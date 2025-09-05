import { useState, useEffect } from 'react';
import Header from './components/Header';
import PropertyFilters from './components/PropertyFilters';
import PropertyList from './components/PropertyList';
import PropertyModal from './components/PropertyModal';
import { Property, FilterOptions } from './types';

function App() {
  // Estados principales
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    province: '',
    city: '',
    type: '',
    minPrice: 0,
    maxPrice: 0,
    status: ''
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE = 'http://localhost:3001/api';

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

    // Filtro por provincia
    if (filters.province) {
      filtered = filtered.filter(property => property.province === filters.province);
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

    setFilteredProperties(filtered);
  }, [properties, searchTerm, filters]);

  // Función para manejar cambios en la búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Función para manejar cambios en los filtros
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Función para limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      province: '',
      city: '',
      type: '',
      minPrice: 0,
      maxPrice: 0,
      status: ''
    });
    setSearchTerm('');
  };

  // Función para ver detalles de una propiedad
  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
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
      
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Contenido principal */}
      <main>
        
        {/* Filtros */}
        <PropertyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Lista de propiedades */}
        <PropertyList
          properties={filteredProperties}
          filters={filters}
          onViewDetails={handleViewDetails}
        />
      </main>

      {/* Modal de detalles */}
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App; 