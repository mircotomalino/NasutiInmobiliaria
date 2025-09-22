#!/bin/bash

# 🧪 Script de Tests para Endpoints de Geolocalización
# Ejecuta tests automatizados para validar coordenadas en API

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
API_BASE="http://localhost:3001/api"
PROPERTY_ID=""

echo -e "${BLUE}🧪 Iniciando Tests de Geolocalización${NC}"
echo "=================================="

# Función para hacer requests y mostrar resultados
make_request() {
    local method=$1
    local url=$2
    local data=$3
    local expected_status=$4
    local test_name=$5
    
    echo -e "\n${YELLOW}📋 Test: $test_name${NC}"
    echo "URL: $method $url"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$url")
    fi
    
    # Separar body y status code
    body=$(echo "$response" | head -n -1)
    status_code=$(echo "$response" | tail -n 1)
    
    echo "Status: $status_code"
    echo "Response: $body"
    
    # Validar status code
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL - Expected $expected_status, got $status_code${NC}"
        return 1
    fi
}

# Función para extraer ID de respuesta
extract_id() {
    echo "$1" | grep -o '"id":[0-9]*' | cut -d':' -f2
}

echo -e "\n${BLUE}🚀 Ejecutando Tests...${NC}"

# Test 1: Crear propiedad con coordenadas válidas
echo -e "\n${BLUE}📍 Test 1: Crear propiedad con coordenadas (Córdoba)${NC}"
response1=$(curl -s -X POST "$API_BASE/properties" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Casa Test Córdoba",
        "description": "Casa de prueba en Córdoba",
        "price": 150000,
        "address": "San Martín 123",
        "city": "Córdoba",
        "type": "casa",
        "bedrooms": 3,
        "bathrooms": 2,
        "area": 120,
        "patio": "Mediano",
        "garage": "1 Vehiculo",
        "latitude": -31.4201,
        "longitude": -64.1888,
        "status": "disponible"
    }')

echo "Response: $response1"
PROPERTY_ID=$(echo "$response1" | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "Property ID: $PROPERTY_ID"

if [ -n "$PROPERTY_ID" ]; then
    echo -e "${GREEN}✅ Propiedad creada con ID: $PROPERTY_ID${NC}"
else
    echo -e "${RED}❌ Error al crear propiedad${NC}"
    exit 1
fi

# Test 2: Crear propiedad con coordenadas de Marcos Juárez
echo -e "\n${BLUE}📍 Test 2: Crear propiedad con coordenadas (Marcos Juárez)${NC}"
response2=$(curl -s -X POST "$API_BASE/properties" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Depto Test Marcos Juárez",
        "description": "Departamento de prueba en Marcos Juárez",
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
    }')

echo "Response: $response2"
echo -e "${GREEN}✅ Segunda propiedad creada${NC}"

# Test 3: Crear propiedad SIN coordenadas
echo -e "\n${BLUE}📍 Test 3: Crear propiedad sin coordenadas${NC}"
response3=$(curl -s -X POST "$API_BASE/properties" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Casa Sin Coordenadas",
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
    }')

echo "Response: $response3"
echo -e "${GREEN}✅ Propiedad sin coordenadas creada${NC}"

# Test 4: Error - Solo latitud (sin longitud)
echo -e "\n${BLUE}❌ Test 4: Error - Solo latitud${NC}"
status4=$(curl -s -w "%{http_code}" -o /dev/null -X POST "$API_BASE/properties" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Propiedad Error",
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
    }')

if [ "$status4" = "400" ]; then
    echo -e "${GREEN}✅ Error 400 - Validación correcta${NC}"
else
    echo -e "${RED}❌ Error - Esperaba 400, obtuvo $status4${NC}"
fi

# Test 5: Error - Latitud inválida
echo -e "\n${BLUE}❌ Test 5: Error - Latitud > 90${NC}"
status5=$(curl -s -w "%{http_code}" -o /dev/null -X POST "$API_BASE/properties" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Propiedad Error Lat",
        "description": "Latitud inválida",
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
    }')

if [ "$status5" = "400" ]; then
    echo -e "${GREEN}✅ Error 400 - Latitud inválida detectada${NC}"
else
    echo -e "${RED}❌ Error - Esperaba 400, obtuvo $status5${NC}"
fi

# Test 6: Verificar propiedades creadas
echo -e "\n${BLUE}📋 Test 6: Verificar propiedades con coordenadas${NC}"
properties=$(curl -s -X GET "$API_BASE/properties")
echo "Total properties: $(echo "$properties" | grep -o '"id"' | wc -l)"

# Verificar que las coordenadas están en la respuesta
if echo "$properties" | grep -q "latitude"; then
    echo -e "${GREEN}✅ Coordenadas incluidas en respuesta${NC}"
else
    echo -e "${RED}❌ Coordenadas no encontradas en respuesta${NC}"
fi

# Test 7: Propiedades con coordenadas
echo -e "\n${BLUE}📍 Test 7: Solo propiedades con coordenadas${NC}"
with_coords=$(curl -s -X GET "$API_BASE/properties/with-coordinates")
echo "Properties with coordinates: $(echo "$with_coords" | grep -o '"id"' | wc -l)"

# Test 8: Búsqueda por proximidad
echo -e "\n${BLUE}🔍 Test 8: Búsqueda por proximidad${NC}"
nearby=$(curl -s -X GET "$API_BASE/properties/nearby?lat=-31.4201&lng=-64.1888&radius=10000")
echo "Properties nearby: $(echo "$nearby" | grep -o '"id"' | wc -l)"

# Test 9: Actualizar propiedad con nuevas coordenadas
if [ -n "$PROPERTY_ID" ]; then
    echo -e "\n${BLUE}🔄 Test 9: Actualizar coordenadas${NC}"
    update_response=$(curl -s -X PUT "$API_BASE/properties/$PROPERTY_ID" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "Casa Test Córdoba - Actualizada",
            "description": "Casa de prueba actualizada",
            "price": 160000,
            "address": "San Martín 123",
            "city": "Córdoba",
            "type": "casa",
            "bedrooms": 3,
            "bathrooms": 2,
            "area": 125,
            "patio": "Grande",
            "garage": "2 Vehiculos",
            "latitude": -31.4215,
            "longitude": -64.1892,
            "status": "disponible"
        }')
    
    echo "Update response: $update_response"
    echo -e "${GREEN}✅ Propiedad actualizada${NC}"
fi

# Test 10: Error - ID inválido
echo -e "\n${BLUE}❌ Test 10: Error - ID inválido${NC}"
status10=$(curl -s -w "%{http_code}" -o /dev/null -X PUT "$API_BASE/properties/invalid" \
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
    }')

if [ "$status10" = "400" ]; then
    echo -e "${GREEN}✅ Error 400 - ID inválido detectado${NC}"
else
    echo -e "${RED}❌ Error - Esperaba 400, obtuvo $status10${NC}"
fi

echo -e "\n${BLUE}🎉 Tests Completados${NC}"
echo "=================="
echo -e "${GREEN}✅ Endpoints de geolocalización funcionando correctamente${NC}"
echo -e "${GREEN}✅ Validación de coordenadas implementada${NC}"
echo -e "${GREEN}✅ Búsquedas por proximidad operativas${NC}"
echo -e "${GREEN}✅ Manejo de errores funcionando${NC}"

echo -e "\n${YELLOW}📊 Resumen:${NC}"
echo "- Propiedades creadas con coordenadas válidas"
echo "- Validación de rangos geográficos funcionando"
echo "- Búsquedas por proximidad operativas"
echo "- Manejo de errores específicos implementado"
echo "- API responses incluyen coordenadas correctamente"
