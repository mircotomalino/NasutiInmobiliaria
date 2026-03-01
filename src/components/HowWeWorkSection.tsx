import React from "react";
import { Home, Briefcase, Navigation, User, Megaphone } from "../icons";
import { getWhatsAppSellPropertyUrl } from "../services/whatsapp";
import HowWeWorkCard from "./HowWeWorkCard";

type HowWeWorkStep = {
  title: string;
  description: string;
  Icon: React.ElementType;
};

const steps: HowWeWorkStep[] = [
  {
    title: "Visitamos tu propiedad",
    description:
      "Coordinamos una visita para conocer tu propiedad y tus objetivos.",
    Icon: Home,
  },
  {
    title: "La tasamos",
    description:
      "Realizamos una tasación profesional considerando el mercado actual y el potencial de tu propiedad.",
    Icon: Briefcase,
  },
  {
    title: "La publicamos",
    description:
      "Difundimos tu propiedad en nuestros canales para llegar a los compradores indicados.",
    Icon: Megaphone,
  },
  {
    title: "Agendamos las visitas",
    description:
      "Coordinamos visitas con interesados para mostrar tu propiedad.",
    Icon: Navigation,
  },
  {
    title: "Gestionamos el cierre",
    description:
      "Guiamos la negociación y te acompañamos hasta el cierre de la operación, cuidando cada detalle.",
    Icon: User,
  },
];

const HowWeWorkSection: React.FC = () => {
  return (
    <section id="como-trabajamos" className="min-h-[calc(100vh-6rem)] py-12 bg-gray-50 scroll-mt-20 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">
            Cómo trabajamos
          </h2>
          <div className="w-24 h-1 bg-[#f0782c] mx-auto rounded-full mb-4" />
          <p className="text-lg text-[#4B5563] max-w-2xl mx-auto mb-4">
            Publicar tu propiedad con nosotros es simple y transparente.
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none hidden md:block absolute left-8 right-8 top-24 border-t-2 border-[#f0782c]/70" />

          <div className="grid gap-6 md:grid-cols-5">
            {steps.map((step, index) => (
              <HowWeWorkCard
                key={step.title}
                title={step.title}
                description={step.description}
                Icon={step.Icon}
                animationDelayMs={index * 120}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href={getWhatsAppSellPropertyUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              Quiero vender mi propiedad
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWorkSection;

