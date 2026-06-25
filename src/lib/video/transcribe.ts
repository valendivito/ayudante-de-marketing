import { readFileSync } from "node:fs";
import path from "node:path";
import { run } from "./exec";
import type { TranscriptSegment } from "../types";

export type TranscriptSource = "captions" | "whisper_groq" | "whisper_openai" | "none";

export interface TranscriptResult {
  segments: TranscriptSegment[];
  source: TranscriptSource;
}

function parseTimestamp(ts: string): number {
  const [h, m, s] = ts.split(":");
  return parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseFloat(s.replace(",", "."));
}

/** Minimal WebVTT parser: handles yt-dlp's native + auto-generated caption output. */
export function parseVtt(content: string): TranscriptSegment[] {
  const blocks = content.replace(/\r/g, "").split(/\n\n+/);
  const segments: TranscriptSegment[] = [];
  const cueLine = /(\d{2}:\d{2}:\d{2}[.,]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[.,]\d{3})/;

  for (const block of blocks) {
    const lines = block.split("\n").filter(Boolean);
    const cueLineIndex = lines.findIndex((l) => cueLine.test(l));
    if (cueLineIndex === -1) continue;
    const match = lines[cueLineIndex].match(cueLine);
    if (!match) continue;

    const text = lines
      .slice(cueLineIndex + 1)
      .join(" ")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (!text) continue;

    const start = parseTimestamp(match[1]);
    const end = parseTimestamp(match[2]);

    const previous = segments[segments.length - 1];
    if (previous && previous.text === text) {
      previous.end = end;
      continue;
    }
    segments.push({ start, end, text });
  }

  return segments;
}

async function extractAudio(videoPath: string, outDir: string): Promise<string> {
  const audioPath = path.join(outDir, "audio.mp3");
  await run("ffmpeg", [
    "-y",
    "-i",
    videoPath,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-b:a",
    "64k",
    audioPath,
  ]);
  return audioPath;
}

interface WhisperSegment {
  start: number;
  end: number;
  text: string;
}

async function transcribeWithWhisper(
  audioPath: string,
  apiKey: string,
  baseUrl: string,
  model: string
): Promise<TranscriptSegment[]> {
  const fileBuffer = readFileSync(audioPath);
  const form = new FormData();
  form.append("file", new Blob([fileBuffer], { type: "audio/mpeg" }), "audio.mp3");
  form.append("model", model);
  form.append("response_format", "verbose_json");

  const res = await fetch(`${baseUrl}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Whisper API (${baseUrl}) falló con ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as { segments?: WhisperSegment[]; text?: string };
  if (data.segments && data.segments.length > 0) {
    return data.segments.map((s) => ({ start: s.start, end: s.end, text: s.text.trim() }));
  }
  if (data.text) {
    return [{ start: 0, end: 0, text: data.text.trim() }];
  }
  return [];
}

export async function getTranscript(
  videoPath: string,
  subtitlePath: string | null,
  outDir: string,
  options: { whisperProvider?: "groq" | "openai"; noWhisper?: boolean } = {}
): Promise<TranscriptResult> {
  if (subtitlePath) {
    try {
      const segments = parseVtt(readFileSync(subtitlePath, "utf-8"));
      if (segments.length > 0) {
        return { segments, source: "captions" };
      }
    } catch {
      // fall through to whisper
    }
  }

  if (options.noWhisper) {
    return { segments: [], source: "none" };
  }

  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const preferOpenAi = options.whisperProvider === "openai";

  if ((!groqKey && !openaiKey) || (preferOpenAi && !openaiKey)) {
    return { segments: [], source: "none" };
  }

  const audioPath = await extractAudio(videoPath, outDir);

  if (groqKey && !preferOpenAi) {
    const segments = await transcribeWithWhisper(
      audioPath,
      groqKey,
      "https://api.groq.com/openai/v1",
      "whisper-large-v3"
    );
    return { segments, source: "whisper_groq" };
  }

  if (openaiKey) {
    const segments = await transcribeWithWhisper(
      audioPath,
      openaiKey,
      "https://api.openai.com/v1",
      "whisper-1"
    );
    return { segments, source: "whisper_openai" };
  }

  return { segments: [], source: "none" };
}
