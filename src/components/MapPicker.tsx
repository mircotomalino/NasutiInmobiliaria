import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Search, Navigation, X, Edit3 } from 'lucide-react';

// Fix para iconos de Leaflet con Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Tipos para el componente
interface MapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onCoordinatesChange: (lat: number | null, lng: number | null) => void;
  address?: string;
  onAddressChange?: (address: string) => void;
  className?: string;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

// Componente para manejar eventos del mapa
const MapEvents: React.FC<{
  onMapClick: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}> = ({ onMapClick, initialLat, initialLng }) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });

  // Centrar el mapa en las coordenadas iniciales si existen
  useEffect(() => {
    if (initialLat && initialLng) {
      map.setView([initialLat, initialLng], 15);
    }
  }, [map, initialLat, initialLng]);

  return null;
};

// Componente principal MapPicker
const MapPicker: React.FC<MapPickerProps> = ({
  latitude,
  longitude,
  onCoordinatesChange,
  address,
  onAddressChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-31.4201, -64.1888]); // Córdoba por defecto
  const [currentMarker, setCurrentMarker] = useState<[number, number] | null>(null);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Coordenadas por defecto para ciudades argentinas
  const defaultCities = [
    { name: 'Córdoba', lat: -31.4201, lng: -64.1888 },
    { name: 'Marcos Juárez', lat: -32.6986, lng: -62.1019 },
    { name: 'Leones', lat: -32.4378, lng: -63.2975 },
    { name: 'Rosario', lat: -32.9442, lng: -60.6505 },
  ];

  // Inicializar coordenadas
  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
      setCurrentMarker([latitude, longitude]);
      setManualLat(latitude.toString());
      setManualLng(longitude.toString());
    }
  }, [latitude, longitude]);

  // Función para buscar direcciones usando Nominatim (OpenStreetMap)
  const searchAddress = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ar&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching address:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce para la búsqueda
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.length > 2) {
        searchAddress(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Manejar selección de resultado de búsqueda
  const handleSearchResultSelect = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setMapCenter([lat, lng]);
    setCurrentMarker([lat, lng]);
    setManualLat(lat.toString());
    setManualLng(lng.toString());
    onCoordinatesChange(lat, lng);
    
    if (onAddressChange) {
      onAddressChange(result.display_name);
    }
    
    setSearchQuery('');
    setSearchResults([]);
  };

  // Manejar click en el mapa
  const handleMapClick = (lat: number, lng: number) => {
    setCurrentMarker([lat, lng]);
    setManualLat(lat.toFixed(8));
    setManualLng(lng.toFixed(8));
    onCoordinatesChange(lat, lng);
  };

  // Manejar cambio de coordenadas manuales
  const handleManualCoordinatesChange = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      setMapCenter([lat, lng]);
      setCurrentMarker([lat, lng]);
      onCoordinatesChange(lat, lng);
    }
  };

  // Limpiar coordenadas
  const handleClearCoordinates = () => {
    setCurrentMarker(null);
    setManualLat('');
    setManualLng('');
    onCoordinatesChange(null, null);
  };

  // Obtener mi ubicación actual
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter([lat, lng]);
          setCurrentMarker([lat, lng]);
          setManualLat(lat.toFixed(8));
          setManualLng(lng.toFixed(8));
          onCoordinatesChange(lat, lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('No se pudo obtener la ubicación actual');
        }
      );
    } else {
      alert('Geolocalización no soportada por este navegador');
    }
  };

  return (
    <div className={`map-picker ${className}`}>
      {/* Botón para abrir el selector de mapa */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
      >
        <MapPin className="w-5 h-5 text-[#f0782c]" />
        {latitude && longitude ? (
          <span className="text-sm text-gray-700">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
        ) : (
          <span className="text-sm text-gray-500">Seleccionar ubicación en mapa</span>
        )}
        <Edit3 className="w-4 h-4 text-gray-400" />
      </button>

      {/* Modal del mapa */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-[95vw] h-[95vh] max-w-6xl max-h-[800px] flex flex-col">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Seleccionar Ubicación
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex-1 flex">
              {/* Panel lateral */}
              <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Búsqueda de direcciones */}
                <div className="p-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar Dirección
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar dirección..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-[#f0782c] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  {/* Resultados de búsqueda */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto">
                      {searchResults.map((result) => (
                        <button
                          key={result.place_id}
                          onClick={() => handleSearchResultSelect(result)}
                          className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium truncate">{result.display_name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ciudades por defecto */}
                <div className="p-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudades Principales
                  </label>
                  <div className="space-y-1">
                    {defaultCities.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => handleSearchResultSelect({
                          display_name: city.name,
                          lat: city.lat.toString(),
                          lon: city.lng.toString(),
                          place_id: 0
                        })}
                        className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coordenadas manuales */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Coordenadas Manuales
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowManualInput(!showManualInput)}
                      className="text-xs text-[#f0782c] hover:underline"
                    >
                      {showManualInput ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>

                  {showManualInput && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Latitud</label>
                        <input
                          type="number"
                          step="any"
                          value={manualLat}
                          onChange={(e) => setManualLat(e.target.value)}
                          onBlur={handleManualCoordinatesChange}
                          placeholder="-31.4201"
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f0782c] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Longitud</label>
                        <input
                          type="number"
                          step="any"
                          value={manualLng}
                          onChange={(e) => setManualLng(e.target.value)}
                          onBlur={handleManualCoordinatesChange}
                          placeholder="-64.1888"
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f0782c] focus:border-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleManualCoordinatesChange}
                        className="w-full px-3 py-1 text-xs bg-[#f0782c] text-white rounded hover:bg-[#e06a1f] transition-colors duration-200"
                      >
                        Aplicar Coordenadas
                      </button>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="p-4 space-y-2">
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Navigation className="w-4 h-4" />
                    Mi Ubicación Actual
                  </button>
                  
                  {currentMarker && (
                    <button
                      type="button"
                      onClick={handleClearCoordinates}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      Limpiar Ubicación
                    </button>
                  )}
                </div>

                {/* Vista previa */}
                {currentMarker && (
                  <div className="p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Vista Previa</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div><strong>Latitud:</strong> {currentMarker[0].toFixed(8)}</div>
                      <div><strong>Longitud:</strong> {currentMarker[1].toFixed(8)}</div>
                      {address && (
                        <div><strong>Dirección:</strong> {address}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mapa */}
              <div className="flex-1 relative">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  key={`${mapCenter[0]}-${mapCenter[1]}`}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  <MapEvents
                    onMapClick={handleMapClick}
                    initialLat={currentMarker?.[0]}
                    initialLng={currentMarker?.[1]}
                  />
                  
                  {currentMarker && (
                    <Marker position={currentMarker}>
                      <Popup>
                        <div className="text-sm">
                          <div><strong>Ubicación seleccionada</strong></div>
                          <div>Lat: {currentMarker[0].toFixed(6)}</div>
                          <div>Lng: {currentMarker[1].toFixed(6)}</div>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#f0782c] text-white rounded-lg hover:bg-[#e06a1f] transition-colors duration-200"
              >
                Confirmar Ubicación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
