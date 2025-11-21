export interface Property {
  id: string;
  title: string;
  description: string;
  street?: string; // Calle
  streetNumber?: string; // Número
  neighborhood?: string; // Barrio
  locality?: string; // Localidad
  city: string; // Ciudad
  province: string;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number; // en m²
  patio?: PatioType;
  garage?: GarageType;
  latitude?: number; // Coordenada de latitud (decimal)
  longitude?: number; // Coordenada de longitud (decimal)
  featured?: boolean; // Si está destacada en el carrusel (máximo 3)
  publishedDate: string;
  imageUrl?: string; // Para compatibilidad con datos estáticos
  images?: string[]; // Para imágenes subidas desde el panel de gestión
}

export type PropertyType =
  | "casa"
  | "departamento"
  | "terreno"
  | "oficina"
  | "local"
  | "quinta";

export type PropertyStatus = "disponible" | "reservada" | "vendida";

export type PatioType = "No Tiene" | "Chico" | "Mediano" | "Grande";

export type GarageType = "No Tiene" | "1 Vehiculo" | "2 Vehiculos";

export interface FilterOptions {
  searchTerm: string;
  city: string;
  type: PropertyType | "";
  minPrice: number;
  maxPrice: number;
  status: PropertyStatus | "";
  patio: PatioType | "";
  garage: GarageType | "";
}

export interface SortOption {
  label: string;
  value: string;
}
