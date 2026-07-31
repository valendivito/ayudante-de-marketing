import React from "react";
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../theme";
import { Icon } from "../components/UI";
import { lerp, useScale } from "../util";

// Escena 4: cierre / llamado a la accion.
export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();

  const pop = spring({ frame, fps, config: { damping: 15, mass: 0.8 } });
  const scale = lerp(pop, [0, 1], [0.8, 1]);
  const handle = lerp(frame, [10, 22], [0, 1], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${scale})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 * s }}>
          <div style={{ transform: "rotate(90deg)" }}>
            <Icon name="play" size={54 * s} />
          </div>
          <span
            style={{
              fontFamily: FONT.cond,
              fontWeight: 900,
              fontSize: 150 * s,
              lineHeight: 0.9,
              color: COLORS.ink,
              textTransform: "uppercase",
            }}
          >
            Dale, <span style={{ color: COLORS.red }}>arrancamos</span>
          </span>
        </div>

        <div
          style={{
            marginTop: 40 * s,
            opacity: handle,
            transform: `translateY(${(1 - handle) * 16 * s}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: 14 * s,
            padding: `${14 * s}px ${34 * s}px`,
            borderRadius: 999,
            background: COLORS.ink,
          }}
        >
          <span style={{ width: 12 * s, height: 12 * s, borderRadius: 999, background: COLORS.red }} />
          <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40 * s, color: COLORS.white }}>
            @mdracingfundas
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
