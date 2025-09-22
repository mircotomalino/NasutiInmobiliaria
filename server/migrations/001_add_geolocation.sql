-- Migración: Agregar geolocalización a la tabla properties
-- Fecha: 2024-12-19
-- Descripción: Añade campos de latitud, longitud para mapas

-- Agregar columnas de latitud y longitud
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Crear índices para optimizar consultas geográficas
CREATE INDEX IF NOT EXISTS idx_properties_latitude ON properties(latitude);
CREATE INDEX IF NOT EXISTS idx_properties_longitude ON properties(longitude);
CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON properties(latitude, longitude);

-- Crear función helper para calcular distancia (en metros)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL(10,8), 
    lng1 DECIMAL(11,8), 
    lat2 DECIMAL(10,8), 
    lng2 DECIMAL(11,8)
) RETURNS DECIMAL AS $$
DECLARE
    earth_radius DECIMAL := 6371000;
    dlat DECIMAL;
    dlng DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dlat := radians(lat2 - lat1);
    dlng := radians(lng2 - lng1);
    
    a := sin(dlat/2) * sin(dlat/2) + 
         cos(radians(lat1)) * cos(radians(lat2)) * 
         sin(dlng/2) * sin(dlng/2);
    
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql;

-- Crear vista para propiedades con coordenadas válidas
CREATE OR REPLACE VIEW properties_with_coordinates AS
SELECT 
    p.*,
    CASE 
        WHEN p.latitude IS NOT NULL AND p.longitude IS NOT NULL 
        THEN true 
        ELSE false 
    END as has_coordinates
FROM properties p;