import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Property, FilterOptions } from '../types';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  filters: FilterOptions;
  onViewDetails: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  filters,
  onViewDetails
}) => {
  // Tolerar valores no-array para evitar errores de renderizado cuando la API
  // devuelve un objeto de error u otro tipo inesperado
  const safeProperties = Array.isArray(properties) ? properties : [];
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calcular propiedades para la página actual
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = safeProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(safeProperties.length / propertiesPerPage);

  // Función para cambiar de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para ir a la página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // Función para ir a la página siguiente
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  if (safeProperties.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h3>No se encontraron propiedades</h3>
        <p>
          Intenta ajustar los filtros para encontrar más resultados.
        </p>
      </div>
    );
  }

  return (
    <div>
      
      {/* Información de resultados */}
      <div className="results-info">
        <span>
          Mostrando {safeProperties.length === 0 ? 0 : indexOfFirstProperty + 1}-{Math.min(indexOfLastProperty, safeProperties.length)} de {safeProperties.length} propiedades
        </span>
        
        {totalPages > 1 && (
          <span>
            Página {currentPage} de {totalPages}
          </span>
        )}
      </div>

      {/* Grid de propiedades */}
      <div className="property-list">
        {currentProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pagination">
          
          {/* Botón anterior */}
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Números de página */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`pagination-number ${
                currentPage === pageNumber ? 'active' : ''
              }`}
            >
              {pageNumber}
            </button>
          ))}

          {/* Botón siguiente */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyList; 