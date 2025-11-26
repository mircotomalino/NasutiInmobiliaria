-- Hacer la columna description opcional (nullable)
ALTER TABLE properties 
ALTER COLUMN description DROP NOT NULL;

