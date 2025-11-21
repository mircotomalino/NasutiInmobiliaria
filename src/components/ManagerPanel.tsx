import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Home,
  Building,
  Store,
  Briefcase,
  TreePine,
  Square,
  Search,
  ExternalLink,
  Star,
  LogOut,
} from "lucide-react";
import {
  propertyStatuses,
  cities,
  patioOptions,
  garageOptions,
} from "../data/properties";
import {
  Property as PropertyType,
  PropertyStatus,
  PatioType,
  GarageType,
} from "../types";
import PropertyFormModal from "./PropertyFormModal";
import { getApiBase } from "../utils/api";

export interface Property
  extends Omit<
    PropertyType,
    | "id"
    | "publishedDate"
    | "imageUrl"
    | "province"
    | "latitude"
    | "longitude"
    | "featured"
    | "status"
  > {
  id?: number;
  street?: string;
  streetNumber?: string;
  neighborhood?: string;
  locality?: string;
  latitude?: number | null;
  longitude?: number | null;
  featured?: boolean;
  status?: PropertyStatus;
}

const ManagerPanel: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<
    Array<{ id?: number; url: string }>
  >([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Estados para filtros del manager
  const [managerFilters, setManagerFilters] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 0,
    bedrooms: "",
    type: "",
    status: "",
  });

  const propertyTypes = [
    { value: "casa", label: "Casa", icon: <Home className="w-4 h-4" /> },
    {
      value: "departamento",
      label: "Departamento",
      icon: <Building className="w-4 h-4" />,
    },
    {
      value: "oficina",
      label: "Oficina",
      icon: <Briefcase className="w-4 h-4" />,
    },
    { value: "local", label: "Local", icon: <Store className="w-4 h-4" /> },
    {
      value: "quinta",
      label: "Quinta",
      icon: <TreePine className="w-4 h-4" />,
    },
    {
      value: "terreno",
      label: "Terreno",
      icon: <Square className="w-4 h-4" />,
    },
  ];

  const API_BASE = getApiBase();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Efecto para aplicar filtros del manager
  useEffect(() => {
    let filtered = [...properties];

    // Filtro por búsqueda (nombre/título/dirección)
    if (managerFilters.search.trim()) {
      const searchTerm = managerFilters.search.toLowerCase();
      filtered = filtered.filter(
        property =>
          property.title.toLowerCase().includes(searchTerm) ||
          (property.street &&
            property.street.toLowerCase().includes(searchTerm)) ||
          (property.neighborhood &&
            property.neighborhood.toLowerCase().includes(searchTerm)) ||
          (property.locality &&
            property.locality.toLowerCase().includes(searchTerm)) ||
          property.city.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por precio mínimo
    if (managerFilters.minPrice > 0) {
      filtered = filtered.filter(
        property => property.price >= managerFilters.minPrice
      );
    }

    // Filtro por precio máximo
    if (managerFilters.maxPrice > 0) {
      filtered = filtered.filter(
        property => property.price <= managerFilters.maxPrice
      );
    }

    // Filtro por habitaciones
    if (managerFilters.bedrooms) {
      filtered = filtered.filter(
        property => property.bedrooms === parseInt(managerFilters.bedrooms)
      );
    }

    // Filtro por tipo
    if (managerFilters.type) {
      filtered = filtered.filter(
        property => property.type === managerFilters.type
      );
    }

    // Filtro por estado/disponibilidad
    if (managerFilters.status) {
      filtered = filtered.filter(
        property => property.status === managerFilters.status
      );
    }

    setFilteredProperties(filtered);
  }, [properties, managerFilters]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE}/properties`);
      const data = await response.json();
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Agregar nuevos archivos a los existentes (no reemplazar)
      setSelectedFiles(prev => [...prev, ...newFiles]);

      // Generar URLs de previsualización para los nuevos archivos
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);

      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
      e.target.value = "";
    }
  };

  // Función para eliminar una imagen existente
  const handleDeleteExistingImage = async (
    imageId: number | undefined,
    imageUrl: string
  ) => {
    if (!imageId || !editingProperty?.id) {
      // Si no hay ID, solo removemos de la vista (para imágenes nuevas que aún no se han guardado)
      setExistingImages(prev => prev.filter(img => img.url !== imageUrl));
      return;
    }

    if (!confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/properties/${editingProperty.id}/images/${imageId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remover la imagen de la lista de imágenes existentes
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
        alert("Imagen eliminada exitosamente");
      } else {
        console.error("Error deleting image");
        alert("Error al eliminar la imagen");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error de conexión al eliminar la imagen");
    }
  };

  // Función para remover una imagen nueva antes de subirla
  const handleRemoveNewImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Liberar el objeto URL
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProperty) {
      console.error("No hay propiedad para editar");
      return;
    }

    // Validar que las coordenadas sean requeridas
    if (!editingProperty.latitude || !editingProperty.longitude) {
      alert(
        "Las coordenadas son requeridas. Por favor, ingresa las coordenadas de la propiedad."
      );
      return;
    }

    console.log(
      "🚀 Iniciando creación/actualización de propiedad:",
      editingProperty
    );

    const formData = new FormData();

    // Agregar datos de la propiedad
    Object.entries(editingProperty).forEach(([key, value]) => {
      // Excluir solo: id e images
      if (key === "id" || key === "images") {
        return;
      }

      // Para valores null o undefined, enviar string vacío
      if (value === null || value === undefined) {
        formData.append(key, "");
        console.log(`📝 Agregando campo vacío: ${key} = ""`);
      } else {
        formData.append(key, value.toString());
        console.log(`📝 Agregando campo: ${key} = ${value}`);
      }
    });

    // Agregar archivos
    if (selectedFiles.length > 0) {
      console.log(`📸 Agregando ${selectedFiles.length} nueva(s) imagen(es)`);
      selectedFiles.forEach(file => {
        formData.append("images", file);
        console.log(
          `📁 Agregando archivo: ${file.name} (${(file.size / 1024).toFixed(
            2
          )} KB)`
        );
      });
    } else {
      console.log("ℹ️ No hay nuevas imágenes para agregar");
    }

    try {
      const url = editingProperty.id
        ? `${API_BASE}/properties/${editingProperty.id}`
        : `${API_BASE}/properties`;

      const method = editingProperty.id ? "PUT" : "POST";

      console.log(`🌐 Enviando ${method} a: ${url}`);

      const response = await fetch(url, {
        method,
        body: formData,
      });

      console.log(
        `📡 Respuesta del servidor: ${response.status} ${response.statusText}`
      );

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Propiedad creada/actualizada exitosamente:", result);

        // Limpiar las URLs de previsualización
        previewUrls.forEach(url => URL.revokeObjectURL(url));

        // Recargar la lista de propiedades
        await fetchProperties();

        // Cerrar el formulario de edición/creación
        handleCancel();

        // Mostrar mensaje de éxito
        const mensaje = isAdding
          ? "✅ Propiedad creada exitosamente"
          : "✅ Propiedad actualizada exitosamente";
        alert(mensaje);
      } else {
        const errorText = await response.text();
        console.error("❌ Error del servidor:", response.status, errorText);
        alert(
          `Error al guardar la propiedad: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("💥 Error de red:", error);
      alert(`Error de conexión: ${error}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta propiedad?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/properties/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProperties();
      } else {
        console.error("Error deleting property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/properties/${id}/featured`, {
        method: "PATCH",
      });

      if (response.ok) {
        await fetchProperties();
      } else {
        const errorData = await response.json();
        if (errorData.error && errorData.featuredProperties) {
          // Mostrar mensaje con las propiedades destacadas actuales
          const propertyNames = errorData.featuredProperties
            .map((p: any) => `• ${p.title}`)
            .join("\n");
          alert(
            `${errorData.error}:\n\n${propertyNames}\n\nDebes quitar una estrella antes de agregar otra.`
          );
        } else {
          alert("Error al actualizar el estado destacado de la propiedad");
        }
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
      alert("Error al actualizar el estado destacado de la propiedad");
    }
  };

  const handleEdit = async (property: Property) => {
    console.log("🔧 Iniciando edición de propiedad:", property);

    // Limpiar estado primero
    setEditingProperty(null);
    setIsAdding(false);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);

    // Pequeño delay para asegurar que el estado se limpie
    setTimeout(async () => {
      try {
        // Crear una copia limpia de la propiedad para editar
        const propertyToEdit: Property = {
          id: property.id,
          title: property.title || "",
          description: property.description || "",
          price:
            typeof property.price === "string"
              ? parseFloat(property.price)
              : property.price || 0,
          street: property.street || "",
          streetNumber: property.streetNumber || "",
          neighborhood: property.neighborhood || "",
          locality: property.locality || "",
          city: property.city || "Marcos Juárez",
          type: property.type || "casa",
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          area: property.area || 0,
          patio: property.patio || "No Tiene",
          garage: property.garage || "No Tiene",
          images: property.images || [],
          latitude: property.latitude
            ? parseFloat(property.latitude.toString())
            : null,
          longitude: property.longitude
            ? parseFloat(property.longitude.toString())
            : null,
        };

        console.log("✅ Propiedad preparada para editar:", propertyToEdit);

        // Cargar imágenes existentes con sus IDs desde el servidor
        if (property.id) {
          try {
            const imageResponse = await fetch(
              `${API_BASE}/properties/${property.id}/images`
            );

            if (imageResponse.ok) {
              const imagesData = await imageResponse.json();
              setExistingImages(imagesData);
              console.log("📸 Imágenes cargadas:", imagesData);
            } else {
              // Fallback: usar las URLs sin IDs
              const images =
                property.images?.map((url: string) => ({ url })) || [];
              setExistingImages(images);
            }
          } catch (error) {
            console.error("Error loading images:", error);
            // Usar las imágenes de la propiedad actual como fallback
            const images =
              property.images?.map((url: string) => ({ url })) || [];
            setExistingImages(images);
          }
        }

        setEditingProperty(propertyToEdit);
        setIsAdding(false);

        console.log("✅ Estado actualizado, haciendo scroll...");

        // Scroll hacia arriba para mostrar el formulario
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          console.log("✅ Scroll completado");
        }, 200);
      } catch (error) {
        console.error("❌ Error al editar propiedad:", error);
        alert(
          "Error al cargar la propiedad para editar. Por favor, inténtalo de nuevo."
        );
      }
    }, 50);
  };

  // Funciones para manejar filtros del manager
  const handleFilterChange = (key: string, value: string | number) => {
    setManagerFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setManagerFilters({
      search: "",
      minPrice: 0,
      maxPrice: 0,
      bedrooms: "",
      type: "",
      status: "",
    });
  };

  const handleAdd = () => {
    setEditingProperty({
      title: "",
      description: "",
      price: 0,
      street: "",
      streetNumber: "",
      neighborhood: "",
      locality: "",
      city: "Marcos Juárez",
      type: "casa",
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      patio: "No Tiene" as PatioType,
      garage: "No Tiene" as GarageType,
    });
    setIsAdding(true);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);
  };

  const handleCancel = () => {
    setEditingProperty(null);
    setIsAdding(false);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);

    // Liberar URLs de previsualización
    previewUrls.forEach(url => URL.revokeObjectURL(url));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con botón de logout */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-gray-600">
              Gestiona las propiedades de la inmobiliaria
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>

        {/* Botón Agregar */}
        {!isAdding && !editingProperty && (
          <div className="mb-6">
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Propiedad
            </button>
          </div>
        )}

        {/* Filtros del Manager */}
        {!isAdding && !editingProperty && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Filtrar Propiedades
              </h3>
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Buscador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por nombre o ciudad
                </label>
                <input
                  type="text"
                  placeholder="Buscar propiedades..."
                  value={managerFilters.search}
                  onChange={e => handleFilterChange("search", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filtro por precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de Precio (USD)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={managerFilters.minPrice || ""}
                    onChange={e =>
                      handleFilterChange(
                        "minPrice",
                        Number(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={managerFilters.maxPrice || ""}
                    onChange={e =>
                      handleFilterChange(
                        "maxPrice",
                        Number(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filtro por habitaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habitaciones
                </label>
                <select
                  value={managerFilters.bedrooms}
                  onChange={e => handleFilterChange("bedrooms", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  <option value="1">1 habitación</option>
                  <option value="2">2 habitaciones</option>
                  <option value="3">3 habitaciones</option>
                  <option value="4">4 habitaciones</option>
                  <option value="5">5+ habitaciones</option>
                </select>
              </div>

              {/* Filtro por tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Propiedad
                </label>
                <select
                  value={managerFilters.type}
                  onChange={e => handleFilterChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los tipos</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por disponibilidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilidad
                </label>
                <select
                  value={managerFilters.status}
                  onChange={e => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los estados</option>
                  {propertyStatuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contador de resultados */}
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  Mostrando {filteredProperties.length} de {properties.length}{" "}
                  propiedades
                </div>
              </div>
            </div>
          </div>
        )}

        <PropertyFormModal
          isOpen={isAdding || !!editingProperty}
          isAdding={isAdding}
          editingProperty={editingProperty}
          setEditingProperty={setEditingProperty}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onFileChange={handleFileChange}
          onDeleteExistingImage={handleDeleteExistingImage}
          onRemoveNewImage={handleRemoveNewImage}
          existingImages={existingImages}
          previewUrls={previewUrls}
          propertyTypes={propertyTypes}
          cities={cities}
          patioOptions={patioOptions}
          garageOptions={garageOptions}
        />

        {/* Lista de propiedades */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              Propiedades ({properties.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propiedad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map(property => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Link
                          to={`/propiedad/${property.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-900 hover:underline"
                        >
                          {property.title}
                        </Link>
                        <div className="text-sm text-gray-500">
                          {property.city}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {property.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(property.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.status === "disponible"
                            ? "bg-green-100 text-green-800"
                            : property.status === "vendida"
                            ? "bg-red-100 text-red-800"
                            : property.status === "reservada"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            property.id && handleToggleFeatured(property.id)
                          }
                          className={`${
                            property.featured
                              ? "text-yellow-500"
                              : "text-gray-400"
                          } hover:text-yellow-600 transition-colors`}
                          title={
                            property.featured
                              ? "Quitar de destacados"
                              : "Destacar en carrusel (máx. 3)"
                          }
                        >
                          <Star
                            className={`w-5 h-5 ${
                              property.featured ? "fill-yellow-500" : ""
                            }`}
                          />
                        </button>
                        <Link
                          to={`/propiedad/${property.id}`}
                          className="text-green-600 hover:text-green-900"
                          title="Ver página de la propiedad"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(property)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar propiedad"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            property.id && handleDelete(property.id)
                          }
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar propiedad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPanel;
