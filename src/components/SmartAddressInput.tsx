import React, { useState, useEffect } from "react";
import { MapPin, Copy, Check, AlertCircle } from "lucide-react";

interface SmartAddressInputProps {
  value: string;
  onChange: (address: string) => void;
  onCoordinatesChange?: (lat: number | null, lng: number | null) => void;
  className?: string;
  placeholder?: string;
  showMapPreview?: boolean;
}

const SmartAddressInput: React.FC<SmartAddressInputProps> = ({
  value,
  onChange,
  onCoordinatesChange,
  className = "",
  placeholder = "Dirección o coordenadas (ej: -31.4201, -64.1888)",
  showMapPreview = true,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [detectedType, setDetectedType] = useState<
    "address" | "coordinates" | "unknown"
  >("unknown");
  const [parsedCoordinates, setParsedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // Función para detectar si el input contiene coordenadas
  const detectInputType = (
    input: string
  ): "address" | "coordinates" | "unknown" => {
    if (!input.trim()) return "unknown";

    // Patrones para detectar coordenadas
    const coordinatePatterns = [
      // Formato: "lat, lng" o "lat,lng"
      /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,
      // Formato: "lat lng" (espacio)
      /^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/,
      // Formato con coma decimal: "31,4201, -64,1888"
      /^(-?\d+),(\d+)\s*,\s*(-?\d+),(\d+)$/,
      // Formato de Google Maps: "lat, lng" con más contexto
      /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*[^\d]/,
    ];

    for (const pattern of coordinatePatterns) {
      if (pattern.test(input.trim())) {
        return "coordinates";
      }
    }

    // Si contiene palabras comunes de direcciones, es una dirección
    const addressKeywords = [
      "calle",
      "avenida",
      "av",
      "pasaje",
      "pas",
      "ruta",
      "rt",
      "km",
      "barrio",
      "zona",
      "centro",
      "norte",
      "sur",
      "este",
      "oeste",
      "street",
      "avenue",
      "road",
      "boulevard",
      "lane",
      "drive",
    ];

    const lowerInput = input.toLowerCase();
    if (addressKeywords.some(keyword => lowerInput.includes(keyword))) {
      return "address";
    }

    return "unknown";
  };

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
  const generateGoogleMapsUrl = (
    address: string,
    lat?: number,
    lng?: number
  ): string => {
    if (lat && lng) {
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    const inputType = detectInputType(newValue);
    setDetectedType(inputType);

    if (inputType === "coordinates") {
      const coords = parseCoordinates(newValue);
      setParsedCoordinates(coords);
      setIsValid(!!coords);

      if (coords && onCoordinatesChange) {
        onCoordinatesChange(coords.lat, coords.lng);
      }
    } else {
      setParsedCoordinates(null);
      setIsValid(true);

      if (onCoordinatesChange) {
        onCoordinatesChange(null, null);
      }
    }
  };

  // Copiar coordenadas al portapapeles
  const copyCoordinates = () => {
    if (parsedCoordinates) {
      const coordsText = `${parsedCoordinates.lat}, ${parsedCoordinates.lng}`;
      navigator.clipboard.writeText(coordsText).then(() => {
        // Mostrar feedback visual
        const button = document.getElementById("copy-coords-btn");
        if (button) {
          const originalText = button.innerHTML;
          button.innerHTML = '<Check className="w-4 h-4" />';
          setTimeout(() => {
            button.innerHTML = originalText;
          }, 2000);
        }
      });
    }
  };

  // Sincronizar con el valor externo
  useEffect(() => {
    setInputValue(value);
    const inputType = detectInputType(value);
    setDetectedType(inputType);

    if (inputType === "coordinates") {
      const coords = parseCoordinates(value);
      setParsedCoordinates(coords);
      setIsValid(!!coords);
    } else {
      setParsedCoordinates(null);
      setIsValid(true);
    }
  }, [value]);

  return (
    <div className={`smart-address-input ${className}`}>
      {/* Input principal */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
            detectedType === "coordinates" && !isValid
              ? "border-red-300 focus:ring-red-500"
              : detectedType === "coordinates" && isValid
                ? "border-green-300 focus:ring-green-500"
                : "border-gray-300 focus:ring-blue-500"
          }`}
        />

        {/* Indicador de tipo detectado */}
        {detectedType !== "unknown" && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {detectedType === "coordinates" ? (
              isValid ? (
                <MapPin className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )
            ) : (
              <MapPin className="w-4 h-4 text-blue-600" />
            )}
          </div>
        )}
      </div>

      {/* Información y controles */}
      {inputValue && (
        <div className="mt-2 space-y-2">
          {/* Información del tipo detectado */}
          <div className="text-sm">
            {detectedType === "coordinates" && isValid && (
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-4 h-4" />
                <span>
                  Coordenadas detectadas: {parsedCoordinates?.lat.toFixed(6)},{" "}
                  {parsedCoordinates?.lng.toFixed(6)}
                </span>
                <button
                  id="copy-coords-btn"
                  onClick={copyCoordinates}
                  className="ml-2 p-1 hover:bg-green-100 rounded transition-colors"
                  title="Copiar coordenadas"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
            {detectedType === "coordinates" && !isValid && (
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span>Formato de coordenadas inválido</span>
              </div>
            )}
            {detectedType === "address" && (
              <div className="flex items-center gap-2 text-blue-700">
                <MapPin className="w-4 h-4" />
                <span>Dirección detectada</span>
              </div>
            )}
          </div>

          {/* Botón para ver en Google Maps */}
          {showMapPreview &&
            (detectedType === "address" ||
              (detectedType === "coordinates" && isValid)) && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const url = generateGoogleMapsUrl(
                      inputValue,
                      parsedCoordinates?.lat,
                      parsedCoordinates?.lng
                    );
                    window.open(url, "_blank");
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Ver en Google Maps
                </button>

                {showMapPreview && (
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {showPreview ? "Ocultar" : "Mostrar"} Mapa
                  </button>
                )}
              </div>
            )}

          {/* Preview del mapa */}
          {showPreview &&
            showMapPreview &&
            (detectedType === "address" ||
              (detectedType === "coordinates" && isValid)) && (
              <div className="mt-2">
                <iframe
                  src={generateGoogleMapsUrl(
                    inputValue,
                    parsedCoordinates?.lat,
                    parsedCoordinates?.lng
                  )}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-md"
                />
              </div>
            )}
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-2 text-xs text-gray-500">
        <p>
          <strong>Tipos de entrada soportados:</strong>
        </p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Direcciones: "Av. San Martín 1234, Córdoba"</li>
          <li>Coordenadas: "-31.4201, -64.1888" o "-31.4201 -64.1888"</li>
          <li>Pega coordenadas directamente desde Google Maps</li>
        </ul>
      </div>
    </div>
  );
};

export default SmartAddressInput;
