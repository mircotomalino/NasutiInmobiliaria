import React, { useState, useEffect } from 'react';
import { MapPin, Edit3, X, Navigation } from 'lucide-react';

// Tipos para el componente
interface SimpleMapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onCoordinatesChange: (lat: number | null, lng: number | null) => void;
  address?: string;
  onAddressChange?: (address: string) => void;
  className?: string;
}

// Componente SimpleMapPicker - versión simplificada sin dependencias complejas
const SimpleMapPicker: React.FC<SimpleMapPickerProps> = ({
  latitude,
  longitude,
  onCoordinatesChange,
  address,
  onAddressChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [currentLat, setCurrentLat] = useState<number | null>(null);
  const [currentLng, setCurrentLng] = useState<number | null>(null);

  // Inicializar coordenadas
  useEffect(() => {
    if (latitude && longitude) {
      setCurrentLat(latitude);
      setCurrentLng(longitude);
      setManualLat(latitude.toString());
      setManualLng(longitude.toString());
    } else {
      setCurrentLat(null);
      setCurrentLng(null);
      setManualLat('');
      setManualLng('');
    }
  }, [latitude, longitude]);

  // Manejar cambio de coordenadas manuales
  const handleManualCoordinatesChange = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      setCurrentLat(lat);
      setCurrentLng(lng);
      onCoordinatesChange(lat, lng);
    } else {
      alert('Por favor ingresa coordenadas válidas (Latitud: -90 a 90, Longitud: -180 a 180)');
    }
  };

  // Limpiar coordenadas
  const handleClearCoordinates = () => {
    setCurrentLat(null);
    setCurrentLng(null);
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
          setCurrentLat(lat);
          setCurrentLng(lng);
          setManualLat(lat.toFixed(8));
          setManualLng(lng.toFixed(8));
          onCoordinatesChange(lat, lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('No se pudo obtener la ubicación actual. Verifica que tengas permisos de ubicación habilitados.');
        }
      );
    } else {
      alert('Geolocalización no soportada por este navegador');
    }
  };

  // Coordenadas por defecto para ciudades argentinas
  const defaultCities = [
    { name: 'Córdoba', lat: -31.4201, lng: -64.1888 },
    { name: 'Marcos Juárez', lat: -32.6986, lng: -62.1019 },
    { name: 'Leones', lat: -32.4378, lng: -63.2975 },
    { name: 'Rosario', lat: -32.9442, lng: -60.6505 },
  ];

  const handleCitySelect = (city: typeof defaultCities[0]) => {
    setCurrentLat(city.lat);
    setCurrentLng(city.lng);
    setManualLat(city.lat.toString());
    setManualLng(city.lng.toString());
    onCoordinatesChange(city.lat, city.lng);
  };

  return (
    <div className={`simple-map-picker ${className}`}>
      {/* Botón para abrir el selector */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-200 ${
          currentLat && currentLng 
            ? 'border-green-300 bg-green-50 hover:bg-green-100' 
            : 'border-gray-300 bg-white hover:bg-gray-50'
        }`}
      >
        <MapPin className={`w-5 h-5 ${currentLat && currentLng ? 'text-green-600' : 'text-[#f0782c]'}`} />
        {currentLat && currentLng ? (
          <span className="text-sm text-green-700 font-medium">
            ✅ {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
          </span>
        ) : (
          <span className="text-sm text-gray-500">Seleccionar ubicación</span>
        )}
        <Edit3 className={`w-4 h-4 ${currentLat && currentLng ? 'text-green-500' : 'text-gray-400'}`} />
      </button>

      {/* Modal del selector */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
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
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Ciudades por defecto */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ciudades Principales
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {defaultCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city)}
                      className="p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#f0782c] transition-colors duration-200"
                    >
                      <div className="font-medium text-sm">{city.name}</div>
                      <div className="text-xs text-gray-500">
                        {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coordenadas manuales */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Coordenadas Manuales
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Latitud</label>
                    <input
                      type="number"
                      step="any"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      placeholder="-31.4201"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Longitud</label>
                    <input
                      type="number"
                      step="any"
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                      placeholder="-64.1888"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleManualCoordinatesChange}
                  className="mt-3 w-full px-4 py-2 bg-[#f0782c] text-white rounded-lg hover:bg-[#e06a1f] transition-colors duration-200"
                >
                  Aplicar Coordenadas
                </button>
              </div>

              {/* Acciones */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  <Navigation className="w-4 h-4" />
                  Mi Ubicación Actual
                </button>
                
                {currentLat && currentLng && (
                  <button
                    type="button"
                    onClick={handleClearCoordinates}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    Limpiar Ubicación
                  </button>
                )}
              </div>

              {/* Vista previa */}
              {currentLat && currentLng && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Ubicación Seleccionada</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Latitud:</strong> {currentLat.toFixed(8)}</div>
                    <div><strong>Longitud:</strong> {currentLng.toFixed(8)}</div>
                    {address && (
                      <div><strong>Dirección:</strong> {address}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {currentLat && currentLng ? (
                  <span className="text-green-600 font-medium">
                    ✅ Ubicación seleccionada: {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
                  </span>
                ) : (
                  <span className="text-gray-500">
                    Selecciona una ubicación para continuar
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentLat && currentLng) {
                      onCoordinatesChange(currentLat, currentLng);
                      setIsOpen(false);
                    } else {
                      alert('Por favor selecciona una ubicación antes de confirmar');
                    }
                  }}
                  disabled={!currentLat || !currentLng}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentLat && currentLng
                      ? 'bg-[#f0782c] text-white hover:bg-[#e06a1f]' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentLat && currentLng ? 'Confirmar Ubicación' : 'Selecciona una ubicación'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMapPicker;
