import React from "react";
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../theme";
import { FeaturePill } from "../components/UI";
import { lerp, useScale } from "../util";

type Pill = { icon: "ruler" | "factory" | "medal" | "check"; label: string };

// Escena 3: sellos de confianza MDRACING.
export const PillsScene: React.FC<{
  duration: number;
  heading: string;
  highlight: string;
  pills: Pill[];
}> = ({ duration, heading, highlight, pills }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const out = lerp(frame, [duration - 12, duration], [1, 0]);
  const eyebrow = lerp(frame, [0, 14], [0, 1], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 * s }}>
        <span
          style={{
            fontFamily: FONT.cond,
            fontWeight: 800,
            fontSize: 46 * s,
            letterSpacing: 4 * s,
            color: COLORS.ink,
            textTransform: "uppercase",
            opacity: eyebrow,
          }}
        >
          {heading} <span style={{ color: COLORS.red }}>{highlight}</span>
        </span>

        {pills.map((p, i) => {
          const at = 8 + i * 9;
          const pop = spring({ frame: frame - at, fps, config: { damping: 15, mass: 0.7 } });
          return (
            <div
              key={`${p.label}-${i}`}
              style={{
                opacity: lerp(frame, [at, at + 8], [0, 1]),
                transform: `translateX(${(1 - pop) * -60 * s}px) scale(${lerp(pop, [0, 1], [0.85, 1])})`,
              }}
            >
              <FeaturePill icon={p.icon} label={p.label} s={s} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
