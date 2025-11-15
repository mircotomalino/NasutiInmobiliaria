/**
 * Get the base API URL from environment variables
 * Falls back to localhost for development
 */
export function getApiBase(): string {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, '') + '/api';
}

/**
 * Get the base server URL (without /api) for direct image URLs
 * Falls back to localhost for development
 */
export function getServerBase(): string {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, '');
}

