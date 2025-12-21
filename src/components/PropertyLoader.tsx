import React, { useState, useEffect } from "react";
import { PROPERTY_TYPE_CONFIG } from "../utils/propertyUtils";

interface PropertyLoaderProps {
  message?: string;
}

const PropertyLoader: React.FC<PropertyLoaderProps> = ({
  message = "Cargando nuestras propiedades...",
}) => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  const icons = Object.values(PROPERTY_TYPE_CONFIG).map(config => ({
    component: config.icon,
    label: config.label,
  }));

  // Rotar iconos cada 800ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex(prev => (prev + 1) % icons.length);
    }, 800);

    return () => clearInterval(interval);
  }, [icons.length]);

  const CurrentIcon = icons[currentIconIndex].component;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Icono animado */}
        <div className="mb-6 flex justify-center">
          <div className="text-[#f0782c]">
            <CurrentIcon
              className="w-16 h-16 sm:w-20 sm:h-20"
              style={{
                animation: "scale 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Texto de carga */}
        <p className="text-xl sm:text-2xl font-semibold text-gray-800">
          {message}
        </p>
      </div>

      {/* Estilos CSS inline para animaciones */}
      <style>{`
        @keyframes scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyLoader;
