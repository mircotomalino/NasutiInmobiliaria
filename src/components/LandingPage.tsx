import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Property } from "../types";
import { handlePropertyWhatsAppContact } from "../services/whatsapp";
import { getPropertyTypeIcon } from "../utils/propertyUtils";
import { getApiBase } from "../utils/api";

const LandingPage: React.FC = () => {
  // Número de WhatsApp del propietario (configurable)
  const OWNER_PHONE = "5493513459377"; // Número de WhatsApp de Nasuti Inmobiliaria

  // Estado para el carrusel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el formulario de contacto
  const [formData, setFormData] = useState({
    nombre: "",
    asunto: "",
    mensaje: "",
  });

  const API_BASE = getApiBase();

  // Obtener propiedades destacadas desde la API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        // Usar el nuevo endpoint específico para propiedades destacadas
        const response = await fetch(`${API_BASE}/properties/featured`);
        const data = await response.json();

        // Asegurarse de que data sea un array
        if (Array.isArray(data)) {
          setFeaturedProperties(data);
        } else {
          console.error("Featured properties data is not an array:", data);
          setFeaturedProperties([]);
        }
      } catch (error) {
        console.error("Error fetching featured properties:", error);
        // Fallback a array vacío si hay error
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  // Funciones para manejar el formulario de contacto
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construir el mensaje para WhatsApp
    const message = `Hola Nasuti! Mi nombre es: ${formData.nombre}
Te hablo para ${formData.asunto || "Consulta general"}
${formData.mensaje}`;

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Construir la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${OWNER_PHONE}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva ventana
    window.open(whatsappUrl, "_blank");

    // Limpiar el formulario después del envío
    setFormData({
      nombre: "",
      asunto: "",
      mensaje: "",
    });
  };

  // Funciones para el carrusel
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredProperties.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      prev => (prev - 1 + featuredProperties.length) % featuredProperties.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      {/* Esta será la landing page que actualmente está en index.html */}
      <div className="min-h-screen bg-gray-50">
        {/* Header removido: ahora lo provee SiteNavbar dentro del Layout */}

        {/* Sección Hero */}
        <section id="inicio" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#1F2937] mb-6">
                  60 Años de <span className="text-[#f0782c]">Experiencia</span>{" "}
                  en el Mercado Inmobiliario
                </h2>
                <p className="text-xl text-[#6B7280] mb-8 leading-relaxed">
                  Desde 1964, somos una inmobiliaria de confianza que ha
                  funcionado ininterrumpidamente, adaptándose a los cambios del
                  mercado inmobiliario. Nuestro compromiso es brindar un
                  servicio personalizado y profesional para encontrar la
                  propiedad ideal para usted.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/catalogo"
                    className="bg-[#f0782c] hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-center"
                  >
                    Ver Propiedades
                  </a>
                  <a
                    href="#contacto"
                    className="border-2 border-[#f0782c] text-[#f0782c] hover:bg-black hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-center"
                  >
                    Contactar
                  </a>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/img/institucionales/GastonYSergio1.jpg"
                  alt="Gastón y Sergio - Nasuti Inmobiliaria"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sección Propiedades Destacadas */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">
                Propiedades Destacadas
              </h2>
              <div className="w-24 h-1 bg-[#f0782c] mx-auto rounded-full"></div>
            </div>

            {/* Estado de carga */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-xl text-gray-600">
                  Cargando propiedades destacadas...
                </div>
              </div>
            ) : featuredProperties.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-4">
                    ¿Tienes propiedades que quieres vender?
                  </div>
                  <div className="text-lg text-[#6B7280] mb-6">
                    Comunícate con nosotros así nos encargamos
                  </div>
                  <a
                    href="#contacto"
                    className="inline-block bg-[#f0782c] hover:bg-[#e06a1f] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
                  >
                    Contactar Ahora
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* Carrusel de propiedades */}
                <div className="relative">
                  {/* Contenedor del carrusel */}
                  <div className="overflow-hidden rounded-xl shadow-lg">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                      }}
                    >
                      {featuredProperties.map(property => (
                        <div key={property.id} className="w-full flex-shrink-0">
                          <div className="bg-white rounded-lg lg:rounded-xl overflow-hidden shadow-xl">
                            {/* Imagen de la propiedad - Responsive */}
                            <div className="relative">
                              <img
                                src={
                                  property.images && property.images.length > 0
                                    ? property.images[0]
                                    : property.imageUrl ||
                                      "/img/default-property.jpg"
                                }
                                alt={property.title}
                                className="w-full h-[19rem] object-cover"
                              />
                              {/* Badges - Responsive */}
                              <div className="absolute top-3 left-3 lg:top-4 lg:left-4 flex flex-col gap-2">
                                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 lg:px-3 lg:py-1 rounded-full flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-medium text-[#1F2937]">
                                  <span className="w-4 h-4 lg:w-auto lg:h-auto">
                                    {getPropertyTypeIcon(property.type)}
                                  </span>
                                  <span className="capitalize">
                                    {property.type}
                                  </span>
                                </div>
                                <div
                                  className={`backdrop-blur-sm px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-medium text-white ${
                                    property.status === "disponible"
                                      ? "bg-green-500/90"
                                      : property.status === "reservada"
                                      ? "bg-yellow-500/90"
                                      : property.status === "vendida"
                                      ? "bg-red-500/90"
                                      : "bg-gray-500/90"
                                  }`}
                                >
                                  {property.status === "disponible"
                                    ? "Disponible"
                                    : property.status === "reservada"
                                    ? "Reservada"
                                    : property.status === "vendida"
                                    ? "Vendida"
                                    : property.status}
                                </div>
                              </div>
                            </div>

                            {/* Información de la propiedad - Responsive */}
                            <div className="p-4 sm:p-6 lg:p-8 px-12 sm:px-16 lg:px-20">
                              <div className="mb-3 lg:mb-4">
                                <h3
                                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F2937] mb-2 lg:mb-3 overflow-hidden text-center"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {property.title}
                                </h3>
                              </div>

                              {/* Ubicación destacada - Responsive */}
                              <div className="flex items-start gap-2 mb-3 lg:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0782c] flex-shrink-0 mt-0.5" />
                                <div>
                                  {property.address && (
                                    <div className="font-semibold text-sm sm:text-base text-[#1F2937]">
                                      {property.address}
                                    </div>
                                  )}
                                  <div className="font-semibold text-sm sm:text-base text-[#1F2937]">
                                    {property.city}
                                  </div>
                                </div>
                              </div>

                              {/* Descripción limitada - Responsive */}
                              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 lg:mb-6 line-clamp-3">
                                {property.description}
                              </p>

                              {/* Características en tarjetas - Responsive */}
                              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 lg:mb-6">
                                {property.bedrooms > 0 && (
                                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg text-center">
                                    <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 mx-auto mb-1" />
                                    <div className="text-base sm:text-lg font-bold text-[#1F2937]">
                                      {property.bedrooms}
                                    </div>
                                    <div className="text-xs hidden sm:block text-gray-600">
                                      Habitaciones
                                    </div>
                                    <div className="text-xs sm:hidden text-gray-600">
                                      Hab
                                    </div>
                                  </div>
                                )}
                                {property.bathrooms > 0 && (
                                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg text-center">
                                    <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 mx-auto mb-1" />
                                    <div className="text-base sm:text-lg font-bold text-[#1F2937]">
                                      {property.bathrooms}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      Baños
                                    </div>
                                  </div>
                                )}
                                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg text-center">
                                  <Square className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 mx-auto mb-1" />
                                  <div className="text-base sm:text-lg font-bold text-[#1F2937]">
                                    {property.area}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    m²
                                  </div>
                                </div>
                              </div>

                              {/* Botones de acción - Responsive */}
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <Link
                                  to={`/propiedad/${property.id}`}
                                  className="flex-1 bg-[#f0782c] hover:bg-[#e06a1f] text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 text-center text-sm sm:text-base shadow-md hover:shadow-lg"
                                >
                                  Ver Detalles
                                </Link>
                                <button
                                  onClick={() =>
                                    handlePropertyWhatsAppContact(property)
                                  }
                                  className="flex-1 bg-[#f0782c] hover:bg-[#e06a1f] text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 text-center text-sm sm:text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                  <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                  </svg>
                                  Contactar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Controles del carrusel - Responsive */}
                  {featuredProperties.length > 1 && (
                    <>
                      {/* Botones de navegación - Responsive */}
                      <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-gray-800/30 backdrop-blur-sm hover:bg-[#f0782c] text-white p-2 sm:p-3 rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-10"
                      >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>

                      <button
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-gray-800/30 backdrop-blur-sm hover:bg-[#f0782c] text-white p-2 sm:p-3 rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-10"
                      >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>

                      {/* Indicadores - Responsive */}
                      <div className="flex justify-center mt-6 sm:mt-8 gap-1.5 sm:gap-2">
                        {featuredProperties.map((_, slideIndex) => (
                          <button
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`rounded-full transition-all duration-300 ${
                              slideIndex === currentSlide
                                ? "w-6 sm:w-8 h-2.5 sm:h-3 bg-[#f0782c]"
                                : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-300 hover:bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Botón para ver todas las propiedades - Responsive */}
                <div className="text-center mt-8 sm:mt-12">
                  <a
                    href="/catalogo"
                    className="inline-flex items-center gap-2 bg-[#1F2937] hover:bg-black text-white font-bold py-3 px-6 sm:py-4 sm:px-10 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">
                      Ver todas las propiedades
                    </span>
                    <span className="sm:hidden">Ver todas</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Sección Quiénes Somos */}
        <section id="quienes-somos" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1F2937] mb-4">
                Quiénes Somos
              </h2>
              <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
                Conozca a los integrantes de nuestra empresa
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mb-6">
                  <img
                    src="/img/institucionales/SergioNasuti.jpg"
                    alt="Sergio - Socio"
                    className="w-40 h-40 lg:w-48 lg:h-48 rounded-full mx-auto shadow-lg object-cover object-top"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                  Sergio
                </h3>
                <p className="text-[#6B7280] text-sm">Socio y Gerente</p>
              </div>

              <div className="text-center">
                <div className="mb-6">
                  <img
                    src="/img/institucionales/GastonDurio.jpg"
                    alt="Gastón - Socio"
                    className="w-40 h-40 lg:w-48 lg:h-48 rounded-full mx-auto shadow-lg object-cover object-top"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                  Gastón
                </h3>
                <p className="text-[#6B7280] text-sm">Socio y Gerente</p>
              </div>

              <div className="text-center">
                <div className="mb-6">
                  <img
                    src="/img/institucionales/CamilaBuzzi.jpg"
                    alt="Camila - Equipo"
                    className="w-40 h-40 lg:w-48 lg:h-48 rounded-full mx-auto shadow-lg object-cover object-top"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                  Camila
                </h3>
                <p className="text-[#6B7280] text-sm">Equipo</p>
              </div>

              <div className="text-center">
                <div className="mb-6">
                  <img
                    src="/img/institucionales/AliciaNasuti.jpg"
                    alt="Alicia - Equipo"
                    className="w-40 h-40 lg:w-48 lg:h-48 rounded-full mx-auto shadow-lg object-cover object-top"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                  Alicia
                </h3>
                <p className="text-[#6B7280] text-sm">Equipo</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">
                Nuestra Historia
              </h2>
              <div className="w-24 h-1 bg-[#f0782c] mx-auto rounded-full"></div>
            </div>

            {/* Timeline visual */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#f0782c] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">1964</span>
                </div>
                <h3 className="text-[#1F2937] text-lg font-semibold mb-2">
                  Fundación
                </h3>
                <p className="text-[#6B7280] text-sm">
                  Nacimiento de la empresa
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-[#f0782c] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">60+</span>
                </div>
                <h3 className="text-[#1F2937] text-lg font-semibold mb-2">
                  Años de Experiencia
                </h3>
                <p className="text-[#6B7280] text-sm">
                  Funcionamiento ininterrumpido
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-[#f0782c] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">2024</span>
                </div>
                <h3 className="text-[#1F2937] text-lg font-semibold mb-2">
                  Presente
                </h3>
                <p className="text-[#6B7280] text-sm">Liderazgo moderno</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="grid md:grid-cols-[2fr_3fr] gap-4 lg:gap-6 min-h-[26rem] lg:h-[550px]">
                <div className="relative">
                  <img
                    src="/img/institucionales/InmobiliariaLateral1.jpg"
                    alt="Inmobiliaria Nasuti"
                    className="w-full h-full object-cover rounded-l-xl md:rounded-l-xl rounded-t-xl md:rounded-t-none"
                  />
                </div>

                <div className="pt-6 pb-8 px-4 sm:px-6 md:px-8 lg:pt-8 lg:pb-12 lg:px-12 flex flex-col justify-start overflow-y-auto">
                  <div className="mb-2">
                    <h3 className="text-[#1F2937] text-xl lg:text-2xl font-bold mb-1">
                      El Legado de Erminio Nasuti
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-[#374151] leading-relaxed">
                      La inmobiliaria Nasuti nació de la visión y el compromiso
                      de un hombre con valores inquebrantables: el{" "}
                      <span className="text-[#f0782c] font-semibold">
                        Sr. Erminio Nasuti
                      </span>
                      . Fundador de la inmobiliaria con mayor trayectoria y
                      experiencia en Marcos Juárez y la región, Erminio marcó un
                      hito en el sector desde{" "}
                      <span className="text-[#f0782c] font-semibold">1964</span>
                      . Con un carácter decidido y un enfoque centrado en las
                      <span className="text-[#1F2937] font-semibold">
                        {" "}
                        relaciones personales
                      </span>{" "}
                      por encima de cualquier negocio, se ganó el respeto y el
                      prestigio de toda la comunidad.
                    </p>

                    <p className="text-sm text-[#374151] leading-relaxed">
                      Su legado de{" "}
                      <span className="text-[#1F2937] font-semibold">
                        integridad
                      </span>{" "}
                      y{" "}
                      <span className="text-[#1F2937] font-semibold">
                        profesionalismo
                      </span>{" "}
                      continúa vivo en la ciudad y ha sido heredado de manera
                      innata por su hijo,
                      <span className="text-[#f0782c] font-semibold">
                        {" "}
                        Sergio Nasuti
                      </span>
                      , actual socio de la inmobiliaria. Sergio mantiene con
                      orgullo la identidad que distingue a la empresa,
                      consolidando su reputación como un referente en el
                      mercado.
                    </p>

                    <p className="text-sm text-[#374151] leading-relaxed">
                      A lo largo de los años, gracias al esfuerzo y la
                      dedicación de ambos, Inmobiliaria Nasuti ha concretado
                      <span className="text-[#f0782c] font-semibold">
                        {" "}
                        más de 750 operaciones inmobiliarias
                      </span>
                      , alcanzando un nivel de cierre de ventas sin precedentes.
                      Cada transacción se realiza con la máxima profesionalidad,
                      asegurando el cumplimiento de todas las formalidades
                      legales correspondientes.
                    </p>

                    <p className="text-sm text-[#374151] leading-relaxed">
                      Con sólidos cimientos basados en el{" "}
                      <span className="text-[#1F2937] font-semibold">
                        profesionalismo
                      </span>{" "}
                      y la{" "}
                      <span className="text-[#1F2937] font-semibold">
                        integridad
                      </span>
                      , Inmobiliaria Nasuti se proyecta hacia el futuro con el
                      compromiso de concretar operaciones fructíferas y
                      satisfactorias para sus clientes, manteniendo siempre los
                      valores que la han definido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Contacto */}
        <section id="contacto" className="py-20 bg-[#1F2937] text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Contáctanos
              </h2>
              <div className="w-24 h-1 bg-[#f0782c] mx-auto rounded-full mb-4"></div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                ¿Listo para encontrar tu próxima propiedad? Estamos aquí para
                ayudarte en cada paso del camino.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Información de contacto */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-[#f0782c]">
                    Información de Contacto
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">
                          Oficina Principal
                        </h4>
                        <p className="text-gray-300">
                          25 de Mayo nro. 347, esquina 1ro. de Mayo
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Teléfono</h4>
                        <p className="text-gray-300">+54 9 3472 52-1436</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Email</h4>
                        <p className="text-gray-300">inmnasuti@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">
                          Horarios de Atención
                        </h4>
                        <p className="text-gray-300">
                          Lunes a Viernes de 8:30 hs a 12:30 hs
                        </p>
                        <p className="text-gray-300">y de 14 hs a 17 hs</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Redes sociales */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-[#f0782c]">
                    Síguenos
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.instagram.com/nasuti_inm/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center hover:bg-[#e65a1a] transition-colors duration-200"
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulario de contacto */}
              <div className="bg-white text-gray-800 p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-[#1F2937]">
                  Envíanos un Mensaje
                </h3>
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="asunto"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Asunto
                    </label>
                    <select
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="compra">Comprar propiedad</option>
                      <option value="venta">Vender propiedad</option>
                      <option value="alquiler">Alquilar propiedad</option>
                      <option value="tasacion">Tasación</option>
                      <option value="consulta">Consulta general</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="mensaje"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mensaje
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={4}
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#f0782c] hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    Enviar por WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer simple */}
        <footer className="bg-black text-white py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-300">
                © 2025 Nasuti Inmobiliaria. Todos los derechos reservados. | 60
                años de experiencia en el mercado inmobiliario.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
