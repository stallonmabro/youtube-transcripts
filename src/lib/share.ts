import type { TranscriptSegment } from "./youtube";
import { createAdminClient } from "./supabase/admin";

export interface SharedTranscript {
  id: string;
  videoId: string;
  segments: TranscriptSegment[];
  createdAt: string;
}

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function saveSharedTranscript(
  videoId: string,
  segments: TranscriptSegment[]
): Promise<SharedTranscript> {
  const supabase = createAdminClient();

  let id = generateId();
  // Ensure uniqueness
  const { data: existing } = await supabase
    .from("shared_transcripts")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (existing) {
    id = generateId();
  }

  const data = {
    id,
    video_id: videoId,
    segments,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const { error } = await supabase.from("shared_transcripts").insert(data);

  if (error) {
    throw new Error(`Failed to save shared transcript: ${error.message}`);
  }

  return {
    id,
    videoId,
    segments,
    createdAt: data.created_at,
  };
}

export async function getSharedTranscript(
  id: string
): Promise<SharedTranscript | null> {
  // Prevent invalid IDs
  if (!/^[a-z0-9]{8}$/.test(id)) return null;

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("shared_transcripts")
    .select("*")
    .eq("id", id)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;

  // Clean up expired entries silently (fire-and-forget)
  supabase
    .from("shared_transcripts")
    .delete()
    .lt("expires_at", new Date().toISOString());

  return {
    id: data.id,
    videoId: data.video_id,
    segments: data.segments as TranscriptSegment[],
    createdAt: data.created_at,
  };
}
