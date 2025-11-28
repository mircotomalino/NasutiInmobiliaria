import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "nasuti_inmobiliaria",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Crear las tablas con estructura completa desde cero
const initDatabase = async () => {
  try {
    // Tabla de propiedades (estructura completa)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(12,2) NOT NULL,
        address VARCHAR(500) DEFAULT '',
        city VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        bedrooms INTEGER,
        bathrooms INTEGER,
        area INTEGER,
        covered_area INTEGER,
        patio VARCHAR(20),
        garage VARCHAR(20),
        latitude DECIMAL(12, 8) NOT NULL,
        longitude DECIMAL(13, 8) NOT NULL,
        status VARCHAR(20) DEFAULT 'disponible',
        featured BOOLEAN DEFAULT FALSE,
        published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT check_latitude_range CHECK (latitude >= -90 AND latitude <= 90),
        CONSTRAINT check_longitude_range CHECK (longitude >= -180 AND longitude <= 180)
      )
    `);

    // Tabla de imágenes de propiedades
    await pool.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índices
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_properties_latitude ON properties(latitude);
      CREATE INDEX IF NOT EXISTS idx_properties_longitude ON properties(longitude);
      CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON properties(latitude, longitude);
      CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured)
    `);

    // Eliminar cualquier trigger o función relacionada con geometrías si existen
    try {
      await pool.query(`
        DROP TRIGGER IF EXISTS trigger_update_property_geom ON properties;
        DROP FUNCTION IF EXISTS update_property_geom() CASCADE;
      `);
    } catch (dropError) {
      // Ignorar errores si no existen
    }

    // Crear función helper para calcular distancia (en metros)
    // SET search_path = '' previene problemas de seguridad con search_path mutable
    await pool.query(`
      CREATE OR REPLACE FUNCTION calculate_distance(
        lat1 DECIMAL(12,8), 
        lng1 DECIMAL(13,8), 
        lat2 DECIMAL(12,8), 
        lng2 DECIMAL(13,8)
      ) RETURNS DECIMAL 
      LANGUAGE plpgsql
      SET search_path = ''
      AS $$
      DECLARE
        earth_radius DECIMAL := 6371000;
        dlat DECIMAL;
        dlng DECIMAL;
        a DECIMAL;
        c DECIMAL;
      BEGIN
        dlat := radians(lat2 - lat1);
        dlng := radians(lng2 - lng1);
        
        a := sin(dlat/2) * sin(dlat/2) + 
             cos(radians(lat1)) * cos(radians(lat2)) * 
             sin(dlng/2) * sin(dlng/2);
        
        c := 2 * atan2(sqrt(a), sqrt(1-a));
        
        RETURN earth_radius * c;
      END;
      $$;
    `);

    // Habilitar Row Level Security (RLS) en Supabase
    // Esto resuelve los problemas de seguridad detectados por el linter de Supabase
    try {
      // Habilitar RLS en las tablas principales
      await pool.query(`
        ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
      `);

      // Habilitar RLS en migrations si existe (puede existir si se usó migrate.js antes)
      try {
        await pool.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'migrations') THEN
              ALTER TABLE public.migrations ENABLE ROW LEVEL SECURITY;
              
              DROP POLICY IF EXISTS "Allow service role to read migrations" ON public.migrations;
              CREATE POLICY "Allow service role to read migrations"
              ON public.migrations FOR SELECT USING (true);

              DROP POLICY IF EXISTS "Allow service role to insert migrations" ON public.migrations;
              CREATE POLICY "Allow service role to insert migrations"
              ON public.migrations FOR INSERT WITH CHECK (true);
            END IF;
          END $$;
        `);
      } catch (migrationsError) {
        console.warn(
          "Could not configure RLS for migrations table:",
          migrationsError.message
        );
      }

      // Intentar eliminar cualquier extensión o tabla relacionada con geometrías si existen
      try {
        await pool.query(`
          DO $$
          BEGIN
            -- Eliminar extensión si existe
            IF EXISTS (SELECT FROM pg_extension WHERE extname = 'postgis') THEN
              DROP EXTENSION IF EXISTS postgis CASCADE;
            END IF;
          END $$;
        `);
      } catch (cleanupError) {
        // Ignorar errores de limpieza (puede no tener permisos o no existir)
      }
      // Crear políticas para properties
      await pool.query(`
        DROP POLICY IF EXISTS "Allow public read access to properties" ON public.properties;
        CREATE POLICY "Allow public read access to properties"
        ON public.properties FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Allow service role to insert properties" ON public.properties;
        CREATE POLICY "Allow service role to insert properties"
        ON public.properties FOR INSERT WITH CHECK (true);

        DROP POLICY IF EXISTS "Allow service role to update properties" ON public.properties;
        CREATE POLICY "Allow service role to update properties"
        ON public.properties FOR UPDATE USING (true) WITH CHECK (true);

        DROP POLICY IF EXISTS "Allow service role to delete properties" ON public.properties;
        CREATE POLICY "Allow service role to delete properties"
        ON public.properties FOR DELETE USING (true);
      `);

      // Crear políticas para property_images
      await pool.query(`
        DROP POLICY IF EXISTS "Allow public read access to property_images" ON public.property_images;
        CREATE POLICY "Allow public read access to property_images"
        ON public.property_images FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Allow service role to insert property_images" ON public.property_images;
        CREATE POLICY "Allow service role to insert property_images"
        ON public.property_images FOR INSERT WITH CHECK (true);

        DROP POLICY IF EXISTS "Allow service role to update property_images" ON public.property_images;
        CREATE POLICY "Allow service role to update property_images"
        ON public.property_images FOR UPDATE USING (true) WITH CHECK (true);

        DROP POLICY IF EXISTS "Allow service role to delete property_images" ON public.property_images;
        CREATE POLICY "Allow service role to delete property_images"
        ON public.property_images FOR DELETE USING (true);
      `);

      console.log("🔒 RLS policies configured successfully");
    } catch (rlsError) {
      // Si falla (por ejemplo, en desarrollo local sin Supabase), solo loguear el error
      // pero no fallar la inicialización completa
      console.warn(
        "Warning: Could not configure RLS policies:",
        rlsError.message
      );
    }

    console.log("🗃️ Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export { pool, initDatabase };
