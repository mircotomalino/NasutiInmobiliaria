import express from "express";
import { pool } from "../db.js";

const router = express.Router({ mergeParams: true }); // mergeParams para recibir :id del router padre

// Obtener imágenes de una propiedad con sus IDs
router.get("/images", async (req, res) => {
  try {
    const { id } = req.params; // id viene del router padre (properties)
    const result = await pool.query(
      "SELECT id, image_url as url FROM property_images WHERE property_id = $1 ORDER BY id",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching property images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Eliminar una imagen específica
router.delete("/images/:imageId", async (req, res) => {
  try {
    const { id, imageId } = req.params; // id viene del router padre (properties)
    const result = await pool.query(
      "DELETE FROM property_images WHERE id = $1 AND property_id = $2 RETURNING *",
      [imageId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

