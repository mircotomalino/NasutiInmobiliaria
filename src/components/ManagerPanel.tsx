import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Home,
  Building,
  Store,
  Briefcase,
  TreePine,
  Square,
  ArrowLeft,
  Search
} from 'lucide-react';
import { propertyStatuses, cities, patioOptions, garageOptions } from '../data/properties';
import { Property as PropertyType, PropertyType as PropType, PropertyStatus, PatioType, GarageType } from '../types';

interface Property extends Omit<PropertyType, 'id' | 'publishedDate' | 'imageUrl' | 'province'> {
  id?: number;
}

const ManagerPanel: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const propertyTypes = [
    { value: 'casa', label: 'Casa', icon: <Home className="w-4 h-4" /> },
    { value: 'departamento', label: 'Departamento', icon: <Building className="w-4 h-4" /> },
    { value: 'oficina', label: 'Oficina', icon: <Briefcase className="w-4 h-4" /> },
    { value: 'local', label: 'Local', icon: <Store className="w-4 h-4" /> },
    { value: 'quinta', label: 'Quinta', icon: <TreePine className="w-4 h-4" /> },
    { value: 'terreno', label: 'Terreno', icon: <Square className="w-4 h-4" /> }
  ];



  const API_BASE = 'http://localhost:3001/api';

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE}/properties`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProperty) return;

    const formData = new FormData();
    
    // Agregar datos de la propiedad
    Object.entries(editingProperty).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'images') {
        formData.append(key, value.toString());
      }
    });

    // Agregar archivos
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const url = editingProperty.id 
        ? `${API_BASE}/properties/${editingProperty.id}`
        : `${API_BASE}/properties`;
      
      const method = editingProperty.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData
      });

      if (response.ok) {
        await fetchProperties();
        handleCancel();
      } else {
        console.error('Error saving property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchProperties();
      } else {
        console.error('Error deleting property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingProperty({
      title: '',
      description: '',
      price: 0,
      address: '',
      city: '',
      type: 'casa',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      patio: 'No Tiene' as PatioType,
      garage: 'No Tiene' as GarageType,
      status: 'disponible'
    });
    setIsAdding(true);
    setSelectedFiles([]);
  };

  const handleCancel = () => {
    setEditingProperty(null);
    setIsAdding(false);
    setSelectedFiles([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
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
        {/* Header */}
        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Gestión</h1>
              <p className="text-gray-600 mt-2">Administra las propiedades del catálogo</p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ir al Inicio
              </a>
              <a
                href="/catalogo"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Search className="w-4 h-4 mr-2" />
                Ver Catálogo
              </a>
            </div>
          </div>
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

        {/* Formulario */}
        {(isAdding || editingProperty) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {isAdding ? 'Agregar Nueva Propiedad' : 'Editar Propiedad'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProperty?.title || ''}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, title: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProperty?.price || ''}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, price: parseFloat(e.target.value) || 0} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    required
                    value={editingProperty?.type || 'casa'}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, type: e.target.value as PropType} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    required
                    value={editingProperty?.status || 'disponible'}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, status: e.target.value as PropertyStatus} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {propertyStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProperty?.address || ''}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, address: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <select
                    required
                    value={editingProperty?.city || ''}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, city: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar ciudad</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Habitaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habitaciones
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProperty?.bedrooms || ''}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, bedrooms: parseInt(e.target.value) || 0} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Baños */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baños
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProperty?.bathrooms || ''}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, bathrooms: parseInt(e.target.value) || 0} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Área */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProperty?.area || ''}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, area: parseInt(e.target.value) || 0} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Patio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patio
                  </label>
                  <select
                    value={editingProperty?.patio || 'No Tiene'}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, patio: e.target.value as PatioType} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {patioOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Garage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Garage
                  </label>
                  <select
                    value={editingProperty?.garage || 'No Tiene'}
                    onChange={(e) => setEditingProperty(prev => prev ? {...prev, garage: e.target.value as GarageType} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {garageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingProperty?.description || ''}
                  onChange={(e) => setEditingProperty(prev => prev ? {...prev, description: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subida de imágenes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imágenes
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {selectedFiles.length} archivo(s) seleccionado(s)
                    </p>
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isAdding ? 'Crear' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de propiedades */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Propiedades ({properties.length})</h2>
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
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {property.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.address}, {property.city}
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.status === 'disponible' ? 'bg-green-100 text-green-800' :
                        property.status === 'vendida' ? 'bg-red-100 text-red-800' :
                        property.status === 'reservada' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(property)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => property.id && handleDelete(property.id)}
                          className="text-red-600 hover:text-red-900"
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
