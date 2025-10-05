import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const SiteNavbar: React.FC = () => {
  const { pathname, hash } = useLocation();

  const isInicio = pathname === '/';
  const isCatalogo = pathname.startsWith('/catalogo') || pathname.startsWith('/propiedad');
  const isQuienes = pathname === '/' && hash === '#quienes-somos';
  const isContacto = pathname === '/' && hash === '#contacto';

  const linkBase = 'text-gray-600 hover:text-[#f0782c] transition-colors duration-200';
  const activeMods = 'text-[#f0782c] font-semibold';

  const classes = (active: boolean) => `${linkBase} ${active ? activeMods : ''}`;

  return (
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
            <a href="/#quienes-somos" className={classes(isQuienes)}>Quiénes Somos</a>
            <a href="/#contacto" className={classes(isContacto)}>Contacto</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default SiteNavbar;


