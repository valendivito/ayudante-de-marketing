import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../theme";
import { lerp, useScale } from "../util";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// Renglon con reveal (sube + aparece) segun un frame de inicio.
const Line: React.FC<{
  at: number;
  frame: number;
  s: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, frame, s, children, style }) => {
  const p = lerp(frame, [at, at + 16], [0, 1], EASE);
  return (
    <div style={{ overflow: "hidden", padding: `${4 * s}px 0` }}>
      <div style={{ opacity: p, transform: `translateY(${(1 - p) * 64 * s}px)`, ...style }}>{children}</div>
    </div>
  );
};

// Escena 2: titulo principal del tutorial.
export const TitleScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const out = lerp(frame, [duration - 14, duration], [1, 0]);
  const line = { fontFamily: FONT.cond, fontWeight: 900, lineHeight: 0.92, textTransform: "uppercase" as const };

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{ textAlign: "center" }}>
        <Line at={0} frame={frame} s={s} style={{ marginBottom: 10 * s }}>
          <span
            style={{
              fontFamily: FONT.body,
              fontWeight: 700,
              fontSize: 34 * s,
              letterSpacing: 6 * s,
              color: COLORS.red,
              textTransform: "uppercase",
            }}
          >
            Guía oficial · a medida
          </span>
        </Line>

        <Line at={8} frame={frame} s={s}>
          <div style={{ ...line, fontSize: 132 * s, color: COLORS.ink, letterSpacing: -1 * s }}>
            Instalá tus fundas
          </div>
        </Line>

        <Line at={18} frame={frame} s={s}>
          <div style={{ ...line, fontSize: 176 * s, color: COLORS.red, letterSpacing: -1 * s }}>
            Paso a paso
          </div>
        </Line>

        <Line at={30} frame={frame} s={s} style={{ marginTop: 22 * s }}>
          <span style={{ fontFamily: FONT.body, fontWeight: 500, fontSize: 44 * s, color: COLORS.ink }}>
            Cortadas para tu auto. Sin adhesivos, sin talleres.
          </span>
        </Line>
      </div>
    </AbsoluteFill>
  );
};
