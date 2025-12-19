import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const SiteNavbar: React.FC = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Detectar si estamos en la página de login/admin
  const isLoginPage = pathname === "/admin";

  // Inicio está activo cuando estamos en "/" sin hash o con hash "#inicio"
  const isInicio =
    pathname === "/" && (!hash || hash === "" || hash === "#inicio");
  const isCatalogo =
    pathname.startsWith("/catalogo") || pathname.startsWith("/propiedad");
  const isQuienes = pathname === "/" && hash === "#quienes-somos";
  const isTrayectoria = pathname === "/" && hash === "#nuestra-trayectoria";
  const isContacto = pathname === "/" && hash === "#contacto";

  const linkBase =
    "text-white hover:text-gray-100 transition-all duration-200 px-3 py-1.5 rounded-lg";
  const activeMods = "text-white font-semibold bg-white/20 backdrop-blur-sm";

  const classes = (active: boolean) =>
    `${linkBase} ${active ? activeMods : ""}`;

  // Función para cerrar el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Función para hacer scroll a una sección con offset para el header sticky
  const scrollToSection = (hash: string) => {
    const element = document.querySelector(hash);
    if (element) {
      const headerHeight = 80; // Altura aproximada del header sticky
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Manejar clic en enlaces de sección
  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string
  ) => {
    e.preventDefault();
    handleLinkClick();

    // Si estamos en otra página, navegar a la página principal con el hash
    if (pathname !== "/") {
      window.location.href = `/${hash}`;
    } else {
      // Si ya estamos en la página principal, hacer scroll primero (con animación suave)
      scrollToSection(hash);
      // Actualizar el hash usando navigate para que React Router lo detecte sin interrumpir la animación
      setTimeout(() => {
        navigate(hash, { replace: true });
      }, 50);
    }
  };

  // Manejar scroll cuando la página carga con un hash en la URL
  useEffect(() => {
    if (hash && pathname === "/") {
      // Delay para asegurar que el DOM esté completamente renderizado
      setTimeout(() => {
        scrollToSection(hash);
      }, 500);
    }
  }, [hash, pathname]);

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
              src="/img/logos/LogoNasuti.png"
              alt="Nasuti Inmobiliaria Logo"
              className="h-12 w-auto"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Nasuti Inmobiliaria
            </h1>
          </div>

          {/* Navegación desktop - Ocultar en página de login */}
          {!isLoginPage && (
            <nav className="hidden md:flex space-x-4">
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
              <a
                href="/#quienes-somos"
                className={classes(isQuienes)}
                onClick={e => handleSectionClick(e, "#quienes-somos")}
              >
                Quiénes Somos
              </a>
              <a
                href="/#nuestra-trayectoria"
                className={classes(isTrayectoria)}
                onClick={e => handleSectionClick(e, "#nuestra-trayectoria")}
              >
                Nuestra Trayectoria
              </a>
              <a
                href="/#contacto"
                className={classes(isContacto)}
                onClick={e => handleSectionClick(e, "#contacto")}
              >
                Contacto
              </a>
            </nav>
          )}

          {/* Botón hamburguesa móvil - Ocultar en página de login */}
          {!isLoginPage && (
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
          )}
        </div>
      </div>

      {/* Menú móvil - Ocultar en página de login */}
      {!isLoginPage && (
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
              onClick={e => handleSectionClick(e, "#quienes-somos")}
            >
              Quiénes Somos
            </a>
            <a
              href="/#nuestra-trayectoria"
              className={`block py-2 px-4 rounded-lg ${classes(isTrayectoria)}`}
              onClick={e => handleSectionClick(e, "#nuestra-trayectoria")}
            >
              Nuestra Trayectoria
            </a>
            <a
              href="/#contacto"
              className={`block py-2 px-4 rounded-lg ${classes(isContacto)}`}
              onClick={e => handleSectionClick(e, "#contacto")}
            >
              Contacto
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteNavbar;
