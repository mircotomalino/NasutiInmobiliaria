import React from "react";
import PropertyMapEmbed from "./PropertyMapEmbed";

const PropertyMapExample: React.FC = () => {
  const sampleProperties = [
    {
      address: "Rua Visconde de Pirajá 520, Ipanema, Rio de Janeiro",
      latitude: -22.9848,
      longitude: -43.1986,
    },
    {
      address: "Av. San Martín 1234, Marcos Juárez, Córdoba",
      latitude: -32.6979,
      longitude: -62.0963,
    },
    {
      address: "Obispo luque 1346, Leones, Córdoba",
      latitude: -32.35,
      longitude: -62.3,
    },
  ];

  return (
    <div className="property-map-examples">
      <h2>Ejemplos de Mapas de Propiedades</h2>
      {sampleProperties.map((property, index) => (
        <div key={index} style={{ marginBottom: "2rem" }}>
          <h3>Propiedad {index + 1}</h3>
          <p>
            <strong>Dirección:</strong> {property.address}
          </p>
          <p>
            <strong>Coordenadas:</strong> {property.latitude}, {property.longitude}
          </p>
          <PropertyMapEmbed
            latitude={property.latitude}
            longitude={property.longitude}
            height="250px"
            zoom={16}
            className="property-map"
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyMapExample;
