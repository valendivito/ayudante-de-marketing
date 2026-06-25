"use client";

import { useRef, useState, type FormEvent } from "react";

type Mode = "url" | "file";

export function UploadForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const form = new FormData();
    if (mode === "url") {
      if (!url.trim()) {
        setError("Pegá una URL de video.");
        return;
      }
      form.set("url", url.trim());
    } else {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        setError("Elegí un archivo de video.");
        return;
      }
      form.set("file", file);
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/videos", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo enviar el video.");
        return;
      }
      setUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSubmitted();
    } catch {
      setError("No se pudo enviar el video. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="mb-4 flex gap-2">
        <button type="button" onClick={() => setMode("url")} className={tabClass(mode === "url")}>
          URL
        </button>
        <button type="button" onClick={() => setMode("file")} className={tabClass(mode === "file")}>
          Subir archivo
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.tiktok.com/..."
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
      ) : (
        <input ref={fileInputRef} type="file" accept="video/*" className="w-full text-sm" />
      )}

      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {submitting ? "Enviando..." : "Analizar video"}
      </button>
    </form>
  );
}

function tabClass(active: boolean): string {
  return `rounded-full px-3 py-1 text-sm font-medium ${
    active
      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
  }`;
}
