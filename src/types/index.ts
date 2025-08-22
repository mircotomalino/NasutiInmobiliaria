export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number; // en m²
  publishedDate: string;
  imageUrl: string;
}

export type PropertyType = 'casa' | 'departamento' | 'terreno' | 'oficina' | 'local' | 'quinta';

export type PropertyStatus = 'disponible' | 'reservada' | 'vendida';

export interface FilterOptions {
  searchTerm: string;
  city: string;
  type: PropertyType | '';
  minPrice: number;
  maxPrice: number;
  status: PropertyStatus | '';
}

export interface SortOption {
  label: string;
  value: string;
} 