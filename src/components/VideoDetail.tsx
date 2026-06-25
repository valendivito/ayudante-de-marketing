"use client";

import { useEffect, useState } from "react";
import type { VideoDetail as VideoDetailData } from "@/lib/types";
import { AnalysisView } from "./AnalysisView";
import { StatusBadge } from "./StatusBadge";

const POLL_INTERVAL_MS = 3000;
const DONE_STATUSES = new Set(["completed", "failed"]);

export function VideoDetail({ id }: { id: string }) {
  const [video, setVideo] = useState<VideoDetailData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      const res = await fetch(`/api/videos/${id}`);
      if (cancelled) return;
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const data = (await res.json()) as VideoDetailData;
      setVideo(data);
      if (!DONE_STATUSES.has(data.status)) {
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id]);

  if (notFound) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">No se encontró ese video.</p>;
  }

  if (!video) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Cargando...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {video.title || video.source}
          </h1>
          {video.statusDetail && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{video.statusDetail}</p>
          )}
        </div>
        <StatusBadge status={video.status} />
      </div>

      {video.status === "failed" && video.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {video.error}
        </p>
      )}

      {video.analysis ? (
        <AnalysisView analysis={video.analysis} />
      ) : (
        video.status !== "failed" && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Analizando el video, esto puede tardar unos minutos...
          </p>
        )
      )}
    </div>
  );
}
