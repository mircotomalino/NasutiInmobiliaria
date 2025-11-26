import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const SiteNavbar: React.FC = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Detectar si estamos en la página de login/admin
  const isLoginPage = pathname === "/admin";

  const isInicio = pathname === "/";
  const isCatalogo =
    pathname.startsWith("/catalogo") || pathname.startsWith("/propiedad");
  const isQuienes = pathname === "/" && hash === "#quienes-somos";
  const isContacto = pathname === "/" && hash === "#contacto";

  const linkBase =
    "text-white hover:text-gray-100 transition-colors duration-200";
  const activeMods = "text-white font-semibold underline";

  const classes = (active: boolean) =>
    `${linkBase} ${active ? activeMods : ""}`;

  // Función para cerrar el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#f0782c] shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo y nombre - Clickeable */}
          <div
            className="logo-container cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-3"
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src="/img/LogoNasuti.png"
              alt="Nasuti Inmobiliaria Logo"
              className="h-12 w-auto"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Nasuti Inmobiliaria
            </h1>
          </div>

          {/* Navegación desktop - Ocultar en página de login */}
          {!isLoginPage && (
            <nav className="hidden md:flex space-x-8">
              <NavLink
                to="/"
                className={classes(isInicio)}
                onClick={() => {
                  // Desplazar al tope siempre que se haga click en Inicio
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Inicio
              </NavLink>
              <NavLink to="/catalogo" className={classes(isCatalogo)}>
                Propiedades
              </NavLink>
              <a href="/#quienes-somos" className={classes(isQuienes)}>
                Quiénes Somos
              </a>
              <a href="/#contacto" className={classes(isContacto)}>
                Contacto
              </a>
            </nav>
          )}

          {/* Botón hamburguesa móvil - Ocultar en página de login */}
          {!isLoginPage && (
<<<<<<< HEAD
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#e06a1f] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
=======
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
>>>>>>> c16f63724e36497d3436f8ecf89b8affb376f040
          )}
        </div>
      </div>

      {/* Menú móvil - Ocultar en página de login */}
      {!isLoginPage && (
<<<<<<< HEAD
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 pt-2 pb-4 space-y-3 bg-[#f0782c] border-t border-[#e06a1f]">
          <NavLink
            to="/"
            className={`block py-2 px-4 rounded-lg ${classes(isInicio)}`}
            onClick={() => {
              handleLinkClick();
              window.scrollTo({ top: 0, behavior: "smooth" });
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
            onClick={handleLinkClick}
          >
            Quiénes Somos
          </a>
          <a
            href="/#contacto"
            className={`block py-2 px-4 rounded-lg ${classes(isContacto)}`}
            onClick={handleLinkClick}
          >
            Contacto
          </a>
        </nav>
      </div>
=======
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="px-4 pt-2 pb-4 space-y-3 bg-white border-t border-gray-100">
            <NavLink
              to="/"
              className={`block py-2 px-4 rounded-lg ${classes(isInicio)}`}
              onClick={() => {
                handleLinkClick();
                window.scrollTo({ top: 0, behavior: "smooth" });
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
              onClick={handleLinkClick}
            >
              Quiénes Somos
            </a>
            <a
              href="/#contacto"
              className={`block py-2 px-4 rounded-lg ${classes(isContacto)}`}
              onClick={handleLinkClick}
            >
              Contacto
            </a>
          </nav>
        </div>
>>>>>>> c16f63724e36497d3436f8ecf89b8affb376f040
      )}
    </header>
  );
};

export default SiteNavbar;
