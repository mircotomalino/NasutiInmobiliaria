// Servicio centralizado para WhatsApp
import { Property } from '../types';

// Número de WhatsApp de Nasuti Inmobiliaria
export const OWNER_PHONE = "5493513459377";

// Función para generar URL de WhatsApp con mensaje personalizado
export const generateWhatsAppUrl = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${OWNER_PHONE}?text=${encodedMessage}`;
};

// Función para abrir WhatsApp con mensaje
export const openWhatsApp = (message: string): void => {
  const url = generateWhatsAppUrl(message);
  window.open(url, '_blank');
};

// Función para generar mensaje de contacto con propiedad
export const generatePropertyContactMessage = (property: Property): string => {
  const propertyUrl = `${window.location.origin}/propiedad/${property.id}`;
  return `Hola como estas? estoy interesado en esta propiedad "${property.title}" podrias brindarme mas informacion?

Link de la propiedad: ${propertyUrl}`;
};

// Función para manejar contacto por WhatsApp desde una propiedad
export const handlePropertyWhatsAppContact = (property: Property): void => {
  const message = generatePropertyContactMessage(property);
  openWhatsApp(message);
};

// Función para manejar contacto general por WhatsApp
export const handleGeneralWhatsAppContact = (): void => {
  const message = "Hola! Me interesa conocer más sobre las propiedades disponibles. ¿Podrías brindarme información?";
  openWhatsApp(message);
};
