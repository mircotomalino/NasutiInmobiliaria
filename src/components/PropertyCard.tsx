import React from 'react';
import { Link } from 'react-router-dom';
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
    <div className="property-card h-[500px] flex flex-col">
      
      {/* Imagen de la propiedad */}
      <div className="property-image h-48 flex-shrink-0">
        <img
          src={property.images && property.images.length > 0 ? property.images[0] : property.imageUrl || '/img/default-property.jpg'}
          alt={property.title}
          className="w-full h-full object-cover"
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
      <div className="property-content flex-1 flex flex-col p-4 overflow-hidden">
        
        {/* Título */}
        <div className="mb-2 flex-shrink-0">
          <h3 className="property-title text-lg font-bold text-gray-900 line-clamp-2">
            {property.title}
          </h3>
        </div>

        {/* Precio */}
        <div className="mb-3 flex-shrink-0">
          <span className="text-xl font-bold text-[#f0782c]">
            ${property.price.toLocaleString()}
          </span>
        </div>

        {/* Ubicación */}
        <div className="property-location mb-3 flex-shrink-0">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>
        </div>

        {/* Características principales - Contenedor con scroll si es necesario */}
        <div className="property-features mb-4 flex-1 overflow-y-auto min-h-0">
          <div className="flex flex-wrap gap-2">
            {property.bedrooms > 0 && (
              <div className="property-feature flex items-center gap-1 text-sm text-gray-600">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} hab.</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="property-feature flex items-center gap-1 text-sm text-gray-600">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} baños</span>
              </div>
            )}
            <div className="property-feature flex items-center gap-1 text-sm text-gray-600">
              <Square className="w-4 h-4" />
              <span>{property.area}m²</span>
            </div>
            {property.patio && property.patio !== 'No Tiene' && (
              <div className="property-feature flex items-center gap-1 text-sm text-gray-600">
                <Trees className="w-4 h-4" />
                <span>Patio {property.patio.toLowerCase()}</span>
              </div>
            )}
            {property.garage && property.garage !== 'No Tiene' && (
              <div className="property-feature flex items-center gap-1 text-sm text-gray-600">
                <Car className="w-4 h-4" />
                <span>{property.garage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción - SIEMPRE VISIBLES */}
        <div className="flex gap-2 flex-shrink-0 mt-2">
          <button
            onClick={() => onViewDetails(property)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-center text-sm flex items-center justify-center gap-1"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Detalles</span>
          </button>
          
          <Link
            to={`/propiedad/${property.id}`}
            className="flex-1 bg-[#f0782c] hover:bg-[#e06a1f] text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-center text-sm flex items-center justify-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span>Ver Propiedad</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard; 