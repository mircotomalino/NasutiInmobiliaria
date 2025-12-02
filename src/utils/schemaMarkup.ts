const BASE_URL = "https://inmobiliarianasuti.com.ar";

export interface LocalBusinessSchema {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  image?: string;
  priceRange?: string;
  openingHours?: string[];
}

export interface RealEstateAgentSchema {
  name: string;
  jobTitle: string;
  image?: string;
  worksFor: {
    name: string;
    url: string;
  };
}

export interface PropertySchema {
  name: string;
  description: string;
  url: string;
  image?: string | string[];
  offers: {
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  numberOfRooms?: number;
  numberOfBathroomsTotal?: number;
  floorSize?: {
    value: number;
    unitText: string;
  };
}

export interface BreadcrumbSchema {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const generateLocalBusinessSchema = (
  data: LocalBusinessSchema
): object => {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: data.name,
    description: data.description,
    url: data.url,
    telephone: data.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },
    ...(data.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: data.geo.latitude,
        longitude: data.geo.longitude,
      },
    }),
    ...(data.image && { image: data.image }),
    ...(data.priceRange && { priceRange: data.priceRange }),
    ...(data.openingHours && { openingHours: data.openingHours }),
  };
};

export const generateRealEstateAgentSchema = (
  data: RealEstateAgentSchema
): object => {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: data.name,
    jobTitle: data.jobTitle,
    ...(data.image && { image: data.image }),
    worksFor: {
      "@type": "RealEstateAgent",
      name: data.worksFor.name,
      url: data.worksFor.url,
    },
  };
};

export const generatePropertySchema = (data: PropertySchema): object => {
  const images = Array.isArray(data.image) ? data.image : [data.image].filter(Boolean);
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description,
    url: data.url,
    ...(images.length > 0 && { image: images }),
    offers: {
      "@type": "Offer",
      price: data.offers.price,
      priceCurrency: data.offers.priceCurrency,
      availability: data.offers.availability,
      url: data.offers.url,
    },
    address: {
      "@type": "PostalAddress",
      ...(data.address.streetAddress && {
        streetAddress: data.address.streetAddress,
      }),
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      addressCountry: data.address.addressCountry,
    },
    ...(data.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: data.geo.latitude,
        longitude: data.geo.longitude,
      },
    }),
    ...(data.numberOfRooms && { numberOfRooms: data.numberOfRooms }),
    ...(data.numberOfBathroomsTotal && {
      numberOfBathroomsTotal: data.numberOfBathroomsTotal,
    }),
    ...(data.floorSize && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: data.floorSize.value,
        unitText: data.floorSize.unitText,
      },
    }),
  };
};

export const generateBreadcrumbSchema = (
  data: BreadcrumbSchema
): object => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: data.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const generateCollectionPageSchema = (): object => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Catálogo de Propiedades - Nasuti Inmobiliaria",
    description:
      "Catálogo completo de propiedades inmobiliarias en Marcos Juárez y la región. Casas, departamentos, terrenos y más.",
    url: `${BASE_URL}/catalogo`,
  };
};

