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
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar una imagen específica
router.delete("/images/:imageId", async (req, res) => {
  try {
    const { id, imageId } = req.params; // id viene del router padre (properties)
    
    // Obtener la URL de la imagen antes de borrarla
    const imageResult = await pool.query(
      "SELECT image_url FROM property_images WHERE id = $1 AND property_id = $2",
      [imageId, id]
    );

    if (imageResult.rows.length === 0) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    const imageUrl = imageResult.rows[0].image_url;

    // Eliminar imagen de Supabase Storage si está configurado
    const { supabase, STORAGE_BUCKET } = await import("../config/supabase.js");
    
    if (supabase && imageUrl) {
      try {
        // Extraer el path del archivo de la URL completa
        // La URL tiene formato: https://...supabase.co/storage/v1/object/public/PropertyImages/14/1763693736222-332094349.jpeg
        const pathMatch = imageUrl.match(
          /\/storage\/v1\/object\/public\/[^/]+\/(.+)$/
        );

        if (pathMatch && pathMatch[1]) {
          const filePath = pathMatch[1];
          const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filePath]);

          if (error) {
            console.error(
              `Error eliminando imagen ${filePath} de Supabase:`,
              error
            );
            // Continuar con la eliminación de BD aunque falle la eliminación de Storage
          } else {
            console.log(
              `✅ Imagen eliminada de Supabase Storage: ${filePath}`
            );
          }
        }
      } catch (storageError) {
        console.error("Error procesando eliminación de imagen de Storage:", storageError);
        // Continuar con la eliminación de BD aunque falle la eliminación de Storage
      }
    }

    // Eliminar registro de la base de datos
    const result = await pool.query(
      "DELETE FROM property_images WHERE id = $1 AND property_id = $2 RETURNING *",
      [imageId, id]
    );

    res.json({ message: "Imagen eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
