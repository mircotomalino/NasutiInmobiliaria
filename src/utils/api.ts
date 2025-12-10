/**
 * Get the base API URL from environment variables
 * Falls back to relative path for same-origin requests
 */
export function getApiBase(): string {
  // Si hay una URL de API configurada explícitamente, usarla
  if (import.meta.env.VITE_API_URL) {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Remove trailing slash if present
    return apiUrl.replace(/\/$/, "") + "/api";
  }
  
  // En desarrollo, usar el proxy de Vite (ruta relativa)
  if (import.meta.env.DEV) {
    return "/api";
  }
  
  // En producción sin VITE_API_URL configurada, usar ruta relativa
  // Esto funciona si el backend está en el mismo dominio
  // Si el backend está en otro dominio (ej: Railway), configurar VITE_API_URL en Vercel
  if (typeof window !== "undefined") {
    // En producción, intentar usar el mismo origen
    return "/api";
  }
  
  return "/api";
}

/**
 * Get the base server URL (without /api) for direct image URLs
 * Falls back to current origin for same-origin requests
 */
export function getServerBase(): string {
  // Si hay una URL de API configurada explícitamente, usarla
  if (import.meta.env.VITE_API_URL) {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Remove trailing slash if present
    return apiUrl.replace(/\/$/, "");
  }
  
  // En desarrollo y producción, usar el origen actual si no hay URL configurada
  // Esto asume que el backend está en el mismo dominio
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  // Fallback para SSR (aunque no se usa en este proyecto)
  return "";
}
