import { NextRequest } from "next/server";
import { saveSharedTranscript, getSharedTranscript } from "@/lib/share";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.videoId || !body.segments || !Array.isArray(body.segments)) {
      return Response.json(
        { error: "videoId and segments are required" },
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
