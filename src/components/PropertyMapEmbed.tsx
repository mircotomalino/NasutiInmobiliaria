import React from "react";

interface PropertyMapEmbedProps {
  address: string;
  width?: string | number;
  height?: string | number;
  zoom?: number;
  className?: string;
}

const PropertyMapEmbed: React.FC<PropertyMapEmbedProps> = ({
  address,
  width = "100%",
  height = "300px",
  zoom = 15,
  className = "",
}) => {
  // Función para codificar la dirección para URL
  const encodeAddress = (address: string): string => {
    return encodeURIComponent(address.trim());
  };

  // Construir la URL del iframe de Google Maps usando el método gratuito
  // Este método no requiere API key y usa la URL estándar de Google Maps
  const mapUrl = `https://www.google.com/maps?q=${encodeAddress(address)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div
      className={`property-map-embed ${className}`}
      style={{ width, height }}
    >
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa de ${address}`}
      />
    </div>
  );
};

export default PropertyMapEmbed;
