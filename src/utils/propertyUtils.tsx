// Utilidades para propiedades
import { 
  Home, 
  Building, 
  Store, 
  Briefcase, 
  TreePine, 
  Square 
} from 'lucide-react';
import { PropertyType } from '../types';

// Función centralizada para obtener el ícono según el tipo de propiedad
export const getPropertyTypeIcon = (type: PropertyType) => {
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

// Función para obtener el ícono pequeño (para cards)
export const getPropertyTypeIconSmall = (type: PropertyType) => {
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
