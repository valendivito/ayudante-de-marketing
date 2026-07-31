import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LogoShine } from "../components/Logo";
import { lerp, useScale } from "../util";

// Escena 1: reveal del logo MDRACING con destello + barrido de brillo cromado.
export const HeroScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();

  const pop = spring({ frame, fps, config: { damping: 16, mass: 0.9 } });
  const scale = lerp(pop, [0, 1], [0.78, 1]);
  const rise = (1 - pop) * 22 * s;
  const flash = lerp(frame, [0, 7, 26], [0, 0.7, 0]);
  const out = lerp(frame, [duration - 14, duration], [1, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* destello de reveal */}
        <div
          style={{
            position: "absolute",
            width: 1150 * s,
            height: 1150 * s,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,255,255,${flash}) 0%, rgba(225,6,0,${flash * 0.6}) 26%, rgba(225,6,0,0) 60%)`,
            filter: "blur(8px)",
          }}
        />
        <div style={{ transform: `translateY(${rise}px) scale(${scale})` }}>
          <LogoShine height={250 * s} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
