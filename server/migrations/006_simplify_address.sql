-- Migración para simplificar dirección a un solo campo
-- Eliminar campos separados y agregar campo address simple

-- Agregar columna address si no existe
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS address VARCHAR(500);

-- Eliminar columnas de dirección separadas
ALTER TABLE properties 
DROP COLUMN IF EXISTS street,
DROP COLUMN IF EXISTS street_number,
DROP COLUMN IF EXISTS neighborhood,
DROP COLUMN IF EXISTS locality;

-- Eliminar índices relacionados
DROP INDEX IF EXISTS idx_properties_street;
DROP INDEX IF EXISTS idx_properties_neighborhood;
DROP INDEX IF EXISTS idx_properties_locality;

