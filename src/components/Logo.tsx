import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { lerp } from "../util";

const RATIO = 1024 / 298; // proporción del logo oficial

// Logo oficial MDRACING (public/logo.png · fondo transparente). Se dimensiona
// por altura.
export const Logo: React.FC<{ height: number; glow?: boolean }> = ({ height, glow = true }) => {
  return (
    <Img
      src={staticFile("logo.png")}
      style={{
        height,
        width: "auto",
        display: "block",
        filter: glow ? `drop-shadow(0 ${height * 0.06}px ${height * 0.16}px rgba(0,0,0,0.65))` : undefined,
      }}
    />
  );
};

// Logo con barrido de brillo cromado (para el reveal del hero). El reflejo
// recorre solo la silueta del logo usando la propia imagen como máscara.
export const LogoShine: React.FC<{ height: number }> = ({ height }) => {
  const frame = useCurrentFrame();
  const width = height * RATIO;
  const sweep = lerp(frame, [6, 34], [150, -55]);
  const shine = lerp(frame, [4, 10, 30, 40], [0, 1, 1, 0]);

  return (
    <div style={{ position: "relative", width, height }}>
      <Img
        src={staticFile("logo.png")}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          filter: `drop-shadow(0 ${height * 0.06}px ${height * 0.18}px rgba(0,0,0,0.7))`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, rgba(255,255,255,0) 43%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 57%)",
          backgroundSize: "230% 100%",
          backgroundPositionX: `${sweep}%`,
          backgroundRepeat: "no-repeat",
          WebkitMaskImage: `url(${staticFile("logo.png")})`,
          maskImage: `url(${staticFile("logo.png")})`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          mixBlendMode: "screen",
          opacity: shine,
        }}
      />
    </div>
  );
};
