import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../theme";
import { lerp, useScale } from "../util";

const PHRASE = "FÁBRICA DIRECTA · SIN INTERMEDIARIOS · 25 AÑOS · CORTE A MEDIDA · ";

// Barra roja superior con marquee, igual que el header de la web.
export const TopMarquee: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const drop = lerp(frame, [0, 18], [-1, 0]);
  const h = 62 * s;
  const shift = (frame * 2.4 * s) % (100000);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: h,
        background: COLORS.red,
        transform: `translateY(${drop * h}px)`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        boxShadow: `0 ${6 * s}px ${18 * s}px rgba(209,0,0,0.28)`,
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          transform: `translateX(${-shift}px)`,
          display: "flex",
          fontFamily: FONT.cond,
          fontWeight: 700,
          fontSize: 26 * s,
          letterSpacing: 2 * s,
          color: COLORS.white,
        }}
      >
        <span>{PHRASE.repeat(8)}</span>
        <span>{PHRASE.repeat(8)}</span>
      </div>
    </div>
  );
};
