import React, { useState } from "react";
import {
  X,
  MapPin,
  Bed,
  Bath,
  Square,
  ChevronLeft,
  ChevronRight,
  Trees,
  Car,
} from "lucide-react";
import { Property } from "../types";
import { handlePropertyWhatsAppContact } from "../services/whatsapp";
import { getPropertyTypeIcon } from "../utils/propertyUtils";

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property || !isOpen) return null;

  // Funciones para manejar el carrusel de imágenes
  const nextImage = () => {
    const images = property.images || [];
    if (images.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = property.images || [];
    if (images.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    }
  };

  // Obtener la imagen actual
  const getCurrentImage = () => {
    const images = property.images || [];
    if (images.length > 0) {
      return images[currentImageIndex];
    }
    return property.imageUrl || "/img/default-property.jpg";
  };

  // Verificar si hay múltiples imágenes
  const hasMultipleImages = property.images && property.images.length > 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="modal-header">
          <h2 className="modal-title">Detalles de la Propiedad</h2>
          <button onClick={onClose} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="modal-body">
          {/* Carrusel de imágenes */}
          <div className="modal-image-container">
            <img
              src={getCurrentImage()}
              alt={property.title}
              className="modal-image"
            />

            {/* Controles de navegación del carrusel */}
            {hasMultipleImages && (
              <>
                {/* Botón anterior */}
                <button
                  onClick={prevImage}
                  className="modal-carousel-btn modal-carousel-btn-prev"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Botón siguiente */}
                <button
                  onClick={nextImage}
                  className="modal-carousel-btn modal-carousel-btn-next"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Indicadores de posición */}
                <div className="modal-carousel-indicators">
                  {property.images?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`modal-carousel-indicator ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      aria-label={`Ir a imagen ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Contador de imágenes */}
                <div className="modal-carousel-counter">
                  {currentImageIndex + 1} / {property.images?.length}
                </div>
              </>
            )}
          </div>

          {/* Información principal */}
          <div className="modal-grid">
            {/* Columna izquierda */}
            <div>
              {/* Título */}
              <div className="modal-section">
                <h3 className="modal-section h4">{property.title}</h3>
              </div>

              {/* Tipo y estado */}
              <div className="modal-badges">
                <div className="modal-badge">
                  {getPropertyTypeIcon(property.type)}
                  <span>
                    {property.type.charAt(0).toUpperCase() +
                      property.type.slice(1)}
                  </span>
                </div>
                <div
                  className={`property-status-badge ${
                    property.status === "disponible"
                      ? "status-available"
                      : property.status === "reservada"
                      ? "status-reserved"
                      : "status-sold"
                  }`}
                >
                  {property.status.charAt(0).toUpperCase() +
                    property.status.slice(1)}
                </div>
              </div>

              {/* Ubicación */}
              <div className="modal-location">
                <MapPin className="w-5 h-5" />
                <div className="modal-location-text">
                  {property.address && <h5>{property.address}</h5>}
                  <h5>{property.city}</h5>
                  {property.latitude && property.longitude && (
                    <p className="text-xs text-gray-500 mt-1">
                      {property.latitude.toFixed(6)},{" "}
                      {property.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div className="modal-section">
                <h4>Descripción</h4>
                <p>{property.description}</p>
              </div>
            </div>

            {/* Columna derecha */}
            <div>
              {/* Características */}
              <div className="modal-section">
                <h4>Características</h4>
                <div className="modal-features">
                  {property.bedrooms > 0 && (
                    <div className="modal-feature">
                      <Bed className="w-5 h-5" />
                      <span>{property.bedrooms} Habitaciones</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="modal-feature">
                      <Bath className="w-5 h-5" />
                      <span>{property.bathrooms} Baños</span>
                    </div>
                  )}
                  <div className="modal-feature">
                    <Square className="w-5 h-5" />
                    <span>Terreno: {property.area} m²</span>
                  </div>
                  {property.coveredArea && property.coveredArea > 0 && (
                    <div className="modal-feature">
                      <Square className="w-5 h-5" />
                      <span>
                        Superficie Cubierta: {property.coveredArea} m²
                      </span>
                    </div>
                  )}
                  {property.patio && property.patio !== "No Tiene" && (
                    <div className="modal-feature">
                      <Trees className="w-5 h-5" />
                      <span>Patio {property.patio}</span>
                    </div>
                  )}
                  {property.garage && property.garage !== "No Tiene" && (
                    <div className="modal-feature">
                      <Car className="w-5 h-5" />
                      <span>Garage: {property.garage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="modal-actions">
                <button
                  onClick={() => handlePropertyWhatsAppContact(property)}
                  className="modal-btn modal-btn-primary"
                >
                  Contactar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
