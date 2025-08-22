# Nasuti Inmobiliaria - Catálogo de Propiedades

Este es el proyecto principal del catálogo de propiedades de Nasuti Inmobiliaria, desarrollado con React, TypeScript y Vite.

## Estructura del Proyecto

```
ProjectDurio/
├── src/                    # Código fuente de la aplicación React
│   ├── components/         # Componentes React
│   ├── data/              # Datos de propiedades
│   ├── types/             # Definiciones de tipos TypeScript
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── img/                   # Imágenes del proyecto
├── dist/                  # Archivos de distribución (generados)
├── index.html             # Página principal (Landing Page)
├── catalogo.html          # Página del catálogo React
├── package.json           # Dependencias y scripts
├── vite.config.ts         # Configuración de Vite
├── tsconfig.json          # Configuración de TypeScript
├── netlify.toml           # Configuración de Netlify
├── _redirects             # Redirecciones para Netlify
└── README.md              # Este archivo
```

## URLs del Proyecto

- **🏠 Página Principal:** `/` - Landing page con información de la empresa
- **📋 Catálogo:** `/catalogo` - Aplicación React con filtros y búsqueda de propiedades

## Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Construir para producción:**
   ```bash
   npm run build
   ```

4. **Vista previa de producción:**
   ```bash
   npm run preview
   ```

## Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción
- **CSS Modules** - Estilos modulares
- **TailwindCSS** - Framework CSS (en landing page)

## Características

- **Landing Page** - Página de inicio con información de la empresa
- **Catálogo de propiedades** - Aplicación React interactiva
- **Filtros de búsqueda** - Búsqueda avanzada de propiedades
- **Vista detallada** - Información completa de cada propiedad
- **Diseño responsivo** - Optimizado para todos los dispositivos
- **Interfaz moderna** - Diseño elegante y profesional

## Desarrollo

El proyecto está configurado con:
- Hot Module Replacement (HMR)
- TypeScript para mejor desarrollo
- ESLint para linting
- Prettier para formateo de código

## Despliegue

El proyecto está configurado para desplegarse en Netlify con:
- Configuración automática de rutas
- Redirecciones para SPA
- Build optimizado para producción
