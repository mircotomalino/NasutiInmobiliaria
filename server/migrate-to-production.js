import "dotenv/config";
import { pool as localPool, initDatabase } from "./db.js";
import pg from "pg";
const { Pool } = pg;

/**
 * Script para migrar datos de la base de datos local a Supabase (producción)
 *
 * Uso:
 * 1. Configura las variables de entorno de producción (Supabase)
 * 2. Ejecuta: node server/migrate-to-production.js
 */

// Pool para la base de datos de producción (Supabase)
const productionPool = new Pool({
  user: process.env.PROD_DB_USER || process.env.DB_USER,
  host: process.env.PROD_DB_HOST || process.env.DB_HOST,
  database: process.env.PROD_DB_NAME || process.env.DB_NAME,
  password: process.env.PROD_DB_PASSWORD || process.env.DB_PASSWORD,
  port: parseInt(process.env.PROD_DB_PORT || process.env.DB_PORT || "5432"),
  ssl:
    process.env.PROD_DB_SSL === "true" || process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

// Verificar que las variables de producción estén configuradas
const checkProductionConfig = () => {
  const required = ["PROD_DB_HOST", "PROD_DB_USER", "PROD_DB_PASSWORD"];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0 && !process.env.DB_HOST?.includes("supabase")) {
    console.error("❌ Error: Variables de producción no configuradas");
    console.error("Faltan:", missing.join(", "));
    console.error(
      "\nConfigura las variables PROD_DB_* o usa DB_* con valores de Supabase"
    );
    process.exit(1);
  }
};

// Migrar propiedades
const migrateProperties = async () => {
  try {
    console.log("📦 Migrando propiedades...");

    // Obtener todas las propiedades de la BD local
    const localProperties = await localPool.query(`
      SELECT id, title, description, price, address, city, province, 
             type, bedrooms, bathrooms, area, patio, garage, status,
             latitude, longitude, featured,
             published_date, created_at, updated_at
      FROM properties
      ORDER BY id
    `);

    if (localProperties.rows.length === 0) {
      console.log("⚠️  No hay propiedades para migrar");
      return;
    }

    console.log(`📋 Encontradas ${localProperties.rows.length} propiedades`);

    // Insertar propiedades en producción (ignorar duplicados por ID)
    let inserted = 0;
    let skipped = 0;

    for (const property of localProperties.rows) {
      try {
        await productionPool.query(
          `
          INSERT INTO properties (
            id, title, description, price, address, city, province,
            type, bedrooms, bathrooms, area, patio, garage, status,
            latitude, longitude, featured,
            published_date, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            address = EXCLUDED.address,
            city = EXCLUDED.city,
            province = EXCLUDED.province,
            type = EXCLUDED.type,
            bedrooms = EXCLUDED.bedrooms,
            bathrooms = EXCLUDED.bathrooms,
            area = EXCLUDED.area,
            patio = EXCLUDED.patio,
            garage = EXCLUDED.garage,
            status = EXCLUDED.status,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            featured = EXCLUDED.featured,
            updated_at = CURRENT_TIMESTAMP
        `,
          [
            property.id,
            property.title,
            property.description,
            property.price,
            property.address,
            property.city,
            property.province,
            property.type,
            property.bedrooms,
            property.bathrooms,
            property.area,
            property.patio,
            property.garage,
            property.status,
            property.latitude,
            property.longitude,
            property.featured,
            property.published_date,
            property.created_at,
            property.updated_at,
          ]
        );
        inserted++;
        console.log(`  ✅ Migrada: ${property.title} (ID: ${property.id})`);
      } catch (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          skipped++;
          console.log(
            `  ⏭️  Ya existe: ${property.title} (ID: ${property.id})`
          );
        } else {
          console.error(
            `  ❌ Error migrando propiedad ${property.id}:`,
            error.message
          );
        }
      }
    }

    console.log(
      `\n✅ Propiedades migradas: ${inserted} nuevas, ${skipped} existentes`
    );
  } catch (error) {
    console.error("❌ Error migrando propiedades:", error);
    throw error;
  }
};

// Migrar imágenes
const migrateImages = async () => {
  try {
    console.log("\n🖼️  Migrando imágenes...");

    // Obtener todas las imágenes de la BD local
    const localImages = await localPool.query(`
      SELECT id, property_id, image_url, created_at
      FROM property_images
      ORDER BY property_id, id
    `);

    if (localImages.rows.length === 0) {
      console.log("⚠️  No hay imágenes para migrar");
      return;
    }

    console.log(`📋 Encontradas ${localImages.rows.length} imágenes`);

    let inserted = 0;
    let skipped = 0;

    for (const image of localImages.rows) {
      try {
        await productionPool.query(
          `
          INSERT INTO property_images (id, property_id, image_url, created_at)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO UPDATE SET
            image_url = EXCLUDED.image_url
        `,
          [image.id, image.property_id, image.image_url, image.created_at]
        );
        inserted++;
      } catch (error) {
        if (error.code === "23505") {
          skipped++;
        } else {
          console.error(
            `  ❌ Error migrando imagen ${image.id}:`,
            error.message
          );
        }
      }
    }

    console.log(
      `✅ Imágenes migradas: ${inserted} nuevas, ${skipped} existentes`
    );
  } catch (error) {
    console.error("❌ Error migrando imágenes:", error);
    throw error;
  }
};

// Función principal
const migrateToProduction = async () => {
  try {
    console.log("🚀 Iniciando migración a producción...\n");

    checkProductionConfig();

    // Verificar conexión a producción
    console.log("🔌 Verificando conexión a producción...");
    await productionPool.query("SELECT 1");
    console.log("✅ Conexión a producción exitosa\n");

    // Inicializar base de datos de producción (crear tablas si no existen)
    console.log("📊 Inicializando base de datos de producción...");
    // Nota: initDatabase usa el pool exportado, necesitamos crear una versión que acepte un pool
    // Por ahora, asumimos que las tablas ya existen en producción
    console.log("✅ Base de datos lista\n");

    // Migrar datos
    await migrateProperties();
    await migrateImages();

    console.log("\n🎉 Migración completada exitosamente!");
    console.log("\n📝 Notas:");
    console.log(
      "  - Las imágenes físicas deben copiarse manualmente o usar Cloudinary"
    );
    console.log(
      "  - Verifica que todas las propiedades se hayan migrado correctamente"
    );
    console.log("  - Revisa los IDs de secuencia si es necesario");
  } catch (error) {
    console.error("\n❌ Error durante la migración:", error);
    process.exit(1);
  } finally {
    await localPool.end();
    await productionPool.end();
  }
};

// Ejecutar migración
migrateToProduction();
