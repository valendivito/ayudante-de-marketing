// Sistema visual MDRACING (rojo / blanco / negro + plata metalizada del logo).
// Basado en la identidad de la web y los carruseles de redes.

export const COLORS = {
  red: "#d10000", // rojo principal de marca
  redDeep: "#8f0000", // rojo profundo para volumen/sombra
  redAccent: "#ff4500", // rojo/naranja secundario
  ink: "#0a0a0a", // negro texto
  white: "#ffffff",
  paper: "#f5f5f7", // fondo gris muy claro
  paperEdge: "#e7e8ec", // borde del fondo (vignette)
  gridLine: "rgba(10,10,10,0.055)", // grilla sutil
  // plata / cromo para el script "Racing"
  silverHi: "#ffffff",
  silverMid: "#b9c1cb",
  silverLo: "#828b96",
} as const;

export const FONT = {
  cond: "Barlow Condensed", // titulos condensados en mayuscula
  body: "Barlow", // cuerpo / subtitulos
  script: "Great Vibes", // script cromado del logo
} as const;

// Gradientes reutilizables.
export const RED_METAL = `linear-gradient(180deg, ${COLORS.redAccent} 0%, ${COLORS.red} 46%, ${COLORS.redDeep} 100%)`;
export const SILVER_CHROME = `linear-gradient(180deg, ${COLORS.silverHi} 0%, #e9edf2 34%, ${COLORS.silverMid} 58%, ${COLORS.silverLo} 78%, #ffffff 100%)`;
