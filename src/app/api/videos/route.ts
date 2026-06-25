import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createVideo, listVideos, updateVideo } from "@/lib/db";
import { processVideo } from "@/lib/pipeline";
import type { VideoSummary } from "@/lib/types";

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(/* turbopackIgnore: true */ process.cwd(), "storage", "uploads");

export async function GET() {
  const videos: VideoSummary[] = listVideos().map((v) => ({
    id: v.id,
    sourceType: v.source_type,
    source: v.source,
    title: v.title,
    durationSeconds: v.duration_seconds,
    status: v.status,
    statusDetail: v.status_detail,
    error: v.error,
    createdAt: v.created_at,
  }));
  return Response.json({ videos });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const url = form.get("url");
  const file = form.get("file");

  const id = randomUUID();

  if (typeof url === "string" && url.trim()) {
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
    } catch {
      return Response.json({ error: "URL inválida." }, { status: 400 });
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return Response.json({ error: "URL inválida." }, { status: 400 });
    }
    createVideo({ id, sourceType: "url", source: parsed.toString() });
  } else if (file instanceof File) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
    const ext = path.extname(file.name) || ".mp4";
    const filePath = path.join(UPLOAD_DIR, `${id}${ext}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(filePath, buffer);
    createVideo({ id, sourceType: "upload", source: file.name });
    updateVideo(id, { filePath });
  } else {
    return Response.json({ error: "Mandá una URL o un archivo de video." }, { status: 400 });
  }

  processVideo(id).catch((err) => {
    console.error(`processVideo(${id}) failed:`, err);
  });

  return Response.json({ id }, { status: 202 });
}
