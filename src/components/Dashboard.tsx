"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { VideoSummary } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { UploadForm } from "./UploadForm";

const POLL_INTERVAL_MS = 4000;

async function fetchVideos(): Promise<VideoSummary[]> {
  const res = await fetch("/api/videos");
  if (!res.ok) return [];
  const data = (await res.json()) as { videos: VideoSummary[] };
  return data.videos;
}

export function Dashboard() {
  const [videos, setVideos] = useState<VideoSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const data = await fetchVideos();
      if (cancelled) return;
      setVideos(data);
      setLoading(false);
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  async function handleSubmitted() {
    const data = await fetchVideos();
    setVideos(data);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Ayudante de Marketing
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Mandá un video y recibí guion viral, captions, descripción y un análisis completo de
          potencial viral.
        </p>
      </header>

      <UploadForm onSubmitted={handleSubmitted} />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Videos</h2>
        {loading ? (
          <p className="text-sm text-zinc-400">Cargando...</p>
        ) : videos.length === 0 ? (
          <p className="text-sm text-zinc-400">Todavía no mandaste ningún video.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {videos.map((video) => (
              <li key={video.id}>
                <Link
                  href={`/videos/${video.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {video.title || video.source}
                    </span>
                    {video.status === "failed" && video.error ? (
                      <span className="truncate text-xs text-red-600 dark:text-red-400">
                        {video.error}
                      </span>
                    ) : video.statusDetail ? (
                      <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {video.statusDetail}
                      </span>
                    ) : null}
                  </div>
                  <StatusBadge status={video.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
