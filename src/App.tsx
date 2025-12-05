import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PropertyFilters from "./components/PropertyFilters";
import PropertyList from "./components/PropertyList";
import SEOHead from "./components/SEOHead";
import {
  Property,
  FilterOptions,
  PropertyType,
  PropertyStatus,
  PatioType,
  GarageType,
} from "./types";
import { getApiBase } from "./utils/api";
import { generateCollectionPageSchema, generateBreadcrumbSchema } from "./utils/schemaMarkup";
import { Link } from "react-router-dom";

function App() {
  // Hook para manejar parámetros de URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados principales
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    city: "",
    type: "",
    minPrice: 0,
    maxPrice: 0,
    status: "",
    patio: "",
    garage: "",
  });

  const API_BASE = getApiBase();

  // Cargar propiedades desde la API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE}/properties`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [API_BASE]);

  // Cargar filtros desde URL al montar el componente
  useEffect(() => {
    const urlFilters: FilterOptions = {
      searchTerm: searchParams.get("search") || "",
      city: searchParams.get("city") || "",
      type: (searchParams.get("type") as PropertyType) || "",
      minPrice: parseInt(searchParams.get("minPrice") || "0") || 0,
      maxPrice: parseInt(searchParams.get("maxPrice") || "0") || 0,
      status: (searchParams.get("status") as PropertyStatus) || "",
      patio: (searchParams.get("patio") as PatioType) || "",
      garage: (searchParams.get("garage") as GarageType) || "",
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
      filtered = filtered.filter(
        property =>
          property.title.toLowerCase().includes(term) ||
          property.description.toLowerCase().includes(term) ||
          (property.address && property.address.toLowerCase().includes(term)) ||
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
      filtered = filtered.filter(
        property => property.status === filters.status
      );
    }

    // Filtro por rango de precio
    if (filters.minPrice > 0) {
      filtered = filtered.filter(
        property => property.price >= filters.minPrice
      );
    }
    if (filters.maxPrice > 0) {
      filtered = filtered.filter(
        property => property.price <= filters.maxPrice
      );
    }

    // Filtro por patio
    if (filters.patio) {
      filtered = filtered.filter(property => property.patio === filters.patio);
    }

    // Filtro por garage
    if (filters.garage) {
      filtered = filtered.filter(
        property => property.garage === filters.garage
      );
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, filters]);

  // (Se removió el input de búsqueda del Header en /catalogo)

  // Función para actualizar URL con filtros
  const updateURLWithFilters = (newFilters: FilterOptions) => {
    const params = new URLSearchParams();

    if (newFilters.searchTerm) params.set("search", newFilters.searchTerm);
    if (newFilters.city) params.set("city", newFilters.city);
    if (newFilters.type) params.set("type", newFilters.type);
    if (newFilters.minPrice > 0)
      params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice > 0)
      params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.patio) params.set("patio", newFilters.patio);
    if (newFilters.garage) params.set("garage", newFilters.garage);

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
      searchTerm: "",
      city: "",
      type: "",
      minPrice: 0,
      maxPrice: 0,
      status: "",
      patio: "",
      garage: "",
    };
    setFilters(clearedFilters);
    setSearchTerm("");
    setSearchParams(new URLSearchParams()); // Limpiar URL
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Cargando catálogo...</div>
      </div>
    );
  }

  // Generar schema JSON-LD para CollectionPage
  const collectionPageSchema = generateCollectionPageSchema();

  // Generar schema JSON-LD para Breadcrumbs
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: "Inicio", url: "https://inmobiliarianasuti.com.ar/" },
      { name: "Catálogo", url: "https://inmobiliarianasuti.com.ar/catalogo" },
    ],
  });

  return (
    <div>
      {/* SEO Meta Tags */}
      <SEOHead
        title="Catálogo de Propiedades - Nasuti Inmobiliaria"
        description="Catálogo completo de propiedades inmobiliarias en Marcos Juárez y la región. Casas, departamentos, terrenos, locales comerciales y más. Encuentra tu propiedad ideal."
        canonicalUrl="/catalogo"
        keywords={[
          "catálogo propiedades",
          "propiedades Marcos Juárez",
          "casas en venta",
          "departamentos",
          "terrenos",
          "locales comerciales",
          "inmobiliaria",
          "propiedades Córdoba",
          "venta propiedades",
          "alquiler propiedades",
        ]}
        ogImage="/img/logos/NombreYLogoNasutiInmobiliaria.png"
      />

      {/* Structured Data JSON-LD */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(collectionPageSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Breadcrumbs visuales */}
      <nav className="bg-gray-50 py-3 px-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link
              to="/"
              className="text-gray-500 hover:text-[#f0782c] transition-colors"
            >
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium" aria-current="page">
            Catálogo
          </li>
        </ol>
      </nav>

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
        <PropertyList properties={filteredProperties} filters={filters} />
      </main>
    </div>
  );
}

export default App;
