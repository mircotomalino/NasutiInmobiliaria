import React from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Eye,
  Home,
  Building,
  Store,
  Briefcase,
  TreePine
} from 'lucide-react';
import { Property, PropertyType } from '../types';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  
  // Función para obtener el ícono según el tipo de propiedad
  const getPropertyTypeIcon = (type: PropertyType) => {
    switch (type) {
      case 'casa':
        return <Home className="w-4 h-4" />;
      case 'departamento':
        return <Building className="w-4 h-4" />;
      case 'oficina':
        return <Briefcase className="w-4 h-4" />;
      case 'local':
        return <Store className="w-4 h-4" />;
      case 'quinta':
        return <TreePine className="w-4 h-4" />;
      case 'terreno':
        return <Square className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
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
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="property-card">
      
      {/* Imagen de la propiedad */}
      <div className="property-image">
        <img
          src={property.images && property.images.length > 0 ? property.images[0] : property.imageUrl || '/img/default-property.jpg'}
          alt={property.title}
        />
        
        {/* Badges */}
        <div className="property-badges">
          <div className="property-type-badge">
            {getPropertyTypeIcon(property.type)}
            <span className="capitalize">{property.type}</span>
          </div>
          
          <div className={`property-status-badge ${
            property.status === 'disponible' ? 'status-available' :
            property.status === 'reservada' ? 'status-reserved' :
            'status-sold'
          }`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="property-content">
        
        {/* Título y precio */}
        <div>
          <h3 className="property-title">
            {property.title}
          </h3>
          <div className="property-price">
            {formatPrice(property.price)}
          </div>
        </div>

        {/* Descripción */}
        <p className="property-description">
          {property.description}
        </p>

        {/* Ubicación */}
        <div className="property-location">
          <MapPin className="w-4 h-4" />
          <span>{property.address}, {property.city}</span>
        </div>

        {/* Características principales */}
        <div className="property-features">
          {property.bedrooms > 0 && (
            <div className="property-feature">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} hab.</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="property-feature">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} baños</span>
            </div>
          )}
          <div className="property-feature">
            <Square className="w-4 h-4" />
            <span>{property.area}m²</span>
          </div>
        </div>

        {/* Fecha de publicación */}
        <div className="property-date">
          <Calendar className="w-3 h-3" />
          <span>Publicado: {formatDate(property.publishedDate)}</span>
        </div>

        {/* Botón Ver más */}
        <button
          onClick={() => onViewDetails(property)}
          className="view-details-btn"
        >
          <Eye className="w-4 h-4" />
          <span>Ver más detalles</span>
        </button>
      </div>
    </div>
  );
};

export default PropertyCard; 