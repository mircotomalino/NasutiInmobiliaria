# PropertyMapEmbed Component

Un componente React que muestra mapas de Google Maps usando iframes gratuitos, sin necesidad de API keys.

## Características

- ✅ **Gratuito**: No requiere API key de Google Maps
- ✅ **Fácil de usar**: Solo pasa la dirección como prop
- ✅ **Personalizable**: Ajusta zoom, tamaño y estilos
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Accesible**: Incluye atributos de accesibilidad

## Uso Básico

```tsx
import PropertyMapEmbed from './components/PropertyMapEmbed';

// Uso básico
<PropertyMapEmbed address="Rua Visconde de Pirajá 520, Ipanema, Rio de Janeiro" />

// Con personalización
<PropertyMapEmbed 
  address="Av. San Martín 1234, Marcos Juárez, Córdoba"
  height="400px"
  zoom={18}
  className="rounded-lg shadow-md"
/>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `address` | `string` | - | **Requerido.** Dirección completa de la propiedad |
| `width` | `string \| number` | `'100%'` | Ancho del mapa |
| `height` | `string \| number` | `'300px'` | Alto del mapa |
| `zoom` | `number` | `15` | Nivel de zoom (1-20) |
| `className` | `string` | `''` | Clases CSS adicionales |

## Ejemplos

### Mapa básico
```tsx
<PropertyMapEmbed address="Calle Falsa 123, Ciudad, País" />
```

### Mapa con zoom alto
```tsx
<PropertyMapEmbed 
  address="Calle Falsa 123, Ciudad, País"
  zoom={18}
  height="400px"
/>
```

### Mapa con estilos personalizados
```tsx
<PropertyMapEmbed 
  address="Calle Falsa 123, Ciudad, País"
  className="rounded-lg shadow-lg border-2 border-gray-200"
  height="350px"
  zoom={16}
/>
```

## Integración en PropertyPage

El componente ya está integrado en `PropertyPage.tsx` y se muestra automáticamente cuando una propiedad no tiene coordenadas específicas:

```tsx
// En PropertyPage.tsx
{property.latitude && property.longitude ? (
  <PropertyMap
    latitude={property.latitude}
    longitude={property.longitude}
    address={property.address}
    title={property.title}
    className="mt-4"
  />
) : (
  <div className="mt-4">
    <h4 className="text-lg font-semibold text-gray-900 mb-3">Ubicación en el mapa</h4>
    <PropertyMapEmbed
      address={`${property.address}, ${property.city}, ${property.province}`}
      height="300px"
      zoom={15}
      className="rounded-lg overflow-hidden shadow-md"
    />
    <p className="text-sm text-gray-600 mt-2">
      Mapa aproximado basado en la dirección. Para coordenadas exactas, contacta con nosotros.
    </p>
  </div>
)}
```

## Demo

Para ver el componente en acción, puedes usar el componente `MapDemo` que incluye ejemplos con diferentes direcciones y configuraciones.

## Notas Técnicas

- Utiliza la URL estándar de Google Maps: `https://www.google.com/maps?q={address}&output=embed`
- No requiere configuración adicional ni API keys
- Compatible con todas las direcciones que Google Maps pueda geocodificar
- Incluye atributos de accesibilidad como `title` y `loading="lazy"`
