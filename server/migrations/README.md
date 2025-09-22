# 🗄️ Database Migrations - Nasuti Inmobiliaria

Este directorio contiene las migraciones de base de datos para el sistema inmobiliario.

## 📋 Migraciones Disponibles

### `001_add_geolocation.sql`
**Descripción**: Agrega soporte para geolocalización a las propiedades
**Fecha**: 2024-12-19

#### Cambios incluidos:
- ✅ **Columnas nuevas**:
  - `latitude` (DECIMAL(10, 8)) - Latitud de la propiedad
  - `longitude` (DECIMAL(11, 8)) - Longitud de la propiedad
  - `geom` (GEOMETRY(POINT, 4326)) - Geometría PostGIS (opcional)

- ✅ **Índices creados**:
  - `idx_properties_latitude` - Índice en columna latitude
  - `idx_properties_longitude` - Índice en columna longitude  
  - `idx_properties_coordinates` - Índice compuesto (lat, lng)
  - `idx_properties_geom` - Índice espacial GIST para PostGIS

- ✅ **Restricciones de validación**:
  - `check_latitude_range` - Latitud entre -90 y 90
  - `check_longitude_range` - Longitud entre -180 y 180

- ✅ **Funciones helper**:
  - `calculate_distance()` - Calcula distancia entre dos puntos geográficos
  - `update_property_geom()` - Trigger para actualizar geom automáticamente

- ✅ **Vista creada**:
  - `properties_with_coordinates` - Vista con flag de coordenadas válidas

## 🚀 Cómo Ejecutar Migraciones

### Opción 1: Script de Migración Automatizado
```bash
# Ejecutar todas las migraciones pendientes
node server/migrate.js migrate

# Ejecutar migración específica
node server/migrate.js migrate 001_add_geolocation.sql

# Ver estado de migraciones
node server/migrate.js status
```

### Opción 2: Ejecución Manual
```bash
# Conectar a PostgreSQL
psql -U postgres -d nasuti_inmobiliaria

# Ejecutar migración
\i server/migrations/001_add_geolocation.sql
```

## 🔧 Requisitos

### Básicos
- PostgreSQL 12+ 
- Node.js 18+

### Opcionales (para funcionalidades avanzadas)
- **PostGIS**: Para geometrías espaciales y consultas geográficas avanzadas
  ```bash
  # Instalar PostGIS en Ubuntu/Debian
  sudo apt-get install postgis postgresql-14-postgis-3
  
  # Instalar PostGIS en macOS
  brew install postgis
  ```

## 📊 Nuevos Endpoints API

Después de ejecutar la migración, estarán disponibles:

### `GET /api/properties/nearby`
Busca propiedades cerca de una coordenada específica.
```javascript
// Ejemplo de uso
fetch('/api/properties/nearby?lat=-31.4201&lng=-64.1888&radius=5000')
```

**Parámetros**:
- `lat` (required): Latitud del punto de referencia
- `lng` (required): Longitud del punto de referencia  
- `radius` (optional): Radio de búsqueda en metros (default: 10000)

**Respuesta**:
```json
[
  {
    "id": "1",
    "title": "Casa en Córdoba",
    "latitude": -31.4201,
    "longitude": -64.1888,
    "distance": 1250.5,
    // ... resto de campos de propiedad
  }
]
```

### `GET /api/properties/with-coordinates`
Obtiene solo las propiedades que tienen coordenadas geográficas.
```javascript
// Ejemplo de uso
fetch('/api/properties/with-coordinates')
```

## 🗺️ Ejemplos de Coordenadas

### Ciudades Principales (Argentina)
```sql
-- Córdoba Capital
INSERT INTO properties (..., latitude, longitude) 
VALUES (..., -31.4201, -64.1888);

-- Marcos Juárez
INSERT INTO properties (..., latitude, longitude) 
VALUES (..., -32.6986, -62.1019);

-- Leones
INSERT INTO properties (..., latitude, longitude) 
VALUES (..., -32.4378, -63.2975);

-- Rosario
INSERT INTO properties (..., latitude, longitude) 
VALUES (..., -32.9442, -60.6505);
```

## 🔍 Consultas de Ejemplo

### Buscar propiedades en un radio específico
```sql
SELECT p.*, 
       calculate_distance(-31.4201, -64.1888, p.latitude, p.longitude) as distance_metros
FROM properties p
WHERE p.latitude IS NOT NULL 
  AND p.longitude IS NOT NULL
  AND calculate_distance(-31.4201, -64.1888, p.latitude, p.longitude) <= 5000
ORDER BY distance_metros ASC;
```

### Propiedades con PostGIS (si está instalado)
```sql
SELECT p.*, 
       ST_Distance(p.geom, ST_SetSRID(ST_MakePoint(-64.1888, -31.4201), 4326)) as distance_metros
FROM properties p
WHERE p.geom IS NOT NULL
  AND ST_DWithin(p.geom, ST_SetSRID(ST_MakePoint(-64.1888, -31.4201), 4326), 5000)
ORDER BY distance_metros ASC;
```

## 🛠️ Troubleshooting

### Error: "PostGIS extension not found"
- **Solución**: Instalar PostGIS o ignorar el mensaje (funciona sin PostGIS)
- **Impacto**: Solo se pierden funcionalidades avanzadas de geometría

### Error: "Column already exists"
- **Solución**: La migración ya se ejecutó, es seguro ignorar
- **Verificación**: `node server/migrate.js status`

### Error: "Permission denied"
- **Solución**: Ejecutar con usuario postgres o con permisos adecuados
```bash
sudo -u postgres psql -d nasuti_inmobiliaria -f server/migrations/001_add_geolocation.sql
```

## 📈 Próximas Migraciones

### Planificadas:
- `002_add_property_amenities.sql` - Amenities y características adicionales
- `003_add_user_management.sql` - Sistema de usuarios y autenticación
- `004_add_property_favorites.sql` - Favoritos de usuarios
- `005_add_search_analytics.sql` - Analytics de búsquedas

---

**Desarrollado para Nasuti Inmobiliaria** 🏠
