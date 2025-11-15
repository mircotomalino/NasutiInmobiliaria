// Funciones de validación para coordenadas
export const validateCoordinates = (latitude, longitude) => {
  const errors = [];

  // Validar latitud
  if (latitude !== undefined && latitude !== null && latitude !== "") {
    const lat = parseFloat(latitude);
    if (isNaN(lat)) {
      errors.push("Latitude must be a valid number");
    } else if (lat < -90 || lat > 90) {
      errors.push("Latitude must be between -90 and 90 degrees");
    }
  }

  // Validar longitud
  if (longitude !== undefined && longitude !== null && longitude !== "") {
    const lng = parseFloat(longitude);
    if (isNaN(lng)) {
      errors.push("Longitude must be a valid number");
    } else if (lng < -180 || lng > 180) {
      errors.push("Longitude must be between -180 and 180 degrees");
    }
  }

  // Si se proporciona una coordenada, ambas deben estar presentes
  if (
    (latitude !== undefined && latitude !== null && latitude !== "") !==
    (longitude !== undefined && longitude !== null && longitude !== "")
  ) {
    errors.push("Both latitude and longitude must be provided together");
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
export const validatePropertyData = (data) => {
  const errors = [];

  // Campos requeridos
  const requiredFields = [
    "title",
    "description",
    "price",
    "address",
    "city",
    "type",
  ];
  requiredFields.forEach((field) => {
    if (
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      errors.push(`${field} is required`);
    }
  });

  // Validar precio
  if (data.price !== undefined) {
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      errors.push("Price must be a valid positive number");
    }
  }

  // Validar números enteros
  const integerFields = ["bedrooms", "bathrooms", "area"];
  integerFields.forEach((field) => {
    if (
      data[field] !== undefined &&
      data[field] !== null &&
      data[field] !== ""
    ) {
      const value = parseInt(data[field]);
      if (isNaN(value) || value < 0) {
        errors.push(`${field} must be a valid positive integer`);
      }
    }
  });

  // Validar coordenadas
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
    },
  };
};

