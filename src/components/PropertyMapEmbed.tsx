import React from "react";

interface PropertyMapEmbedProps {
  latitude: number;
  longitude: number;
  width?: string | number;
  height?: string | number;
  zoom?: number;
  className?: string;
}

const PropertyMapEmbed: React.FC<PropertyMapEmbedProps> = ({
  latitude,
  longitude,
  width = "100%",
  height = "300px",
  zoom = 15,
  className = "",
}) => {
  // Construir la URL del iframe de Google Maps usando coordenadas
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

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
        title={`Mapa de ${latitude}, ${longitude}`}
      />
    </div>
  );
};

export default PropertyMapEmbed;
