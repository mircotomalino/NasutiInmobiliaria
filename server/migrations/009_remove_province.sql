-- Eliminar la columna province de la tabla properties
ALTER TABLE properties 
DROP COLUMN IF EXISTS province;

