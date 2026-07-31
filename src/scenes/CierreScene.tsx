import React from "react";
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../theme";
import { lerp, useScale } from "../util";

// Escena 3: cierre de marca -> web + usuario.
export const CierreScene: React.FC<{ website: string; handle: string }> = ({ website, handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();

  const pop = spring({ frame, fps, config: { damping: 16, mass: 0.8 } });
  const scale = lerp(pop, [0, 1], [0.85, 1]);
  const opacity = lerp(frame, [0, 10], [0, 1]);
  const handleP = lerp(frame, [12, 24], [0, 1], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 * s }}>
          <span
            style={{
              width: 13 * s,
              height: 13 * s,
              borderRadius: 999,
              background: COLORS.red,
              boxShadow: `0 0 ${18 * s}px rgba(225,6,0,0.8)`,
            }}
          />
          <span
            style={{
              fontFamily: FONT.cond,
              fontWeight: 800,
              fontSize: 88 * s,
              letterSpacing: 1 * s,
              color: COLORS.text,
              textTransform: "uppercase",
            }}
          >
            {website}
          </span>
          <span
            style={{
              width: 13 * s,
              height: 13 * s,
              borderRadius: 999,
              background: COLORS.red,
              boxShadow: `0 0 ${18 * s}px rgba(225,6,0,0.8)`,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 40 * s,
            opacity: handleP,
            transform: `translateY(${(1 - handleP) * 16 * s}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: 14 * s,
            padding: `${16 * s}px ${38 * s}px`,
            borderRadius: 999,
            background: COLORS.red,
            boxShadow: `0 ${10 * s}px ${34 * s}px rgba(225,6,0,0.35)`,
          }}
        >
          <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 44 * s, color: COLORS.white }}>
            {handle}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
