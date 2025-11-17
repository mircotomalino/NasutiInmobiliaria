import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyFilters from './components/PropertyFilters';
import PropertyList from './components/PropertyList';
import { Property, FilterOptions, PropertyType, PropertyStatus, PatioType, GarageType } from './types';
import { getApiBase } from './utils/api';

function App() {
  // Hook para manejar parámetros de URL
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados principales
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    city: '',
    type: '',
    minPrice: 0,
    maxPrice: 0,
    status: '',
    patio: '',
    garage: ''
  });

  const API_BASE = getApiBase();

  // Cargar propiedades desde la API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE}/properties`);
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Cargar filtros desde URL al montar el componente
  useEffect(() => {
    const urlFilters: FilterOptions = {
      searchTerm: searchParams.get('search') || '',
      city: searchParams.get('city') || '',
      type: (searchParams.get('type') as PropertyType) || '',
      minPrice: parseInt(searchParams.get('minPrice') || '0') || 0,
      maxPrice: parseInt(searchParams.get('maxPrice') || '0') || 0,
      status: (searchParams.get('status') as PropertyStatus) || '',
      patio: (searchParams.get('patio') as PatioType) || '',
      garage: (searchParams.get('garage') as GarageType) || ''
    };
    
    setFilters(urlFilters);
    setSearchTerm(urlFilters.searchTerm);
  }, [searchParams]);



  // Efecto para aplicar filtros
  useEffect(() => {
    let filtered = [...properties];

    // Filtro por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(term) ||
        property.description.toLowerCase().includes(term) ||
        property.address.toLowerCase().includes(term) ||
        property.city.toLowerCase().includes(term) ||
        property.province.toLowerCase().includes(term)
      );
    }

    // Filtro por ciudad
    if (filters.city) {
      filtered = filtered.filter(property => property.city === filters.city);
    }

    // Filtro por tipo
    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }

    // Filtro por estado
    if (filters.status) {
      filtered = filtered.filter(property => property.status === filters.status);
    }

    // Filtro por rango de precio
    if (filters.minPrice > 0) {
      filtered = filtered.filter(property => property.price >= filters.minPrice);
    }
    if (filters.maxPrice > 0) {
      filtered = filtered.filter(property => property.price <= filters.maxPrice);
    }

    // Filtro por patio
    if (filters.patio) {
      filtered = filtered.filter(property => property.patio === filters.patio);
    }

    // Filtro por garage
    if (filters.garage) {
      filtered = filtered.filter(property => property.garage === filters.garage);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, filters]);

  // (Se removió el input de búsqueda del Header en /catalogo)

  // Función para actualizar URL con filtros
  const updateURLWithFilters = (newFilters: FilterOptions) => {
    const params = new URLSearchParams();
    
    if (newFilters.searchTerm) params.set('search', newFilters.searchTerm);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice > 0) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.patio) params.set('patio', newFilters.patio);
    if (newFilters.garage) params.set('garage', newFilters.garage);
    
    setSearchParams(params);
  };

  // Función para manejar cambios en los filtros
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    updateURLWithFilters(newFilters);
  };

  // Función para limpiar filtros
  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      searchTerm: '',
      city: '',
      type: '',
      minPrice: 0,
      maxPrice: 0,
      status: '',
      patio: '',
      garage: ''
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    setSearchParams(new URLSearchParams()); // Limpiar URL
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Cargando catálogo...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Contenido principal */}
      <main>
        
        {/* Filtros */}
        <PropertyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          searchTerm={searchTerm}
        />

        {/* Lista de propiedades */}
        <PropertyList
          properties={filteredProperties}
          filters={filters}
        />
      </main>
    </div>
  );
}

export default App; 