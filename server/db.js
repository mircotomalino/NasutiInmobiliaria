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

// Crear las tablas si no existen
const initDatabase = async () => {
  try {
    // Tabla de propiedades
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(12,2) NOT NULL,
        city VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        bedrooms INTEGER,
        bathrooms INTEGER,
        area INTEGER,
        status VARCHAR(20) DEFAULT 'disponible',
        published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

    // Agregar columnas patio y garage si no existen
    try {
      await pool.query(`
        ALTER TABLE properties 
        ADD COLUMN IF NOT EXISTS patio VARCHAR(20),
        ADD COLUMN IF NOT EXISTS garage VARCHAR(20)
      `);
      console.log("Added patio and garage columns if they did not exist");
    } catch (error) {
      console.log("Patio and garage columns may already exist:", error.message);
    }

    // Agregar columna de superficie cubierta si no existe
    try {
      await pool.query(`
        ALTER TABLE properties 
        ADD COLUMN IF NOT EXISTS covered_area INTEGER
      `);
      console.log("Added covered_area column if it did not exist");
    } catch (error) {
      console.log("Covered_area column may already exist:", error.message);
    }

    // Agregar columna de dirección simple si no existe
    try {
      await pool.query(`
        ALTER TABLE properties 
        ADD COLUMN IF NOT EXISTS address VARCHAR(500)
      `);
      console.log("Added address column if it did not exist");
    } catch (error) {
      console.log("Address column may already exist:", error.message);
    }

    // Eliminar la columna province si existe
    try {
      await pool.query(`
        ALTER TABLE properties 
        DROP COLUMN IF EXISTS province
      `);
      console.log("Removed province column if it existed");
    } catch (error) {
      console.log("Province column may already be removed:", error.message);
    }

    // Agregar columnas de geolocalización si no existen
    try {
      await pool.query(`
        ALTER TABLE properties 
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(12, 8),
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(13, 8)
      `);
      console.log("Added latitude and longitude columns if they did not exist");
    } catch (error) {
      console.log("Geolocation columns may already exist:", error.message);
    }

    // Hacer las coordenadas obligatorias (NOT NULL)
    try {
      // Primero verificar si hay registros sin coordenadas y eliminarlos o actualizarlos
      // (En producción, esto debería manejarse con cuidado)
      await pool.query(`
        ALTER TABLE properties 
        ALTER COLUMN latitude SET NOT NULL
      `);
      await pool.query(`
        ALTER TABLE properties 
        ALTER COLUMN longitude SET NOT NULL
      `);
      console.log("Made latitude and longitude columns NOT NULL");
    } catch (error) {
      // Si falla, puede ser que ya sean NOT NULL o que haya registros sin coordenadas
      console.log(
        "Could not make coordinates NOT NULL (may already be NOT NULL or have NULL values):",
        error.message
      );
    }

    // Crear índices para coordenadas si no existen
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_properties_latitude ON properties(latitude);
        CREATE INDEX IF NOT EXISTS idx_properties_longitude ON properties(longitude);
        CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON properties(latitude, longitude)
      `);
      console.log("Created geolocation indexes if they did not exist");
    } catch (error) {
      console.log("Geolocation indexes may already exist:", error.message);
    }

    // Agregar restricciones de validación para coordenadas
    try {
      await pool.query(`
        ALTER TABLE properties 
        ADD CONSTRAINT IF NOT EXISTS check_latitude_range 
        CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));
        
        ALTER TABLE properties 
        ADD CONSTRAINT IF NOT EXISTS check_longitude_range 
        CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180))
      `);
      console.log(
        "Added coordinate validation constraints if they did not exist"
      );
    } catch (error) {
      console.log(
        "Coordinate validation constraints may already exist:",
        error.message
      );
    }

    // Hacer la columna description opcional (nullable)
    try {
      await pool.query(`
        ALTER TABLE properties 
        ALTER COLUMN description DROP NOT NULL
      `);
      console.log("Made description column nullable");
    } catch (error) {
      console.log("Description column may already be nullable:", error.message);
    }

    // Agregar columna featured para propiedades destacadas en el carrusel
    try {
      await pool.query(`
        ALTER TABLE properties 
        ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE
      `);
      console.log("Added featured column if it did not exist");
    } catch (error) {
      console.log("Featured column may already exist:", error.message);
    }

    // Crear índice para featured
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured)
      `);
      console.log("Created featured index if it did not exist");
    } catch (error) {
      console.log("Featured index may already exist:", error.message);
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export { pool, initDatabase };
