import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Trees,
  Car,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Property } from "../types";
import PropertyMap from "./PropertyMap";
import { handlePropertyWhatsAppContact } from "../services/whatsapp";
import { getPropertyTypeIcon } from "../utils/propertyUtils";
import { getApiBase } from "../utils/api";
import SEOHead from "./SEOHead";
import { generatePropertySchema } from "../utils/schemaMarkup";

const PropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const API_BASE = getApiBase();

  useEffect(() => {
    if (id) {
      fetchProperty(id);
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      const response = await fetch(`${API_BASE}/properties/${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        console.error("Property not found");
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar el carrusel de imágenes
  const nextImage = () => {
    const images = property?.images || [];
    if (images.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = property?.images || [];
    if (images.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Cargando propiedad...</div>
      </div>
    );
  }

  // Helper para formatear coordenadas que pueden venir como string o number
  const formatCoordinate = (value: number | string | undefined | null) => {
    if (value === null || value === undefined) return null;
    const num =
      typeof value === "number" ? value : parseFloat(String(value).trim());
    if (Number.isNaN(num)) return null;
    return num.toFixed(6);
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Propiedad no encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            La propiedad que buscas no existe o ha sido eliminada.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#f0782c] hover:bg-[#e06a1f] text-white px-6 py-3 rounded-lg font-semibold"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const latitudeFormatted = formatCoordinate(property.latitude);
  const longitudeFormatted = formatCoordinate(property.longitude);
  const hasValidCoordinates =
    latitudeFormatted !== null && longitudeFormatted !== null;
  const hasMultipleImages = images.length > 1;

  // Datos para SEO
  const BASE_URL = "https://inmobiliarianasuti.com.ar";
  const propertyUrl = `${BASE_URL}/propiedad/${property.id}`;
  const propertyImage =
    images.length > 0
      ? images[0].startsWith("http")
        ? images[0]
        : `${BASE_URL}${images[0]}`
      : property.imageUrl
        ? property.imageUrl.startsWith("http")
          ? property.imageUrl
          : `${BASE_URL}${property.imageUrl}`
        : `${BASE_URL}/img/default-property.jpg`;

  // Generar título y descripción para SEO
  const seoTitle = `${property.title} - Nasuti Inmobiliaria`;
  const seoDescription =
    property.description && property.description.trim()
      ? `${property.description.substring(0, 150)}...`
      : `${property.type.charAt(0).toUpperCase() + property.type.slice(1)} en ${property.city} - ${property.area}m² - $${property.price.toLocaleString("es-AR")}`;

  // Generar keywords dinámicos
  const seoKeywords = [
    property.type,
    property.city,
    "inmobiliaria",
    "propiedad",
    "venta",
    property.status === "disponible" ? "disponible" : "",
    property.bedrooms > 0 ? `${property.bedrooms} habitaciones` : "",
    property.bathrooms > 0 ? `${property.bathrooms} baños` : "",
    "Nasuti Inmobiliaria",
  ].filter(Boolean);

  // Generar schema JSON-LD para la propiedad
  const propertySchema = generatePropertySchema({
    name: property.title,
    description: property.description || seoDescription,
    url: propertyUrl,
    image: propertyImage,
    offers: {
      price: property.price.toString(),
      priceCurrency: "ARS",
      availability:
        property.status === "disponible"
          ? "https://schema.org/InStock"
          : property.status === "reservada"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/SoldOut",
      url: propertyUrl,
    },
    address: {
      ...(property.address && { streetAddress: property.address }),
      addressLocality: property.city,
      addressRegion: "Córdoba",
      addressCountry: "AR",
    },
    ...(hasValidCoordinates && {
      geo: {
        latitude: parseFloat(latitudeFormatted!),
        longitude: parseFloat(longitudeFormatted!),
      },
    }),
    ...(property.bedrooms > 0 && { numberOfRooms: property.bedrooms }),
    ...(property.bathrooms > 0 && {
      numberOfBathroomsTotal: property.bathrooms,
    }),
    ...(property.coveredArea && property.coveredArea > 0 && {
      floorSize: {
        value: property.coveredArea,
        unitText: "m²",
      },
    }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={`/propiedad/${property.id}`}
        keywords={seoKeywords}
        ogImage={propertyImage}
        ogType="product"
      />

      {/* Structured Data JSON-LD */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(propertySchema)}
        </script>
      </Helmet>
      {/* Botón de navegación */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      </div>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Carrusel de imágenes */}
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {hasMultipleImages && (
                  <>
                    {/* Botón anterior */}
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
                    </button>

                    {/* Botón siguiente */}
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
                    </button>

                    {/* Indicadores */}
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Contador */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <img
                src={property.imageUrl || "/img/default-property.jpg"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Información de la propiedad */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Título y badges */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getPropertyTypeIcon(property.type)}
                  <span className="capitalize">{property.type}</span>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === "disponible"
                      ? "bg-green-100 text-green-800"
                      : property.status === "reservada"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {property.status === "disponible"
                    ? "Disponible"
                    : property.status === "reservada"
                      ? "Reservada"
                      : "Vendida"}
                </div>
              </div>
            </div>

            {/* Grid de información */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Columna izquierda */}
              <div>
                {/* Descripción */}
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    Descripción
                  </h3>
                  <p className="text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
                    {property.description}
                  </p>
                </div>

                {/* Ubicación */}
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    Ubicación
                  </h3>
                  <div className="flex items-start gap-3 text-gray-700 mb-4">
                    <MapPin className="w-5 h-5 mt-1 text-[#f0782c]" />
                    <div>
                      {property.address && (
                        <p className="font-medium">{property.address}</p>
                      )}
                      <p className="font-medium">{property.city}</p>
                      {hasValidCoordinates && (
                        <p className="text-sm text-gray-500 mt-1">
                          Coordenadas: {latitudeFormatted}, {longitudeFormatted}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mapa de la propiedad */}
                  {hasValidCoordinates ? (
                    <PropertyMap
                      latitude={latitudeFormatted!}
                      longitude={longitudeFormatted!}
                      title={property.title}
                      className="mt-4"
                    />
                  ) : (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Esta propiedad no tiene coordenadas configuradas. Por
                        favor, agrega las coordenadas desde el panel de
                        administración.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="flex flex-col">
                {/* Características */}
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    Características
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Bed className="w-5 h-5 text-[#f0782c]" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {property.bedrooms}
                          </p>
                          <p className="text-sm text-gray-600">Habitaciones</p>
                        </div>
                      </div>
                    )}

                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Bath className="w-5 h-5 text-[#f0782c]" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {property.bathrooms}
                          </p>
                          <p className="text-sm text-gray-600">Baños</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Square className="w-5 h-5 text-[#f0782c]" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {property.area} m²
                        </p>
                        <p className="text-sm text-gray-600">Terreno</p>
                      </div>
                    </div>

                    {property.coveredArea && property.coveredArea > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Square className="w-5 h-5 text-[#f0782c]" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {property.coveredArea} m²
                          </p>
                          <p className="text-sm text-gray-600">
                            Superficie Cubierta
                          </p>
                        </div>
                      </div>
                    )}

                    {property.patio && property.patio !== "No Tiene" && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Trees className="w-5 h-5 text-[#f0782c]" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {property.patio}
                          </p>
                          <p className="text-sm text-gray-600">Patio</p>
                        </div>
                      </div>
                    )}

                    {property.garage && property.garage !== "No Tiene" && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Car className="w-5 h-5 text-[#f0782c]" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {property.garage}
                          </p>
                          <p className="text-sm text-gray-600">Garage</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón de contacto */}
                <div className="bg-gradient-to-r from-[#f0782c] to-[#e06a1f] p-4 sm:p-6 rounded-xl text-white mt-auto mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">
                    ¿Te interesa esta propiedad?
                  </h3>
                  <p className="mb-4 text-orange-100">
                    Contáctanos para más información, precios y para coordinar
                    una visita.
                  </p>
                  <button
                    onClick={() =>
                      property && handlePropertyWhatsAppContact(property)
                    }
                    className="inline-block w-full bg-white text-[#f0782c] font-semibold py-3 px-6 rounded-lg text-center hover:bg-gray-100 transition-colors"
                  >
                    Contactar Ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón para compartir */}
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: property.title,
                  text: `Mira esta propiedad: ${property.title}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copiado al portapapeles");
              }
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base"
          >
            Compartir Propiedad
          </button>
        </div>
      </main>
    </div>
  );
};

export default PropertyPage;
