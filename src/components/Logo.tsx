import React from "react";
import { Img, staticFile } from "remotion";

// Logo oficial MDRACING (public/logo.png · 1024x298 · fondo transparente).
// Relacion de aspecto ~3.44:1. Se dimensiona por altura.
export const Logo: React.FC<{ height: number; shadow?: boolean }> = ({ height, shadow = true }) => {
  return (
    <Img
      src={staticFile("logo.png")}
      style={{
        height,
        width: "auto",
        display: "block",
        filter: shadow
          ? `drop-shadow(0 ${height * 0.05}px ${height * 0.1}px rgba(0,0,0,0.22))`
          : undefined,
      }}
    />
  );
};
