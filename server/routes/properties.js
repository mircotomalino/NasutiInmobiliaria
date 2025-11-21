import express from "express";
import { pool } from "../db.js";
import { validatePropertyData } from "../middleware/validation.js";
import { upload } from "../middleware/upload.js";
import imagesRouter from "./images.js";

const router = express.Router();

// Obtener todas las propiedades
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
             p.type, p.bedrooms, p.bathrooms, p.area, p.covered_area as "coveredArea", p.patio, p.garage, p.status,
             p.latitude, p.longitude, p.featured,
             p.published_date as "publishedDate",
             p.created_at, p.updated_at,
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      GROUP BY p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
               p.type, p.bedrooms, p.bathrooms, p.area, p.covered_area, p.patio, p.garage, p.status,
               p.latitude, p.longitude, p.featured, p.published_date, p.created_at, p.updated_at
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint para obtener propiedades destacadas (máximo 3)
// IMPORTANTE: Este endpoint debe estar ANTES de /api/properties/:id
router.get("/featured", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
             p.type, p.bedrooms, p.bathrooms, p.area, p.covered_area as "coveredArea", p.patio, p.garage, p.status,
             p.latitude, p.longitude, p.featured,
             p.published_date as "publishedDate",
             p.created_at, p.updated_at,
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      WHERE p.featured = TRUE
      GROUP BY p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
               p.type, p.bedrooms, p.bathrooms, p.area, p.covered_area, p.patio, p.garage, p.status,
               p.latitude, p.longitude, p.featured, p.published_date, p.created_at, p.updated_at
      ORDER BY p.created_at ASC
      LIMIT 3
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    res.status(500).json({ error: "Internal server error" });
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
      return res.status(400).json({ error: "Invalid property ID" });
    }

    // Obtener el estado actual de la propiedad
    const currentProperty = await pool.query(
      "SELECT id, title, featured FROM properties WHERE id = $1",
      [propertyId]
    );

    if (currentProperty.rows.length === 0) {
      return res.status(404).json({ error: "Property not found" });
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
    res.status(500).json({ error: "Internal server error" });
  }
});

// Obtener una propiedad específica
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const propertyResult = await pool.query(
      `
      SELECT id, title, description, price, address, city, province, 
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
      return res.status(404).json({ error: "Property not found" });
    }

    const property = propertyResult.rows[0];
    property.images = imagesResult.rows.map(img => img.image_url);

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Crear una nueva propiedad
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    // Validar datos de entrada
    const validation = validatePropertyData({
      ...req.body,
      province: req.body.province || "Córdoba", // Valor por defecto
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors,
      });
    }

    const {
      title,
      description,
      price,
      address,
      city,
      province,
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

    const finalStatus = status || "disponible";

    // Generar título automático si no se proporciona
    let finalTitle = title;
    if (!finalTitle || finalTitle.trim() === "") {
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
    console.log("🌍 province:", province, "type:", typeof province);
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

    // Insertar la propiedad
    const queryParams = [
      finalTitle,
      description && description.trim() !== "" ? description : null,
      price,
      address || null,
      city,
      province,
      type,
      bedrooms,
      bathrooms,
      area,
      coveredArea || null,
      patio,
      garage,
      latitude,
      longitude,
      finalStatus,
    ];
    console.log("🔍 DEBUGGING - Parámetros de la query:");
    queryParams.forEach((param, index) => {
      console.log(`  $${index + 1}:`, param, `(type: ${typeof param})`);
    });

    try {
      const propertyResult = await pool.query(
        `
        INSERT INTO properties (title, description, price, address, city, province, type, bedrooms, bathrooms, area, covered_area, patio, garage, latitude, longitude, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING id, title, description, price, address, city, province, 
                  type, bedrooms, bathrooms, area, covered_area as "coveredArea", patio, garage, latitude, longitude, status, featured,
                  published_date as "publishedDate",
                  created_at, updated_at
      `,
        queryParams
      );

      const property = propertyResult.rows[0];

      // Insertar las imágenes si se subieron
      if (req.files && req.files.length > 0) {
        const imageValues = req.files
          .map(file => `(${property.id}, '/uploads/${file.filename}')`)
          .join(", ");
        await pool.query(`
          INSERT INTO property_images (property_id, image_url)
          VALUES ${imageValues}
        `);
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
      console.error("🔍 Error hint:", dbError.hint);
      console.error("🔍 Error position:", dbError.position);
      console.error("🔍 Error internalPosition:", dbError.internalPosition);
      console.error("🔍 Error internalQuery:", dbError.internalQuery);
      console.error("🔍 Error where:", dbError.where);
      console.error("🔍 Error schema:", dbError.schema);
      console.error("🔍 Error table:", dbError.table);
      console.error("🔍 Error column:", dbError.column);
      console.error("🔍 Error dataType:", dbError.dataType);
      console.error("🔍 Error constraint:", dbError.constraint);
      console.error("🔍 Error file:", dbError.file);
      console.error("🔍 Error line:", dbError.line);
      console.error("🔍 Error routine:", dbError.routine);

      res
        .status(500)
        .json({ error: "Internal server error", details: dbError.message });
    }
  } catch (error) {
    console.error("Error creating property:", error);

    // Manejar errores específicos de base de datos
    if (error.code === "23505") {
      // Unique constraint violation
      return res
        .status(400)
        .json({ error: "Property with this data already exists" });
    } else if (error.code === "23514") {
      // Check constraint violation
      return res.status(400).json({
        error: "Invalid data: constraint violation",
        details: error.message,
      });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

// Actualizar una propiedad
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un número válido
    const propertyId = parseInt(id);
    if (isNaN(propertyId)) {
      return res.status(400).json({ error: "Invalid property ID" });
    }

    // Validar datos de entrada
    const validation = validatePropertyData({
      ...req.body,
      province: req.body.province || "Córdoba", // Valor por defecto
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors,
      });
    }

    const {
      title,
      description,
      price,
      address,
      city,
      province,
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

    const finalStatus = status || "disponible";

    // Generar título automático si no se proporciona
    let finalTitle = title;
    if (!finalTitle || finalTitle.trim() === "") {
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
      return res.status(404).json({ error: "Property not found" });
    }

    // Actualizar la propiedad
    const propertyResult = await pool.query(
      `
      UPDATE properties 
      SET title = $1, description = $2, price = $3, address = $4, city = $5, 
          province = $6, type = $7, bedrooms = $8, bathrooms = $9, area = $10, 
          covered_area = $11, patio = $12, garage = $13, latitude = $14, longitude = $15, status = $16, updated_at = CURRENT_TIMESTAMP
      WHERE id = $17
      RETURNING id, title, description, price, address, city, province, 
                type, bedrooms, bathrooms, area, covered_area as "coveredArea", patio, garage, latitude, longitude, status, featured,
                published_date as "publishedDate",
                created_at, updated_at
    `,
      [
        finalTitle,
        description && description.trim() !== "" ? description : null,
        price,
        address || null,
        city,
        province,
        type,
        bedrooms,
        bathrooms,
        area,
        coveredArea || null,
        patio,
        garage,
        latitude,
        longitude,
        finalStatus,
        propertyId,
      ]
    );

    const property = propertyResult.rows[0];

    // Si se subieron nuevas imágenes, agregarlas
    if (req.files && req.files.length > 0) {
      const imageValues = req.files
        .map(file => `(${propertyId}, '/uploads/${file.filename}')`)
        .join(", ");
      await pool.query(`
        INSERT INTO property_images (property_id, image_url)
        VALUES ${imageValues}
      `);
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
    if (error.code === "23505") {
      // Unique constraint violation
      return res
        .status(400)
        .json({ error: "Property with this data already exists" });
    } else if (error.code === "23514") {
      // Check constraint violation
      return res.status(400).json({
        error: "Invalid data: constraint violation",
        details: error.message,
      });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

// Eliminar una propiedad
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM properties WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
