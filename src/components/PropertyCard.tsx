import React from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye,
  Home,
  Building,
  Store,
  Briefcase,
  TreePine,
  Trees,
  Car
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
        
        {/* Título */}
        <div>
          <h3 className="property-title">
            {property.title}
          </h3>
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
          {property.patio && property.patio !== 'No Tiene' && (
            <div className="property-feature">
              <Trees className="w-4 h-4" />
              <span>Patio {property.patio.toLowerCase()}</span>
            </div>
          )}
          {property.garage && property.garage !== 'No Tiene' && (
            <div className="property-feature">
              <Car className="w-4 h-4" />
              <span>{property.garage}</span>
            </div>
          )}
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