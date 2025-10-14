-- Migración: Agregar campo featured para propiedades destacadas en carrusel
-- Fecha: 2025-01-14
-- Descripción: Añade campo featured (booleano) para marcar hasta 3 propiedades destacadas

-- Agregar columna featured
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Crear índice para optimizar consultas de propiedades destacadas
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);

-- Comentario en la columna
COMMENT ON COLUMN properties.featured IS 'Indica si la propiedad está destacada en el carrusel de la landing page (máximo 3)';

