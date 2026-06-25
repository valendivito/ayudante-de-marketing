import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { z } from "zod";
import { AnalysisSchema, type Analysis, type FrameInfo, type TranscriptSegment } from "./types";

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTranscript(segments: TranscriptSegment[]): string {
  if (segments.length === 0) return "(sin transcripción disponible)";
  return segments
    .map((seg) => `[${formatTimestamp(seg.start)}] ${seg.text}`)
    .join("\n");
}

const SYSTEM_PROMPT = `Sos un analista experto en video marketing y contenido viral para redes sociales (TikTok, Reels, Shorts). Analizás el video frame por frame junto con su transcripción y devolvés un análisis completo, honesto y accionable en español rioplatense. Sé específico y concreto, citando momentos y timestamps cuando corresponda. No inventes contenido que no esté en los frames o la transcripción.`;

const ANALYSIS_TOOL_NAME = "entregar_analisis";

function buildToolSchema() {
  return {
    name: ANALYSIS_TOOL_NAME,
    description: "Entrega el análisis estructurado completo del video.",
    input_schema: z.toJSONSchema(AnalysisSchema) as Anthropic.Tool.InputSchema,
  };
}

export async function analyzeVideo(
  frames: FrameInfo[],
  transcriptSegments: TranscriptSegment[],
  transcriptSource: string
): Promise<Analysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Falta ANTHROPIC_API_KEY en el entorno.");
  }

  const anthropic = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

  const content: Anthropic.ContentBlockParam[] = [
    {
      type: "text",
      text: `Transcripción (fuente: ${transcriptSource}):\n${formatTranscript(transcriptSegments)}\n\nA continuación, los frames del video en orden cronológico:`,
    },
  ];

  for (const frame of frames) {
    content.push({ type: "text", text: `Frame en t=${formatTimestamp(frame.timestampSeconds)}` });
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/jpeg",
        data: readFileSync(frame.path).toString("base64"),
      },
    });
  }

  content.push({
    type: "text",
    text: "Analizá este video y llamá a la herramienta con el análisis completo: gancho de los primeros 2 segundos, técnicas de retención y por qué funcionan (o no), potencial viral con motivos concretos, errores a corregir en estructura/guion/captions, un guion sugerido con estructura viral (hook 0-2s, desarrollo con justificación de retención, CTA final), captions listos para usar, contexto visual escena por escena, transcripción y una descripción de publicación con hashtags.",
  });

  const response = await anthropic.messages.create({
    model,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
    tools: [buildToolSchema()],
    tool_choice: { type: "tool", name: ANALYSIS_TOOL_NAME },
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Claude no devolvió un análisis estructurado.");
  }

  return AnalysisSchema.parse(toolUse.input);
}
