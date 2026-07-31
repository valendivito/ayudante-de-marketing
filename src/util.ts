import { interpolate, useVideoConfig } from "remotion";

// Escala en base al lado mas corto (1080 -> factor 1). Vertical (1080x1920) y
// horizontal (1920x1080) comparten lado corto = 1080, asi que los tamanos en
// px se mantienen consistentes en ambos formatos.
export const useScale = () => {
  const { width, height } = useVideoConfig();
  return Math.min(width, height) / 1080;
};

// interpolate con clamp por defecto (no extrapola fuera del rango).
export const lerp = (
  frame: number,
  range: number[],
  out: number[],
  easing?: (n: number) => number,
) =>
  interpolate(frame, range, out, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
