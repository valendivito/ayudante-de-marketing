import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { lerp, useScale } from "../util";

// Fondo negro cinematográfico: centro apenas iluminado, grilla muy sutil,
// bloom rojo que respira y vignette marcada. Deja respirar al logo cromado.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const cell = 84 * s;

  const bloom = (0.1 + 0.05 * Math.sin(frame / 22)) * lerp(frame, [0, 40], [0, 1]);
  const gridIn = lerp(frame, [6, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* núcleo iluminado */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 40%, ${COLORS.bgCore} 0%, ${COLORS.bg} 46%, ${COLORS.bgEdge} 100%)`,
        }}
      />
      {/* bloom rojo de marca */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 70% at 50% 46%, rgba(225,6,0,${bloom}) 0%, rgba(225,6,0,0) 58%)`,
        }}
      />
      {/* grilla sutil */}
      <AbsoluteFill
        style={{
          opacity: gridIn,
          backgroundImage: `linear-gradient(${COLORS.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.gridLine} 1px, transparent 1px)`,
          backgroundSize: `${cell}px ${cell}px`,
          maskImage: "radial-gradient(115% 100% at 50% 45%, #000 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(115% 100% at 50% 45%, #000 30%, transparent 78%)",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(130% 120% at 50% 50%, rgba(0,0,0,0) 55%, ${COLORS.bgEdge} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
