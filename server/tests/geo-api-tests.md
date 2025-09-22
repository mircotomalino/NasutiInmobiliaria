# 🧪 Tests para Endpoints de Geolocalización

## 📋 Endpoints Probados

### ✅ POST /api/properties (Crear Propiedad con Coordenadas)

#### Test 1: Crear propiedad con coordenadas válidas (Córdoba Capital)
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Casa en Córdoba Centro",
    "description": "Hermosa casa en el centro de Córdoba con excelente ubicación",
    "price": 150000,
    "address": "San Martín 123",
    "city": "Córdoba",
    "province": "Córdoba",
    "type": "casa",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 120,
    "patio": "Mediano",
    "garage": "1 Vehiculo",
    "latitude": -31.4201,
    "longitude": -64.1888,
    "status": "disponible"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": 1,
    "title": "Casa en Córdoba Centro",
    "description": "Hermosa casa en el centro de Córdoba con excelente ubicación",
    "price": 150000,
    "address": "San Martín 123",
    "city": "Córdoba",
    "province": "Córdoba",
    "type": "casa",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 120,
    "patio": "Mediano",
    "garage": "1 Vehiculo",
    "latitude": -31.4201,
    "longitude": -64.1888,
    "status": "disponible",
    "publishedDate": "2024-12-19T...",
    "created_at": "2024-12-19T...",
    "updated_at": "2024-12-19T...",
    "images": []
  }
}
```

#### Test 2: Crear propiedad con coordenadas de Marcos Juárez
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Departamento en Marcos Juárez",
    "description": "Moderno departamento en zona céntrica",
    "price": 85000,
    "address": "Av. Rivadavia 456",
    "city": "Marcos Juárez",
    "type": "departamento",
    "bedrooms": 2,
    "bathrooms": 1,
    "area": 80,
    "patio": "No Tiene",
    "garage": "No Tiene",
    "latitude": -32.6986,
    "longitude": -62.1019,
    "status": "disponible"
  }'
```

#### Test 3: Crear propiedad SIN coordenadas (válido)
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Casa sin coordenadas",
    "description": "Propiedad sin geolocalización",
    "price": 100000,
    "address": "Dirección 789",
    "city": "Leones",
    "type": "casa",
    "bedrooms": 2,
    "bathrooms": 1,
    "area": 90,
    "patio": "Chico",
    "garage": "1 Vehiculo",
    "status": "disponible"
  }'
```

#### Test 4: ❌ Error - Solo latitud (sin longitud)
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Propiedad con coordenada incompleta",
    "description": "Solo tiene latitud",
    "price": 75000,
    "address": "Calle 123",
    "city": "Córdoba",
    "type": "casa",
    "bedrooms": 2,
    "bathrooms": 1,
    "area": 85,
    "patio": "No Tiene",
    "garage": "No Tiene",
    "latitude": -31.4201,
    "status": "disponible"
  }'
```

**Respuesta esperada (Error 400):**
```json
{
  "error": "Validation failed",
  "details": [
    "Both latitude and longitude must be provided together"
  ]
}
```

#### Test 5: ❌ Error - Latitud inválida (> 90)
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Propiedad con latitud inválida",
    "description": "Latitud fuera de rango",
    "price": 50000,
    "address": "Calle 456",
    "city": "Córdoba",
    "type": "casa",
    "bedrooms": 1,
    "bathrooms": 1,
    "area": 60,
    "patio": "No Tiene",
    "garage": "No Tiene",
    "latitude": 95.0,
    "longitude": -64.1888,
    "status": "disponible"
  }'
```

**Respuesta esperada (Error 400):**
```json
{
  "error": "Validation failed",
  "details": [
    "Latitude must be between -90 and 90 degrees"
  ]
}
```

#### Test 6: ❌ Error - Longitud inválida (< -180)
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Propiedad con longitud inválida",
    "description": "Longitud fuera de rango",
    "price": 60000,
    "address": "Calle 789",
    "city": "Córdoba",
    "type": "casa",
    "bedrooms": 2,
    "bathrooms": 1,
    "area": 70,
    "patio": "No Tiene",
    "garage": "No Tiene",
    "latitude": -31.4201,
    "longitude": -200.0,
    "status": "disponible"
  }'
```

**Respuesta esperada (Error 400):**
```json
{
  "error": "Validation failed",
  "details": [
    "Longitude must be between -180 and 180 degrees"
  ]
}
```

#### Test 7: ❌ Error - Coordenadas no numéricas
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Propiedad con coordenadas inválidas",
    "description": "Coordenadas no numéricas",
    "price": 70000,
    "address": "Calle 321",
    "city": "Córdoba",
    "type": "casa",
    "bedrooms": 1,
    "bathrooms": 1,
    "area": 65,
    "patio": "No Tiene",
    "garage": "No Tiene",
    "latitude": "invalid",
    "longitude": "invalid",
    "status": "disponible"
  }'
```

**Respuesta esperada (Error 400):**
```json
{
  "error": "Validation failed",
  "details": [
    "Latitude must be a valid number",
    "Longitude must be a valid number"
  ]
}
```

---

### ✅ PUT /api/properties/:id (Actualizar Propiedad con Coordenadas)

#### Test 8: Actualizar propiedad con nuevas coordenadas
```bash
curl -X PUT http://localhost:3001/api/properties/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Casa en Córdoba Centro - Actualizada",
    "description": "Hermosa casa en el centro de Córdoba con excelente ubicación - Ubicación actualizada",
    "price": 160000,
    "address": "San Martín 123",
    "city": "Córdoba",
    "province": "Córdoba",
    "type": "casa",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 125,
    "patio": "Grande",
    "garage": "2 Vehiculos",
    "latitude": -31.4215,
    "longitude": -64.1892,
    "status": "disponible"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": {
    "id": 1,
    "title": "Casa en Córdoba Centro - Actualizada",
    "description": "Hermosa casa en el centro de Córdoba con excelente ubicación - Ubicación actualizada",
    "price": 160000,
    "address": "San Martín 123",
    "city": "Córdoba",
    "province": "Córdoba",
    "type": "casa",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 125,
    "patio": "Grande",
    "garage": "2 Vehiculos",
    "latitude": -31.4215,
    "longitude": -64.1892,
    "status": "disponible",
    "publishedDate": "2024-12-19T...",
    "created_at": "2024-12-19T...",
    "updated_at": "2024-12-19T...",
    "images": []
  }
}
```

#### Test 9: Actualizar propiedad removiendo coordenadas (establecer en null)
```bash
curl -X PUT http://localhost:3001/api/properties/2 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Departamento en Marcos Juárez - Sin coordenadas",
    "description": "Moderno departamento en zona céntrica - Sin geolocalización",
    "price": 85000,
    "address": "Av. Rivadavia 456",
    "city": "Marcos Juárez",
    "type": "departamento",
    "bedrooms": 2,
    "bathrooms": 1,
    "area": 80,
    "patio": "No Tiene",
    "garage": "No Tiene",
    "latitude": null,
    "longitude": null,
    "status": "disponible"
  }'
```

#### Test 10: ❌ Error - ID de propiedad inválido
```bash
curl -X PUT http://localhost:3001/api/properties/invalid \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "description": "Test",
    "price": 100000,
    "address": "Test",
    "city": "Córdoba",
    "type": "casa",
    "latitude": -31.4201,
    "longitude": -64.1888,
    "status": "disponible"
  }'
```

**Respuesta esperada (Error 400):**
```json
{
  "error": "Invalid property ID"
}
```

#### Test 11: ❌ Error - Propiedad no encontrada
```bash
curl -X PUT http://localhost:3001/api/properties/99999 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "description": "Test",
    "price": 100000,
    "address": "Test",
    "city": "Córdoba",
    "type": "casa",
    "latitude": -31.4201,
    "longitude": -64.1888,
    "status": "disponible"
  }'
```

**Respuesta esperada (Error 404):**
```json
{
  "error": "Property not found"
}
```

---

### ✅ GET /api/properties (Verificar Coordenadas en Respuesta)

#### Test 12: Verificar que las propiedades incluyen coordenadas
```bash
curl -X GET http://localhost:3001/api/properties
```

**Respuesta esperada (parcial):**
```json
[
  {
    "id": 1,
    "title": "Casa en Córdoba Centro - Actualizada",
    "latitude": -31.4215,
    "longitude": -64.1892,
    "city": "Córdoba",
    "province": "Córdoba",
    "type": "casa",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 125,
    "patio": "Grande",
    "garage": "2 Vehiculos",
    "status": "disponible",
    "publishedDate": "2024-12-19T...",
    "created_at": "2024-12-19T...",
    "updated_at": "2024-12-19T...",
    "images": []
  },
  {
    "id": 2,
    "title": "Departamento en Marcos Juárez - Sin coordenadas",
    "latitude": null,
    "longitude": null,
    "city": "Marcos Juárez",
    "province": "Córdoba",
    "type": "departamento",
    "bedrooms": 2,
    "bathrooms": 1,
    "area": 80,
    "patio": "No Tiene",
    "garage": "No Tiene",
    "status": "disponible",
    "publishedDate": "2024-12-19T...",
    "created_at": "2024-12-19T...",
    "updated_at": "2024-12-19T...",
    "images": []
  }
]
```

---

### ✅ GET /api/properties/with-coordinates (Propiedades con Coordenadas)

#### Test 13: Obtener solo propiedades con coordenadas
```bash
curl -X GET http://localhost:3001/api/properties/with-coordinates
```

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "title": "Casa en Córdoba Centro - Actualizada",
    "latitude": -31.4215,
    "longitude": -64.1892,
    "has_coordinates": true,
    "city": "Córdoba",
    "province": "Córdoba",
    "type": "casa",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 125,
    "patio": "Grande",
    "garage": "2 Vehiculos",
    "status": "disponible",
    "publishedDate": "2024-12-19T...",
    "created_at": "2024-12-19T...",
    "updated_at": "2024-12-19T...",
    "images": []
  }
]
```

---

### ✅ GET /api/properties/nearby (Búsqueda por Proximidad)

#### Test 14: Buscar propiedades cerca de Córdoba Capital (radio 10km)
```bash
curl -X GET "http://localhost:3001/api/properties/nearby?lat=-31.4201&lng=-64.1888&radius=10000"
```

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "title": "Casa en Córdoba Centro - Actualizada",
    "latitude": -31.4215,
    "longitude": -64.1892,
    "distance": 125.5,
    "city": "Córdoba",
    "province": "Córdoba",
    "type": "casa",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 125,
    "patio": "Grande",
    "garage": "2 Vehiculos",
    "status": "disponible",
    "publishedDate": "2024-12-19T...",
    "created_at": "2024-12-19T...",
    "updated_at": "2024-12-19T...",
    "images": []
  }
]
```

#### Test 15: Buscar propiedades cerca de Córdoba Capital (radio 1km - más restrictivo)
```bash
curl -X GET "http://localhost:3001/api/properties/nearby?lat=-31.4201&lng=-64.1888&radius=1000"
```

**Respuesta esperada:** Array vacío `[]` si no hay propiedades en ese radio.

#### Test 16: ❌ Error - Parámetros de coordenadas faltantes
```bash
curl -X GET "http://localhost:3001/api/properties/nearby"
```

**Respuesta esperada (Error 400):**
```json
{
  "error": "Latitude and longitude are required"
}
```

---

## 🎯 Coordenadas de Referencia para Tests

### Ciudades de Argentina
```bash
# Córdoba Capital
LAT: -31.4201, LNG: -64.1888

# Marcos Juárez  
LAT: -32.6986, LNG: -62.1019

# Leones
LAT: -32.4378, LNG: -63.2975

# Rosario
LAT: -32.9442, LNG: -60.6505
```

### Coordenadas de Test
```bash
# Punto cerca de Córdoba (para pruebas de distancia)
LAT: -31.4215, LNG: -64.1892  # ~125 metros de distancia

# Coordenadas inválidas para tests de error
LAT: 95.0, LNG: -64.1888      # Latitud > 90
LAT: -31.4201, LNG: -200.0    # Longitud < -180
```

---

## 🚀 Ejecutar Tests

### 1. Iniciar el servidor
```bash
npm run server
```

### 2. Ejecutar tests secuencialmente
```bash
# Test 1: Crear propiedad con coordenadas
curl -X POST http://localhost:3001/api/properties -H "Content-Type: application/json" -d '{...}'

# Test 2: Crear otra propiedad
curl -X POST http://localhost:3001/api/properties -H "Content-Type: application/json" -d '{...}'

# Test 3: Verificar propiedades creadas
curl -X GET http://localhost:3001/api/properties

# Test 4: Buscar propiedades cercanas
curl -X GET "http://localhost:3001/api/properties/nearby?lat=-31.4201&lng=-64.1888&radius=10000"
```

### 3. Script automatizado (opcional)
```bash
# Crear script de test
chmod +x run-tests.sh
./run-tests.sh
```

---

## ✅ Checklist de Validación

- [ ] ✅ POST acepta coordenadas válidas
- [ ] ✅ POST rechaza coordenadas inválidas
- [ ] ✅ POST requiere ambas coordenadas o ninguna
- [ ] ✅ PUT actualiza coordenadas correctamente
- [ ] ✅ PUT valida coordenadas en actualizaciones
- [ ] ✅ GET incluye coordenadas en respuestas
- [ ] ✅ GET /with-coordinates filtra correctamente
- [ ] ✅ GET /nearby calcula distancias correctamente
- [ ] ✅ Validación de rangos geográficos
- [ ] ✅ Manejo de errores específicos
- [ ] ✅ Respuestas consistentes en formato JSON
