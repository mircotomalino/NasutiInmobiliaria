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
  origin: process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006'],
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

// Funciones de validación para coordenadas
const validateCoordinates = (latitude, longitude) => {
  const errors = [];
  
  // Validar latitud
  if (latitude !== undefined && latitude !== null && latitude !== '') {
    const lat = parseFloat(latitude);
    if (isNaN(lat)) {
      errors.push('Latitude must be a valid number');
    } else if (lat < -90 || lat > 90) {
      errors.push('Latitude must be between -90 and 90 degrees');
    }
  }
  
  // Validar longitud
  if (longitude !== undefined && longitude !== null && longitude !== '') {
    const lng = parseFloat(longitude);
    if (isNaN(lng)) {
      errors.push('Longitude must be a valid number');
    } else if (lng < -180 || lng > 180) {
      errors.push('Longitude must be between -180 and 180 degrees');
    }
  }
  
  // Si se proporciona una coordenada, ambas deben estar presentes
  if ((latitude !== undefined && latitude !== null && latitude !== '') !== 
      (longitude !== undefined && longitude !== null && longitude !== '')) {
    errors.push('Both latitude and longitude must be provided together');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    latitude: latitude !== undefined && latitude !== null && latitude !== '' ? parseFloat(latitude) : null,
    longitude: longitude !== undefined && longitude !== null && longitude !== '' ? parseFloat(longitude) : null
  };
};

// Función para validar datos de propiedad
const validatePropertyData = (data) => {
  const errors = [];
  
  // Campos requeridos
  const requiredFields = ['title', 'description', 'price', 'address', 'city', 'type'];
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  // Validar precio
  if (data.price !== undefined) {
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      errors.push('Price must be a valid positive number');
    }
  }
  
  // Validar números enteros
  const integerFields = ['bedrooms', 'bathrooms', 'area'];
  integerFields.forEach(field => {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      const value = parseInt(data[field]);
      if (isNaN(value) || value < 0) {
        errors.push(`${field} must be a valid positive integer`);
      }
    }
  });
  
  // Validar coordenadas
  const coordValidation = validateCoordinates(data.latitude, data.longitude);
  if (!coordValidation.isValid) {
    errors.push(...coordValidation.errors);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    validatedData: {
      ...data,
      latitude: coordValidation.latitude,
      longitude: coordValidation.longitude,
      price: data.price ? parseFloat(data.price) : null,
      bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
      bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
      area: data.area ? parseInt(data.area) : null
    }
  };
};

// Rutas API

// Obtener todas las propiedades
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
             p.type, p.bedrooms, p.bathrooms, p.area, p.patio, p.garage, p.status,
             p.latitude, p.longitude, p.featured,
             p.published_date as "publishedDate",
             p.created_at, p.updated_at,
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      GROUP BY p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
               p.type, p.bedrooms, p.bathrooms, p.area, p.patio, p.garage, p.status,
               p.latitude, p.longitude, p.featured, p.published_date, p.created_at, p.updated_at
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para obtener propiedades destacadas (máximo 3)
// IMPORTANTE: Este endpoint debe estar ANTES de /api/properties/:id
app.get('/api/properties/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
             p.type, p.bedrooms, p.bathrooms, p.area, p.patio, p.garage, p.status,
             p.latitude, p.longitude, p.featured,
             p.published_date as "publishedDate",
             p.created_at, p.updated_at,
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      WHERE p.featured = TRUE
      GROUP BY p.id, p.title, p.description, p.price, p.address, p.city, p.province, 
               p.type, p.bedrooms, p.bathrooms, p.area, p.patio, p.garage, p.status,
               p.latitude, p.longitude, p.featured, p.published_date, p.created_at, p.updated_at
      ORDER BY p.created_at ASC
      LIMIT 3
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para toggle el estado featured de una propiedad
// IMPORTANTE: Este endpoint debe estar ANTES de /api/properties/:id
app.patch('/api/properties/:id/featured', async (req, res) => {
  try {
    const { id } = req.params;
    const propertyId = parseInt(id);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    // Obtener el estado actual de la propiedad
    const currentProperty = await pool.query(
      'SELECT id, title, featured FROM properties WHERE id = $1',
      [propertyId]
    );

    if (currentProperty.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const isFeatured = currentProperty.rows[0].featured;

    // Si se quiere marcar como destacada (actualmente no lo está)
    if (!isFeatured) {
      // Verificar cuántas propiedades destacadas hay
      const featuredCount = await pool.query(
        'SELECT COUNT(*) as count FROM properties WHERE featured = TRUE'
      );

      if (parseInt(featuredCount.rows[0].count) >= 3) {
        // Obtener las propiedades destacadas actuales
        const featuredProperties = await pool.query(
          'SELECT id, title FROM properties WHERE featured = TRUE ORDER BY created_at ASC'
        );
        
        return res.status(400).json({ 
          error: 'Ya tienes 3 propiedades destacadas',
          featuredProperties: featuredProperties.rows
        });
      }
    }

    // Toggle el estado featured
    const result = await pool.query(
      'UPDATE properties SET featured = NOT featured WHERE id = $1 RETURNING id, title, featured',
      [propertyId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling featured status:', error);
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
             latitude, longitude, featured,
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
    // Validar datos de entrada
    const validation = validatePropertyData({
      ...req.body,
      province: req.body.province || 'Córdoba' // Valor por defecto
    });

    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    const {
      title,
      description,
      price,
      address,
      city,
      province,
      type,
      bedrooms,
      bathrooms,
      area,
      patio,
      garage,
      latitude,
      longitude,
      status
    } = validation.validatedData;

    // 🔍 LOGGING DETALLADO PARA DEBUGGING
    console.log('🔍 DEBUGGING - Datos recibidos para crear propiedad:');
    console.log('📝 title:', title, 'type:', typeof title);
    console.log('📝 description:', description?.substring(0, 50) + '...', 'type:', typeof description);
    console.log('💰 price:', price, 'type:', typeof price);
    console.log('🏠 address:', address, 'type:', typeof address);
    console.log('🏙️ city:', city, 'type:', typeof city);
    console.log('🌍 province:', province, 'type:', typeof province);
    console.log('🏘️ type:', type, 'type:', typeof type);
    console.log('🛏️ bedrooms:', bedrooms, 'type:', typeof bedrooms);
    console.log('🚿 bathrooms:', bathrooms, 'type:', typeof bathrooms);
    console.log('📐 area:', area, 'type:', typeof area);
    console.log('🌳 patio:', patio, 'type:', typeof patio);
    console.log('🚗 garage:', garage, 'type:', typeof garage);
    console.log('📍 latitude:', latitude, 'type:', typeof latitude);
    console.log('📍 longitude:', longitude, 'type:', typeof longitude);
    console.log('📊 status:', status, 'type:', typeof status);

    // Validar tipos de datos críticos
    if (bedrooms && (typeof bedrooms !== 'number' || bedrooms > 2147483647)) {
      console.error('❌ ERROR: bedrooms fuera de rango:', bedrooms);
    }
    if (bathrooms && (typeof bathrooms !== 'number' || bathrooms > 2147483647)) {
      console.error('❌ ERROR: bathrooms fuera de rango:', bathrooms);
    }
    if (area && (typeof area !== 'number' || area > 2147483647)) {
      console.error('❌ ERROR: area fuera de rango:', area);
    }

    // Insertar la propiedad
    const queryParams = [title, description, price, address, city, province, type, bedrooms, bathrooms, area, patio, garage, latitude, longitude, status];
    console.log('🔍 DEBUGGING - Parámetros de la query:');
    queryParams.forEach((param, index) => {
      console.log(`  $${index + 1}:`, param, `(type: ${typeof param})`);
    });

    try {
      const propertyResult = await pool.query(`
        INSERT INTO properties (title, description, price, address, city, province, type, bedrooms, bathrooms, area, patio, garage, latitude, longitude, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id, title, description, price, address, city, province, 
                  type, bedrooms, bathrooms, area, patio, garage, latitude, longitude, status, featured,
                  published_date as "publishedDate",
                  created_at, updated_at
      `, queryParams);

      const property = propertyResult.rows[0];

      // Insertar las imágenes si se subieron
      if (req.files && req.files.length > 0) {
        const imageValues = req.files.map(file => `(${property.id}, '/uploads/${file.filename}')`).join(', ');
        await pool.query(`
          INSERT INTO property_images (property_id, image_url)
          VALUES ${imageValues}
        `);
      }

      // Obtener imágenes para la respuesta
      const imagesResult = await pool.query('SELECT * FROM property_images WHERE property_id = $1', [property.id]);
      property.images = imagesResult.rows.map(img => img.image_url);

      res.status(201).json(property);
    } catch (dbError) {
      console.error('❌ ERROR ESPECÍFICO DE BASE DE DATOS:');
      console.error('🔍 Error details:', dbError);
      console.error('🔍 Error code:', dbError.code);
      console.error('🔍 Error message:', dbError.message);
      console.error('🔍 Error detail:', dbError.detail);
      console.error('🔍 Error hint:', dbError.hint);
      console.error('🔍 Error position:', dbError.position);
      console.error('🔍 Error internalPosition:', dbError.internalPosition);
      console.error('🔍 Error internalQuery:', dbError.internalQuery);
      console.error('🔍 Error where:', dbError.where);
      console.error('🔍 Error schema:', dbError.schema);
      console.error('🔍 Error table:', dbError.table);
      console.error('🔍 Error column:', dbError.column);
      console.error('🔍 Error dataType:', dbError.dataType);
      console.error('🔍 Error constraint:', dbError.constraint);
      console.error('🔍 Error file:', dbError.file);
      console.error('🔍 Error line:', dbError.line);
      console.error('🔍 Error routine:', dbError.routine);
      
      res.status(500).json({ error: 'Internal server error', details: dbError.message });
    }
  } catch (error) {
    console.error('Error creating property:', error);
    
    // Manejar errores específicos de base de datos
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Property with this data already exists' });
    } else if (error.code === '23514') { // Check constraint violation
      return res.status(400).json({ error: 'Invalid data: constraint violation', details: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Actualizar una propiedad
app.put('/api/properties/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un número válido
    const propertyId = parseInt(id);
    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    // Validar datos de entrada
    const validation = validatePropertyData({
      ...req.body,
      province: req.body.province || 'Córdoba' // Valor por defecto
    });

    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    const {
      title,
      description,
      price,
      address,
      city,
      province,
      type,
      bedrooms,
      bathrooms,
      area,
      patio,
      garage,
      latitude,
      longitude,
      status
    } = validation.validatedData;

    // Verificar que la propiedad existe
    const existingProperty = await pool.query('SELECT id FROM properties WHERE id = $1', [propertyId]);
    if (existingProperty.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Actualizar la propiedad
    const propertyResult = await pool.query(`
      UPDATE properties 
      SET title = $1, description = $2, price = $3, address = $4, city = $5, 
          province = $6, type = $7, bedrooms = $8, bathrooms = $9, area = $10, 
          patio = $11, garage = $12, latitude = $13, longitude = $14, status = $15, updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING id, title, description, price, address, city, province, 
                type, bedrooms, bathrooms, area, patio, garage, latitude, longitude, status, featured,
                published_date as "publishedDate",
                created_at, updated_at
    `, [title, description, price, address, city, province, type, bedrooms, bathrooms, area, patio, garage, latitude, longitude, status, propertyId]);

    const property = propertyResult.rows[0];

    // Si se subieron nuevas imágenes, agregarlas
    if (req.files && req.files.length > 0) {
      const imageValues = req.files.map(file => `(${propertyId}, '/uploads/${file.filename}')`).join(', ');
      await pool.query(`
        INSERT INTO property_images (property_id, image_url)
        VALUES ${imageValues}
      `);
    }

    // Obtener todas las imágenes para la respuesta
    const imagesResult = await pool.query('SELECT * FROM property_images WHERE property_id = $1', [propertyId]);
    property.images = imagesResult.rows.map(img => img.image_url);

    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    
    // Manejar errores específicos de base de datos
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Property with this data already exists' });
    } else if (error.code === '23514') { // Check constraint violation
      return res.status(400).json({ error: 'Invalid data: constraint violation', details: error.message });
    }
    
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

// Obtener imágenes de una propiedad con sus IDs
app.get('/api/properties/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, image_url as url FROM property_images WHERE property_id = $1 ORDER BY id', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching property images:', error);
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

    // Consulta simplificada usando la función calculate_distance
    const result = await pool.query(`
      SELECT id, title, description, price, address, city, province, 
             type, bedrooms, bathrooms, area, patio, garage, status,
             latitude, longitude, featured,
             published_date as "publishedDate",
             created_at, updated_at,
             calculate_distance($1::DECIMAL, $2::DECIMAL, latitude, longitude) as distance
      FROM properties
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        AND calculate_distance($1::DECIMAL, $2::DECIMAL, latitude, longitude) <= $3
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
      SELECT id, title, description, price, address, city, province, 
             type, bedrooms, bathrooms, area, patio, garage, status,
             latitude, longitude, featured,
             published_date as "publishedDate",
             created_at, updated_at
      FROM properties
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      ORDER BY created_at DESC
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
