import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase Storage
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key para operaciones del servidor
const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET || "PropertyImages";

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "⚠️  Supabase Storage no configurado. Las imágenes se guardarán localmente."
  );
}

// Cliente de Supabase con service role key (bypass RLS para operaciones del servidor)
export const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export const STORAGE_BUCKET = supabaseBucket;
