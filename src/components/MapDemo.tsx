import React from "react";
import PropertyMapEmbed from "./PropertyMapEmbed";

const MapDemo: React.FC = () => {
  const sampleAddresses = [
    {
      title: "Casa en Ipanema, Rio de Janeiro",
      address: "Rua Visconde de Pirajá 520, Ipanema, Rio de Janeiro, Brasil",
    },
    {
      title: "Propiedad en Córdoba, Argentina",
      address: "Av. San Martín 1234, Marcos Juárez, Córdoba, Argentina",
    },
    {
      title: "Casa en Leones, Córdoba",
      address: "Obispo luque 1346, Leones, Córdoba, Argentina",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Demo del Componente PropertyMapEmbed
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Este componente muestra mapas de Google Maps usando solo iframes
            gratuitos, sin necesidad de API keys. Perfecto para sitios
            inmobiliarios.
          </p>
        </div>

        <div className="grid gap-8">
          {sampleAddresses.map((property, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {property.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  <strong>Dirección:</strong> {property.address}
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Mapa con zoom 15 (por defecto)
                    </h3>
                    <PropertyMapEmbed
                      address={property.address}
                      height="250px"
                      zoom={15}
                      className="rounded-lg overflow-hidden shadow-md"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Mapa con zoom 18 (más detallado)
                    </h3>
                    <PropertyMapEmbed
                      address={property.address}
                      height="250px"
                      zoom={18}
                      className="rounded-lg overflow-hidden shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            Características del Componente
          </h2>
          <ul className="text-blue-800 space-y-2">
            <li>
              ✅ <strong>Gratuito:</strong> No requiere API key de Google Maps
            </li>
            <li>
              ✅ <strong>Fácil de usar:</strong> Solo pasa la dirección como
              prop
            </li>
            <li>
              ✅ <strong>Personalizable:</strong> Ajusta zoom, tamaño y estilos
            </li>
            <li>
              ✅ <strong>Responsive:</strong> Se adapta a diferentes tamaños de
              pantalla
            </li>
            <li>
              ✅ <strong>Accesible:</strong> Incluye atributos de accesibilidad
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MapDemo;
