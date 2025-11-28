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
