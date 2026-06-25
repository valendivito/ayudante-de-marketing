import { z } from "zod";
import type { VideoStatus } from "./db";

export const AnalysisSchema = z.object({
  resumen: z
    .string()
    .describe("Resumen breve (2-3 frases) de qué pasa y qué se dice en el video."),
  potencial_viral: z.object({
    veredicto: z.enum(["alto", "medio", "bajo"]),
    puntaje: z.number().min(0).max(10),
    motivos: z
      .array(z.string())
      .describe("Motivos concretos por los que el video tiene o no potencial viral."),
  }),
  gancho_inicial: z.object({
    que_pasa: z
      .string()
      .describe("Qué se dice/muestra en los primeros 2 segundos del video."),
    evaluacion: z
      .string()
      .describe("Qué tan fuerte es el gancho y por qué retiene o no retiene la atención."),
    sugerencia_mejorada: z
      .string()
      .describe("Una versión alternativa de gancho más fuerte para los primeros 2 segundos."),
  }),
  retencion: z.object({
    tecnicas_usadas: z
      .array(z.string())
      .describe("Técnicas de retención detectadas en el medio del video (curiosidad, tensión, pattern interrupt, storytelling, etc)."),
    justificacion: z
      .string()
      .describe("Por qué esas técnicas hacen (o no hacen) que la gente se quede viendo."),
  }),
  errores_a_corregir: z
    .array(
      z.object({
        tipo: z
          .string()
          .describe("estructura | guion | captions | ritmo | audio | visual | cta"),
        problema: z.string(),
        sugerencia: z.string(),
      })
    )
    .describe("Errores concretos a corregir, vacío si no hay errores relevantes."),
  guion_sugerido: z.object({
    hook_0_2s: z.string().describe("Guion del gancho para los primeros 2 segundos."),
    desarrollo_retencion: z.string().describe("Guion del cuerpo/medio del video."),
    justificacion_retencion: z
      .string()
      .describe("Por qué este desarrollo retiene a la audiencia."),
    cta_final: z.string().describe("Guion del call to action final."),
  }),
  captions: z
    .array(
      z.object({
        inicio: z.string().describe("Timestamp MM:SS"),
        texto: z.string(),
      })
    )
    .describe("Captions/subtítulos en pantalla listos para usar, en orden cronológico."),
  contexto_visual: z
    .array(
      z.object({
        inicio: z.string().describe("Timestamp MM:SS"),
        descripcion: z.string().describe("Qué se ve en pantalla en ese momento."),
      })
    )
    .describe("Descripción escena por escena de lo que se ve en el video."),
  transcripcion: z
    .string()
    .describe("Transcripción completa de lo que se dice en el video, tal como vino provista."),
  descripcion_publicacion: z.object({
    texto: z.string().describe("Descripción lista para publicar junto al video."),
    hashtags: z.array(z.string()),
  }),
});

export type Analysis = z.infer<typeof AnalysisSchema>;

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface FrameInfo {
  path: string;
  timestampSeconds: number;
}

export interface VideoSummary {
  id: string;
  sourceType: "url" | "upload";
  source: string;
  title: string | null;
  durationSeconds: number | null;
  status: VideoStatus;
  statusDetail: string | null;
  error: string | null;
  createdAt: string;
}

export interface VideoDetail extends VideoSummary {
  frameCount: number | null;
  transcript: TranscriptSegment[] | null;
  transcriptSource: string | null;
  analysis: Analysis | null;
  updatedAt: string;
}
