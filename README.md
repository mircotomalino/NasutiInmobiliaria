# Nasuti Inmobiliaria - Catálogo de Propiedades

Este es el proyecto principal del catálogo de propiedades de Nasuti Inmobiliaria, desarrollado con React, TypeScript y Vite.

## Estructura del Proyecto

```
ProjectDurio/
├── src/                    # Código fuente de la aplicación
│   ├── components/         # Componentes React
│   ├── data/              # Datos de propiedades
│   ├── types/             # Definiciones de tipos TypeScript
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── img/                   # Imágenes del proyecto
├── dist/                  # Archivos de distribución (generados)
├── index.html             # Página principal
├── landing-page.html      # Página de aterrizaje
├── package.json           # Dependencias y scripts
├── vite.config.ts         # Configuración de Vite
├── tsconfig.json          # Configuración de TypeScript
└── README.md              # Este archivo
```

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

## Características

- Catálogo de propiedades inmobiliarias
- Filtros de búsqueda
- Vista detallada de propiedades
- Diseño responsivo
- Interfaz moderna y intuitiva

## Desarrollo

El proyecto está configurado con:
- Hot Module Replacement (HMR)
- TypeScript para mejor desarrollo
- ESLint para linting
- Prettier para formateo de código

## Despliegue

El proyecto está configurado para desplegarse en Netlify con el archivo `netlify.toml`.
