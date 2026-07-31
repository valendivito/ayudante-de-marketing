import React from "react";
import { COLORS, FONT, RED_METAL, SILVER_CHROME } from "../theme";

// Recreacion tipografica del isologo MDRACING: "MD" en rojo metalizado +
// "Racing" en script cromado. (No es el asset oficial: se puede reemplazar por
// el PNG del logo real dejandolo en public/ y usando <Img/>.)
export const LogoLockup: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        filter: `drop-shadow(0 ${size * 0.05}px ${size * 0.09}px rgba(0,0,0,0.20))`,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          fontFamily: FONT.cond,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: size,
          letterSpacing: -size * 0.02,
          backgroundImage: RED_METAL,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
        }}
      >
        MD
      </span>
      <span
        style={{
          fontFamily: FONT.script,
          fontSize: size * 1.02,
          marginLeft: -size * 0.02,
          transform: `translateY(${size * 0.12}px) rotate(-4deg)`,
          backgroundImage: SILVER_CHROME,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow: `0 ${size * 0.015}px ${size * 0.02}px rgba(0,0,0,0.18)`,
        }}
      >
        Racing
      </span>
    </div>
  );
};

// Wordmark plano "MDRACING" para pie/encabezado sobre fondo claro.
export const Wordmark: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div
      style={{
        fontFamily: FONT.cond,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: size * 0.02,
        lineHeight: 1,
        display: "inline-flex",
      }}
    >
      <span style={{ color: COLORS.red }}>MD</span>
      <span style={{ color: COLORS.ink }}>RACING</span>
    </div>
  );
};
