# 🚀 Guía Rápida: Desplegar Frontend en Vercel

## 📋 Paso 1: Conectar Repositorio a Vercel

1. Ve a https://vercel.com y crea una cuenta (o inicia sesión)
2. Haz clic en **Add New Project**
3. Conecta tu cuenta de GitHub si no lo has hecho
4. Selecciona el repositorio `NasutiInmobiliaria`
5. Selecciona la rama `feature/set-up-services` (o la que uses)

---

## ⚙️ Paso 2: Configurar Variables de Entorno

**IMPORTANTE**: Antes de hacer deploy, configura estas variables:

1. En la pantalla de configuración del proyecto, ve a **Environment Variables**
2. Agrega las siguientes variables:

```env
VITE_API_URL=https://TU_URL_RAILWAY.app
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBX2NrB2hmXL7JXd6r7pTGWJ4kCPskYmiE
```

**Reemplaza `TU_URL_RAILWAY.app` con tu URL real de Railway** (la que obtuviste del health check)

**Ejemplo:**
```env
VITE_API_URL=https://nasuti-backend-production.up.railway.app
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBX2NrB2hmXL7JXd6r7pTGWJ4kCPskYmiE
```

---

## 🔧 Paso 3: Configurar Build Settings

Vercel debería detectar automáticamente que es un proyecto Vite, pero verifica:

1. **Framework Preset**: `Vite` (debería detectarse automáticamente)
2. **Root Directory**: `.` (raíz del proyecto)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

Si Vercel no detecta Vite automáticamente:
- Ve a **Settings** → **General** → **Build & Development Settings**
- Configura manualmente los valores arriba

---

## 🚀 Paso 4: Deploy

1. Haz clic en **Deploy**
2. Espera a que termine el build (puede tardar 2-3 minutos)
3. Una vez completado, Vercel te dará una URL temporal como:
   ```
   https://nasuti-inmobiliaria-xxxxx.vercel.app
   ```

---

## 🌐 Paso 5: Configurar Dominio Personalizado (Opcional)

Si quieres usar tu dominio `.com.ar`:

1. En Vercel → **Settings** → **Domains**
2. Haz clic en **Add Domain**
3. Ingresa tu dominio (ej: `nasutiinmobiliaria.com.ar`)
4. Sigue las instrucciones de DNS:
   - Agrega un registro **CNAME** apuntando a `cname.vercel-dns.com`
   - O un registro **A** con la IP que Vercel te indique
5. Espera a que se propague el DNS (puede tardar hasta 24 horas, pero generalmente es más rápido)

---

## ✅ Paso 6: Verificar que Funciona

Una vez desplegado, verifica:

1. **Abre la URL de Vercel** en tu navegador
2. **Abre la consola del navegador** (F12)
3. Verifica que no haya errores de CORS
4. Verifica que las propiedades se carguen correctamente
5. Verifica que los mapas de Google Maps funcionen

---

## 🔍 Troubleshooting

### Error: "Failed to fetch" o CORS

**Solución**: Verifica que en Railway tengas configurado:
```env
FRONTEND_URL=https://tu-dominio.vercel.app,https://tu-dominio.com.ar
```

### Error: "API URL not found"

**Solución**: Verifica que `VITE_API_URL` en Vercel tenga la URL correcta de Railway (sin `/api` al final)

### Error: Google Maps no carga

**Solución**: 
1. Verifica que `VITE_GOOGLE_MAPS_API_KEY` esté configurado en Vercel
2. Ve a Google Cloud Console → APIs & Services → Credentials
3. Agrega las URLs de Vercel a las restricciones de la API Key:
   ```
   https://tu-proyecto.vercel.app/*
   https://tu-dominio.com.ar/*
   ```

### Build falla

**Solución**: 
- Revisa los logs de build en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que el comando `npm run build` funcione localmente

---

## 📝 Notas Importantes

- **Las variables de entorno deben empezar con `VITE_`** para que Vite las incluya en el build
- **No subas archivos `.env` al repositorio** (ya están en `.gitignore`)
- **Después de cambiar variables de entorno**, necesitas hacer un nuevo deploy
- **El build se ejecuta en cada push** a la rama conectada

---

## 🎉 ¡Listo!

Una vez desplegado, tu frontend estará disponible en:
- URL temporal de Vercel: `https://tu-proyecto.vercel.app`
- Tu dominio personalizado (si lo configuraste): `https://tu-dominio.com.ar`

