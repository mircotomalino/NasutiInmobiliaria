import React from 'react';
import { Filter, X } from 'lucide-react';
import { FilterOptions } from '../types';
import { cities, propertyTypes, propertyStatuses } from '../data/properties';

interface PropertyFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = 
    filters.city !== '' || 
    filters.type !== '' || 
    filters.status !== '' || 
    filters.minPrice > 0 || 
    filters.maxPrice > 0;

  return (
    <div className="filters-container">
      <div className="filters-header">
        <div className="filters-title">
          <Filter className="w-5 h-5" />
          <h3>Filtros</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="clear-filters"
          >
            <X className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      <div className="filters-grid">
        
        {/* Filtro por Ciudad */}
        <div className="filter-group">
          <label>Ciudad</label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las ciudades</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Tipo */}
        <div className="filter-group">
          <label>Tipo de Propiedad</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los tipos</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div className="filter-group">
          <label>Estado</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los estados</option>
            {propertyStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Rango de Precio */}
        <div className="filter-group">
          <label>Rango de Precio (USD)</label>
          <div className="price-range">
            <input
              type="number"
              placeholder="Mín"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value) || 0)}
              className="filter-input"
            />
            <input
              type="number"
              placeholder="Máx"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value) || 0)}
              className="filter-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters; 