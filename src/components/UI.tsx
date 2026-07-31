import React from "react";
import { COLORS, FONT } from "../theme";

// Iconos de linea simples (rojo), estilo carrusel.
export const Icon: React.FC<{ name: "ruler" | "factory" | "medal" | "check" | "play"; size: number }> = ({
  name,
  size,
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: COLORS.red,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "ruler":
      return (
        <svg {...common}>
          <path d="M3 8.5 8.5 3l12.5 12.5L15.5 21 3 8.5Z" />
          <path d="M7 9l1.6 1.6M9.5 6.5 11 8M11.5 12.5l1.6 1.6M14 10l1.5 1.5" />
        </svg>
      );
    case "factory":
      return (
        <svg {...common}>
          <path d="M3 21h18M4 21V10l6 4V10l6 4V6l4-2v17" />
          <path d="M7 21v-4M12 21v-4M17 21v-4" />
        </svg>
      );
    case "medal":
      return (
        <svg {...common}>
          <circle cx="12" cy="14" r="5" />
          <path d="M12 12.5 12.9 14l1.6.2-1.2 1.1.3 1.6-1.6-.8-1.6.8.3-1.6-1.2-1.1 1.6-.2.9-1.5Z" />
          <path d="M8.5 9.5 6 3h5l1.5 3.5M15.5 9.5 18 3h-5" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <path d="M7 4.5v15l12-7.5-12-7.5Z" fill={COLORS.red} stroke="none" />
        </svg>
      );
    case "check":
    default:
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
  }
};

// Pill con borde rojo (feature).
export const FeaturePill: React.FC<{
  icon: "ruler" | "factory" | "medal" | "check";
  label: string;
  s: number;
}> = ({ icon, label, s }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16 * s,
        padding: `${16 * s}px ${30 * s}px`,
        borderRadius: 999,
        background: COLORS.white,
        border: `${2.5 * s}px solid ${COLORS.red}`,
        boxShadow: `0 ${10 * s}px ${26 * s}px rgba(209,0,0,0.14)`,
      }}
    >
      <Icon name={icon} size={34 * s} />
      <span
        style={{
          fontFamily: FONT.cond,
          fontWeight: 800,
          fontSize: 38 * s,
          letterSpacing: 1 * s,
          color: COLORS.ink,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// Kicker (etiqueta chica arriba del titulo).
export const Kicker: React.FC<{ label: string; s: number }> = ({ label, s }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14 * s,
        padding: `${11 * s}px ${26 * s}px`,
        borderRadius: 999,
        background: COLORS.red,
        boxShadow: `0 ${8 * s}px ${20 * s}px rgba(209,0,0,0.30)`,
      }}
    >
      <Icon name="play" size={22 * s} />
      <span
        style={{
          fontFamily: FONT.cond,
          fontWeight: 800,
          fontSize: 30 * s,
          letterSpacing: 4 * s,
          color: COLORS.white,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
};
