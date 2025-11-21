import React, { useEffect, useRef, useState } from "react";
import { X, Save, ImagePlus, Trash2 } from "lucide-react";
import SmartAddressInput from "./SmartAddressInput";
import ConfirmDialog from "./ConfirmDialog";
import { PropertyType as PropType, PatioType, GarageType } from "../types";
import { getServerBase } from "../utils/api";
import { Property } from "./ManagerPanel";

interface PropertyFormModalProps {
  isOpen: boolean;
  isAdding: boolean;
  editingProperty: Property | null;
  setEditingProperty: React.Dispatch<React.SetStateAction<Property | null>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteExistingImage: (
    imageId: number | undefined,
    imageUrl: string
  ) => void;
  onRemoveNewImage: (index: number) => void;
  existingImages: Array<{ id?: number; url: string }>;
  previewUrls: string[];
  propertyTypes: Array<{ value: string; label: string }>;
  cities: string[];
  patioOptions: string[];
  garageOptions: string[];
}

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  isAdding,
  editingProperty,
  setEditingProperty,
  onSubmit,
  onCancel,
  onFileChange,
  onDeleteExistingImage,
  onRemoveNewImage,
  existingImages,
  previewUrls,
  propertyTypes,
  cities,
  patioOptions,
  garageOptions,
}) => {
  const SERVER_BASE = getServerBase();
  const initialPropertyRef = useRef<Property | null>(null);
  const initialImagesRef = useRef<Array<{ id?: number; url: string }>>([]);
  const initialPreviewUrlsRef = useRef<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<(() => void) | null>(null);

  // Guardar el estado inicial cuando se abre el modal
  useEffect(() => {
    if (isOpen && editingProperty) {
      initialPropertyRef.current = JSON.parse(JSON.stringify(editingProperty));
      initialImagesRef.current = JSON.parse(JSON.stringify(existingImages));
      initialPreviewUrlsRef.current = JSON.parse(JSON.stringify(previewUrls));
    }
  }, [isOpen, editingProperty?.id]);

  // Función para detectar si hay cambios
  const hasChanges = (): boolean => {
    if (!editingProperty || !initialPropertyRef.current) {
      return false;
    }

    const current = editingProperty;
    const initial = initialPropertyRef.current;

    // Comparar campos principales
    if (
      current.title !== initial.title ||
      current.description !== initial.description ||
      current.price !== initial.price ||
      current.street !== initial.street ||
      current.streetNumber !== initial.streetNumber ||
      current.neighborhood !== initial.neighborhood ||
      current.locality !== initial.locality ||
      current.city !== initial.city ||
      current.type !== initial.type ||
      current.bedrooms !== initial.bedrooms ||
      current.bathrooms !== initial.bathrooms ||
      current.area !== initial.area ||
      current.patio !== initial.patio ||
      current.garage !== initial.garage ||
      current.latitude !== initial.latitude ||
      current.longitude !== initial.longitude
    ) {
      return true;
    }

    // Verificar si hay nuevas imágenes o imágenes eliminadas
    if (
      previewUrls.length > 0 ||
      existingImages.length !== initialImagesRef.current.length
    ) {
      return true;
    }

    // Verificar si se eliminaron imágenes existentes
    const initialImageIds = new Set(
      initialImagesRef.current.map(img => img.id)
    );
    const currentImageIds = new Set(existingImages.map(img => img.id));
    if (initialImageIds.size !== currentImageIds.size) {
      return true;
    }

    return false;
  };

  // Función para manejar el cierre con confirmación
  const handleCancel = () => {
    if (hasChanges()) {
      setPendingCancel(() => onCancel);
      setShowConfirmDialog(true);
    } else {
      onCancel();
    }
  };

  // Función para confirmar el cierre
  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    if (pendingCancel) {
      pendingCancel();
      setPendingCancel(null);
    }
  };

  // Función para cancelar el cierre
  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
    setPendingCancel(null);
  };

  if (!isOpen || !editingProperty) {
    return null;
  }

  return (
    <>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="¿Estás seguro que querés salir?"
        message="Se van a perder todos los cambios que no guardaste."
        confirmText="Sí, salir"
        cancelText="No, quedarme"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelDialog}
      />
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleCancel}
      >
        <div
          className="bg-white rounded-lg shadow-xl p-6 relative z-20 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isAdding ? "Agregar Nueva Propiedad" : "Editar Propiedad"}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Primera fila: Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                required
                value={editingProperty?.title || ""}
                onChange={e =>
                  setEditingProperty(prev =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  required
                  value={editingProperty?.type || "casa"}
                  onChange={e =>
                    setEditingProperty(prev =>
                      prev
                        ? { ...prev, type: e.target.value as PropType }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio (USD) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editingProperty?.price ?? 0}
                  onChange={e =>
                    setEditingProperty(prev =>
                      prev
                        ? {
                            ...prev,
                            price: parseFloat(e.target.value) || 0,
                          }
                        : null
                    )
                  }
                  className="w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <select
                  required
                  value={editingProperty?.city || "Marcos Juárez"}
                  onChange={e =>
                    setEditingProperty(prev =>
                      prev ? { ...prev, city: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campos de Dirección */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Dirección
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calle
                  </label>
                  <input
                    type="text"
                    value={editingProperty?.street || ""}
                    onChange={e =>
                      setEditingProperty(prev =>
                        prev ? { ...prev, street: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Av. San Martín"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número
                  </label>
                  <input
                    type="text"
                    value={editingProperty?.streetNumber || ""}
                    onChange={e =>
                      setEditingProperty(prev =>
                        prev ? { ...prev, streetNumber: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barrio
                  </label>
                  <input
                    type="text"
                    value={editingProperty?.neighborhood || ""}
                    onChange={e =>
                      setEditingProperty(prev =>
                        prev ? { ...prev, neighborhood: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Centro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localidad
                  </label>
                  <input
                    type="text"
                    value={editingProperty?.locality || ""}
                    onChange={e =>
                      setEditingProperty(prev =>
                        prev ? { ...prev, locality: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Marcos Juárez"
                  />
                </div>
              </div>
            </div>

            {/* Coordenadas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coordenadas *
              </label>
              <SmartAddressInput
                value={
                  editingProperty?.latitude && editingProperty?.longitude
                    ? `${editingProperty.latitude}, ${editingProperty.longitude}`
                    : ""
                }
                onChange={() => {
                  // El componente maneja el parsing de coordenadas internamente
                  // Los cambios se manejan a través de onCoordinatesChange
                }}
                onCoordinatesChange={(lat, lng) => {
                  setEditingProperty(prev =>
                    prev
                      ? {
                          ...prev,
                          latitude: lat,
                          longitude: lng,
                        }
                      : null
                  );
                }}
                placeholder="Coordenadas (ej: -31.4201, -64.1888)"
                showMapPreview={true}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habitaciones
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProperty?.bedrooms ?? 1}
                  onChange={e =>
                    setEditingProperty(prev =>
                      prev
                        ? {
                            ...prev,
                            bedrooms: parseInt(e.target.value) || 0,
                          }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Baños
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProperty?.bathrooms ?? 1}
                  onChange={e =>
                    setEditingProperty(prev =>
                      prev
                        ? {
                            ...prev,
                            bathrooms: parseInt(e.target.value) || 0,
                          }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProperty?.area ?? 0}
                  onChange={e =>
                    setEditingProperty(prev =>
                      prev
                        ? { ...prev, area: parseInt(e.target.value) || 0 }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patio
                </label>
                <select
                  value={editingProperty?.patio || "No Tiene"}
                  onChange={e =>
                    setEditingProperty(prev =>
                      prev
                        ? { ...prev, patio: e.target.value as PatioType }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10"
                >
                  {patioOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Garage
                </label>
                <select
                  value={editingProperty?.garage || "No Tiene"}
                  onChange={e =>
                    setEditingProperty(prev =>
                      prev
                        ? { ...prev, garage: e.target.value as GarageType }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10"
                >
                  {garageOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                required
                rows={4}
                value={editingProperty?.description || ""}
                onChange={e =>
                  setEditingProperty(prev =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gestión de imágenes */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Imágenes de la Propiedad
              </label>

              {/* Imágenes existentes */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Imágenes actuales
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={`${SERVER_BASE}${image.url}`}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onDeleteExistingImage(image.id, image.url)
                          }
                          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          title="Eliminar imagen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nuevas imágenes a subir */}
              {previewUrls.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Nuevas imágenes a agregar
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={url}
                          alt={`Nueva imagen ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveNewImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          title="Quitar imagen"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Nueva
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón para agregar más imágenes */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <ImagePlus className="w-12 h-12 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Agregar imágenes
                    </span>
                    <span className="text-xs text-gray-500">
                      Haz clic aquí o arrastra archivos
                    </span>
                  </div>
                </label>
              </div>

              {existingImages.length === 0 && previewUrls.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  No hay imágenes cargadas. Agrega al menos una imagen para
                  mostrar la propiedad.
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isAdding ? "Crear" : "Guardar"}
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
      </div>
    </>
  );
};

export default PropertyFormModal;
