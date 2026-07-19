import { NextRequest } from "next/server";
import { saveSharedTranscript, getSharedTranscript } from "@/lib/share";
import { validateVideoId } from "@/lib/utils";
import { MAX_SEGMENTS, MAX_TRANSCRIPT_TEXT_LENGTH } from "@/lib/constants";

function isValidPayload(videoId: string, segments: unknown[]) {
  if (!validateVideoId(videoId) || !Array.isArray(segments)) return false;
  if (segments.length > MAX_SEGMENTS) return false;
  const text = segments.map((s) => (s as { text?: string }).text || "").join("");
  return text.length <= MAX_TRANSCRIPT_TEXT_LENGTH;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.videoId ||
      !body.segments ||
      !Array.isArray(body.segments) ||
      !isValidPayload(body.videoId, body.segments)
    ) {
      return Response.json(
        { error: "A valid videoId and segments array are required" },
        { status: 400 }
      );
    }

    const result = await saveSharedTranscript(body.videoId, body.segments);

    return Response.json({ id: result.id }, { status: 201 });
  } catch (error) {
    console.error("Share save error:", error);
    return Response.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return Response.json(
      { error: "Share ID is required" },
      { status: 400 }
    );
  }

  const data = await getSharedTranscript(id);

  if (!data) {
    return Response.json(
      { error: "Shared transcript not found or has expired" },
      { status: 404 }
    );
  }

  return Response.json(data);
}
