import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { run } from "./exec";

export interface DownloadResult {
  videoPath: string;
  subtitlePath: string | null;
  title: string | null;
}

/** Downloads a video + native subtitles (if available) via yt-dlp into outDir. */
export async function downloadVideo(url: string, outDir: string): Promise<DownloadResult> {
  mkdirSync(outDir, { recursive: true });
  const outTemplate = path.join(outDir, "source.%(ext)s");

  await run("yt-dlp", [
    "-f",
    "bv*[height<=1080]+ba/b[height<=1080]/b",
    "--merge-output-format",
    "mp4",
    "--write-subs",
    "--write-auto-subs",
    "--sub-langs",
    "es,es-419,en,en-US",
    "--convert-subs",
    "vtt",
    "--no-playlist",
    "-o",
    outTemplate,
    url,
  ]);

  const files = readdirSync(outDir);
  const videoFile = files.find((f) => /^source\.(mp4|mkv|webm|mov)$/i.test(f));
  const subtitleFile = files.find((f) => /^source\..*\.vtt$/i.test(f));

  if (!videoFile) {
    throw new Error("yt-dlp no descargó ningún archivo de video reconocible.");
  }

  let title: string | null = null;
  try {
    const { stdout } = await run("yt-dlp", ["--no-playlist", "--print", "%(title)s", url]);
    title = stdout.trim() || null;
  } catch {
    title = null;
  }

  return {
    videoPath: path.join(outDir, videoFile),
    subtitlePath: subtitleFile ? path.join(outDir, subtitleFile) : null,
    title,
  };
}
