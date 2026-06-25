import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { run } from "./exec";
import type { FrameInfo } from "../types";

export async function getDurationSeconds(videoPath: string): Promise<number> {
  const { stdout } = await run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    videoPath,
  ]);
  const duration = parseFloat(stdout.trim());
  if (!Number.isFinite(duration)) {
    throw new Error("No se pudo determinar la duración del video.");
  }
  return duration;
}

/** Duration-aware frame budget, mirroring the `watch` skill's logic. Hard cap: 100 frames / 2fps. */
function frameBudget(durationSeconds: number): number {
  if (durationSeconds <= 30) return 30;
  if (durationSeconds <= 60) return 40;
  if (durationSeconds <= 180) return 60;
  if (durationSeconds <= 600) return 80;
  return 100;
}

export interface FrameExtractionResult {
  frames: FrameInfo[];
  longVideoWarning: boolean;
}

export async function extractFrames(
  videoPath: string,
  outDir: string,
  durationSeconds: number,
  options: { maxFrames?: number; resolution?: number } = {}
): Promise<FrameExtractionResult> {
  mkdirSync(outDir, { recursive: true });

  const targetFrames = Math.min(options.maxFrames ?? frameBudget(durationSeconds), 100);
  const fps = Math.min(2, targetFrames / Math.max(durationSeconds, 1));
  const resolution = options.resolution ?? 512;

  await run("ffmpeg", [
    "-y",
    "-i",
    videoPath,
    "-vf",
    `fps=${fps},scale=${resolution}:-1`,
    "-frames:v",
    String(targetFrames),
    "-q:v",
    "3",
    path.join(outDir, "frame_%04d.jpg"),
  ]);

  const files = readdirSync(outDir)
    .filter((f) => /^frame_\d+\.jpg$/.test(f))
    .sort();

  const frames: FrameInfo[] = files.map((file, index) => ({
    path: path.join(outDir, file),
    timestampSeconds: index / fps,
  }));

  return { frames, longVideoWarning: durationSeconds > 600 };
}
