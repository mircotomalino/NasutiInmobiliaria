# 🗺️ Configuración de Mapbox para Búsqueda Premium de Direcciones

## 📋 Resumen

La aplicación Nasuti Inmobiliaria incluye soporte opcional para **Mapbox** como proveedor premium de geocoding, con **Nominatim (OpenStreetMap)** como fallback gratuito por defecto.

## 🚀 Ventajas de Mapbox vs Nominatim

| Característica | Mapbox (Premium) | Nominatim (Gratuito) |
|----------------|------------------|----------------------|
| **Precisión** | ⭐⭐⭐⭐⭐ Muy alta | ⭐⭐⭐ Buena |
| **Velocidad** | ⭐⭐⭐⭐⭐ Muy rápida | ⭐⭐⭐ Moderada |
| **Límites** | 100,000 requests/mes | 1 request/segundo |
| **Coverage** | ⭐⭐⭐⭐⭐ Global | ⭐⭐⭐⭐ Buenos datos |
| **Autocomplete** | ⭐⭐⭐⭐⭐ Excelente | ⭐⭐⭐ Básico |
| **Costo** | 💰 Gratis hasta 100k/mes | 🆓 Completamente gratis |

## 🔑 Cómo Obtener tu Token de Mapbox

### Paso 1: Crear Cuenta en Mapbox
1. Ve a [https://account.mapbox.com/](https://account.mapbox.com/)
2. Haz click en **"Sign up"**
3. Completa el formulario de registro
4. Confirma tu email

### Paso 2: Crear un Token de Acceso
1. Una vez logueado, ve a [https://account.mapbox.com/access-tokens/](https://account.mapbox.com/access-tokens/)
2. Haz click en **"Create a token"**
3. Configura el token:
   - **Name**: `Nasuti Inmobiliaria`
   - **Public scopes**: ✅ `styles:read`, ✅ `fonts:read`
   - **Secret scopes**: ✅ `geocoding:read`
   - **URL restrictions**: (opcional) `localhost:3000`, `tu-dominio.com`

### Paso 3: Copiar el Token
El token se ve así:
```
pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsZXhhbXBsZWFwZXMzem5yN2F5dWl3eG8ifQ.example_token_here
```

## ⚙️ Configuración en la Aplicación

### Opción 1: Archivo .env (Recomendado)
1. Copia el archivo `env.example` a `.env`:
   ```bash
   cp env.example .env
   ```

2. Edita el archivo `.env` y agrega tu token:
   ```env
   VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsZXhhbXBsZWFwZXMzem5yN2F5dWl3eG8ifQ.example_token_here
   ```

3. Reinicia la aplicación:
   ```bash
   npm run dev:full
   ```

### Opción 2: Variables de Entorno del Sistema
```bash
export VITE_MAPBOX_TOKEN="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsZXhhbXBsZWFwZXMzem5yN2F5dWl3eG8ifQ.example_token_here"
npm run dev:full
```

### Opción 3: Netlify/Vercel (Deploy)
En tu plataforma de deploy, agrega la variable de entorno:
- **Nombre**: `VITE_MAPBOX_TOKEN`
- **Valor**: `pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsZXhhbXBsZWFwZXMzem5yN2F5dWl3eG8ifQ.example_token_here`

## 🔍 Cómo Funciona la Detección Automática

La aplicación detecta automáticamente si Mapbox está disponible:

```typescript
// Si VITE_MAPBOX_TOKEN existe → Usa Mapbox
// Si no existe → Usa Nominatim como fallback
const isMapboxAvailable = (): boolean => {
  return !!import.meta.env.VITE_MAPBOX_TOKEN;
};
```

### Flujo de Búsqueda:
1. **Con Mapbox**: 
   - Intenta buscar con Mapbox
   - Si no hay resultados → Fallback a Nominatim
   - Si hay error → Fallback a Nominatim

2. **Sin Mapbox**: 
   - Usa directamente Nominatim

## 🎯 Indicadores Visuales

La aplicación muestra qué proveedor está siendo usado:

- **🟡 Mapbox**: Icono de rayo amarillo + "Mapbox"
- **🔵 Nominatim**: Icono de globo azul + "Nominatim"

## 🧪 Testing de la Configuración

### Verificar que Mapbox funciona:
1. Abre el MapPicker en `/managerLogin`
2. Busca una dirección (ej: "Av. Colón 1000, Córdoba")
3. Verifica que aparezca el icono 🟡 "Mapbox"
4. Los resultados deben ser más precisos y rápidos

### Verificar fallback a Nominatim:
1. Comenta la línea `VITE_MAPBOX_TOKEN` en `.env`
2. Reinicia la aplicación
3. Busca la misma dirección
4. Verifica que aparezca el icono 🔵 "Nominatim"

## 📊 Monitoreo de Uso

### Dashboard de Mapbox:
1. Ve a [https://account.mapbox.com/](https://account.mapbox.com/)
2. Sección **"Usage"** muestra:
   - Requests utilizados este mes
   - Límite mensual (100,000)
   - Proyección de uso

### Logs de la Aplicación:
```javascript
// En la consola del navegador verás:
🔍 Buscando con Mapbox...
✅ Mapbox: 5 resultados encontrados

// O en caso de fallback:
⚠️ Mapbox sin resultados, usando Nominatim como fallback
```

## 💰 Costos y Límites

### Plan Gratuito de Mapbox:
- **100,000 requests/mes** gratis
- **Geocoding**: Incluido
- **Map tiles**: Incluido
- **Soporte**: Email

### Planes de Pago:
- **Pay-as-you-go**: $0.75 por cada 1,000 requests adicionales
- **Plans**: Desde $5/mes para proyectos pequeños

## 🔒 Seguridad

### Buenas Prácticas:
1. **Nunca** commits el token al repositorio
2. Usa **URL restrictions** en Mapbox
3. **Rota** el token periódicamente
4. **Monitorea** el uso para detectar abuso

### Archivo .gitignore:
```gitignore
# Variables de entorno
.env
.env.local
.env.production
```

## 🚨 Troubleshooting

### Error: "Mapbox token no configurado"
- Verifica que `VITE_MAPBOX_TOKEN` esté en `.env`
- Reinicia la aplicación después de agregar la variable

### Error: "Mapbox API error: 401"
- Token inválido o expirado
- Verifica el token en [Mapbox Dashboard](https://account.mapbox.com/access-tokens/)

### Error: "Mapbox API error: 403"
- Token no tiene permisos de geocoding
- Verifica que `geocoding:read` esté habilitado

### Búsquedas lentas:
- Mapbox debería ser más rápido que Nominatim
- Verifica tu conexión a internet
- Revisa los logs en la consola

## 📈 Optimizaciones Avanzadas

### Cache de Resultados:
```typescript
// Implementar cache local para evitar requests duplicados
const searchCache = new Map<string, SearchResult[]>();
```

### Debounce Optimizado:
```typescript
// Ajustar el debounce según el proveedor
const debounceTime = isMapboxAvailable() ? 200 : 300;
```

### Batch Requests:
```typescript
// Para múltiples búsquedas, usar batch API de Mapbox
const batchGeocode = async (addresses: string[]) => {
  // Implementar batch geocoding
};
```

## 🌍 Configuración Regional

### Argentina Específica:
```typescript
// Parámetros optimizados para Argentina
const params = {
  country: 'AR',
  language: 'es',
  types: 'address,poi,place,locality,neighborhood'
};
```

## 📞 Soporte

### Mapbox Support:
- **Documentación**: [https://docs.mapbox.com/](https://docs.mapbox.com/)
- **Email**: help@mapbox.com
- **Community**: [https://github.com/mapbox](https://github.com/mapbox)

### Nominatim Support:
- **Documentación**: [https://nominatim.org/release-docs/develop/api/Overview/](https://nominatim.org/release-docs/develop/api/Overview/)
- **Community**: [https://github.com/osm-search/Nominatim](https://github.com/osm-search/Nominatim)

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Mapbox creada
- [ ] Token de acceso generado
- [ ] Variable `VITE_MAPBOX_TOKEN` agregada a `.env`
- [ ] Aplicación reiniciada
- [ ] Búsqueda de prueba realizada
- [ ] Icono 🟡 "Mapbox" visible en la interfaz
- [ ] Fallback a Nominatim verificado
- [ ] Monitoreo de uso configurado

---

**¡Configuración completa! Tu aplicación ahora tiene búsqueda premium de direcciones con Mapbox** 🗺️✨
