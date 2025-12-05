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
app.use(express.static("public"));

// Inicializar base de datos
initDatabase();

// Rutas API
app.use("/api/health", healthRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/properties", geographicRouter); // Rutas geográficas bajo /api/properties

// Sitemap XML - Generado dinámicamente
app.get("/sitemap.xml", async (req, res) => {
  try {
    const { pool } = await import("./db.js");
    const BASE_URL = "https://inmobiliarianasuti.com.ar";
    
    // Obtener todas las propiedades
    const result = await pool.query(`
      SELECT id, updated_at 
      FROM properties 
      WHERE status != 'vendida' OR status IS NULL
      ORDER BY updated_at DESC
    `);
    
    // Fecha actual en formato ISO para lastmod
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Construir XML del sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
    
    // Agregar cada propiedad
    for (const property of result.rows) {
      const lastmod = property.updated_at 
        ? new Date(property.updated_at).toISOString().split('T')[0]
        : currentDate;
      sitemap += `
  <url>
    <loc>${BASE_URL}/propiedad/${property.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (supabaseStorageConfigured) {
    console.log("📦 Supabase Storage configured successfully");
  } else {
    console.warn(
      "⚠️ Supabase Storage no está configurado. Las imágenes no funcionarán."
    );
  }
});
