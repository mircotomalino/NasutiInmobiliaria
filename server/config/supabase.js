import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase Storage
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key para operaciones del servidor
const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET || "PropertyImages";

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "❌ Supabase Storage es obligatorio. Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en las variables de entorno."
  );
}

// Cliente de Supabase con service role key (bypass RLS para operaciones del servidor)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const STORAGE_BUCKET = supabaseBucket;
