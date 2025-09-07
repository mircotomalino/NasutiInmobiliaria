import React, { useState, useEffect } from 'react';
import { sampleProperties } from '../data/properties';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Home,
  Building,
  Store,
  Briefcase,
  TreePine,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PropertyType, Property } from '../types';

const LandingPage: React.FC = () => {
  // Estado para el carrusel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  const API_BASE = 'http://localhost:3001/api';
  
  // Obtener propiedades destacadas desde la API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch(`${API_BASE}/properties`);
        const data = await response.json();
        // Filtrar propiedades disponibles y tomar las primeras 3
        const availableProperties = data.filter((p: Property) => p.status === 'disponible').slice(0, 3);
        setFeaturedProperties(availableProperties);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        // Fallback a propiedades estáticas si hay error
        const fallbackProperties = sampleProperties.filter(p => p.status === 'disponible').slice(0, 3);
        setFeaturedProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);
  
  // Función para obtener el ícono según el tipo de propiedad
  const getPropertyTypeIcon = (type: PropertyType) => {
    switch (type) {
      case 'casa':
        return <Home className="w-4 h-4" />;
      case 'departamento':
        return <Building className="w-4 h-4" />;
      case 'oficina':
        return <Briefcase className="w-4 h-4" />;
      case 'local':
        return <Store className="w-4 h-4" />;
      case 'quinta':
        return <TreePine className="w-4 h-4" />;
      case 'terreno':
        return <Square className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Funciones para el carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProperties.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProperties.length) % featuredProperties.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      {/* Esta será la landing page que actualmente está en index.html */}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo y nombre */}
              <div className="logo-container">
                <img src="/img/LogonNasuti.png" alt="Nasuti Inmobiliaria Logo" className="h-12 w-auto" />
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Nasuti Inmobiliaria</h1>
              </div>
              
              {/* Navegación desktop */}
              <nav className="hidden md:flex space-x-8">
                <a href="#inicio" className="text-gray-600 hover:text-[#f0782c] transition-colors duration-200">Inicio</a>
                <a href="/catalogo" className="text-gray-600 hover:text-[#f0782c] transition-colors duration-200">Propiedades</a>
                <a href="#quienes-somos" className="text-gray-600 hover:text-[#f0782c] transition-colors duration-200">Quiénes Somos</a>
                <a href="#contacto" className="text-gray-600 hover:text-[#f0782c] transition-colors duration-200">Contacto</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Sección Hero */}
        <section id="inicio" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#1F2937] mb-6">
                  60 Años de <span className="text-[#f0782c]">Experiencia</span> en el Mercado Inmobiliario
                </h2>
                <p className="text-xl text-[#6B7280] mb-8 leading-relaxed">
                  Desde 1964, somos una inmobiliaria de confianza que ha funcionado 
                  ininterrumpidamente, adaptándose a los cambios del mercado inmobiliario. 
                  Nuestro compromiso es brindar un servicio personalizado y profesional para 
                  encontrar la propiedad ideal para usted.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/catalogo" className="bg-[#f0782c] hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-center">
                    Ver Propiedades
                  </a>
                  <a href="#contacto" className="border-2 border-[#f0782c] text-[#f0782c] hover:bg-black hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-center">
                    Contactar
                  </a>
                </div>
              </div>
              
              <div className="relative">
                <img src="/img/portadaNasuti.png" alt="Inmobiliaria Durio" className="w-full h-auto rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Sección Propiedades Destacadas */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">Propiedades Destacadas</h2>
              <div className="w-24 h-1 bg-[#f0782c] mx-auto rounded-full mb-4"></div>
              <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
                Descubre nuestras mejores propiedades disponibles
              </p>
            </div>

            {/* Estado de carga */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-xl text-gray-600">Cargando propiedades destacadas...</div>
              </div>
            ) : featuredProperties.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-xl text-gray-600">No hay propiedades disponibles en este momento</div>
              </div>
            ) : (
              <>
                {/* Carrusel de propiedades */}
            <div className="relative">
              {/* Contenedor del carrusel */}
              <div className="overflow-hidden rounded-xl shadow-lg">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredProperties.map((property) => (
                    <div key={property.id} className="w-full flex-shrink-0">
                      <div className="bg-white p-6 lg:p-8 h-[600px] flex flex-col">
                        {/* Imagen de la propiedad */}
                        <div className="relative mb-6">
                          <img
                            src={property.images && property.images.length > 0 ? property.images[0] : property.imageUrl || '/img/default-property.jpg'}
                            alt={property.title}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium text-[#1F2937]">
                              {getPropertyTypeIcon(property.type)}
                              <span className="capitalize">{property.type}</span>
                            </div>
                            <div className="bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white">
                              Disponible
                            </div>
                          </div>
                        </div>
                        
                        {/* Información de la propiedad */}
                        <div className="flex-1 flex flex-col">
                          <div className="mb-4">
                            <h3 className="text-xl lg:text-2xl font-bold text-[#1F2937] mb-2 overflow-hidden" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {property.title}
                            </h3>
                            <div className="text-xl lg:text-2xl font-bold text-[#f0782c] mb-3">
                              {formatPrice(property.price)}
                            </div>
                          </div>
                          
                          {/* Descripción limitada */}
                          <p className="text-[#6B7280] text-sm leading-relaxed mb-4 flex-1 overflow-hidden" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {property.description}
                          </p>
                          
                          {/* Ubicación */}
                          <div className="flex items-center gap-2 text-[#6B7280] mb-3">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{property.address}, {property.city}</span>
                          </div>
                          
                          {/* Características */}
                          <div className="flex flex-wrap gap-3 mb-4">
                            {property.bedrooms > 0 && (
                              <div className="flex items-center gap-1 text-[#6B7280] text-sm">
                                <Bed className="w-4 h-4" />
                                <span>{property.bedrooms} hab.</span>
                              </div>
                            )}
                            {property.bathrooms > 0 && (
                              <div className="flex items-center gap-1 text-[#6B7280] text-sm">
                                <Bath className="w-4 h-4" />
                                <span>{property.bathrooms} baños</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-[#6B7280] text-sm">
                              <Square className="w-4 h-4" />
                              <span>{property.area}m²</span>
                            </div>
                          </div>
                          
                          {/* Fecha de publicación */}
                          <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-4">
                            <Calendar className="w-3 h-3" />
                            <span>Publicado: {formatDate(property.publishedDate)}</span>
                          </div>
                          
                          {/* Botones de acción */}
                          <div className="flex gap-3 mt-auto">
                            <a 
                              href="/catalogo" 
                              className="flex-1 bg-[#1F2937] hover:bg-black text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-center text-sm"
                            >
                              Ver Detalles
                            </a>
                            <a 
                              href="#contacto" 
                              className="flex-1 bg-[#f0782c] hover:bg-black text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-center text-sm"
                            >
                              Consultar
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Controles del carrusel */}
              {featuredProperties.length > 1 && (
                <>
                  {/* Botones de navegación */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-[#1F2937]" />
                  </button>
                  
                  {/* Indicadores */}
                  <div className="flex justify-center mt-8 gap-2">
                    {featuredProperties.map((_, slideIndex) => (
                      <button
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          slideIndex === currentSlide 
                            ? 'bg-[#f0782c] scale-125' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Botón para ver todas las propiedades */}
            <div className="text-center mt-12">
              <a 
                href="/catalogo" 
                className="inline-flex items-center gap-2 bg-[#1F2937] hover:bg-black text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
              >
                Ver todas las propiedades
                <ChevronRight className="w-5 h-5" />
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
              <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Quiénes Somos</h2>
              <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
                Conozca a los socios y gerentes que lideran nuestra empresa
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="text-center">
                <div className="mb-6">
                  <img src="/img/GastonPerfil.jpeg" alt="Gastón - Socio" className="w-48 h-48 rounded-full mx-auto shadow-lg" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1F2937] mb-2">Gastón</h3>
                <p className="text-[#6B7280]">Socio y Gerente</p>
              </div>
              
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-48 h-48 rounded-full mx-auto shadow-lg bg-[#6B7280] flex items-center justify-center text-white text-4xl font-bold">
                    S
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-[#1F2937] mb-2">Sergio</h3>
                <p className="text-[#6B7280]">Socio y Gerente</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Historia */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">Nuestra Historia</h2>
              <div className="w-24 h-1 bg-[#f0782c] mx-auto rounded-full"></div>
            </div>
            
            {/* Timeline visual */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#f0782c] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">1964</span>
                </div>
                <h3 className="text-[#1F2937] text-lg font-semibold mb-2">Fundación</h3>
                <p className="text-[#6B7280] text-sm">Nacimiento de la empresa</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-[#f0782c] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">60+</span>
                </div>
                <h3 className="text-[#1F2937] text-lg font-semibold mb-2">Años de Experiencia</h3>
                <p className="text-[#6B7280] text-sm">Funcionamiento ininterrumpido</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-[#f0782c] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">2024</span>
                </div>
                <h3 className="text-[#1F2937] text-lg font-semibold mb-2">Presente</h3>
                <p className="text-[#6B7280] text-sm">Liderazgo moderno</p>
              </div>
            </div>
            
            {/* Contenido principal */}
            <div className="bg-white p-8 lg:p-12 rounded-xl shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-[#1F2937] text-2xl font-bold mb-4">El Legado de "El Viejo"</h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-[#6B7280] leading-relaxed">
                  Hace más de <span className="text-[#f0782c] font-semibold">60 años</span>, nuestro fundador, a quien todos conocían cariñosamente como <span className="text-[#f0782c] font-semibold">"el viejo"</span>, 
                  tuvo la visión de crear una inmobiliaria que se distinguiera por su <span className="text-[#1F2937] font-semibold">honestidad</span>, 
                  <span className="text-[#1F2937] font-semibold"> profesionalismo</span> y <span className="text-[#1F2937] font-semibold">compromiso</span> con los clientes.
                </p>
                
                <p className="text-lg text-[#6B7280] leading-relaxed">
                  Desde entonces, nuestra empresa ha funcionado <span className="text-[#f0782c] font-semibold">ininterrumpidamente</span>, 
                  adaptándose a los cambios del mercado y manteniendo siempre los valores 
                  que nos inculcó nuestro fundador: <span className="text-[#1F2937] font-semibold">transparencia</span>, <span className="text-[#1F2937] font-semibold">dedicación</span> y <span className="text-[#1F2937] font-semibold">excelencia</span> en el servicio.
                </p>
                
                <p className="text-lg text-[#6B7280] leading-relaxed">
                  Hoy, bajo la dirección de <span className="text-[#f0782c] font-semibold">Gastón y Sergio</span>, continuamos honrando esa herencia 
                  y trabajando para mantener el <span className="text-[#1F2937] font-semibold">legado de confianza</span> que construyó "el viejo" 
                  hace más de seis décadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Contacto */}
        <section id="contacto" className="py-20 bg-[#1F2937] text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Contáctanos</h2>
              <div className="w-24 h-1 bg-[#f0782c] mx-auto rounded-full mb-4"></div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                ¿Listo para encontrar tu próxima propiedad? Estamos aquí para ayudarte en cada paso del camino.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Información de contacto */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-[#f0782c]">Información de Contacto</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Oficina Principal</h4>
                        <p className="text-gray-300">Av. San Martín 1234, Centro</p>
                        <p className="text-gray-300">Buenos Aires, Argentina</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Teléfono</h4>
                        <p className="text-gray-300">+54 11 1234-5678</p>
                        <p className="text-gray-300">+54 11 9876-5432</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Email</h4>
                        <p className="text-gray-300">info@nasutiinmobiliaria.com</p>
                        <p className="text-gray-300">ventas@nasutiinmobiliaria.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Horarios de Atención</h4>
                        <p className="text-gray-300">Lunes a Viernes: 9:00 - 18:00</p>
                        <p className="text-gray-300">Sábados: 9:00 - 13:00</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Redes sociales */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-[#f0782c]">Síguenos</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center hover:bg-[#e65a1a] transition-colors duration-200">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center hover:bg-[#e65a1a] transition-colors duration-200">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-12 h-12 bg-[#f0782c] rounded-full flex items-center justify-center hover:bg-[#e65a1a] transition-colors duration-200">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Formulario de contacto */}
              <div className="bg-white text-gray-800 p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-[#1F2937]">Envíanos un Mensaje</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                    <select
                      id="asunto"
                      name="asunto"
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
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f0782c] focus:border-transparent"
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[#f0782c] hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                    Enviar Mensaje
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
                © 2024 Nasuti Inmobiliaria. Todos los derechos reservados. | 60 años de experiencia en el mercado inmobiliario.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
