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

// Crear las tablas básicas si no existen
// NOTA: Los cambios de esquema (ALTER TABLE) deben ejecutarse mediante migraciones (server/migrate.js)
const initDatabase = async () => {
  try {
    // Tabla de propiedades (estructura básica)
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

    console.log("Database tables initialized successfully");
    console.log("💡 Run migrations with: node server/migrate.js migrate");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export { pool, initDatabase };
