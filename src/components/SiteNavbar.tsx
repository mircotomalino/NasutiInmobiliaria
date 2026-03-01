import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "../icons";

const SECTION_IDS = [
  "inicio",
  "como-trabajamos",
  "quienes-somos",
  "nuestra-trayectoria",
  "contacto",
] as const;

const SiteNavbar: React.FC = () => {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const isLoginPage = pathname === "/admin";
  const isOnHome = pathname === "/";

  const resolvedSection = isOnHome ? (activeSection || "inicio") : null;
  const isInicio = resolvedSection === "inicio";
  const isCatalogo =
    pathname.startsWith("/catalogo") || pathname.startsWith("/propiedad");
  const isComoTrabajamos = resolvedSection === "como-trabajamos";
  const isQuienes = resolvedSection === "quienes-somos";
  const isTrayectoria = resolvedSection === "nuestra-trayectoria";
  const isContacto = resolvedSection === "contacto";

  const linkBase =
    "text-white font-medium hover:text-gray-100 transition-all duration-200 px-2 py-1.5 rounded-lg";
  const activeMods = "text-white font-bold bg-white/20 backdrop-blur-sm";

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

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    handleLinkClick();

    if (pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      scrollToSection(`#${sectionId}`);
    }
  };

  // Scroll to section when landing on home with state.scrollTo (e.g. from menu on another page)
  useEffect(() => {
    const scrollTo = state && typeof state === "object" && "scrollTo" in state ? (state as { scrollTo: string }).scrollTo : null;
    if (!scrollTo || !isOnHome) return;
    const id = setTimeout(() => {
      scrollToSection(`#${scrollTo}`);
      navigate(".", { replace: true, state: {} });
    }, 300);
    return () => clearTimeout(id);
  }, [isOnHome, state, navigate]);

  // Detect which section is in view on scroll (home only)
  useEffect(() => {
    if (!isOnHome) return;

    const HEADER_OFFSET = 120;

    const updateActiveSection = () => {
      // Section that contains the line just below the header is active; else last section that has passed that line
      let current: string = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= HEADER_OFFSET) current = id;
      }
      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, [isOnHome]);

  return (
    <header className="bg-[#f0782c] shadow-sm sticky top-0 z-50 overflow-visible">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 overflow-visible">
          <div
            className="logo-container cursor-pointer hover:opacity-80 transition-opacity flex items-center overflow-visible"
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src="/img/logos/logo_blanco_horizontal.png"
              alt="Nasuti Inmobiliaria Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Navegación desktop - Ocultar en página de login */}
          {!isLoginPage && (
            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/"
                className={classes(isInicio)}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Inicio
              </NavLink>
              <a
                href="/"
                className={classes(isComoTrabajamos)}
                onClick={e => handleSectionClick(e, "como-trabajamos")}
              >
                Cómo trabajamos
              </a>
              <a
                href="/"
                className={classes(isQuienes)}
                onClick={e => handleSectionClick(e, "quienes-somos")}
              >
                Quiénes somos
              </a>
              <a
                href="/"
                className={classes(isTrayectoria)}
                onClick={e => handleSectionClick(e, "nuestra-trayectoria")}
              >
                Trayectoria
              </a>
              <a
                href="/"
                className={classes(isContacto)}
                onClick={e => handleSectionClick(e, "contacto")}
              >
                Contacto
              </a>
              <span className="mx-2 h-5 w-px bg-white/40" aria-hidden />
              <NavLink
                to="/catalogo"
                className={`rounded-lg px-3 py-1.5 font-bold transition-all duration-200 ${
                  isCatalogo
                    ? "bg-white text-[#f0782c]"
                    : "bg-white/90 text-[#f0782c] hover:bg-white"
                }`}
              >
                Propiedades
              </NavLink>
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
          <nav className="px-4 pt-2 pb-4 space-y-1 bg-[#f0782c] border-t border-[#e06a1f]">
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
            <a
              href="/"
              className={`block py-2 px-4 rounded-lg ${classes(isComoTrabajamos)}`}
              onClick={e => handleSectionClick(e, "como-trabajamos")}
            >
              Cómo trabajamos
            </a>
            <a
              href="/"
              className={`block py-2 px-4 rounded-lg ${classes(isQuienes)}`}
              onClick={e => handleSectionClick(e, "quienes-somos")}
            >
              Quiénes Somos
            </a>
            <a
              href="/"
              className={`block py-2 px-4 rounded-lg ${classes(isTrayectoria)}`}
              onClick={e => handleSectionClick(e, "nuestra-trayectoria")}
            >
              Nuestra trayectoria
            </a>
            <a
              href="/"
              className={`block py-2 px-4 rounded-lg ${classes(isContacto)}`}
              onClick={e => handleSectionClick(e, "contacto")}
            >
              Contacto
            </a>
            <div className="my-2 border-t border-white/30" />
            <NavLink
              to="/catalogo"
              className={`block py-2.5 px-4 rounded-lg font-bold ${
                isCatalogo ? "bg-white text-[#f0782c]" : "bg-white/90 text-[#f0782c]"
              }`}
              onClick={handleLinkClick}
            >
              Propiedades
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteNavbar;
