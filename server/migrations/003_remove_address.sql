-- Migración para eliminar la columna address de la tabla properties
-- Ya que ahora solo usamos coordenadas (latitude, longitude)

-- Eliminar la columna address
ALTER TABLE properties DROP COLUMN IF EXISTS address;

