# 🗺️ MapPicker Component

Componente React para selección de ubicaciones geográficas con mapa interactivo usando React-Leaflet.

## 🚀 Características

- ✅ **Mapa interactivo** con React-Leaflet
- ✅ **Búsqueda de direcciones** con autocomplete usando Nominatim
- ✅ **Pin-drop** para seleccionar ubicaciones
- ✅ **Coordenadas manuales** como fallback
- ✅ **Geolocalización** del usuario actual
- ✅ **Ciudades predefinidas** de Argentina
- ✅ **Vista previa** de coordenadas seleccionadas
- ✅ **Responsive** y accesible

## 📦 Instalación

```bash
npm install leaflet react-leaflet@^4.2.1 @types/leaflet --legacy-peer-deps
```

## 🎯 Uso Básico

```tsx
import MapPicker from './components/MapPicker';

const MyComponent = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');

  return (
    <MapPicker
      latitude={latitude}
      longitude={longitude}
      onCoordinatesChange={(lat, lng) => {
        setLatitude(lat);
        setLongitude(lng);
      }}
      address={address}
      onAddressChange={setAddress}
    />
  );
};
```

## 🔧 Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `latitude` | `number \| null` | ✅ | Latitud actual de la propiedad |
| `longitude` | `number \| null` | ✅ | Longitud actual de la propiedad |
| `onCoordinatesChange` | `(lat: number \| null, lng: number \| null) => void` | ✅ | Callback cuando cambian las coordenadas |
| `address` | `string` | ❌ | Dirección actual (opcional) |
| `onAddressChange` | `(address: string) => void` | ❌ | Callback cuando cambia la dirección |
| `className` | `string` | ❌ | Clases CSS adicionales |

## 🌍 Funcionalidades

### 1. **Búsqueda de Direcciones**
- Autocomplete con Nominatim (OpenStreetMap)
- Búsqueda específica para Argentina
- Debounce de 300ms para optimizar requests
- Máximo 5 resultados por búsqueda

### 2. **Selección en Mapa**
- Click en el mapa para colocar pin
- Marcador visual con popup informativo
- Zoom automático al seleccionar ubicación

### 3. **Coordenadas Manuales**
- Inputs numéricos para latitud y longitud
- Validación de rangos geográficos
- Formato decimal con 8 decimales de precisión

### 4. **Geolocalización**
- Botón "Mi Ubicación Actual"
- Usa la API de geolocalización del navegador
- Manejo de errores y permisos

### 5. **Ciudades Predefinidas**
- Córdoba: -31.4201, -64.1888
- Marcos Juárez: -32.6986, -62.1019
- Leones: -32.4378, -63.2975
- Rosario: -32.9442, -60.6505

## 🎨 Estilos

El componente incluye estilos CSS que se importan automáticamente:

```css
/* Estilos para Leaflet */
@import 'leaflet/dist/leaflet.css';

/* Estilos para el MapPicker */
.map-picker .leaflet-container {
  height: 100%;
  width: 100%;
}
```

## 🔍 Ejemplo Completo

```tsx
import React, { useState } from 'react';
import MapPicker from './components/MapPicker';

const PropertyForm = () => {
  const [property, setProperty] = useState({
    title: '',
    address: '',
    latitude: null,
    longitude: null,
    // ... otros campos
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enviar datos incluyendo coordenadas
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...property,
        latitude: property.latitude,
        longitude: property.longitude
      })
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Dirección</label>
        <input
          type="text"
          value={property.address}
          onChange={(e) => setProperty(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

      <div>
        <label>Ubicación en Mapa</label>
        <MapPicker
          latitude={property.latitude}
          longitude={property.longitude}
          onCoordinatesChange={(lat, lng) => 
            setProperty(prev => ({ ...prev, latitude: lat, longitude: lng }))
          }
          address={property.address}
          onAddressChange={(address) => 
            setProperty(prev => ({ ...prev, address }))
          }
        />
      </div>

      <button type="submit">Guardar Propiedad</button>
    </form>
  );
};
```

## 🛠️ Integración en ManagerPanel

El MapPicker ya está integrado en el panel de administración (`/managerLogin`):

```tsx
// En ManagerPanel.tsx
<MapPicker
  latitude={editingProperty?.latitude || null}
  longitude={editingProperty?.longitude || null}
  onCoordinatesChange={(lat, lng) => {
    setEditingProperty(prev => prev ? {
      ...prev,
      latitude: lat,
      longitude: lng
    } : null);
  }}
  address={editingProperty?.address}
  onAddressChange={(address) => {
    setEditingProperty(prev => prev ? {
      ...prev,
      address: address
    } : null);
  }}
  className="w-full"
/>
```

## 🌐 APIs Utilizadas

### Nominatim (OpenStreetMap)
- **URL**: `https://nominatim.openstreetmap.org/search`
- **Propósito**: Búsqueda de direcciones con geocoding
- **Parámetros**:
  - `format=json`: Respuesta en JSON
  - `q`: Término de búsqueda
  - `limit=5`: Máximo 5 resultados
  - `countrycodes=ar`: Solo Argentina
  - `addressdetails=1`: Detalles de dirección

### Geolocalización del Navegador
- **API**: `navigator.geolocation.getCurrentPosition()`
- **Propósito**: Obtener ubicación actual del usuario
- **Permisos**: Requiere permisos de ubicación del navegador

## 🎯 Casos de Uso

1. **Crear nueva propiedad**: Seleccionar ubicación exacta
2. **Editar propiedad existente**: Actualizar coordenadas
3. **Validar direcciones**: Verificar ubicación real
4. **Búsquedas geográficas**: Preparar datos para consultas de proximidad

## 🔧 Troubleshooting

### Error: "Leaflet icons not loading"
```tsx
// Fix para Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
```

### Error: "React version conflict"
```bash
npm install react-leaflet@^4.2.1 --legacy-peer-deps
```

### Error: "Geolocation not working"
- Verificar que el sitio use HTTPS
- Verificar permisos del navegador
- Implementar fallback para navegadores sin soporte

## 📱 Responsive

El componente es completamente responsive:
- Modal se adapta a diferentes tamaños de pantalla
- Panel lateral colapsible en móviles
- Mapa se ajusta al contenedor disponible

## ♿ Accesibilidad

- Labels descriptivos para todos los inputs
- Navegación por teclado
- Contraste de colores adecuado
- Mensajes de error claros
- Tooltips informativos

---

**Desarrollado para Nasuti Inmobiliaria** 🏠
