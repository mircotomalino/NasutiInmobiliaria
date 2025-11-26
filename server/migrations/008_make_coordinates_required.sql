-- Hacer las columnas de coordenadas obligatorias (NOT NULL)
-- Primero, actualizar cualquier registro existente sin coordenadas con valores por defecto (opcional)
-- Luego, hacer las columnas NOT NULL

-- Hacer latitude NOT NULL
ALTER TABLE properties 
ALTER COLUMN latitude SET NOT NULL;

-- Hacer longitude NOT NULL
ALTER TABLE properties 
ALTER COLUMN longitude SET NOT NULL;

