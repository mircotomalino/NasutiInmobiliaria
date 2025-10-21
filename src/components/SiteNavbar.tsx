import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const SiteNavbar: React.FC = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isInicio = pathname === '/';
  const isCatalogo = pathname.startsWith('/catalogo') || pathname.startsWith('/propiedad');
  const isQuienes = pathname === '/' && hash === '#quienes-somos';
  const isContacto = pathname === '/' && hash === '#contacto';

  const linkBase = 'text-gray-600 hover:text-[#f0782c] transition-colors duration-200';
  const activeMods = 'text-[#f0782c] font-semibold';

  const classes = (active: boolean) => `${linkBase} ${active ? activeMods : ''}`;

  // Función para cerrar el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Función para manejar navegación a secciones con scroll suave
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    if (pathname === '/') {
      // Si ya estamos en la página principal, solo hacer scroll
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Si estamos en otra página, navegar primero y luego hacer scroll
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    
    handleLinkClick();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo y nombre - Clickeable */}
          <NavLink 
            to="/" 
            className="logo-container cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img src="/img/LogonNasuti.png" alt="Nasuti Inmobiliaria Logo" className="h-12 w-auto" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Nasuti Inmobiliaria</h1>
          </NavLink>

          {/* Navegación desktop */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={classes(isInicio)}
              onClick={() => {
                // Desplazar al tope siempre que se haga click en Inicio
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Inicio
            </NavLink>
            <NavLink to="/catalogo" className={classes(isCatalogo)}>
              Propiedades
            </NavLink>
            <a 
              href="/#quienes-somos" 
              className={classes(isQuienes)}
              onClick={(e) => handleSectionClick(e, 'quienes-somos')}
            >
              Quiénes Somos
            </a>
            <a 
              href="/#contacto" 
              className={classes(isContacto)}
              onClick={(e) => handleSectionClick(e, 'contacto')}
            >
              Contacto
            </a>
          </nav>

          {/* Botón hamburguesa móvil */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 pt-2 pb-4 space-y-3 bg-white border-t border-gray-100">
          <NavLink
            to="/"
            className={`block py-2 px-4 rounded-lg ${classes(isInicio)}`}
            onClick={() => {
              handleLinkClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/catalogo"
            className={`block py-2 px-4 rounded-lg ${classes(isCatalogo)}`}
            onClick={handleLinkClick}
          >
            Propiedades
          </NavLink>
          <a
            href="/#quienes-somos"
            className={`block py-2 px-4 rounded-lg ${classes(isQuienes)}`}
            onClick={(e) => handleSectionClick(e, 'quienes-somos')}
          >
            Quiénes Somos
          </a>
          <a
            href="/#contacto"
            className={`block py-2 px-4 rounded-lg ${classes(isContacto)}`}
            onClick={(e) => handleSectionClick(e, 'contacto')}
          >
            Contacto
          </a>
        </nav>
      </div>
    </header>
  );
};

export default SiteNavbar;


