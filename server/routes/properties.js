import express from "express";
import { pool } from "../db.js";
import { validatePropertyData } from "../middleware/validation.js";
import { upload, uploadToSupabase } from "../middleware/upload.js";
import imagesRouter from "./images.js";

const router = express.Router();

// Obtener todas las propiedades
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.description, p.price, p.address, p.city, 
             p.type, p.bedrooms, p.bathrooms, p.area, p.covered_area as "coveredArea", p.patio, p.garage, p.status,
             p.latitude, p.longitude, p.featured,
             p.published_date as "publishedDate",
             p.created_at, p.updated_at,
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      GROUP BY p.id, p.title, p.description, p.price, p.address, p.city, 
               p.type, p.bedrooms, p.bathrooms, p.area, p.covered_area, p.patio, p.garage, p.status,
               p.latitude, p.longitude, p.featured, p.published_date, p.created_at, p.updated_at
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Endpoint para obtener propiedades destacadas (máximo 3)
// IMPORTANTE: Este endpoint debe estar ANTES de /api/properties/:id
router.get("/featured", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.description, p.price, p.address, p.city, 
             p.type, p.bedrooms, p.bathrooms, p.area, p.covered_area as "coveredArea", p.patio, p.garage, p.status,
             p.latitude, p.longitude, p.featured,
             p.published_date as "publishedDate",
             p.created_at, p.updated_at,
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      WHERE p.featured = TRUE
      GROUP BY p.id, p.title, p.description, p.price, p.address, p.city, 
               p.type, p.bedrooms, p.bathrooms, p.area, p.covered_area, p.patio, p.garage, p.status,
               p.latitude, p.longitude, p.featured, p.published_date, p.created_at, p.updated_at
      ORDER BY p.created_at ASC
      LIMIT 3
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Usar el router de imágenes para las rutas /:id/images
// IMPORTANTE: Debe estar después de /featured pero antes de GET /:id
router.use("/:id", imagesRouter);

// Endpoint para toggle el estado featured de una propiedad
// IMPORTANTE: Este endpoint debe estar ANTES de GET /:id
router.patch("/:id/featured", async (req, res) => {
  try {
    const { id } = req.params;
    const propertyId = parseInt(id);

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: "ID de propiedad inválido" });
    }

    // Obtener el estado actual de la propiedad
    const currentProperty = await pool.query(
      "SELECT id, title, featured FROM properties WHERE id = $1",
      [propertyId]
    );

    if (currentProperty.rows.length === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    const isFeatured = currentProperty.rows[0].featured;

    // Si se quiere marcar como destacada (actualmente no lo está)
    if (!isFeatured) {
      // Verificar cuántas propiedades destacadas hay
      const featuredCount = await pool.query(
        "SELECT COUNT(*) as count FROM properties WHERE featured = TRUE"
      );

      if (parseInt(featuredCount.rows[0].count) >= 3) {
        // Obtener las propiedades destacadas actuales
        const featuredProperties = await pool.query(
          "SELECT id, title FROM properties WHERE featured = TRUE ORDER BY created_at ASC"
        );

        return res.status(400).json({
          error: "Ya tienes 3 propiedades destacadas",
          featuredProperties: featuredProperties.rows,
        });
      }
    }

    // Toggle el estado featured
    const result = await pool.query(
      "UPDATE properties SET featured = NOT featured WHERE id = $1 RETURNING id, title, featured",
      [propertyId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error toggling featured status:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener una propiedad específica
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const propertyResult = await pool.query(
      `
      SELECT id, title, description, price, address, city, 
             type, bedrooms, bathrooms, area, covered_area as "coveredArea", patio, garage, status,
             latitude, longitude, featured,
             published_date as "publishedDate",
             created_at, updated_at
      FROM properties WHERE id = $1
    `,
      [id]
    );
    const imagesResult = await pool.query(
      "SELECT * FROM property_images WHERE property_id = $1",
      [id]
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    const property = propertyResult.rows[0];
    property.images = imagesResult.rows.map(img => img.image_url);

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear una nueva propiedad
router.post("/", upload.any(), async (req, res) => {
  try {
    // Validar datos de entrada
    const validation = validatePropertyData({
      ...req.body,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: "Error de validación",
        details: validation.errors,
      });
    }

    const {
      title,
      description,
      price,
      address,
      city,
      type,
      bedrooms,
      bathrooms,
      area,
      coveredArea,
      patio,
      garage,
      latitude,
      longitude,
      status,
    } = validation.validatedData;

    // Validar que los campos NOT NULL tengan valores válidos
    if (price === null || price === undefined) {
      return res.status(400).json({
        error: "Error de validación",
        details: ["El precio es obligatorio"],
      });
    }
    if (!city || city.trim() === "") {
      return res.status(400).json({
        error: "Error de validación",
        details: ["La ciudad es obligatoria"],
      });
    }
    if (!type || type.trim() === "") {
      return res.status(400).json({
        error: "Error de validación",
        details: ["El tipo de propiedad es obligatorio"],
      });
    }
    if (latitude === null || latitude === undefined) {
      return res.status(400).json({
        error: "Error de validación",
        details: ["La latitud es obligatoria"],
      });
    }
    if (longitude === null || longitude === undefined) {
      return res.status(400).json({
        error: "Error de validación",
        details: ["La longitud es obligatoria"],
      });
    }

    const finalStatus = status || "disponible";
    const finalAddress = address || "";

    // Generar título automático si no se proporciona
    let finalTitle = title && title.trim() !== "" ? title.trim() : null;
    if (!finalTitle) {
      // Contar propiedades existentes para generar el número
      const countResult = await pool.query(
        "SELECT COUNT(*) as count FROM properties"
      );
      const propertyCount = parseInt(countResult.rows[0].count) || 0;
      finalTitle = `Propiedad ${propertyCount + 1}`;
      console.log(`📝 Título generado automáticamente: ${finalTitle}`);
    }

    // 🔍 LOGGING DETALLADO PARA DEBUGGING
    console.log("🔍 DEBUGGING - Datos recibidos para crear propiedad:");
    console.log("📝 title:", finalTitle, "type:", typeof finalTitle);
    console.log(
      "📝 description:",
      description?.substring(0, 50) + "...",
      "type:",
      typeof description
    );
    console.log("💰 price:", price, "type:", typeof price);
    console.log("🛣️ address:", address, "type:", typeof address);
    console.log("🏙️ city:", city, "type:", typeof city);
    console.log("🏘️ type:", type, "type:", typeof type);
    console.log("🛏️ bedrooms:", bedrooms, "type:", typeof bedrooms);
    console.log("🚿 bathrooms:", bathrooms, "type:", typeof bathrooms);
    console.log("📐 area:", area, "type:", typeof area);
    console.log("🏠 coveredArea:", coveredArea, "type:", typeof coveredArea);
    console.log("🌳 patio:", patio, "type:", typeof patio);
    console.log("🚗 garage:", garage, "type:", typeof garage);
    console.log("📍 latitude:", latitude, "type:", typeof latitude);
    console.log("📍 longitude:", longitude, "type:", typeof longitude);
    console.log("📊 status:", status, "type:", typeof status);

    // Validar tipos de datos críticos
    if (bedrooms && (typeof bedrooms !== "number" || bedrooms > 2147483647)) {
      console.error("❌ ERROR: bedrooms fuera de rango:", bedrooms);
    }
    if (
      bathrooms &&
      (typeof bathrooms !== "number" || bathrooms > 2147483647)
    ) {
      console.error("❌ ERROR: bathrooms fuera de rango:", bathrooms);
    }
    if (area && (typeof area !== "number" || area > 2147483647)) {
      console.error("❌ ERROR: area fuera de rango:", area);
    }
    if (
      coveredArea &&
      (typeof coveredArea !== "number" || coveredArea > 2147483647)
    ) {
      console.error("❌ ERROR: coveredArea fuera de rango:", coveredArea);
    }

    // Insertar la propiedad - asegurar que campos NOT NULL nunca sean null
    const queryParams = [
      finalTitle, // NOT NULL - siempre tiene valor (generado si falta)
      description && description.trim() !== "" ? description.trim() : null, // nullable
      price, // NOT NULL - validado arriba
      finalAddress, // DEFAULT '' - siempre string
      city.trim(), // NOT NULL - validado arriba
      type.trim(), // NOT NULL - validado arriba
      bedrooms || null, // nullable
      bathrooms || null, // nullable
      area || null, // nullable
      coveredArea || null, // nullable
      patio || null, // nullable
      garage || null, // nullable
      latitude, // NOT NULL - validado arriba
      longitude, // NOT NULL - validado arriba
      finalStatus, // DEFAULT 'disponible' - siempre tiene valor
    ];
    console.log("🔍 DEBUGGING - Parámetros de la query:");
    queryParams.forEach((param, index) => {
      console.log(`  $${index + 1}:`, param, `(type: ${typeof param})`);
    });

    try {
      const propertyResult = await pool.query(
        `
        INSERT INTO properties (title, description, price, address, city, type, bedrooms, bathrooms, area, covered_area, patio, garage, latitude, longitude, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id, title, description, price, address, city, 
                  type, bedrooms, bathrooms, area, covered_area as "coveredArea", patio, garage, latitude, longitude, status, featured,
                  published_date as "publishedDate",
                  created_at, updated_at
      `,
        queryParams
      );

      const property = propertyResult.rows[0];

      // Insertar las imágenes si se subieron
      // Filtrar solo los archivos (req.files puede contener todos los campos)
      const imageFiles = req.files
        ? req.files.filter(file => file.fieldname === "images")
        : [];
      if (imageFiles.length > 0) {
        try {
          const imageUrls = await Promise.all(
            imageFiles.map(async file => {
              try {
                return await uploadToSupabase(file, property.id);
              } catch (uploadError) {
                console.error(
                  `❌ Error subiendo imagen ${file.originalname}:`,
                  uploadError
                );
                throw uploadError; // Re-lanzar para que se maneje arriba
              }
            })
          );

          // Log para debugging
          console.log("🔗 URLs generadas para guardar:", imageUrls);

          // Insertar URLs de imágenes en la base de datos usando parámetros preparados
          for (const url of imageUrls) {
            // Validar que la URL sea absoluta antes de guardar
            if (
              !url.startsWith("http://") &&
              !url.startsWith("https://") &&
              !url.startsWith("/")
            ) {
              console.error("❌ URL inválida detectada:", url);
              continue; // Saltar URLs inválidas
            }

            await pool.query(
              `INSERT INTO property_images (property_id, image_url) VALUES ($1, $2)`,
              [property.id, url]
            );
          }
        } catch (imageError) {
          console.error("❌ Error procesando imágenes:", imageError);
          // Si falla la subida de imágenes, eliminar la propiedad creada
          try {
            await pool.query("DELETE FROM properties WHERE id = $1", [
              property.id,
            ]);
            console.log("🗑️ Propiedad eliminada debido a error en imágenes");
          } catch (deleteError) {
            console.error(
              "❌ Error eliminando propiedad después de fallo en imágenes:",
              deleteError
            );
          }
          throw imageError; // Re-lanzar para que se maneje en el catch externo
        }
      }

      // Obtener imágenes para la respuesta
      const imagesResult = await pool.query(
        "SELECT * FROM property_images WHERE property_id = $1",
        [property.id]
      );
      property.images = imagesResult.rows.map(img => img.image_url);

      res.status(201).json(property);
    } catch (dbError) {
      console.error("❌ ERROR ESPECÍFICO DE BASE DE DATOS:");
      console.error("🔍 Error details:", dbError);
      console.error("🔍 Error code:", dbError.code);
      console.error("🔍 Error message:", dbError.message);
      console.error("🔍 Error detail:", dbError.detail);
      console.error("🔍 Error column:", dbError.column);

      // Manejar errores específicos de NOT NULL
      if (dbError.code === "23502") {
        // NOT NULL constraint violation
        const columnName = dbError.column || "campo desconocido";
        return res.status(400).json({
          error: "Error de validación",
          details: [
            `El campo '${columnName}' es obligatorio y no puede estar vacío`,
          ],
        });
      }

      // Manejar otros errores de constraint
      if (dbError.code === "23505") {
        // Unique constraint violation
        return res.status(400).json({
          error: "Error de validación",
          details: ["Ya existe una propiedad con estos datos"],
        });
      }

      if (dbError.code === "23514") {
        // Check constraint violation
        return res.status(400).json({
          error: "Error de validación",
          details: [
            "Datos inválidos: violación de restricción",
            dbError.message,
          ],
        });
      }

      res.status(500).json({
        error: "Error interno del servidor",
        details: dbError.message,
      });
    }
  } catch (error) {
    console.error("Error creating property:", error);

    // Manejar errores específicos de base de datos
    if (error.code === "23502") {
      // NOT NULL constraint violation
      const columnName = error.column || "campo desconocido";
      return res.status(400).json({
        error: "Error de validación",
        details: [
          `El campo '${columnName}' es obligatorio y no puede estar vacío`,
        ],
      });
    }

    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(400).json({
        error: "Error de validación",
        details: ["Ya existe una propiedad con estos datos"],
      });
    }

    if (error.code === "23514") {
      // Check constraint violation
      return res.status(400).json({
        error: "Error de validación",
        details: ["Datos inválidos: violación de restricción", error.message],
      });
    }

    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar una propiedad
router.put("/:id", upload.any(), async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un número válido
    const propertyId = parseInt(id);
    if (isNaN(propertyId)) {
      return res.status(400).json({ error: "ID de propiedad inválido" });
    }

    // Validar datos de entrada
    const validation = validatePropertyData({
      ...req.body,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: "Error de validación",
        details: validation.errors,
      });
    }

    const {
      title,
      description,
      price,
      address,
      city,
      type,
      bedrooms,
      bathrooms,
      area,
      coveredArea,
      patio,
      garage,
      latitude,
      longitude,
      status,
    } = validation.validatedData;

    // Validar que los campos NOT NULL tengan valores válidos
    if (price === null || price === undefined) {
      return res.status(400).json({
        error: "Error de validación",
        details: ["El precio es obligatorio"],
      });
    }
    if (!city || city.trim() === "") {
      return res.status(400).json({
        error: "Error de validación",
        details: ["La ciudad es obligatoria"],
      });
    }
    if (!type || type.trim() === "") {
      return res.status(400).json({
        error: "Error de validación",
        details: ["El tipo de propiedad es obligatorio"],
      });
    }
    if (latitude === null || latitude === undefined) {
      return res.status(400).json({
        error: "Error de validación",
        details: ["La latitud es obligatoria"],
      });
    }
    if (longitude === null || longitude === undefined) {
      return res.status(400).json({
        error: "Error de validación",
        details: ["La longitud es obligatoria"],
      });
    }

    const finalStatus = status || "disponible";
    const finalAddress = address || "";

    // Generar título automático si no se proporciona
    let finalTitle = title && title.trim() !== "" ? title.trim() : null;
    if (!finalTitle) {
      // Contar propiedades existentes para generar el número
      const countResult = await pool.query(
        "SELECT COUNT(*) as count FROM properties"
      );
      const propertyCount = parseInt(countResult.rows[0].count) || 0;
      finalTitle = `Propiedad ${propertyCount + 1}`;
      console.log(
        `📝 Título generado automáticamente en UPDATE: ${finalTitle}`
      );
    }

    // Verificar que la propiedad existe
    const existingProperty = await pool.query(
      "SELECT id FROM properties WHERE id = $1",
      [propertyId]
    );
    if (existingProperty.rows.length === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    // Actualizar la propiedad - asegurar que campos NOT NULL nunca sean null
    const propertyResult = await pool.query(
      `
      UPDATE properties 
      SET title = $1, description = $2, price = $3, address = $4, city = $5, 
          type = $6, bedrooms = $7, bathrooms = $8, area = $9, 
          covered_area = $10, patio = $11, garage = $12, latitude = $13, longitude = $14, status = $15, updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING id, title, description, price, address, city, 
                type, bedrooms, bathrooms, area, covered_area as "coveredArea", patio, garage, latitude, longitude, status, featured,
                published_date as "publishedDate",
                created_at, updated_at
    `,
      [
        finalTitle, // NOT NULL - siempre tiene valor (generado si falta)
        description && description.trim() !== "" ? description.trim() : null, // nullable
        price, // NOT NULL - validado arriba
        finalAddress, // DEFAULT '' - siempre string
        city.trim(), // NOT NULL - validado arriba
        type.trim(), // NOT NULL - validado arriba
        bedrooms || null, // nullable
        bathrooms || null, // nullable
        area || null, // nullable
        coveredArea || null, // nullable
        patio || null, // nullable
        garage || null, // nullable
        latitude, // NOT NULL - validado arriba
        longitude, // NOT NULL - validado arriba
        finalStatus, // DEFAULT 'disponible' - siempre tiene valor
        propertyId,
      ]
    );

    const property = propertyResult.rows[0];

    // Si se subieron nuevas imágenes, agregarlas
    // Filtrar solo los archivos (req.files puede contener todos los campos)
    const imageFiles = req.files
      ? req.files.filter(file => file.fieldname === "images")
      : [];
    if (imageFiles.length > 0) {
      const imageUrls = await Promise.all(
        imageFiles.map(file => uploadToSupabase(file, propertyId))
      );

      // Log para debugging
      console.log("🔗 URLs generadas para actualizar:", imageUrls);

      // Insertar URLs de imágenes en la base de datos usando parámetros preparados
      for (const url of imageUrls) {
        // Validar que la URL sea absoluta antes de guardar
        if (
          !url.startsWith("http://") &&
          !url.startsWith("https://") &&
          !url.startsWith("/")
        ) {
          console.error("❌ URL inválida detectada:", url);
          continue; // Saltar URLs inválidas
        }

        await pool.query(
          `INSERT INTO property_images (property_id, image_url) VALUES ($1, $2)`,
          [propertyId, url]
        );
      }
    }

    // Obtener todas las imágenes para la respuesta
    const imagesResult = await pool.query(
      "SELECT * FROM property_images WHERE property_id = $1",
      [propertyId]
    );
    property.images = imagesResult.rows.map(img => img.image_url);

    res.json(property);
  } catch (error) {
    console.error("Error updating property:", error);

    // Manejar errores específicos de base de datos
    if (error.code === "23502") {
      // NOT NULL constraint violation
      const columnName = error.column || "campo desconocido";
      return res.status(400).json({
        error: "Error de validación",
        details: [
          `El campo '${columnName}' es obligatorio y no puede estar vacío`,
        ],
      });
    }

    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(400).json({
        error: "Error de validación",
        details: ["Ya existe una propiedad con estos datos"],
      });
    }

    if (error.code === "23514") {
      // Check constraint violation
      return res.status(400).json({
        error: "Error de validación",
        details: ["Datos inválidos: violación de restricción", error.message],
      });
    }

    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar una propiedad
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener todas las imágenes de la propiedad antes de borrarla
    const imagesResult = await pool.query(
      "SELECT image_url FROM property_images WHERE property_id = $1",
      [id]
    );

    // Verificar que la propiedad existe
    const propertyCheck = await pool.query(
      "SELECT id FROM properties WHERE id = $1",
      [id]
    );

    if (propertyCheck.rows.length === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    // Eliminar imágenes de Supabase Storage si están configuradas
    if (imagesResult.rows.length > 0) {
      const { supabase, STORAGE_BUCKET } = await import(
        "../config/supabase.js"
      );

      if (supabase) {
        const deletePromises = imagesResult.rows.map(async img => {
          try {
            // Extraer el path del archivo de la URL completa
            // La URL tiene formato: https://...supabase.co/storage/v1/object/public/PropertyImages/14/1763693736222-332094349.jpeg
            const url = img.image_url;
            const pathMatch = url.match(
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
              } else {
                console.log(
                  `✅ Imagen eliminada de Supabase Storage: ${filePath}`
                );
              }
            }
          } catch (imgError) {
            console.error("Error procesando eliminación de imagen:", imgError);
          }
        });

        await Promise.all(deletePromises);
      }
    }

    // Borrar la propiedad (las imágenes en BD se eliminan automáticamente por CASCADE)
    const result = await pool.query(
      "DELETE FROM properties WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({
      message: "Property deleted successfully",
      deletedImages: imagesResult.rows.length,
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
