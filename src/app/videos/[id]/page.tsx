import Link from "next/link";
import { VideoDetail } from "@/components/VideoDetail";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        ← Volver
      </Link>
      <VideoDetail id={id} />
    </div>
  );
}
