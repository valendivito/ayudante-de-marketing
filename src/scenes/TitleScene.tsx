import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../theme";
import { lerp, useScale } from "../util";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const Line: React.FC<{ at: number; frame: number; s: number; children: React.ReactNode }> = ({
  at,
  frame,
  s,
  children,
}) => {
  const p = lerp(frame, [at, at + 16], [0, 1], EASE);
  return (
    <div style={{ overflow: "hidden", padding: `${6 * s}px 0` }}>
      <div style={{ opacity: p, transform: `translateY(${(1 - p) * 74 * s}px)` }}>{children}</div>
    </div>
  );
};

// Escena 2: texto grande del tutorial.
export const TitleScene: React.FC<{ duration: number; line1: string; line2: string }> = ({
  duration,
  line1,
  line2,
}) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const out = lerp(frame, [duration - 14, duration], [1, 0]);
  const base = {
    fontFamily: FONT.cond,
    fontWeight: 900 as const,
    lineHeight: 0.9,
    letterSpacing: -1 * s,
    textTransform: "uppercase" as const,
  };

  const rule = lerp(frame, [4, 22], [0, 1], EASE);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* línea de acento roja */}
        <div
          style={{
            width: 120 * s * rule,
            height: 6 * s,
            borderRadius: 999,
            background: COLORS.red,
            marginBottom: 30 * s,
            boxShadow: `0 0 ${24 * s}px rgba(225,6,0,0.7)`,
          }}
        />
        <Line at={0} frame={frame} s={s}>
          <div style={{ ...base, fontSize: 118 * s, color: COLORS.text }}>{line1}</div>
        </Line>
        <Line at={12} frame={frame} s={s}>
          <div
            style={{
              ...base,
              fontSize: 168 * s,
              color: COLORS.red,
              textShadow: `0 ${8 * s}px ${40 * s}px rgba(225,6,0,0.35)`,
            }}
          >
            {line2}
          </div>
        </Line>
      </div>
    </AbsoluteFill>
  );
};
