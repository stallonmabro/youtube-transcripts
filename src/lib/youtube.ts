"use server";

import { YoutubeTranscript } from "youtube-transcript";

export interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
}

export interface TranscriptResult {
  segments: TranscriptSegment[];
  videoId: string;
  language: string;
}

export async function fetchTranscript(
  videoId: string
): Promise<TranscriptResult> {
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

    const segments: TranscriptSegment[] = transcriptItems.map((item) => ({
      text: item.text,
      duration: item.duration,
      offset: item.offset,
    }));

    return {
      segments,
      videoId,
      language: "en",
    };
  } catch (error) {
    console.error("Transcript fetch error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch transcript. The video may not have captions available."
    );
  }
}

export async function getVideoInfo(videoId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    // Return minimal info without API key
    return {
      id: videoId,
      title: "YouTube Video",
      channelTitle: "",
      thumbnails: {
        default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
        medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      },
    };
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );
    const data = await res.json();

    if (!data.items?.length) {
      throw new Error("Video not found");
    }

    const snippet = data.items[0].snippet;
    return {
      id: videoId,
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      thumbnails: snippet.thumbnails,
    };
  } catch {
    return {
      id: videoId,
      title: "YouTube Video",
      channelTitle: "",
      thumbnails: {
        default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
        medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      },
    };
  }
}
