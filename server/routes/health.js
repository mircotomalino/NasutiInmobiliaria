import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Health check endpoint - Verificar estado de la API y conexión a BD
router.get("/", async (req, res) => {
  try {
    // Intentar una query simple a la base de datos
    const dbCheck = await pool.query("SELECT 1 as status, NOW() as timestamp");

    // Obtener información de la BD
    const dbInfo = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM properties) as total_properties,
        (SELECT COUNT(*) FROM property_images) as total_images,
        version() as postgres_version
    `);

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        responseTime: dbCheck.rows[0].timestamp,
        totalProperties: parseInt(dbInfo.rows[0].total_properties),
        totalImages: parseInt(dbInfo.rows[0].total_images),
        postgresVersion:
          dbInfo.rows[0].postgres_version.split(" ")[0] +
          " " +
          dbInfo.rows[0].postgres_version.split(" ")[1],
      },
      server: {
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error.message,
      },
      server: {
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      },
    });
  }
});

export default router;
