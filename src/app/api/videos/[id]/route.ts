import { getVideo } from "@/lib/db";
import type { Analysis, TranscriptSegment, VideoDetail } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const video = await getVideo(id);
  if (!video) {
    return Response.json({ error: "Video no encontrado." }, { status: 404 });
  }

  let analysis: Analysis | null = null;
  if (video.analysis_json) {
    try {
      analysis = JSON.parse(video.analysis_json) as Analysis;
    } catch {
      analysis = null;
    }
  }

  let transcript: TranscriptSegment[] | null = null;
  if (video.transcript) {
    try {
      transcript = JSON.parse(video.transcript) as TranscriptSegment[];
    } catch {
      transcript = null;
    }
  }

  const detail: VideoDetail = {
    id: video.id,
    sourceType: video.source_type,
    source: video.source,
    title: video.title,
    durationSeconds: video.duration_seconds,
    status: video.status,
    statusDetail: video.status_detail,
    error: video.error,
    frameCount: video.frame_count,
    transcript,
    transcriptSource: video.transcript_source,
    analysis,
    createdAt: video.created_at,
    updatedAt: video.updated_at,
  };

  return Response.json(detail);
}
