# 📦 Configuración de Supabase Storage

## Paso 1: Crear el Bucket en Supabase

1. Ve al **Dashboard de Supabase** → **Storage**
2. Haz clic en **"New bucket"**
3. Configura el bucket:

   - **Name**: `PropertyImages` (o el nombre que prefieras)
   - **Public bucket**: ✅ **Marcar como público** (para que las imágenes sean accesibles públicamente)
   - **File size limit**: 5 MB (o el tamaño máximo que quieras)
   - **Allowed MIME types**: `image/*` (solo imágenes)

4. Haz clic en **"Create bucket"**

## Paso 2: Configurar Políticas de Seguridad (RLS)

1. Ve a **Storage** → **Policies** → Selecciona el bucket `PropertyImages`
2. Crea las siguientes políticas:

### Política 1: Lectura pública

- **Policy name**: `Allow public read access`
- **Allowed operation**: `SELECT`
- **Policy definition**:
  ```sql
  true
  ```

### Política 2: Inserción desde service role

- **Policy name**: `Allow service role to insert`
- **Allowed operation**: `INSERT`
- **Policy definition**:
  ```sql
  true
  ```

### Política 3: Eliminación desde service role

- **Policy name**: `Allow service role to delete`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```sql
  true
  ```

## Paso 3: Obtener las Credenciales

1. Ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **IMPORTANTE**: Usa el `service_role` key, NO el `anon` key

## Paso 4: Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env` (o en Railway/Vercel):

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
SUPABASE_STORAGE_BUCKET=PropertyImages
```

## Paso 5: Instalar Dependencias

```bash
npm install
```

Esto instalará `@supabase/supabase-js` que agregamos al `package.json`.

## Paso 6: Probar la Configuración

1. Reinicia tu servidor
2. Intenta subir una imagen de propiedad
3. Verifica que la imagen se guarde en Supabase Storage y no localmente

## Fallback Local

Si no configuras Supabase Storage, la aplicación seguirá funcionando guardando las imágenes localmente en `public/uploads/`. Esto es útil para desarrollo local.

## Notas Importantes

- ⚠️ **Nunca expongas el `service_role` key en el frontend**
- ✅ El `service_role` key solo debe usarse en el backend (Railway)
- 🔒 Las políticas RLS controlan quién puede acceder a las imágenes
- 📦 El bucket debe ser público para que las imágenes se muestren en el frontend
