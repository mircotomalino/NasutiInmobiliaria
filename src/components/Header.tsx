import React from 'react';
import { Search, Home } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <header>
      <div className="header-container">
        <div className="header-content">
          
          {/* Logo y Título */}
          <div className="header-logo-section">
            <div className="logo-container">
              <img 
                src="/img/LogonNasuti.png" 
                alt="Logo Nasuti Inmobiliaria" 
                className="header-logo"
              />
            </div>
            
            <div className="header-title">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Catálogo de Propiedades
              </h1>
            </div>
          </div>
          
          {/* Buscador y Botón de Inicio */}
          <div className="search-section">
            {/* Buscador */}
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar propiedades..."
                className="search-input"
              />
            </div>
            
            {/* Botón para ir a inicio */}
            <a 
              href="/" 
              className="home-button"
              title="Ir a página de inicio"
            >
              <Home className="w-5 h-5" />
              <span className="home-text">Inicio</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 