import React, { useState } from 'react';
import MapPicker from './MapPicker';

// Componente de ejemplo para demostrar el uso del MapPicker
const MapPickerExample: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');

  const handleCoordinatesChange = (lat: number | null, lng: number | null) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Ejemplo de MapPicker
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ingresa una dirección..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación en Mapa
          </label>
          <MapPicker
            latitude={latitude}
            longitude={longitude}
            onCoordinatesChange={handleCoordinatesChange}
            address={address}
            onAddressChange={handleAddressChange}
          />
        </div>

        {/* Vista previa de los datos */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Datos Seleccionados
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Dirección:</strong> {address || 'No especificada'}
            </div>
            <div>
              <strong>Latitud:</strong> {latitude ? latitude.toFixed(8) : 'No especificada'}
            </div>
            <div>
              <strong>Longitud:</strong> {longitude ? longitude.toFixed(8) : 'No especificada'}
            </div>
          </div>
        </div>

        {/* Botones de ejemplo */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setLatitude(-31.4201);
              setLongitude(-64.1888);
              setAddress('Córdoba, Córdoba, Argentina');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Ejemplo: Córdoba
          </button>
          
          <button
            onClick={() => {
              setLatitude(-32.6986);
              setLongitude(-62.1019);
              setAddress('Marcos Juárez, Córdoba, Argentina');
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Ejemplo: Marcos Juárez
          </button>
          
          <button
            onClick={() => {
              setLatitude(null);
              setLongitude(null);
              setAddress('');
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPickerExample;
