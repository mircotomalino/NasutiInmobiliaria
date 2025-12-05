/**
 * Get the base API URL from environment variables
 * Falls back to localhost for development
 */
export function getApiBase(): string {
  // En desarrollo, usar el proxy de Vite (ruta relativa)
  // En producción, usar la URL completa
  if (import.meta.env.DEV) {
    return "/api";
  }
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, "") + "/api";
}

/**
 * Get the base server URL (without /api) for direct image URLs
 * Falls back to localhost for development
 */
export function getServerBase(): string {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, "");
}
