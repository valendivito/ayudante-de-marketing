import type { VideoStatus } from "@/lib/db";

const LABELS: Record<VideoStatus, string> = {
  queued: "En cola",
  downloading: "Descargando",
  extracting_frames: "Extrayendo frames",
  transcribing: "Transcribiendo",
  analyzing: "Analizando",
  completed: "Completado",
  failed: "Error",
};

const STYLES: Record<VideoStatus, string> = {
  queued: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  downloading: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  extracting_frames: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  transcribing: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  analyzing: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const PROCESSING_STATUSES = new Set<VideoStatus>([
  "queued",
  "downloading",
  "extracting_frames",
  "transcribing",
  "analyzing",
]);

export function StatusBadge({ status }: { status: VideoStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {PROCESSING_STATUSES.has(status) && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      )}
      {LABELS[status]}
    </span>
  );
}
