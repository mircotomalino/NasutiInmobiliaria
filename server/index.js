import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pool, initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Inicializar base de datos
initDatabase();

// Rutas API

// Obtener todas las propiedades
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
             p.type, p.bedrooms, p.bathrooms, p.area, p.patio, p.garage, p.status,
             p.latitude, p.longitude,
             p.published_date as "publishedDate",
             p.created_at, p.updated_at,
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      GROUP BY p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
               p.type, p.bedrooms, p.bathrooms, p.area, p.patio, p.garage, p.status,
               p.latitude, p.longitude, p.published_date, p.created_at, p.updated_at
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Obtener una propiedad específica
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const propertyResult = await pool.query(`
      SELECT id, title, description, price, address, city, province, 
             type, bedrooms, bathrooms, area, patio, garage, status,
             latitude, longitude,
             published_date as "publishedDate",
             created_at, updated_at
      FROM properties WHERE id = $1
    `, [id]);
    const imagesResult = await pool.query('SELECT * FROM property_images WHERE property_id = $1', [id]);
    
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    const property = propertyResult.rows[0];
    property.images = imagesResult.rows.map(img => img.image_url);
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Crear una nueva propiedad
app.post('/api/properties', upload.array('images', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      address,
      city,
      province = 'Córdoba', // Valor por defecto
      type,
      bedrooms,
      bathrooms,
      area,
      patio,
      garage,
      latitude,
      longitude,
      status
    } = req.body;

    // Insertar la propiedad
    const propertyResult = await pool.query(`
      INSERT INTO properties (title, description, price, address, city, province, type, bedrooms, bathrooms, area, patio, garage, latitude, longitude, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, title, description, price, address, city, province, 
                type, bedrooms, bathrooms, area, patio, garage, latitude, longitude, status,
                published_date as "publishedDate",
                created_at, updated_at
    `, [title, description, price, address, city, province, type, bedrooms, bathrooms, area, patio, garage, latitude, longitude, status]);

    const property = propertyResult.rows[0];

    // Insertar las imágenes si se subieron
    if (req.files && req.files.length > 0) {
      const imageValues = req.files.map(file => `(${property.id}, '/uploads/${file.filename}')`).join(', ');
      await pool.query(`
        INSERT INTO property_images (property_id, image_url)
        VALUES ${imageValues}
      `);
    }

    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Actualizar una propiedad
app.put('/api/properties/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      address,
      city,
      province = 'Córdoba', // Valor por defecto
      type,
      bedrooms,
      bathrooms,
      area,
      patio,
      garage,
      latitude,
      longitude,
      status
    } = req.body;

    // Actualizar la propiedad
    const propertyResult = await pool.query(`
      UPDATE properties 
      SET title = $1, description = $2, price = $3, address = $4, city = $5, 
          province = $6, type = $7, bedrooms = $8, bathrooms = $9, area = $10, 
          patio = $11, garage = $12, latitude = $13, longitude = $14, status = $15, updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING id, title, description, price, address, city, province, 
                type, bedrooms, bathrooms, area, patio, garage, latitude, longitude, status,
                published_date as "publishedDate",
                created_at, updated_at
    `, [title, description, price, address, city, province, type, bedrooms, bathrooms, area, patio, garage, latitude, longitude, status, id]);

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Si se subieron nuevas imágenes, agregarlas
    if (req.files && req.files.length > 0) {
      const imageValues = req.files.map(file => `(${id}, '/uploads/${file.filename}')`).join(', ');
      await pool.query(`
        INSERT INTO property_images (property_id, image_url)
        VALUES ${imageValues}
      `);
    }

    res.json(propertyResult.rows[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Eliminar una propiedad
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Eliminar una imagen específica
app.delete('/api/properties/:id/images/:imageId', async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const result = await pool.query('DELETE FROM property_images WHERE id = $1 AND property_id = $2 RETURNING *', [imageId, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para consultas geográficas
app.get('/api/properties/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10000 } = req.query; // radius en metros por defecto
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Usar la función calculate_distance si está disponible, sino usar distancia aproximada
    const result = await pool.query(`
      SELECT p.*, 
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images,
             CASE 
               WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'calculate_distance') 
               THEN calculate_distance($1::DECIMAL, $2::DECIMAL, p.latitude, p.longitude)
               ELSE 6371000 * acos(
                 cos(radians($1)) * cos(radians(p.latitude)) * 
                 cos(radians(p.longitude) - radians($2)) + 
                 sin(radians($1)) * sin(radians(p.latitude))
               )
             END as distance
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
      GROUP BY p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
               p.type, p.bedrooms, p.bathrooms, p.area, p.patio, p.garage, p.status,
               p.latitude, p.longitude, p.published_date, p.created_at, p.updated_at
      HAVING CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'calculate_distance') 
        THEN calculate_distance($1::DECIMAL, $2::DECIMAL, p.latitude, p.longitude)
        ELSE 6371000 * acos(
          cos(radians($1)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(p.latitude))
        )
      END <= $3
      ORDER BY distance ASC
    `, [lat, lng, radius]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching nearby properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para obtener propiedades con coordenadas
app.get('/api/properties/with-coordinates', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images,
             CASE 
               WHEN p.latitude IS NOT NULL AND p.longitude IS NOT NULL 
               THEN true 
               ELSE false 
             END as has_coordinates
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
      GROUP BY p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
               p.type, p.bedrooms, p.bathrooms, p.area, p.patio, p.garage, p.status,
               p.latitude, p.longitude, p.published_date, p.created_at, p.updated_at
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties with coordinates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Crear directorio de uploads si no existe
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
