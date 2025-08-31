# Nasuti Inmobiliaria - Panel de Gestión

Sistema completo de gestión inmobiliaria con panel administrativo y catálogo público.

## 🚀 Características

- **Panel de Gestión**: Administración completa de propiedades
- **Catálogo Público**: Visualización de propiedades para clientes
- **Base de Datos PostgreSQL**: Almacenamiento persistente de datos
- **Subida de Imágenes**: Gestión de múltiples imágenes por propiedad
- **Filtros Avanzados**: Búsqueda y filtrado de propiedades
- **Diseño Responsive**: Compatible con todos los dispositivos

## 📋 Requisitos Previos

- Node.js 20.19+ o 22.12+
- PostgreSQL
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd ProjectDurio
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Base de Datos PostgreSQL

Crear una base de datos PostgreSQL:
```sql
CREATE DATABASE nasuti_inmobiliaria;
```

### 4. Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=nasuti_inmobiliaria
DB_PASSWORD=tu_password
DB_PORT=5432
```

### 5. Ejecutar el Proyecto

#### Opción A: Ejecutar todo junto (recomendado)
```bash
npm run dev:full
```

#### Opción B: Ejecutar por separado
```bash
# Terminal 1 - Servidor backend
npm run server

# Terminal 2 - Cliente frontend
npm run dev
```

## 🌐 URLs de Acceso

- **Página Principal**: http://localhost:3000/
- **Catálogo de Propiedades**: http://localhost:3000/catalogo
- **Panel de Gestión**: http://localhost:3000/managerLogin
- **API Backend**: http://localhost:3001/api

## 📊 Estructura de la Base de Datos

### Tabla: properties
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(255) NOT NULL)
- `description` (TEXT NOT NULL)
- `price` (DECIMAL(12,2) NOT NULL)
- `address` (VARCHAR(255) NOT NULL)
- `city` (VARCHAR(100) NOT NULL)
- `province` (VARCHAR(100) NOT NULL)
- `type` (VARCHAR(50) NOT NULL)
- `bedrooms` (INTEGER)
- `bathrooms` (INTEGER)
- `area` (INTEGER)
- `status` (VARCHAR(20) DEFAULT 'disponible')
- `published_date` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### Tabla: property_images
- `id` (SERIAL PRIMARY KEY)
- `property_id` (INTEGER REFERENCES properties(id) ON DELETE CASCADE)
- `image_url` (TEXT NOT NULL)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## 🎯 Funcionalidades del Panel de Gestión

### Gestión de Propiedades
- ✅ Agregar nuevas propiedades
- ✅ Editar propiedades existentes
- ✅ Eliminar propiedades
- ✅ Subir múltiples imágenes
- ✅ Gestión de estados (disponible, vendida, alquilada, reservada)

### Tipos de Propiedades Soportados
- 🏠 Casa
- 🏢 Departamento
- 🏢 Oficina
- 🏪 Local
- 🌳 Quinta
- 📐 Terreno

### Características Técnicas
- 📱 Diseño responsive
- 🔍 Filtros avanzados
- 📸 Subida de imágenes múltiples
- 💾 Base de datos PostgreSQL
- 🔄 API REST completa

## 🚀 Despliegue

### Build para Producción
```bash
npm run build
```

### Configuración de Netlify
El proyecto está configurado para desplegarse en Netlify con:
- Node.js 20.19.0
- Build command: `npm run build`
- Publish directory: `dist`
- Redirects configurados para SPA

## 📁 Estructura del Proyecto

```
ProjectDurio/
├── src/
│   ├── components/
│   │   ├── ManagerPanel.tsx      # Panel de gestión
│   │   ├── LandingPage.tsx       # Página principal
│   │   ├── App.tsx              # Catálogo de propiedades
│   │   └── ...
│   ├── types/
│   └── main.tsx
├── server/
│   ├── index.js                 # Servidor Express
│   └── db.js                    # Configuración de base de datos
├── public/
│   └── uploads/                 # Imágenes subidas
└── package.json
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar solo el frontend
- `npm run server` - Ejecutar solo el backend
- `npm run dev:full` - Ejecutar frontend y backend juntos
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

## 🛡️ Seguridad

- El panel de gestión es accesible solo por URL directa (`/managerLogin`)
- No hay autenticación implementada (requerimiento del proyecto)
- Las imágenes se almacenan localmente en `public/uploads/`

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

**Desarrollado para Nasuti Inmobiliaria** 🏠
