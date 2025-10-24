import React from 'react';
import PropertyMapEmbed from './PropertyMapEmbed';

const PropertyMapExample: React.FC = () => {
  const sampleAddresses = [
    "Rua Visconde de Pirajá 520, Ipanema, Rio de Janeiro",
    "Av. San Martín 1234, Marcos Juárez, Córdoba",
    "Obispo luque 1346, Leones, Córdoba"
  ];

  return (
    <div className="property-map-examples">
      <h2>Ejemplos de Mapas de Propiedades</h2>
      {sampleAddresses.map((address, index) => (
        <div key={index} style={{ marginBottom: '2rem' }}>
          <h3>Propiedad {index + 1}</h3>
          <p><strong>Dirección:</strong> {address}</p>
          <PropertyMapEmbed 
            address={address}
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
