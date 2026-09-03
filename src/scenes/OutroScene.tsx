import React from "react";
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../theme";
import { lerp, useScale } from "../util";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const Reveal: React.FC<{ at: number; frame: number; s: number; children: React.ReactNode }> = ({
  at,
  frame,
  s,
  children,
}) => {
  const p = lerp(frame, [at, at + 16], [0, 1], EASE);
  return (
    <div style={{ overflow: "hidden", padding: `${6 * s}px 0` }}>
      <div style={{ opacity: p, transform: `translateY(${(1 - p) * 70 * s}px)` }}>{children}</div>
    </div>
  );
};

// Contenido del outro: llamado a la accion para seguir en redes.
export const OutroScene: React.FC<{
  eyebrow: string;
  ctaLine1: string;
  ctaLine2: string;
  handle: string;
  platforms: string;
}> = ({ eyebrow, ctaLine1, ctaLine2, handle, platforms }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();

  const big = {
    fontFamily: FONT.cond,
    fontWeight: 900 as const,
    lineHeight: 0.9,
    letterSpacing: -1 * s,
    textTransform: "uppercase" as const,
  };

  // pill: entra con spring y luego late suave para llamar la atencion.
  const pillIn = spring({ frame: frame - 48, fps, config: { damping: 15, mass: 0.7 } });
  const pulse = 1 + 0.03 * Math.sin((frame - 60) / 9);
  const pillScale = lerp(pillIn, [0, 1], [0.8, 1]) * (frame > 60 ? pulse : 1);
  const platP = lerp(frame, [60, 74], [0, 1], EASE);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {/* eyebrow */}
        <div
          style={{
            opacity: lerp(frame, [8, 22], [0, 1], EASE),
            display: "inline-flex",
            alignItems: "center",
            gap: 14 * s,
            marginBottom: 26 * s,
          }}
        >
          <span style={{ width: 40 * s, height: 4 * s, borderRadius: 999, background: COLORS.red }} />
          <span
            style={{
              fontFamily: FONT.cond,
              fontWeight: 800,
              fontSize: 34 * s,
              letterSpacing: 4 * s,
              color: COLORS.red,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
          <span style={{ width: 40 * s, height: 4 * s, borderRadius: 999, background: COLORS.red }} />
        </div>

        {/* CTA grande */}
        <Reveal at={18} frame={frame} s={s}>
          <div style={{ ...big, fontSize: 122 * s, color: COLORS.text }}>{ctaLine1}</div>
        </Reveal>
        <Reveal at={30} frame={frame} s={s}>
          <div
            style={{
              ...big,
              fontSize: 148 * s,
              color: COLORS.red,
              textShadow: `0 ${8 * s}px ${40 * s}px rgba(225,6,0,0.35)`,
            }}
          >
            {ctaLine2}
          </div>
        </Reveal>

        {/* handle pill */}
        <div
          style={{
            marginTop: 44 * s,
            transform: `scale(${pillScale})`,
            display: "inline-flex",
            alignItems: "center",
            padding: `${18 * s}px ${44 * s}px`,
            borderRadius: 999,
            background: COLORS.red,
            boxShadow: `0 ${10 * s}px ${36 * s}px rgba(225,6,0,0.4)`,
          }}
        >
          <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 48 * s, color: COLORS.white }}>
            {handle}
          </span>
        </div>

        {/* plataformas */}
        <div
          style={{
            marginTop: 26 * s,
            opacity: platP,
            fontFamily: FONT.body,
            fontWeight: 600,
            fontSize: 34 * s,
            letterSpacing: 1 * s,
            color: COLORS.textMuted,
          }}
        >
          {platforms}
        </div>
      </div>
    </AbsoluteFill>
  );
};
