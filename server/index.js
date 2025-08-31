const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { pool, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
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
      SELECT p.*, 
             array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      GROUP BY p.id
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
    const propertyResult = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
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
      province,
      type,
      bedrooms,
      bathrooms,
      area,
      status
    } = req.body;

    // Insertar la propiedad
    const propertyResult = await pool.query(`
      INSERT INTO properties (title, description, price, address, city, province, type, bedrooms, bathrooms, area, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [title, description, price, address, city, province, type, bedrooms, bathrooms, area, status]);

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
      province,
      type,
      bedrooms,
      bathrooms,
      area,
      status
    } = req.body;

    // Actualizar la propiedad
    const propertyResult = await pool.query(`
      UPDATE properties 
      SET title = $1, description = $2, price = $3, address = $4, city = $5, 
          province = $6, type = $7, bedrooms = $8, bathrooms = $9, area = $10, 
          status = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `, [title, description, price, address, city, province, type, bedrooms, bathrooms, area, status, id]);

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

// Crear directorio de uploads si no existe
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
