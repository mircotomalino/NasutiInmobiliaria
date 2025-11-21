// Funciones de validación para coordenadas
export const validateCoordinates = (latitude, longitude) => {
  const errors = [];

  // Validar latitud
  if (latitude !== undefined && latitude !== null && latitude !== "") {
    const lat = parseFloat(latitude);
    if (isNaN(lat)) {
      errors.push("La latitud debe ser un número válido");
    } else if (lat < -90 || lat > 90) {
      errors.push("La latitud debe estar entre -90 y 90 grados");
    }
  }

  // Validar longitud
  if (longitude !== undefined && longitude !== null && longitude !== "") {
    const lng = parseFloat(longitude);
    if (isNaN(lng)) {
      errors.push("La longitud debe ser un número válido");
    } else if (lng < -180 || lng > 180) {
      errors.push("La longitud debe estar entre -180 y 180 grados");
    }
  }

  // Si se proporciona una coordenada, ambas deben estar presentes
  if (
    (latitude !== undefined && latitude !== null && latitude !== "") !==
    (longitude !== undefined && longitude !== null && longitude !== "")
  ) {
    errors.push("Ambas coordenadas (latitud y longitud) deben estar presentes");
  }

  return {
    isValid: errors.length === 0,
    errors,
    latitude:
      latitude !== undefined && latitude !== null && latitude !== ""
        ? parseFloat(latitude)
        : null,
    longitude:
      longitude !== undefined && longitude !== null && longitude !== ""
        ? parseFloat(longitude)
        : null,
  };
};

// Función para validar datos de propiedad
export const validatePropertyData = data => {
  const errors = [];

  // Campos requeridos NOT NULL en la base de datos
  const requiredFields = {
    price: "El precio",
    city: "La ciudad",
    type: "El tipo de propiedad",
    latitude: "La latitud",
    longitude: "La longitud"
  };
  
  Object.entries(requiredFields).forEach(([field, label]) => {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === "" ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      errors.push(`${label} es obligatorio`);
    }
  });

  // Validar precio (debe ser un número positivo válido)
  if (data.price !== undefined && data.price !== null && data.price !== "") {
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      errors.push("El precio debe ser un número positivo válido");
    }
  }

  // Validar ciudad (debe ser un string no vacío)
  if (data.city !== undefined && data.city !== null) {
    const cityStr = String(data.city).trim();
    if (cityStr === "") {
      errors.push("La ciudad no puede estar vacía");
    } else if (cityStr.length > 100) {
      errors.push("La ciudad no puede tener más de 100 caracteres");
    }
  }

  // Validar tipo (debe ser un string no vacío)
  if (data.type !== undefined && data.type !== null) {
    const typeStr = String(data.type).trim();
    if (typeStr === "") {
      errors.push("El tipo de propiedad no puede estar vacío");
    } else if (typeStr.length > 50) {
      errors.push("El tipo de propiedad no puede tener más de 50 caracteres");
    }
  }

  // Validar números enteros
  const integerFields = {
    bedrooms: "Las habitaciones",
    bathrooms: "Los baños",
    area: "El área",
    coveredArea: "La superficie cubierta"
  };
  
  Object.entries(integerFields).forEach(([field, label]) => {
    if (
      data[field] !== undefined &&
      data[field] !== null &&
      data[field] !== ""
    ) {
      const value = parseInt(data[field]);
      if (isNaN(value) || value < 0) {
        errors.push(`${label} debe ser un número entero positivo válido`);
      }
    }
  });

  // Validar coordenadas (requeridas)
  const coordValidation = validateCoordinates(data.latitude, data.longitude);
  if (!coordValidation.isValid) {
    errors.push(...coordValidation.errors);
  }

  // Preparar datos validados con valores por defecto para campos NOT NULL
  const validatedData = {
    // Campos NOT NULL - siempre deben tener valores válidos
    price: data.price !== undefined && data.price !== null && data.price !== "" 
      ? parseFloat(data.price) 
      : null, // null causará error si no se validó antes
    city: data.city !== undefined && data.city !== null 
      ? String(data.city).trim() 
      : "", // string vacío causará error si no se validó antes
    type: data.type !== undefined && data.type !== null 
      ? String(data.type).trim() 
      : "", // string vacío causará error si no se validó antes
    latitude: coordValidation.latitude !== null 
      ? coordValidation.latitude 
      : null, // null causará error si no se validó antes
    longitude: coordValidation.longitude !== null 
      ? coordValidation.longitude 
      : null, // null causará error si no se validó antes
    
    // Campos opcionales
    title: data.title !== undefined && data.title !== null 
      ? String(data.title).trim() 
      : "", // Se generará automáticamente si está vacío
    description: data.description !== undefined && data.description !== null && data.description !== ""
      ? String(data.description).trim()
      : null,
    address: data.address !== undefined && data.address !== null
      ? String(data.address).trim()
      : "", // DEFAULT '' en la DB
    status: data.status !== undefined && data.status !== null && data.status !== ""
      ? String(data.status).trim()
      : "disponible", // DEFAULT 'disponible' en la DB
    
    // Campos numéricos opcionales
    bedrooms: data.bedrooms !== undefined && data.bedrooms !== null && data.bedrooms !== ""
      ? parseInt(data.bedrooms)
      : null,
    bathrooms: data.bathrooms !== undefined && data.bathrooms !== null && data.bathrooms !== ""
      ? parseInt(data.bathrooms)
      : null,
    area: data.area !== undefined && data.area !== null && data.area !== ""
      ? parseInt(data.area)
      : null,
    coveredArea: data.coveredArea !== undefined && data.coveredArea !== null && data.coveredArea !== ""
      ? parseInt(data.coveredArea)
      : null,
    
    // Campos de texto opcionales
    patio: data.patio !== undefined && data.patio !== null && data.patio !== ""
      ? String(data.patio).trim()
      : null,
    garage: data.garage !== undefined && data.garage !== null && data.garage !== ""
      ? String(data.garage).trim()
      : null,
  };

  return {
    isValid: errors.length === 0,
    errors,
    validatedData,
  };
};
