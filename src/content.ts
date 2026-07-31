import { z } from "zod";

// =============================================================================
//  TEXTOS DEL INTRO  ·  editá acá y listo
// -----------------------------------------------------------------------------
//  Podés cambiar cualquier texto de dos formas:
//   1) A mano: editá los valores de `defaultContent` de abajo y volvé a
//      renderizar (`npm run render:all`).
//   2) Visualmente: corré `npm start` (Remotion Studio) y editá los campos en
//      la barra lateral derecha; Studio puede guardar los cambios de vuelta.
// =============================================================================

const iconEnum = z.enum(["ruler", "factory", "medal", "check"]);

export const pillSchema = z.object({
  icon: iconEnum,
  label: z.string(),
});

export const introSchema = z.object({
  // Barra roja superior (marquee). Se repite en loop.
  marquee: z.string(),

  // Escena 1 — reveal del logo
  heroKicker: z.string(),

  // Escena 2 — titulo
  titleEyebrow: z.string(),
  titleLine1: z.string(),
  titleLine2: z.string(), // se muestra en rojo
  titleSubtitle: z.string(),

  // Escena 3 — sellos de confianza
  pillsHeading: z.string(),
  pillsHeadingHighlight: z.string(), // palabra final en rojo
  pills: z.array(pillSchema),

  // Escena 4 — cierre
  ctaText: z.string(),
  ctaHighlight: z.string(), // palabra en rojo
  handle: z.string(),

  // Pie (presente todo el video)
  website: z.string(),
});

export type IntroProps = z.infer<typeof introSchema>;

// -----------------------------------------------------------------------------
//  VALORES POR DEFECTO  ·  cambiá el texto entre comillas
// -----------------------------------------------------------------------------
export const defaultContent: IntroProps = {
  marquee: "FÁBRICA DIRECTA · SIN INTERMEDIARIOS · 25 AÑOS · CORTE A MEDIDA · ",

  heroKicker: "Tutorial de instalación",

  titleEyebrow: "Guía oficial · a medida",
  titleLine1: "Instalá tus fundas",
  titleLine2: "Paso a paso",
  titleSubtitle: "Cortadas para tu auto. Sin adhesivos, sin talleres.",

  pillsHeading: "Calidad que se",
  pillsHeadingHighlight: "nota",
  pills: [
    { icon: "ruler", label: "Corte a medida" },
    { icon: "factory", label: "Fábrica directa" },
    { icon: "medal", label: "25 años de oficio" },
  ],

  ctaText: "Dale,",
  ctaHighlight: "arrancamos",
  handle: "@mdracingfundas",

  website: "mdracingfundas.com",
};
