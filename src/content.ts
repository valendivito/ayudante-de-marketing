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
