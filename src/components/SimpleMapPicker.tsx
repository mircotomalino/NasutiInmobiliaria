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
  const [googleMapsInput, setGoogleMapsInput] = useState('');
  const [currentLat, setCurrentLat] = useState<number | null>(null);
  const [currentLng, setCurrentLng] = useState<number | null>(null);

  // Inicializar coordenadas
  useEffect(() => {
    if (latitude && longitude) {
      setCurrentLat(latitude);
      setCurrentLng(longitude);
    } else {
      setCurrentLat(null);
      setCurrentLng(null);
    }
  }, [latitude, longitude]);

  // Función para parsear coordenadas de Google Maps
  const parseGoogleMapsCoordinates = (input: string): { lat: number; lng: number } | null => {
    if (!input.trim()) return null;
    
    // Limpiar el input
    const cleaned = input.trim().replace(/[^\d\.,\-\s]/g, '');
    
    // Intentar diferentes formatos de Google Maps
    const patterns = [
      // Formato: "lat, lng" o "lat,lng"
      /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,
      // Formato: "lat lng" (espacio)
      /^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/,
      // Formato con coma decimal: "31,4201, -64,1888"
      /^(-?\d+),(\d+)\s*,\s*(-?\d+),(\d+)$/,
    ];
    
    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        let lat: number, lng: number;
        
        if (pattern === patterns[2]) {
          // Formato con coma decimal
          lat = parseFloat(`${match[1]}.${match[2]}`);
          lng = parseFloat(`${match[3]}.${match[4]}`);
        } else {
          // Formato estándar
          lat = parseFloat(match[1]);
          lng = parseFloat(match[2]);
        }
        
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      }
    }
    
    return null;
  };


  // Manejar input de Google Maps
  const handleGoogleMapsInput = () => {
    const parsed = parseGoogleMapsCoordinates(googleMapsInput);
    
    if (parsed) {
      setCurrentLat(parsed.lat);
      setCurrentLng(parsed.lng);
      onCoordinatesChange(parsed.lat, parsed.lng);
      setGoogleMapsInput('');
    } else {
      alert('Formato de coordenadas no reconocido.\n\nFormatos aceptados:\n• 31.4201, -64.1888\n• 31.4201 -64.1888\n• 31,4201, -64,1888\n\nPega las coordenadas directamente desde Google Maps.');
    }
  };

  // Limpiar coordenadas
  const handleClearCoordinates = () => {
    setCurrentLat(null);
    setCurrentLng(null);
    onCoordinatesChange(null, null);
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
              {/* Input de Google Maps */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📍 Pegar coordenadas desde Google Maps
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={googleMapsInput}
                    onChange={(e) => setGoogleMapsInput(e.target.value)}
                    placeholder="Pega las coordenadas desde Google Maps (ej: 31.4201, -64.1888)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleGoogleMapsInput}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    Aplicar desde Google Maps
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Formatos aceptados: <code>31.4201, -64.1888</code> o <code>31.4201 -64.1888</code>
                </div>
              </div>

              {/* Acciones */}
              <div className="space-y-3">
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
