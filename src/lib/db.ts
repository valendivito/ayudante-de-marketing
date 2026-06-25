import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

const DB_PATH =
  process.env.DATABASE_PATH || path.join(/* turbopackIgnore: true */ process.cwd(), "storage", "db.sqlite");

mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH, { timeout: 5000 });

db.exec("PRAGMA journal_mode = WAL;");

db.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    source_type TEXT NOT NULL,
    source TEXT NOT NULL,
    file_path TEXT,
    title TEXT,
    duration_seconds REAL,
    status TEXT NOT NULL DEFAULT 'queued',
    status_detail TEXT,
    error TEXT,
    frame_count INTEGER,
    transcript TEXT,
    transcript_source TEXT,
    analysis_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

export type VideoStatus =
  | "queued"
  | "downloading"
  | "extracting_frames"
  | "transcribing"
  | "analyzing"
  | "completed"
  | "failed";

export interface VideoRow {
  id: string;
  source_type: "url" | "upload";
  source: string;
  file_path: string | null;
  title: string | null;
  duration_seconds: number | null;
  status: VideoStatus;
  status_detail: string | null;
  error: string | null;
  frame_count: number | null;
  transcript: string | null;
  transcript_source: string | null;
  analysis_json: string | null;
  created_at: string;
  updated_at: string;
}

export function createVideo(input: {
  id: string;
  sourceType: "url" | "upload";
  source: string;
}): void {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO videos (id, source_type, source, status, created_at, updated_at)
     VALUES (?, ?, ?, 'queued', ?, ?)`
  ).run(input.id, input.sourceType, input.source, now, now);
}

export function updateVideo(
  id: string,
  fields: Partial<{
    filePath: string | null;
    title: string | null;
    durationSeconds: number | null;
    status: VideoStatus;
    statusDetail: string | null;
    error: string | null;
    frameCount: number | null;
    transcript: string | null;
    transcriptSource: string | null;
    analysisJson: string | null;
  }>
): void {
  const columns: Record<string, string> = {
    filePath: "file_path",
    title: "title",
    durationSeconds: "duration_seconds",
    status: "status",
    statusDetail: "status_detail",
    error: "error",
    frameCount: "frame_count",
    transcript: "transcript",
    transcriptSource: "transcript_source",
    analysisJson: "analysis_json",
  };

  const sets: string[] = [];
  const values: unknown[] = [];
  for (const [key, column] of Object.entries(columns)) {
    if (key in fields) {
      sets.push(`${column} = ?`);
      values.push((fields as Record<string, unknown>)[key]);
    }
  }
  if (sets.length === 0) return;

  sets.push("updated_at = ?");
  values.push(new Date().toISOString());
  values.push(id);

  db.prepare(`UPDATE videos SET ${sets.join(", ")} WHERE id = ?`).run(...(values as never[]));
}

export function getVideo(id: string): VideoRow | undefined {
  return db.prepare("SELECT * FROM videos WHERE id = ?").get(id) as unknown as
    | VideoRow
    | undefined;
}

export function listVideos(): VideoRow[] {
  return db.prepare("SELECT * FROM videos ORDER BY created_at DESC").all() as unknown as VideoRow[];
}

export default db;
