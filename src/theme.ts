// Sistema visual MDRACING — versión oscura / cinematográfica.
// Fondo negro para que el logo cromado y el rojo de marca peguen fuerte.

export const COLORS = {
  red: "#e10600", // rojo de marca (un toque más vivo sobre negro)
  redDeep: "#7a0000",
  redAccent: "#ff3a1d",

  white: "#ffffff",
  text: "#f4f5f6", // texto principal
  textMuted: "#9aa0a8",

  bg: "#0b0b0d", // fondo base
  bgCore: "#17171b", // centro un poco más claro
  bgEdge: "#050506", // borde/vignette
  gridLine: "rgba(255,255,255,0.045)",

  // plata / cromo del logo
  silverHi: "#ffffff",
  silverMid: "#b9c1cb",
  silverLo: "#828b96",
} as const;

export const FONT = {
  cond: "Barlow Condensed",
  body: "Barlow",
  script: "Great Vibes",
} as const;
