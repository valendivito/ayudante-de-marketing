import { mkdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { updateVideo, getVideo } from "./db";
import { downloadVideo } from "./video/download";
import { getDurationSeconds, extractFrames } from "./video/frames";
import { getTranscript } from "./video/transcribe";
import { analyzeVideo } from "./claude";

const WORK_DIR =
  process.env.WORK_DIR || path.join(/* turbopackIgnore: true */ process.cwd(), "storage", "frames");

export async function processVideo(id: string): Promise<void> {
  const video = await getVideo(id);
  if (!video) return;

  const outDir = path.join(WORK_DIR, id);
  mkdirSync(outDir, { recursive: true });

  try {
    let videoPath: string;
    let subtitlePath: string | null = null;

    if (video.source_type === "url") {
      await updateVideo(id, { status: "downloading", statusDetail: "Descargando video con yt-dlp..." });
      const result = await downloadVideo(video.source, outDir);
      videoPath = result.videoPath;
      subtitlePath = result.subtitlePath;
      if (result.title) await updateVideo(id, { title: result.title });
    } else {
      if (!video.file_path) throw new Error("No se encontró el archivo subido.");
      videoPath = video.file_path;
    }

    const durationSeconds = await getDurationSeconds(videoPath);
    await updateVideo(id, { durationSeconds });

    await updateVideo(id, { status: "extracting_frames", statusDetail: "Extrayendo frames con ffmpeg..." });
    const { frames, longVideoWarning } = await extractFrames(videoPath, outDir, durationSeconds);
    await updateVideo(id, {
      frameCount: frames.length,
      statusDetail: longVideoWarning
        ? `Video largo: análisis con muestreo disperso (${frames.length} frames).`
        : null,
    });

    await updateVideo(id, { status: "transcribing", statusDetail: "Obteniendo transcripción..." });
    const transcriptResult = await getTranscript(videoPath, subtitlePath, outDir);
    await updateVideo(id, {
      transcript: JSON.stringify(transcriptResult.segments),
      transcriptSource: transcriptResult.source,
    });

    await updateVideo(id, { status: "analyzing", statusDetail: "Generando análisis con Claude..." });
    const analysis = await analyzeVideo(
      frames,
      transcriptResult.segments,
      transcriptResult.source
    );

    await updateVideo(id, {
      status: "completed",
      statusDetail: null,
      analysisJson: JSON.stringify(analysis),
    });
  } catch (err) {
    await updateVideo(id, {
      status: "failed",
      statusDetail: null,
      error: err instanceof Error ? err.message : String(err),
    });
  } finally {
    rmSync(outDir, { recursive: true, force: true });
    // El archivo subido ya cumplió su función (se usó para extraer frames/transcripción);
    // no hace falta conservarlo, así no se acumula disco en el servidor.
    if (video.source_type === "upload" && video.file_path && existsSync(video.file_path)) {
      rmSync(video.file_path, { force: true });
    }
  }
}
