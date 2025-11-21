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

  // Campos requeridos (title y description ya no son requeridos, title se genera automáticamente si falta)
  const requiredFields = {
    price: "El precio",
    city: "La ciudad",
    type: "El tipo de propiedad"
  };
  
  Object.entries(requiredFields).forEach(([field, label]) => {
    if (
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      errors.push(`${label} es obligatorio`);
    }
  });

  // Validar precio
  if (data.price !== undefined) {
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      errors.push("El precio debe ser un número positivo válido");
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
  if (!data.latitude || !data.longitude) {
    errors.push("Ambas coordenadas (latitud y longitud) son obligatorias");
  }

  const coordValidation = validateCoordinates(data.latitude, data.longitude);
  if (!coordValidation.isValid) {
    errors.push(...coordValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
    validatedData: {
      ...data,
      latitude: coordValidation.latitude,
      longitude: coordValidation.longitude,
      price: data.price ? parseFloat(data.price) : null,
      bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
      bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
      area: data.area ? parseInt(data.area) : null,
      coveredArea: data.coveredArea ? parseInt(data.coveredArea) : null,
    },
  };
};
