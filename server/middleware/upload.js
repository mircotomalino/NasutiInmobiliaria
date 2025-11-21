import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import { supabase, STORAGE_BUCKET } from "../config/supabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de multer para almacenamiento en memoria (necesario para Supabase Storage)
const memoryStorage = multer.memoryStorage();

// Configuración de multer para almacenamiento en disco (fallback si no hay Supabase)
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Usar almacenamiento en memoria si Supabase está configurado, sino usar disco
const storage = supabase ? memoryStorage : diskStorage;

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Función para subir imagen a Supabase Storage
export const uploadToSupabase = async (file, propertyId) => {
  if (!supabase) {
    // Fallback: retornar ruta local
    return `/uploads/${file.filename}`;
  }

  try {
    const fileExt = path.extname(file.originalname);
    const fileName = `${propertyId}/${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${fileExt}`;
    const filePath = `${fileName}`;

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading to Supabase Storage:", error);
      throw error;
    }

    // Obtener URL pública del archivo
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadToSupabase:", error);
    throw error;
  }
};

// Crear directorio de uploads si no existe (solo para fallback local)
if (!supabase) {
  const uploadsDir = path.join(__dirname, "../public/uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}
