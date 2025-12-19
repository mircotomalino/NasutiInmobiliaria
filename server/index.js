import "dotenv/config";
import express from "express";
import cors from "cors";
import { initDatabase } from "./db.js";

// Importar rutas
import healthRouter from "./routes/health.js";
import propertiesRouter from "./routes/properties.js";
import geographicRouter from "./routes/geographic.js";

// Manejar errores no capturados para evitar que el servidor se caiga
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // No cerrar el proceso, solo loguear el error
});

process.on("uncaughtException", error => {
  console.error("Uncaught Exception:", error);
  // Si es un error de conexión a la base de datos, no cerrar el proceso
  if (
    error.code === "XX000" ||
    error.message?.includes("shutdown") ||
    error.message?.includes("db_termination")
  ) {
    console.warn(
      "Database connection error handled, server will continue running"
    );
    return;
  }
  // Para otros errores críticos, cerrar el proceso después de loguear
  console.error("Critical error, shutting down gracefully");
  process.exit(1);
});

// Verificar configuración de Supabase Storage
let supabaseStorageConfigured = false;
try {
  const { supabase } = await import("./config/supabase.js");
  supabaseStorageConfigured = !!supabase;
} catch (error) {
  console.warn("⚠️ Error al configurar Supabase Storage:", error.message);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",").map(url => url.trim())
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
          "http://localhost:3003",
          "http://localhost:3004",
          "http://localhost:3005",
          "http://localhost:3006",
        ],
    credentials: true,
  })
);
app.use(express.json());

// Inicializar base de datos
initDatabase();

// Ruta de prueba para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({
    message: "Nasuti Inmobiliaria API Server",
    status: "running",
    timestamp: new Date().toISOString(),
    routes: {
      health: "/api/health",
      properties: "/api/properties",
      propertiesFeatured: "/api/properties/featured",
      sitemap: "/sitemap.xml"
    }
  });
});

// Logging middleware para debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas API - IMPORTANTE: Registrar ANTES de express.static para evitar conflictos
app.use("/api/health", healthRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/properties", geographicRouter); // Rutas geográficas bajo /api/properties

// Servir archivos estáticos (después de las rutas de API)
app.use(express.static("public"));

// Handler 404 para rutas no encontradas
app.use((req, res) => {
  console.warn(`[404] Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    availableRoutes: {
      root: "/",
      health: "/api/health",
      properties: "/api/properties",
      propertiesFeatured: "/api/properties/featured",
      sitemap: "/sitemap.xml"
    }
  });
});

// Sitemap XML - Generado dinámicamente con imágenes
app.get("/sitemap.xml", async (req, res) => {
  try {
    const { pool } = await import("./db.js");
    const BASE_URL = "https://inmobiliarianasuti.com.ar";
    
    // Obtener todas las propiedades con sus imágenes
    const result = await pool.query(`
      SELECT p.id, p.title, p.updated_at,
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      WHERE p.status != 'vendida' OR p.status IS NULL
      GROUP BY p.id, p.title, p.updated_at
      ORDER BY p.updated_at DESC
    `);
    
    // Fecha actual en formato ISO para lastmod
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Construir XML del sitemap con namespace de imágenes
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Página principal -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Catálogo -->
  <url>
    <loc>${BASE_URL}/catalogo</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    
    // Agregar cada propiedad con sus imágenes
    for (const property of result.rows) {
      const lastmod = property.updated_at 
        ? new Date(property.updated_at).toISOString().split('T')[0]
        : currentDate;
      
      sitemap += `
  <url>
    <loc>${BASE_URL}/propiedad/${property.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;
      
      // Agregar imágenes si existen (máximo 10 imágenes por propiedad según especificación)
      if (property.images && property.images.length > 0) {
        const images = property.images.slice(0, 10); // Limitar a 10 imágenes
        for (const imageUrl of images) {
          // Asegurar que la URL sea absoluta
          const fullImageUrl = imageUrl.startsWith('http') 
            ? imageUrl 
            : imageUrl.startsWith('/')
            ? `${BASE_URL}${imageUrl}`
            : `${BASE_URL}/${imageUrl}`;
          
          sitemap += `
    <image:image>
      <image:loc>${fullImageUrl}</image:loc>
      <image:title>${property.title || 'Propiedad'}</image:title>
    </image:image>`;
        }
      }
      
      sitemap += `
  </url>`;
    }
    
    sitemap += `
</urlset>`;
    
    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

// Railway requiere escuchar en 0.0.0.0 para aceptar conexiones externas
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at http://0.0.0.0:${PORT}`);
  if (supabaseStorageConfigured) {
    console.log("📦 Supabase Storage configured successfully");
  } else {
    console.warn(
      "⚠️ Supabase Storage no está configurado. Las imágenes no funcionarán."
    );
  }
});
