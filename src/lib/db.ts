import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase usa un CA propio; en vez de empaquetarlo, confiamos en el cifrado
  // TLS sin validar la cadena de certificados (suficiente para este proyecto).
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
});

// node-postgres: un cliente idle del pool puede emitir 'error' si el servidor
// corta la conexión (ej: tras dormirse en hosting gratuito); sin este handler
// ese evento no manejado tira abajo todo el proceso.
pool.on("error", (err) => {
  console.error("Error en una conexión idle del pool de Postgres:", err);
});

// Si la conexión falla en este punto (ej: DATABASE_URL ausente durante
// `next build`, o la base tarda en levantar), no debe tirar abajo el
// proceso con un unhandled rejection: cada query real más adelante va a
// fallar por su cuenta con un error claro cuando se la awaitee de verdad.
const ready = pool.query(`
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
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  )
`).catch((err) => {
  console.error("No se pudo inicializar la tabla 'videos':", err);
});

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

export async function createVideo(input: {
  id: string;
  sourceType: "url" | "upload";
  source: string;
}): Promise<void> {
  await ready;
  const now = new Date().toISOString();
  await pool.query(
    `INSERT INTO videos (id, source_type, source, status, created_at, updated_at)
     VALUES ($1, $2, $3, 'queued', $4, $4)`,
    [input.id, input.sourceType, input.source, now]
  );
}

export async function updateVideo(
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
): Promise<void> {
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
      values.push((fields as Record<string, unknown>)[key]);
      sets.push(`${column} = $${values.length}`);
    }
  }
  if (sets.length === 0) return;

  values.push(new Date().toISOString());
  sets.push(`updated_at = $${values.length}`);

  values.push(id);

  await ready;
  await pool.query(`UPDATE videos SET ${sets.join(", ")} WHERE id = $${values.length}`, values);
}

export async function getVideo(id: string): Promise<VideoRow | undefined> {
  await ready;
  const result = await pool.query("SELECT * FROM videos WHERE id = $1", [id]);
  return result.rows[0] as VideoRow | undefined;
}

export async function listVideos(): Promise<VideoRow[]> {
  await ready;
  const result = await pool.query("SELECT * FROM videos ORDER BY created_at DESC");
  return result.rows as VideoRow[];
}

export default pool;
