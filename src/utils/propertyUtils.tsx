// Utilidades para propiedades
import {
  Home,
  Building,
  Store,
  Briefcase,
  TreePine,
  Map,
  Warehouse,
  Car,
  Wheat,
} from "../icons";
import { PropertyType } from "../types";
import React from "react";

export const PROPERTY_TYPE_CONFIG: Record<
  PropertyType,
  { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
  casa: { label: "Casa", icon: Home },
  departamento: { label: "Departamento", icon: Building },
  terreno: { label: "Terreno", icon: Map },
  oficina: { label: "Oficina", icon: Briefcase },
  local: { label: "Local", icon: Store },
  quinta: { label: "Quinta", icon: TreePine },
  galpon: { label: "Galpón", icon: Warehouse },
  cochera: { label: "Cochera", icon: Car },
  campo: { label: "Campo", icon: Wheat },
};

export const propertyTypes: PropertyType[] = Object.keys(
  PROPERTY_TYPE_CONFIG
) as PropertyType[];

export const propertyTypesWithLabels = (
  iconSize: "small" | "large" = "small"
): Array<{ value: PropertyType; label: string; icon: React.ReactElement }> => {
  return propertyTypes.map(type => {
    const config = PROPERTY_TYPE_CONFIG[type];
    const IconComponent = config.icon;
    const size = iconSize === "small" ? "w-4 h-4" : "w-5 h-5";
    return {
      value: type,
      label: config.label,
      icon: <IconComponent className={size} />,
    };
  });
};

// Función centralizada para obtener el ícono según el tipo de propiedad
export const getPropertyTypeIcon = (type: PropertyType) => {
  const config = PROPERTY_TYPE_CONFIG[type];
  if (!config) {
    return <Home className="w-5 h-5" />;
  }
  const IconComponent = config.icon;
  return <IconComponent className="w-5 h-5" />;
};

// Función para obtener el ícono pequeño (para cards)
export const getPropertyTypeIconSmall = (type: PropertyType) => {
  const config = PROPERTY_TYPE_CONFIG[type];
  if (!config) {
    return <Home className="w-4 h-4" />;
  }
  const IconComponent = config.icon;
  return <IconComponent className="w-4 h-4" />;
};

// Función para obtener el label de un tipo
export const getPropertyTypeLabel = (type: PropertyType): string => {
  return PROPERTY_TYPE_CONFIG[type]?.label || type;
};
