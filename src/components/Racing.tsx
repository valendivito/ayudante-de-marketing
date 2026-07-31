import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Easing } from "remotion";
import { COLORS } from "../theme";
import { lerp, useScale } from "../util";

// Cortina/rafaga roja diagonal que cruza la pantalla dentro de [start, end].
// Sirve como transicion "racing" entre escenas.
export const SpeedSwipe: React.FC<{
  start: number;
  end: number;
  color?: string;
}> = ({ start, end, color = COLORS.red }) => {
  const frame = useCurrentFrame();
  const p = lerp(frame, [start, end], [0, 1], Easing.inOut(Easing.cubic));
  // La barra entra desde la izquierda y sale por la derecha.
  const x = lerp(p, [0, 1], [-180, 180]);

  if (frame < start - 1 || frame > end + 1) return null;

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: 0,
          width: "70%",
          height: "140%",
          transform: `skewX(-14deg) translateX(${x}%)`,
          background: `linear-gradient(90deg, rgba(255,69,0,0) 0%, ${COLORS.redAccent} 22%, ${color} 55%, ${COLORS.redDeep} 100%)`,
          filter: "saturate(1.1)",
        }}
      />
    </AbsoluteFill>
  );
};

// Rafagas finas de velocidad que aparecen brevemente (acento de apertura).
export const SpeedLines: React.FC<{ start: number; end: number }> = ({
  start,
  end,
}) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const life = lerp(frame, [start, (start + end) / 2, end], [0, 1, 0]);
  if (frame < start || frame > end) return null;
  const lines = [
    { top: "26%", w: 46, delay: 0 },
    { top: "34%", w: 30, delay: 3 },
    { top: "63%", w: 38, delay: 1 },
    { top: "71%", w: 26, delay: 4 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {lines.map((l, i) => {
        const x = lerp(frame, [start + l.delay, end], [-30, 130]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: l.top,
              left: `${x}%`,
              width: `${l.w * s}px`,
              height: `${4 * s}px`,
              borderRadius: 999,
              opacity: life * 0.5,
              background: `linear-gradient(90deg, rgba(209,0,0,0), ${COLORS.red})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
