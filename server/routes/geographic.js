import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Endpoint para consultas geográficas - propiedades cercanas
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 10000 } = req.query; // radius en metros por defecto

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    // Consulta simplificada usando la función calculate_distance
    const result = await pool.query(
      `
      SELECT id, title, description, price, address, city, province, 
             type, bedrooms, bathrooms, area, patio, garage, status,
             latitude, longitude, featured,
             published_date as "publishedDate",
             created_at, updated_at,
             calculate_distance($1::DECIMAL, $2::DECIMAL, latitude, longitude) as distance
      FROM properties
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        AND calculate_distance($1::DECIMAL, $2::DECIMAL, latitude, longitude) <= $3
      ORDER BY distance ASC
    `,
      [lat, lng, radius]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching nearby properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint para obtener propiedades con coordenadas
router.get("/with-coordinates", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, description, price, address, city, province, 
             type, bedrooms, bathrooms, area, patio, garage, status,
             latitude, longitude, featured,
             published_date as "publishedDate",
             created_at, updated_at
      FROM properties
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching properties with coordinates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
