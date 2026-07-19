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

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 500
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * 2 ** i));
      }
    }
  }
  throw lastError;
}

export async function fetchTranscript(
  videoId: string,
  lang = "en"
): Promise<TranscriptResult> {
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    throw new Error("Invalid YouTube video ID.");
  }
  try {
    const transcriptItems = await withRetry(() =>
      YoutubeTranscript.fetchTranscript(videoId, { lang })
    );

    const segments: TranscriptSegment[] = transcriptItems.map((item) => ({
      text: item.text,
      duration: item.duration,
      offset: item.offset,
    }));

    return {
      segments,
      videoId,
      language: lang,
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
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    throw new Error("Invalid YouTube video ID.");
  }
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
