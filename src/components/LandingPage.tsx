import React from 'react';

const LandingPage: React.FC = () => {
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
                <a href="#propiedades" className="text-gray-600 hover:text-[#f0782c] transition-colors duration-200">Propiedades</a>
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
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Nuestra Historia</h2>
            </div>
            
            <div className="bg-gray-50 p-8 lg:p-12 rounded-lg shadow-sm">
              <div className="prose prose-lg mx-auto text-center">
                <p className="text-xl text-[#6B7280] leading-relaxed mb-6">
                  Hace más de 60 años, nuestro fundador, a quien todos conocían cariñosamente como "el viejo", 
                  tuvo la visión de crear una inmobiliaria que se distinguiera por su honestidad, 
                  profesionalismo y compromiso con los clientes.
                </p>
                
                <p className="text-xl text-[#6B7280] leading-relaxed mb-6">
                  Desde entonces, nuestra empresa ha funcionado ininterrumpidamente, 
                  adaptándose a los cambios del mercado y manteniendo siempre los valores 
                  que nos inculcó nuestro fundador: transparencia, dedicación y excelencia en el servicio.
                </p>
                
                <p className="text-xl text-[#6B7280] leading-relaxed">
                  Hoy, bajo la dirección de Gastón y Sergio, continuamos honrando esa herencia 
                  y trabajando para mantener el legado de confianza que construyó "el viejo" 
                  hace más de seis décadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contacto" className="bg-[#1F2937] text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Contacto</h2>
              <p className="text-gray-300">
                ¿Listo para encontrar tu próxima propiedad? Contáctanos hoy mismo.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
