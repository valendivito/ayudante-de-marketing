import { z } from "zod";

// =============================================================================
//  TEXTOS DEL INTRO  ·  editá acá y listo
// -----------------------------------------------------------------------------
//   1) A mano: cambiá los valores de `defaultContent` y volvé a renderizar
//      (`npm run render:all`).
//   2) Visualmente: corré `npm start` (Remotion Studio) y editá los campos en
//      la barra lateral derecha.
// =============================================================================

export const introSchema = z.object({
  // Texto grande (2 renglones). El 2do va en rojo.
  titleLine1: z.string(),
  titleLine2: z.string(),
  // Cierre de marca
  website: z.string(),
  handle: z.string(),
});

export type IntroProps = z.infer<typeof introSchema>;

export const defaultContent: IntroProps = {
  titleLine1: "Tutorial de instalación",
  titleLine2: "Fundas para asientos",
  website: "mdracingfundas.com",
  handle: "@mdracingfundas",
};

// =============================================================================
//  OUTRO  ·  cierre de Shorts con llamado a la acción
// =============================================================================
export const outroSchema = z.object({
  eyebrow: z.string(), // etiqueta chica arriba
  ctaLine1: z.string(), // texto grande (blanco)
  ctaLine2: z.string(), // texto grande (rojo)
  handle: z.string(), // usuario, en la pill
  platforms: z.string(), // redes donde seguirlos
  website: z.string(),
});

export type OutroProps = z.infer<typeof outroSchema>;

export const defaultOutro: OutroProps = {
  eyebrow: "No te pierdas ninguno",
  ctaLine1: "Seguinos en redes",
  ctaLine2: "para más tutoriales",
  handle: "@mdracingfundas",
  platforms: "Instagram · TikTok · YouTube",
  website: "mdracingfundas.com",
};

