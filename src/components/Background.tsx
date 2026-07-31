import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { lerp, useScale } from "../util";

// Fondo claro estilo carrusel MDRACING: gris muy claro + grilla sutil + un
// halo rojo que respira suavemente y una vignette para dar profundidad.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const cell = 68 * s;

  const gridIn = lerp(frame, [0, 24], [0, 1]);
  const glow = lerp(frame, [0, 90], [0.0, 0.16]) * (0.85 + 0.15 * Math.sin(frame / 18));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, overflow: "hidden" }}>
      {/* halo rojo de marca */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 42%, rgba(209,0,0,${glow}) 0%, rgba(209,0,0,0) 55%)`,
        }}
      />
      {/* grilla */}
      <AbsoluteFill
        style={{
          opacity: gridIn,
          backgroundImage: `linear-gradient(${COLORS.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.gridLine} 1px, transparent 1px)`,
          backgroundSize: `${cell}px ${cell}px`,
          maskImage:
            "radial-gradient(120% 100% at 50% 50%, #000 40%, rgba(0,0,0,0.25) 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 100% at 50% 50%, #000 40%, rgba(0,0,0,0.25) 100%)",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(130% 120% at 50% 50%, rgba(0,0,0,0) 62%, ${COLORS.paperEdge} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
