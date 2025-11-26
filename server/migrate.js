import "dotenv/config";
import pg from "pg";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "nasuti_inmobiliaria",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Crear tabla de migraciones si no existe
const createMigrationsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        checksum VARCHAR(64)
      )
    `);

    // Habilitar RLS en migrations para Supabase
    try {
      await pool.query(`
        ALTER TABLE public.migrations ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Allow service role to read migrations" ON public.migrations;
        CREATE POLICY "Allow service role to read migrations"
        ON public.migrations FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Allow service role to insert migrations" ON public.migrations;
        CREATE POLICY "Allow service role to insert migrations"
        ON public.migrations FOR INSERT WITH CHECK (true);
      `);
    } catch (rlsError) {
      // Si falla (por ejemplo, en desarrollo local), solo loguear el warning
      console.warn(
        "Warning: Could not configure RLS for migrations table:",
        rlsError.message
      );
    }

    console.log("✅ Migrations table ready");
  } catch (error) {
    console.error("❌ Error creating migrations table:", error);
    throw error;
  }
};

// Calcular checksum del archivo
const calculateChecksum = content => {
  return crypto.createHash("sha256").update(content).digest("hex");
};

// Ejecutar una migración específica
const runMigration = async filename => {
  const migrationPath = path.join(__dirname, "migrations", filename);

  try {
    // Verificar si la migración ya se ejecutó
    const existingMigration = await pool.query(
      "SELECT * FROM migrations WHERE filename = $1",
      [filename]
    );

    if (existingMigration.rows.length > 0) {
      console.log(`⏭️  Migration ${filename} already executed, skipping`);
      return;
    }

    // Leer el archivo de migración
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");
    const checksum = calculateChecksum(migrationSQL);

    console.log(`🚀 Executing migration: ${filename}`);

    // Ejecutar la migración en una transacción
    await pool.query("BEGIN");

    try {
      await pool.query(migrationSQL);

      // Registrar la migración como ejecutada
      await pool.query(
        "INSERT INTO migrations (filename, checksum) VALUES ($1, $2)",
        [filename, checksum]
      );

      await pool.query("COMMIT");
      console.log(`✅ Migration ${filename} completed successfully`);
    } catch (migrationError) {
      await pool.query("ROLLBACK");
      throw migrationError;
    }
  } catch (error) {
    console.error(`❌ Error executing migration ${filename}:`, error);
    throw error;
  }
};

// Ejecutar todas las migraciones pendientes
const runAllMigrations = async () => {
  try {
    console.log("🔄 Starting database migrations...\n");

    // Crear tabla de migraciones
    await createMigrationsTable();

    // Obtener archivos de migración ordenados
    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith(".sql"))
      .sort();

    if (migrationFiles.length === 0) {
      console.log("ℹ️  No migration files found");
      return;
    }

    console.log(`📋 Found ${migrationFiles.length} migration(s):`);
    migrationFiles.forEach(file => console.log(`   - ${file}`));
    console.log("");

    // Ejecutar cada migración
    for (const filename of migrationFiles) {
      await runMigration(filename);
    }

    console.log("\n🎉 All migrations completed successfully!");
  } catch (error) {
    console.error("\n💥 Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Ejecutar migración específica
const runSpecificMigration = async filename => {
  try {
    console.log(`🎯 Running specific migration: ${filename}\n`);

    await createMigrationsTable();
    await runMigration(filename);

    console.log("\n✅ Specific migration completed!");
  } catch (error) {
    console.error("\n💥 Specific migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Función para mostrar estado de migraciones
const showMigrationStatus = async () => {
  try {
    console.log("📊 Migration Status:\n");

    await createMigrationsTable();

    const executedMigrations = await pool.query(
      "SELECT * FROM migrations ORDER BY executed_at"
    );

    const migrationsDir = path.join(__dirname, "migrations");
    const allMigrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith(".sql"))
      .sort();

    console.log("Executed migrations:");
    executedMigrations.rows.forEach(row => {
      console.log(`  ✅ ${row.filename} (${row.executed_at})`);
    });

    const executedFilenames = executedMigrations.rows.map(row => row.filename);
    const pendingMigrations = allMigrationFiles.filter(
      file => !executedFilenames.includes(file)
    );

    if (pendingMigrations.length > 0) {
      console.log("\nPending migrations:");
      pendingMigrations.forEach(file => {
        console.log(`  ⏳ ${file}`);
      });
    } else {
      console.log("\n🎉 All migrations are up to date!");
    }
  } catch (error) {
    console.error("❌ Error checking migration status:", error);
  } finally {
    await pool.end();
  }
};

// Manejar argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "status":
    showMigrationStatus();
    break;
  case "migrate":
    const filename = args[1];
    if (filename) {
      runSpecificMigration(filename);
    } else {
      runAllMigrations();
    }
    break;
  default:
    console.log(`
🗄️  Database Migration Tool

Usage:
  node migrate.js migrate          # Run all pending migrations
  node migrate.js migrate <file>   # Run specific migration file
  node migrate.js status           # Show migration status

Examples:
  node migrate.js migrate
  node migrate.js migrate 001_add_geolocation.sql
  node migrate.js status
    `);
    break;
}
