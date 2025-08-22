import { useState, useEffect } from 'react';
import Header from './components/Header';
import PropertyFilters from './components/PropertyFilters';
import PropertyList from './components/PropertyList';
import PropertyModal from './components/PropertyModal';
import { Property, FilterOptions } from './types';
import { sampleProperties } from './data/properties';

function App() {
  // Estados principales
  const [properties] = useState<Property[]>(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    city: '',
    type: '',
    minPrice: 0,
    maxPrice: 0,
    status: ''
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        property.city.toLowerCase().includes(term)
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