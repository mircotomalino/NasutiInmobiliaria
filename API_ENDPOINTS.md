# API Endpoints - Nasuti Inmobiliaria

## Base URL

```
https://tu-proyecto.railway.app
```

## Endpoints Disponibles

### 🏥 Health Check

```
GET /api/health
```

Verifica el estado de la API y la conexión a la base de datos.

**Ejemplo:**

```bash
curl https://tu-proyecto.railway.app/api/health
```

---

### 🏠 Propiedades

#### Obtener todas las propiedades

```
GET /api/properties
```

**Ejemplo:**

```bash
curl https://tu-proyecto.railway.app/api/properties
```

#### Obtener propiedades destacadas (máximo 3)

```
GET /api/properties/featured
```

**Ejemplo:**

```bash
curl https://tu-proyecto.railway.app/api/properties/featured
```

#### Obtener una propiedad específica

```
GET /api/properties/:id
```

**Ejemplo:**

```bash
curl https://tu-proyecto.railway.app/api/properties/1
```

#### Crear una nueva propiedad

```
POST /api/properties
Content-Type: multipart/form-data
```

**Ejemplo con curl:**

```bash
curl -X POST https://tu-proyecto.railway.app/api/properties \
  -F "title=Casa en venta" \
  -F "description=Hermosa casa con jardín" \
  -F "price=50000" \
  -F "address=Av. Principal 123" \
  -F "city=San Marcos" \
  -F "province=Córdoba" \
  -F "type=casa" \
  -F "bedrooms=3" \
  -F "bathrooms=2" \
  -F "area=150" \
  -F "patio=si" \
  -F "garage=si" \
  -F "status=disponible" \
  -F "latitude=-31.4167" \
  -F "longitude=-64.1833" \
  -F "images=@/ruta/a/imagen1.jpg" \
  -F "images=@/ruta/a/imagen2.jpg"
```

#### Actualizar una propiedad

```
PUT /api/properties/:id
Content-Type: multipart/form-data
```

**Ejemplo:**

```bash
curl -X PUT https://tu-proyecto.railway.app/api/properties/1 \
  -F "title=Casa actualizada" \
  -F "price=55000"
```

#### Eliminar una propiedad

```
DELETE /api/properties/:id
```

**Ejemplo:**

```bash
curl -X DELETE https://tu-proyecto.railway.app/api/properties/1
```

#### Toggle estado destacado de una propiedad

```
PATCH /api/properties/:id/featured
```

**Ejemplo:**

```bash
curl -X PATCH https://tu-proyecto.railway.app/api/properties/1/featured
```

---

### 🖼️ Imágenes

#### Obtener imágenes de una propiedad

```
GET /api/properties/:id/images
```

**Ejemplo:**

```bash
curl https://tu-proyecto.railway.app/api/properties/1/images
```

#### Eliminar una imagen específica

```
DELETE /api/properties/:id/images/:imageId
```

**Ejemplo:**

```bash
curl -X DELETE https://tu-proyecto.railway.app/api/properties/1/images/5
```

---

### 🗺️ Consultas Geográficas

#### Propiedades cercanas a un punto

```
GET /api/properties/nearby?lat=-31.4167&lng=-64.1833&radius=10000
```

**Parámetros:**

- `lat` (requerido): Latitud
- `lng` (requerido): Longitud
- `radius` (opcional): Radio en metros (default: 10000)

**Ejemplo:**

```bash
curl "https://tu-proyecto.railway.app/api/properties/nearby?lat=-31.4167&lng=-64.1833&radius=5000"
```

#### Propiedades con coordenadas

```
GET /api/properties/with-coordinates
```

**Ejemplo:**

```bash
curl https://tu-proyecto.railway.app/api/properties/with-coordinates
```

---

## Ejemplos de Uso

### Probar Health Check

```bash
# Reemplaza con tu URL de Railway
curl https://tu-proyecto.railway.app/api/health | jq
```

### Obtener todas las propiedades

```bash
curl https://tu-proyecto.railway.app/api/properties | jq
```

### Crear propiedad desde JSON (sin imágenes)

```bash
curl -X POST https://tu-proyecto.railway.app/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Casa en venta",
    "description": "Hermosa casa",
    "price": 50000,
    "address": "Av. Principal 123",
    "city": "San Marcos",
    "province": "Córdoba",
    "type": "casa",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 150,
    "patio": "si",
    "garage": "si",
    "status": "disponible"
  }'
```

---

## Notas

- Todas las respuestas son en formato JSON
- Para subir imágenes, usa `multipart/form-data`
- El máximo de imágenes por propiedad es 10
- Las propiedades destacadas tienen un límite de 3
- Los endpoints geográficos requieren coordenadas válidas
