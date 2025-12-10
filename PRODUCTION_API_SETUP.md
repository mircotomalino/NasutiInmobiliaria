# Configuración de API en Producción

## Problema

El frontend está en Vercel y el backend está en Railway. Son servicios separados, por lo que necesitan comunicarse a través de URLs completas.

## Solución

Configurar la variable de entorno `VITE_API_URL` en Vercel con la URL de tu backend en Railway.

## Pasos para Configurar

### 1. Obtener la URL del Backend en Railway

1. Ve a tu proyecto en Railway: https://railway.app
2. Selecciona el servicio del backend
3. Ve a la pestaña "Settings"
4. Busca la sección "Domains" o "Public Domain"
5. Copia la URL pública (ej: `https://tu-backend.railway.app`)

**Nota:** Si no tienes un dominio público configurado en Railway:
- Ve a "Settings" > "Networking"
- Haz clic en "Generate Domain" para crear un dominio público
- Copia la URL generada

### 2. Configurar Variable de Entorno en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com
2. Selecciona tu proyecto
3. Ve a "Settings" > "Environment Variables"
4. Agrega una nueva variable:
   - **Name:** `VITE_API_URL`
   - **Value:** La URL de tu backend (sin `/api` al final)
     - Ejemplo: `https://tu-backend.railway.app`
   - **Environment:** Selecciona "Production" (y "Preview" si quieres)
5. Haz clic en "Save"

### 3. Redesplegar

Después de agregar la variable de entorno:

1. Ve a "Deployments" en Vercel
2. Haz clic en los tres puntos (...) del último deployment
3. Selecciona "Redeploy"
4. O simplemente haz un nuevo commit y push

### 4. Verificar

Una vez redesplegado, verifica que funcione:

1. Abre tu sitio en producción
2. Abre la consola del navegador (F12)
3. Ve a la pestaña "Network"
4. Recarga la página
5. Busca la petición a `/api/properties`
6. Debería tener un status 200 (éxito)

## Ejemplo de Configuración

```
VITE_API_URL=https://nasuti-backend.railway.app
```

El código automáticamente agregará `/api` al final, por lo que las peticiones irán a:
```
https://nasuti-backend.railway.app/api/properties
```

## Troubleshooting

### Error: "Failed to fetch" o "Network error"

- Verifica que la URL en `VITE_API_URL` sea correcta
- Verifica que el backend en Railway esté corriendo
- Verifica que el backend tenga CORS configurado para permitir tu dominio de Vercel

### Error: "CORS policy"

El backend necesita permitir tu dominio de Vercel. En `server/index.js`, asegúrate de que `FRONTEND_URL` incluya tu dominio de Vercel:

```javascript
FRONTEND_URL=https://inmobiliarianasuti.com.ar,https://tu-proyecto.vercel.app
```

### Las peticiones van a localhost

- Verifica que la variable de entorno esté configurada en Vercel
- Verifica que esté configurada para el ambiente correcto (Production)
- Redesplega después de agregar la variable

## Alternativa: Usar el mismo dominio

Si prefieres usar el mismo dominio para frontend y backend:

1. Configura un proxy en Vercel para redirigir `/api/*` a Railway
2. O mueve el backend a Vercel como funciones serverless

Pero la solución más simple es configurar `VITE_API_URL` como se describe arriba.

