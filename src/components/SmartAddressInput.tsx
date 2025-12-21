import React, { useState, useEffect } from "react";
import { MapPin, AlertCircle } from "../icons";

interface SmartAddressInputProps {
  value: string;
  onChange: (coordinates: string) => void;
  onCoordinatesChange?: (lat: number | null, lng: number | null) => void;
  className?: string;
  placeholder?: string;
  showMapPreview?: boolean;
  disabled?: boolean;
}

const SmartAddressInput: React.FC<SmartAddressInputProps> = ({
  value,
  onChange,
  onCoordinatesChange,
  className = "",
  placeholder = "Coordenadas (ej: -31.4201, -64.1888)",
  showMapPreview = true,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [parsedCoordinates, setParsedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isValid, setIsValid] = useState(true);

  // Función para parsear coordenadas
  const parseCoordinates = (
    input: string
  ): { lat: number; lng: number } | null => {
    if (!input.trim()) return null;

    const cleaned = input.trim().replace(/[^\d\.,\-\s]/g, "");

    const patterns = [
      /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,
      /^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/,
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

        if (
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        ) {
          return { lat, lng };
        }
      }
    }

    return null;
  };

  // Función para generar URL de Google Maps
  const generateGoogleMapsUrl = (lat: number, lng: number): string => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    const coords = parseCoordinates(newValue);
    setParsedCoordinates(coords);
    setIsValid(!!coords || newValue.trim() === "");

    if (coords && onCoordinatesChange) {
      onCoordinatesChange(coords.lat, coords.lng);
    } else {
      if (onCoordinatesChange) {
        onCoordinatesChange(null, null);
      }
    }
  };

  // Sincronizar con el valor externo
  useEffect(() => {
    setInputValue(value);
    const coords = parseCoordinates(value);
    setParsedCoordinates(coords);
    setIsValid(!!coords || value.trim() === "");
  }, [value]);

  return (
    <div className={`smart-address-input ${className}`}>
      {/* Input principal */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
            disabled
              ? "bg-gray-100 cursor-not-allowed border-gray-300"
              : inputValue.trim() && !isValid
                ? "border-red-300 focus:ring-red-500"
                : inputValue.trim() && isValid && parsedCoordinates
                  ? "border-green-300 focus:ring-green-500"
                  : "border-gray-300 focus:ring-blue-500"
          }`}
        />

        {/* Indicador de validación */}
        {inputValue.trim() && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid && parsedCoordinates ? (
              <MapPin className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
        )}
      </div>

      {/* Información y controles */}
      {inputValue && (
        <div className="mt-2 space-y-2">
          {/* Mensaje de error si las coordenadas son inválidas */}
          {inputValue.trim() && !isValid && (
            <div className="text-sm">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Formato de coordenadas inválido. Use: lat, lng (ej: -31.4201,
                  -64.1888)
                </span>
              </div>
            </div>
          )}

          {/* Botón para ver en Google Maps */}
          {showMapPreview && isValid && parsedCoordinates && (
            <div>
              <button
                type="button"
                onClick={() => {
                  const url = generateGoogleMapsUrl(
                    parsedCoordinates.lat,
                    parsedCoordinates.lng
                  );
                  window.open(url, "_blank");
                }}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Ver en Google Maps
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartAddressInput;
