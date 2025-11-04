# Guía de Despliegue a Producción - Nasuti Inmobiliaria

Esta guía te ayudará a desplegar la aplicación a producción usando Vercel (frontend), Railway (backend), Supabase (BD) y Cloudinary (imágenes opcional).

## 📋 Requisitos Previos

- Cuenta en GitHub (repositorio del proyecto)
- Cuenta en Vercel (gratis)
- Cuenta en Railway (plan Hobby $5/mes o créditos gratis)
- Cuenta en Supabase (gratis tier)
- Dominio .com.ar configurado

---

## 🗄️ Paso 1: Configurar Supabase (Base de Datos)

### 1.1 Crear Proyecto en Supabase

1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto
3. Anota:
   - **Project Name**: (ej: nasuti-inmobiliaria)
   - **Database Password**: (guárdala bien, la necesitarás)

### 1.2 Obtener Credenciales de Conexión

1. En tu proyecto de Supabase, ve a **Settings** → **Database**
2. Busca la sección **Connection string**
3. Anota estos valores:
   - **Host**: `db.xxxxx.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: (la que creaste al crear el proyecto)

### 1.3 Ejecutar Migraciones

1. Configura temporalmente tu `.env` local con las credenciales de Supabase:

   ```env
   DB_HOST=db.xxxxx.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=tu-password-supabase
   DB_SSL=true
   ```

2. Ejecuta las migraciones:

   ```bash
   node server/migrate.js migrate
   ```

3. Verifica que las tablas se hayan creado en Supabase → **Table Editor**

---

## 🚂 Paso 2: Configurar Railway (Backend API)

### 2.1 Crear Proyecto en Railway

1. Ve a https://railway.app y crea una cuenta
2. Haz clic en **New Project** → **Deploy from GitHub repo**
3. Selecciona tu repositorio
4. Railway detectará automáticamente que es un proyecto Node.js

### 2.2 Configurar Variables de Entorno

En Railway, ve a tu proyecto → **Variables** y agrega:

```env
# Base de Datos (Supabase)
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu-password-supabase
DB_SSL=true

# Servidor
PORT=3001
NODE_ENV=production

# CORS (reemplaza con tu dominio real)
FRONTEND_URL=https://tu-dominio.com.ar,https://www.tu-dominio.com.ar
```

### 2.3 Configurar Build y Start Commands

En Railway → **Settings** → **Deploy**:

- **Build Command**: (dejar vacío o `npm install`)
- **Start Command**: `npm run server`

### 2.4 Obtener URL del Backend

1. Railway generará una URL automáticamente (ej: `https://tu-backend.railway.app`)
2. O puedes configurar un dominio personalizado
3. **Anota esta URL**, la necesitarás para Vercel

---

## ⚡ Paso 3: Configurar Vercel (Frontend)

### 3.1 Conectar Repositorio

1. Ve a https://vercel.com y crea una cuenta
2. Haz clic en **Add New Project**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite

### 3.2 Configurar Variables de Entorno

En Vercel → **Settings** → **Environment Variables**, agrega:

```env
VITE_API_URL=https://tu-backend.railway.app
VITE_GOOGLE_MAPS_API_KEY=tu-api-key-de-google-maps
```

### 3.3 Configurar Build Settings

En **Settings** → **General** → **Build & Development Settings**:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.4 Configurar Dominio Personalizado

1. En Vercel → **Settings** → **Domains**
2. Agrega tu dominio `.com.ar`
3. Sigue las instrucciones para configurar DNS:
   - Agrega un registro CNAME apuntando a `cname.vercel-dns.com`
   - O un registro A con la IP que Vercel te indique

### 3.5 Deploy

1. Haz clic en **Deploy**
2. Espera a que termine el build
3. Tu sitio estará disponible en tu dominio

---

## 🖼️ Paso 4: Migrar Datos a Supabase (Opcional)

Si ya tienes propiedades en tu BD local:

1. Configura las variables de producción en tu `.env`:

   ```env
   PROD_DB_HOST=db.xxxxx.supabase.co
   PROD_DB_PORT=5432
   PROD_DB_NAME=postgres
   PROD_DB_USER=postgres
   PROD_DB_PASSWORD=tu-password-supabase
   PROD_DB_SSL=true
   ```

2. Ejecuta el script de migración:
   ```bash
   node server/migrate-to-production.js
   ```

**Nota**: Las imágenes físicas deben copiarse manualmente o usar Cloudinary (ver siguiente paso).

---

## ☁️ Paso 5: Cloudinary para Imágenes (Opcional)

### 5.1 Crear Cuenta

1. Ve a https://cloudinary.com y crea una cuenta gratis
2. Obtén tus credenciales:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 5.2 Integrar Cloudinary (Futuro)

Por ahora, las imágenes se servirán desde el servidor de Railway. Para optimizar en el futuro, puedes integrar Cloudinary en `server/index.js`.

---

## 🗺️ Paso 6: Actualizar Google Maps API Key

### 6.1 Actualizar Restricciones

1. Ve a https://console.cloud.google.com/apis/credentials
2. Selecciona tu API Key
3. En **Application restrictions** → **HTTP referrers (web sites)**, agrega:

   ```
   https://tu-dominio.com.ar/*
   https://www.tu-dominio.com.ar/*
   http://localhost:3000/*
   ```

4. Guarda los cambios

---

## ✅ Paso 7: Verificación

### 7.1 Verificar Funcionalidades

- [ ] Página principal carga correctamente
- [ ] Propiedades se muestran en el catálogo
- [ ] Mapas de Google Maps funcionan
- [ ] Panel de administración accesible
- [ ] Subida de imágenes funciona
- [ ] Filtros y búsqueda funcionan

### 7.2 Verificar Logs

- **Railway**: Revisa los logs del backend para errores
- **Vercel**: Revisa los logs del frontend
- **Supabase**: Verifica las conexiones en Dashboard → Database → Connection Pooling

---

## 🔧 Troubleshooting

### Problema: CORS Errors

**Solución**: Verifica que `FRONTEND_URL` en Railway incluya todas las URLs (con y sin www)

### Problema: Error de conexión a BD

**Solución**:

- Verifica que `DB_SSL=true` esté configurado
- Verifica que las credenciales de Supabase sean correctas
- Revisa los logs de Railway

### Problema: Imágenes no cargan

**Solución**:

- Verifica que las rutas de imágenes sean correctas
- Verifica que Railway tenga acceso al directorio `public/uploads`
- Considera usar Cloudinary para mejor rendimiento

### Problema: Google Maps no carga

**Solución**:

- Verifica que `VITE_GOOGLE_MAPS_API_KEY` esté configurado en Vercel
- Verifica que las restricciones de la API Key incluyan tu dominio

---

## 📊 Costos Estimados

- **Vercel**: Gratis (hasta cierto límite)
- **Railway**: $5/mes (plan Hobby) o usar créditos gratis
- **Supabase**: Gratis (500MB, suficiente para ~200 propiedades)
- **Cloudinary**: Gratis (25GB almacenamiento, 25GB/mes ancho de banda)
- **Dominio**: Varía según proveedor

**Total estimado: $0-5/mes**

---

## 📝 Notas Finales

- Las variables de entorno en producción deben configurarse en cada plataforma
- No subas archivos `.env` al repositorio (están en `.gitignore`)
- Mantén `env.example` actualizado con todas las variables necesarias
- Revisa los logs regularmente para detectar problemas temprano

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs en Railway y Vercel
2. Verifica que todas las variables de entorno estén configuradas
3. Revisa la consola del navegador (F12) para errores del frontend
