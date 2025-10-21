import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Home,
  Trees,
  Car
} from 'lucide-react';
import { Property } from '../types';
import { getPropertyTypeIconSmall } from '../utils/propertyUtils';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  





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
            {getPropertyTypeIconSmall(property.type)}
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
        {/* Precio oculto en cards del listado */}

        {/* Ubicación */}
        <div className="property-location mb-3 flex-shrink-0">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>
        </div>

        {/* Características principales - Grid directo */}
        <div className="property-features mb-4 flex-1 min-h-0 grid grid-cols-2 gap-2 text-xs">
          {property.bedrooms > 0 && (
            <div className="property-feature flex items-center gap-1 text-gray-600">
              <Bed className="w-3 h-3" />
              <span>{property.bedrooms} hab.</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="property-feature flex items-center gap-1 text-gray-600">
              <Bath className="w-3 h-3" />
              <span>{property.bathrooms} baños</span>
            </div>
          )}
          <div className="property-feature flex items-center gap-1 text-gray-600">
            <Square className="w-3 h-3" />
            <span>{property.area}m²</span>
          </div>
          {property.patio && property.patio !== 'No Tiene' && (
            <div className="property-feature flex items-center gap-1 text-gray-600">
              <Trees className="w-3 h-3" />
              <span>Patio {property.patio.toLowerCase()}</span>
            </div>
          )}
          {property.garage && property.garage !== 'No Tiene' && (
            <div className="property-feature flex items-center gap-1 text-gray-600">
              <Car className="w-3 h-3 flex-shrink-0" />
              <span className="whitespace-nowrap">{property.garage}</span>
            </div>
          )}
        </div>

        {/* Botón de acción - SIEMPRE VISIBLE */}
        <div className="flex-shrink-0 mt-2">
          <Link
            to={`/propiedad/${property.id}`}
            className="w-full bg-[#f0782c] hover:bg-[#e06a1f] text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-center text-sm flex items-center justify-center gap-1"
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