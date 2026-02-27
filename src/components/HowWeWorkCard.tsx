import React from "react";

type HowWeWorkCardProps = {
  title: string;
  description: string;
  Icon: React.ElementType;
  animationDelayMs?: number;
};

const HowWeWorkCard: React.FC<HowWeWorkCardProps> = ({
  title,
  description,
  Icon,
  animationDelayMs = 0,
}) => {
  return (
    <div
      className="relative bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.08)] hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)] p-6 text-center transition-transform duration-300 ease-out group hover:-translate-y-2 opacity-0 animate-how-we-work"
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className="mb-4 flex justify-center">
        <Icon
          className="w-12 h-12 text-[#f0782c] transition-transform duration-200 group-hover:scale-110 group-hover:text-[#e0661d]"
          strokeWidth={2.8}
        />
      </div>
      <h3 className="text-lg font-semibold text-[#1F2937] mb-2 min-h-[3.5rem] text-center leading-snug">
        {title}
      </h3>
      <p className="text-sm text-[#4B5563] text-left leading-relaxed max-w-xs mx-auto">
        {description}
      </p>
    </div>
  );
};

export default HowWeWorkCard;

