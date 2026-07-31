import React from "react";
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { LogoLockup } from "../components/Logo";
import { Kicker } from "../components/UI";
import { lerp, useScale } from "../util";

// Escena 1: presentacion del isologo MDRACING con un destello de reveal.
export const HeroScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();

  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.9 } });
  const scale = lerp(pop, [0, 1], [0.72, 1]);
  const rise = (1 - pop) * 26 * s;

  const flash = lerp(frame, [0, 6, 22], [0, 0.9, 0]);
  const kicker = lerp(frame, [16, 30], [0, 1], Easing.out(Easing.cubic));
  const kickerRise = (1 - kicker) * 18 * s;

  const out = lerp(frame, [duration - 14, duration], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: out,
      }}
    >
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* destello de reveal detras del logo */}
        <div
          style={{
            position: "absolute",
            width: 900 * s,
            height: 900 * s,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,255,255,${flash}) 0%, rgba(209,0,0,${flash * 0.5}) 30%, rgba(209,0,0,0) 62%)`,
            filter: "blur(6px)",
          }}
        />
        <div style={{ transform: `translateY(${rise}px) scale(${scale})` }}>
          <LogoLockup size={210 * s} />
        </div>
        <div style={{ marginTop: 54 * s, opacity: kicker, transform: `translateY(${kickerRise}px)` }}>
          <Kicker label="Tutorial de instalación" s={s} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
