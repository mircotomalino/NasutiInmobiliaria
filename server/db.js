import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'nasuti_inmobiliaria',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Crear las tablas si no existen
const initDatabase = async () => {
  try {
    // Tabla de propiedades
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        province VARCHAR(100) NOT NULL,
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
      console.log('Added patio and garage columns if they did not exist');
    } catch (error) {
      console.log('Patio and garage columns may already exist:', error.message);
    }

    // Hacer la columna province opcional (nullable)
    try {
      await pool.query(`
        ALTER TABLE properties 
        ALTER COLUMN province DROP NOT NULL
      `);
      console.log('Made province column nullable');
    } catch (error) {
      console.log('Province column may already be nullable:', error.message);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export { pool, initDatabase };
