import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, ExternalLink, MapPin } from 'lucide-react';

// Fix para iconos de Leaflet con Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
  title: string;
  className?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  address,
  title,
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter] = useState<[number, number]>([latitude, longitude]);

  // Lazy load del componente de mapa
  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Función para abrir Google Maps
  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${address}, ${latitude}, ${longitude}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  // Función para abrir Apple Maps (detectar dispositivo)
  const openAppleMaps = () => {
    const query = encodeURIComponent(`${address}`);
    const url = `http://maps.apple.com/?q=${query}&ll=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  // Función inteligente para abrir mapas según el dispositivo
  const openMapsApp = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isMac = /macintosh/.test(userAgent);
    
    if (isIOS || isMac) {
      openAppleMaps();
    } else {
      openGoogleMaps();
    }
  };

  // Función para copiar coordenadas
  const copyCoordinates = () => {
    const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    navigator.clipboard.writeText(coords);
    
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.textContent = 'Coordenadas copiadas';
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
  };

  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="w-8 h-8 border-4 border-[#f0782c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`property-map ${className}`}>
      {/* Header del mapa */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#f0782c]" />
          <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
        </div>
        
        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={copyCoordinates}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            title="Copiar coordenadas"
          >
            <span className="text-xs">📋</span>
            Coordenadas
          </button>
          
          <button
            onClick={openMapsApp}
            className="flex items-center gap-2 px-4 py-2 bg-[#f0782c] hover:bg-[#e06a1f] text-white rounded-lg font-medium transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Cómo llegar
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '400px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker position={[latitude, longitude]}>
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-600 mb-2">{address}</p>
                <div className="flex gap-2">
                  <button
                    onClick={openGoogleMaps}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    <span>🗺️</span>
                    Google
                  </button>
                  <button
                    onClick={openAppleMaps}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                  >
                    <span>🍎</span>
                    Apple
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Overlay con información */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-sm">
            <p className="font-medium text-gray-900">{title}</p>
            <p className="text-gray-600 text-xs">{address}</p>
            <p className="text-gray-500 text-xs mt-1">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Botón de pantalla completa (opcional) */}
        <button
          onClick={() => {
            // Implementar vista de pantalla completa si es necesario
            console.log('Vista de pantalla completa');
          }}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-lg shadow-lg transition-all"
          title="Vista de pantalla completa"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <p><strong>Dirección:</strong> {address}</p>
            <p><strong>Coordenadas:</strong> {latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              Haz clic en "Cómo llegar" para abrir en tu app de mapas preferida
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
