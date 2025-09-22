// Servicio de geocoding con soporte para Nominatim (gratuito) y Mapbox (premium)

interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
  importance?: number;
  boundingbox?: string[];
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface MapboxResult {
  id: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  place_type: string[];
  relevance: number;
  properties?: {
    address?: string;
    category?: string;
  };
  context?: Array<{
    id: string;
    text: string;
    wikidata?: string;
  }>;
}

// Configuración de APIs
const GEOCODING_CONFIG = {
  nominatim: {
    baseUrl: 'https://nominatim.openstreetmap.org/search',
    params: {
      format: 'json',
      limit: 5,
      countrycodes: 'ar', // Solo Argentina
      addressdetails: 1,
      dedupe: 1
    }
  },
  mapbox: {
    baseUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    // Token se obtiene de process.env.VITE_MAPBOX_TOKEN
  }
};

// Detectar si Mapbox está disponible
export const isMapboxAvailable = (): boolean => {
  return !!import.meta.env.VITE_MAPBOX_TOKEN;
};

// Obtener el token de Mapbox
export const getMapboxToken = (): string | null => {
  return import.meta.env.VITE_MAPBOX_TOKEN || null;
};

// Búsqueda con Nominatim (OpenStreetMap)
const searchWithNominatim = async (query: string): Promise<GeocodingResult[]> => {
  try {
    const params = new URLSearchParams({
      ...GEOCODING_CONFIG.nominatim.params,
      q: query
    });

    const response = await fetch(`${GEOCODING_CONFIG.nominatim.baseUrl}?${params}`, {
      headers: {
        'User-Agent': 'NasutiInmobiliaria/1.0 (contact@nasutiinmobiliaria.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const results: GeocodingResult[] = await response.json();
    
    // Filtrar y mejorar resultados
    return results
      .filter(result => result.lat && result.lon && result.display_name)
      .map(result => ({
        ...result,
        lat: parseFloat(result.lat).toString(),
        lon: parseFloat(result.lon).toString()
      }))
      .sort((a, b) => (b.importance || 0) - (a.importance || 0));
  } catch (error) {
    console.error('Error searching with Nominatim:', error);
    throw new Error('Error al buscar direcciones con Nominatim');
  }
};

// Búsqueda con Mapbox
const searchWithMapbox = async (query: string): Promise<GeocodingResult[]> => {
  const token = getMapboxToken();
  if (!token) {
    throw new Error('Mapbox token no configurado');
  }

  try {
    const params = new URLSearchParams({
      access_token: token,
      country: 'AR', // Solo Argentina
      limit: '5',
      types: 'address,poi,place,locality,neighborhood',
      language: 'es'
    });

    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${GEOCODING_CONFIG.mapbox.baseUrl}/${encodedQuery}.json?${params}`
    );

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();
    const results: MapboxResult[] = data.features || [];

    // Convertir resultados de Mapbox al formato estándar
    return results
      .filter(result => result.center && result.place_name)
      .map(result => {
        const [lng, lat] = result.center;
        return {
          display_name: result.place_name,
          lat: lat.toString(),
          lon: lng.toString(),
          place_id: parseInt(result.id.replace(/\D/g, '')) || Math.random(),
          importance: result.relevance,
          address: {
            road: result.properties?.address,
            city: result.context?.find(c => c.id.includes('place'))?.text,
            state: result.context?.find(c => c.id.includes('region'))?.text,
            country: result.context?.find(c => c.id.includes('country'))?.text
          }
        };
      })
      .sort((a, b) => (b.importance || 0) - (a.importance || 0));
  } catch (error) {
    console.error('Error searching with Mapbox:', error);
    throw new Error('Error al buscar direcciones con Mapbox');
  }
};

// Función principal de búsqueda con fallback automático
export const searchAddress = async (query: string): Promise<{
  results: GeocodingResult[];
  provider: 'mapbox' | 'nominatim';
  fallback?: boolean;
}> => {
  if (!query.trim()) {
    return { results: [], provider: 'nominatim' };
  }

  // Intentar primero con Mapbox si está disponible
  if (isMapboxAvailable()) {
    try {
      console.log('🔍 Buscando con Mapbox...');
      const results = await searchWithMapbox(query);
      
      // Si Mapbox no devuelve resultados, hacer fallback a Nominatim
      if (results.length === 0) {
        console.log('⚠️ Mapbox sin resultados, usando Nominatim como fallback');
        const fallbackResults = await searchWithNominatim(query);
        return {
          results: fallbackResults,
          provider: 'nominatim',
          fallback: true
        };
      }

      console.log(`✅ Mapbox: ${results.length} resultados encontrados`);
      return { results, provider: 'mapbox' };
    } catch (error) {
      console.warn('⚠️ Error con Mapbox, usando Nominatim como fallback:', error);
      
      try {
        const fallbackResults = await searchWithNominatim(query);
        return {
          results: fallbackResults,
          provider: 'nominatim',
          fallback: true
        };
      } catch (fallbackError) {
        console.error('❌ Error con ambos servicios:', fallbackError);
        throw new Error('No se pudo buscar la dirección. Intenta nuevamente.');
      }
    }
  }

  // Usar Nominatim directamente si Mapbox no está disponible
  console.log('🔍 Buscando con Nominatim...');
  try {
    const results = await searchWithNominatim(query);
    console.log(`✅ Nominatim: ${results.length} resultados encontrados`);
    return { results, provider: 'nominatim' };
  } catch (error) {
    console.error('❌ Error con Nominatim:', error);
    throw new Error('No se pudo buscar la dirección. Verifica tu conexión a internet.');
  }
};

// Función para geocodificación inversa (coordenadas -> dirección)
export const reverseGeocode = async (lat: number, lng: number): Promise<{
  address: string;
  provider: 'mapbox' | 'nominatim';
}> => {
  if (isMapboxAvailable()) {
    try {
      const token = getMapboxToken()!;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&language=es`
      );

      if (response.ok) {
        const data = await response.json();
        const result = data.features?.[0];
        if (result) {
          return {
            address: result.place_name,
            provider: 'mapbox'
          };
        }
      }
    } catch (error) {
      console.warn('Error con Mapbox reverse geocoding:', error);
    }
  }

  // Fallback a Nominatim
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'NasutiInmobiliaria/1.0 (contact@nasutiinmobiliaria.com)'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        address: data.display_name || `${lat}, ${lng}`,
        provider: 'nominatim'
      };
    }
  } catch (error) {
    console.error('Error con Nominatim reverse geocoding:', error);
  }

  return {
    address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    provider: 'nominatim'
  };
};

// Función para obtener información del proveedor actual
export const getGeocodingInfo = () => {
  const isMapbox = isMapboxAvailable();
  return {
    provider: isMapbox ? 'mapbox' : 'nominatim',
    isPremium: isMapbox,
    tokenConfigured: !!getMapboxToken(),
    features: {
      autocomplete: true,
      reverseGeocoding: true,
      fallback: isMapbox, // Mapbox tiene fallback a Nominatim
      rateLimit: isMapbox ? '100,000/month' : '1 request/second'
    }
  };
};
