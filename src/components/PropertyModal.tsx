import React from 'react';
import { X, MapPin, Bed, Bath, Square, Calendar, Home, Building, Store, Briefcase, TreePine } from 'lucide-react';
import { Property, PropertyType } from '../types';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, isOpen, onClose }) => {
  if (!property || !isOpen) return null;

  // Función para obtener el ícono según el tipo de propiedad
  const getPropertyTypeIcon = (type: PropertyType) => {
    switch (type) {
      case 'casa':
        return <Home className="w-5 h-5" />;
      case 'departamento':
        return <Building className="w-5 h-5" />;
      case 'oficina':
        return <Briefcase className="w-5 h-5" />;
      case 'local':
        return <Store className="w-5 h-5" />;
      case 'quinta':
        return <TreePine className="w-5 h-5" />;
      case 'terreno':
        return <Square className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };



  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header del modal */}
        <div className="modal-header">
          <h2 className="modal-title">
            Detalles de la Propiedad
          </h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="modal-body">
          
          {/* Imagen principal */}
          <img
            src={property.images && property.images.length > 0 ? property.images[0] : property.imageUrl || '/img/default-property.jpg'}
            alt={property.title}
            className="modal-image"
          />

          {/* Información principal */}
          <div className="modal-grid">
            
            {/* Columna izquierda */}
            <div>
              
              {/* Título y precio */}
              <div className="modal-section">
                <h3 className="modal-section h4">
                  {property.title}
                </h3>
                <p className="property-price">
                  {formatPrice(property.price)}
                </p>
              </div>

              {/* Tipo y estado */}
              <div className="modal-badges">
                <div className="modal-badge">
                  {getPropertyTypeIcon(property.type)}
                  <span>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                </div>
                <div className={`property-status-badge ${
                  property.status === 'disponible' ? 'status-available' :
                  property.status === 'reservada' ? 'status-reserved' :
                  'status-sold'
                }`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
              </div>

              {/* Ubicación */}
              <div className="modal-location">
                <MapPin className="w-5 h-5" />
                <div className="modal-location-text">
                  <h5>{property.address}</h5>
                  <p>{property.city}</p>
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
                    <span>{property.area} m²</span>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="modal-section">
                <h4>Información Adicional</h4>
                <div className="modal-features">
                  <div className="modal-feature">
                    <Calendar className="w-4 h-4" />
                    <span>Publicado: {formatDate(property.publishedDate)}</span>
                  </div>
                  <div className="modal-feature">
                    <span>ID: {property.id}</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="modal-actions">
                <button className="modal-btn modal-btn-primary">
                  Contactar
                </button>
                <button className="modal-btn modal-btn-secondary">
                  Agendar Visita
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