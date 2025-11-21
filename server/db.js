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

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export { pool, initDatabase };
