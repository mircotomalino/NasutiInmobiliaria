-- Migración para agregar campo de superficie cubierta
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS covered_area INTEGER;

