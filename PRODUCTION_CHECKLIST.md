# Checklist de Despliegue a Producción

## ✅ Fase 1: Preparación del Código - COMPLETADA

- [x] Crear utilidad `getApiBase()` en `src/utils/api.ts`
- [x] Reemplazar URLs hardcodeadas en todos los componentes:
  - [x] `src/App.tsx`
  - [x] `src/components/PropertyPage.tsx`
  - [x] `src/components/ManagerPanel.tsx`
  - [x] `src/components/LandingPage.tsx`
- [x] Actualizar CORS en `server/index.js` para usar `FRONTEND_URL`
- [x] Agregar soporte SSL en `server/db.js` para Supabase
- [x] Actualizar `env.example` con todas las variables de producción
- [x] Actualizar `server/migrate.js` para soportar SSL
- [x] Crear script `server/migrate-to-production.js` para migración de datos
- [x] Crear guía de despliegue `DEPLOY_GUIDE.md`

---

## 📋 Fase 2: Configuración de Servicios - PENDIENTE (Acciones Manuales)

### 2.1 Supabase (Base de Datos)

- [ ] Crear cuenta en Supabase
- [ ] Crear proyecto nuevo
- [ ] Anotar credenciales de conexión (host, password, port)
- [ ] Configurar variables de entorno locales temporalmente
- [ ] Ejecutar migraciones: `node server/migrate.js migrate`
- [ ] Verificar que las tablas se hayan creado

### 2.2 Railway (Backend API)

- [ ] Crear cuenta en Railway
- [ ] Crear nuevo proyecto desde GitHub
- [ ] Configurar variables de entorno:
  - [ ] DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SSL
  - [ ] PORT=3001
  - [ ] NODE_ENV=production
  - [ ] FRONTEND_URL (URLs de Vercel)
- [ ] Configurar build command (vacío o `npm install`)
- [ ] Configurar start command (`npm run server`)
- [ ] Obtener URL del backend deployado
- [ ] Verificar que el backend esté funcionando

### 2.3 Vercel (Frontend)

- [ ] Crear cuenta en Vercel
- [ ] Importar repositorio desde GitHub
- [ ] Configurar variables de entorno:
  - [ ] VITE_API_URL (URL de Railway)
  - [ ] VITE_GOOGLE_MAPS_API_KEY
- [ ] Configurar build command: `npm run build`
- [ ] Configurar output directory: `dist`
- [ ] Agregar dominio personalizado (.com.ar)
- [ ] Configurar DNS (CNAME o A record)
- [ ] Realizar deploy y verificar

### 2.4 Cloudinary (Imágenes - Opcional)

- [ ] Crear cuenta en Cloudinary
- [ ] Obtener Cloud Name, API Key, API Secret
- [ ] (Futuro) Integrar Cloudinary en `server/index.js`

---

## 📦 Fase 3: Migración de Datos - PENDIENTE

### 3.1 Migrar Datos a Supabase

- [ ] Configurar variables PROD*DB*_ o usar DB\__ con valores de Supabase
- [ ] Ejecutar script de migración: `node server/migrate-to-production.js`
- [ ] Verificar que todas las propiedades se hayan migrado
- [ ] Verificar que las imágenes se hayan migrado
- [ ] (Si usa Cloudinary) Migrar imágenes físicas a Cloudinary

---

## 🗺️ Fase 4: Google Maps API - PENDIENTE

### 4.1 Actualizar Restricciones de API Key

- [ ] Ir a Google Cloud Console → APIs & Services → Credentials
- [ ] Seleccionar tu API Key
- [ ] En "Application restrictions" → "HTTP referrers", agregar:
  - [ ] `https://tu-dominio.com.ar/*`
  - [ ] `https://www.tu-dominio.com.ar/*`
  - [ ] `http://localhost:3000/*` (para desarrollo)
- [ ] Guardar cambios
- [ ] Verificar que las APIs estén habilitadas:
  - [ ] Maps JavaScript API
  - [ ] Geocoding API
  - [ ] Places API

---

## ✅ Fase 5: Testing y Verificación - PENDIENTE

### 5.1 Verificar Funcionalidades en Producción

- [ ] Página principal carga correctamente
- [ ] Propiedades se muestran en el catálogo
- [ ] Mapas de Google Maps funcionan
- [ ] Panel de administración es accesible (`/managerLogin`)
- [ ] Subida de nuevas propiedades funciona
- [ ] Subida de imágenes funciona
- [ ] Edición de propiedades funciona
- [ ] Eliminación de propiedades funciona
- [ ] Filtros y búsqueda funcionan
- [ ] Página individual de propiedad funciona
- [ ] Enlaces de WhatsApp funcionan
- [ ] Formulario de contacto funciona

### 5.2 Verificar Logs y Monitoreo

- [ ] Revisar logs de Railway (backend)
- [ ] Revisar logs de Vercel (frontend)
- [ ] Verificar conexiones a BD en Supabase Dashboard
- [ ] Verificar que no haya errores en consola del navegador

### 5.3 Verificar Performance

- [ ] Páginas cargan rápido (< 3 segundos)
- [ ] Imágenes se cargan correctamente
- [ ] Mapas se cargan sin errores
- [ ] No hay errores de CORS

---

## 📝 Notas Importantes

1. **Variables de Entorno**: No subas archivos `.env` al repositorio. Usa las variables de entorno en cada plataforma.

2. **Seguridad**:

   - Asegúrate de que las API Keys estén configuradas correctamente
   - No expongas credenciales en el código
   - Usa restricciones en las API Keys de Google Maps

3. **Backups**:

   - Supabase tiene backups automáticos
   - Considera hacer backups manuales periódicos

4. **Monitoreo**:
   - Revisa los logs regularmente
   - Configura alertas si es posible

---

## 🆘 Troubleshooting

Si encuentras problemas, revisa:

- `DEPLOY_GUIDE.md` - Guía completa de despliegue
- Logs en Railway y Vercel
- Consola del navegador (F12)
- Variables de entorno configuradas correctamente

---

## 📊 Costos Estimados

- **Vercel**: Gratis
- **Railway**: $5/mes (plan Hobby) o créditos gratis
- **Supabase**: Gratis (500MB)
- **Cloudinary**: Gratis (25GB)
- **Dominio**: Según proveedor

**Total: $0-5/mes**
