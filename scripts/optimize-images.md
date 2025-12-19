# Guía de Optimización de Imágenes

Esta guía describe cómo optimizar las imágenes del sitio para mejorar el rendimiento y SEO.

## Objetivos

1. **Reducir el tamaño de archivo** - Comprimir imágenes sin pérdida significativa de calidad
2. **Formato WebP** - Convertir a WebP para mejor compresión
3. **Imágenes responsivas** - Generar múltiples tamaños para diferentes dispositivos
4. **Lazy loading** - Ya implementado en componentes

## Herramientas Recomendadas

### 1. Sharp (Node.js)
```bash
npm install --save-dev sharp
```

### 2. ImageMagick (CLI)
```bash
# macOS
brew install imagemagick

# Linux
sudo apt-get install imagemagick
```

### 3. Squoosh (Web-based)
https://squoosh.app/ - Herramienta web para compresión

## Script de Ejemplo con Sharp

Crea un archivo `scripts/optimize-images.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/img';
const outputDir = './public/img/optimized';

// Tamaños para imágenes responsivas
const sizes = [320, 640, 1024, 1920];

async function optimizeImage(inputPath, outputPath, size = null) {
  try {
    let image = sharp(inputPath);
    
    // Obtener metadata
    const metadata = await image.metadata();
    
    // Calcular dimensiones si se especifica un tamaño
    let width = metadata.width;
    let height = metadata.height;
    
    if (size) {
      if (width > height) {
        width = size;
        height = null; // Mantener aspect ratio
      } else {
        height = size;
        width = null;
      }
    }
    
    // Generar WebP
    const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(webpPath);
    
    // Generar JPEG optimizado
    await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outputPath);
    
    console.log(`✅ Optimized: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error);
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      // Crear directorio de salida si no existe
      const relativePath = path.relative(inputDir, filePath);
      const outputSubDir = path.dirname(path.join(outputDir, relativePath));
      if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
      }
      
      // Generar versiones en diferentes tamaños
      for (const size of sizes) {
        const sizeSuffix = `-${size}w`;
        const ext = path.extname(file);
        const nameWithoutExt = path.basename(file, ext);
        const outputPath = path.join(
          outputSubDir,
          `${nameWithoutExt}${sizeSuffix}${ext}`
        );
        
        await optimizeImage(filePath, outputPath, size);
      }
    }
  }
}

// Ejecutar
(async () => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  await processDirectory(inputDir);
  console.log('🎉 Image optimization complete!');
})();
```

## Uso del Script

```bash
node scripts/optimize-images.js
```

## Integración en Build

Agregar al `package.json`:

```json
{
  "scripts": {
    "optimize:images": "node scripts/optimize-images.js",
    "build": "npm run optimize:images && tsc && vite build"
  }
}
```

## Componente OptimizedImage

Ya está creado en `src/components/OptimizedImage.tsx`. 

Para usarlo, reemplaza `<img>` con `<OptimizedImage>`:

```tsx
import OptimizedImage from './components/OptimizedImage';

// Antes
<img src="/img/property.jpg" alt="Property" />

// Después
<OptimizedImage
  src="/img/property.jpg"
  alt="Property"
  className="w-full h-full object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  srcSet="/img/optimized/property-320w.jpg 320w, /img/optimized/property-640w.jpg 640w, /img/optimized/property-1024w.jpg 1024w"
/>
```

## Checklist de Optimización

- [ ] Instalar herramientas de optimización (Sharp, ImageMagick, etc.)
- [ ] Crear script de optimización
- [ ] Ejecutar optimización en todas las imágenes
- [ ] Generar versiones WebP
- [ ] Generar versiones en múltiples tamaños (320w, 640w, 1024w, 1920w)
- [ ] Actualizar componentes para usar OptimizedImage
- [ ] Agregar srcset y sizes apropiados
- [ ] Verificar que las imágenes se carguen correctamente
- [ ] Verificar mejoras en PageSpeed Insights

## Notas

- Las imágenes optimizadas deben estar en `public/img/optimized/`
- Mantener las imágenes originales como respaldo
- El componente `OptimizedImage` ya está preparado para WebP y srcset
- El lazy loading ya está implementado en los componentes existentes

