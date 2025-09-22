-- Migración PostGIS (Opcional): Agregar geometrías espaciales
-- Fecha: 2024-12-19
-- Requisito: PostGIS debe estar instalado

-- Intentar crear extensión PostGIS si no existe
CREATE EXTENSION IF NOT EXISTS postgis;

-- Agregar columna geom usando PostGIS
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS geom GEOMETRY(POINT, 4326);

-- Crear índice espacial para PostGIS
CREATE INDEX IF NOT EXISTS idx_properties_geom ON properties USING GIST (geom);

-- Crear trigger para actualizar geom automáticamente cuando cambien lat/lng
CREATE OR REPLACE FUNCTION update_property_geom()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.geom = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    ELSE
        NEW.geom = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para INSERT y UPDATE
DROP TRIGGER IF EXISTS trigger_update_property_geom ON properties;
CREATE TRIGGER trigger_update_property_geom
    BEFORE INSERT OR UPDATE OF latitude, longitude ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_property_geom();

-- Actualizar registros existentes que tengan lat/lng
UPDATE properties 
SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND geom IS NULL;

-- Comentarios
COMMENT ON COLUMN properties.geom IS 'Geometría PostGIS de la propiedad (POINT con SRID 4326)';
COMMENT ON FUNCTION update_property_geom IS 'Trigger function para actualizar geometría automáticamente';
