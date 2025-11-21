-- Migración para agregar campos de dirección separados
-- Calle, número, barrio, localidad, ciudad (ya existe)

-- Agregar columnas de dirección si no existen
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS street VARCHAR(255),
ADD COLUMN IF NOT EXISTS street_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS neighborhood VARCHAR(255),
ADD COLUMN IF NOT EXISTS locality VARCHAR(255);

-- Crear índices para búsquedas
CREATE INDEX IF NOT EXISTS idx_properties_street ON properties(street);
CREATE INDEX IF NOT EXISTS idx_properties_neighborhood ON properties(neighborhood);
CREATE INDEX IF NOT EXISTS idx_properties_locality ON properties(locality);

