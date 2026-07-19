"use client";

import { ArrowLeft, Clock, FileText, MessageSquareQuote } from "lucide-react";
import type { SharedTranscript } from "@/lib/share";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SharedTranscriptView({
  data,
}: {
  data: SharedTranscript;
}) {
  const segments = data.segments;
  const fullText = segments.map((s) => s.text).join(" ");
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  const last = segments[segments.length - 1];
  const durationMinutes = last
    ? Math.ceil((last.offset + last.duration) / 60)
    : 0;

  const shareDate = new Date(data.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white text-xs font-bold">
              YT
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              YouTube <span className="text-primary">Transcripts</span>
            </span>
          </a>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Generate your own transcript
          </a>
        </div>

        <div className="mx-auto mt-4 max-w-4xl px-4 sm:px-6">
          <div className="aspect-video overflow-hidden rounded-xl bg-black shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${data.videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
              title="YouTube video player"
            />
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          {/* Info bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <FileText size={14} />
                {segments.length} segments
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquareQuote size={14} />
                {wordCount.toLocaleString()} words
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} />
                {durationMinutes} min
              </span>
            </div>
            <span className="text-xs text-muted/60">
              Shared on {shareDate}
            </span>
          </div>

          <div className="rounded-xl border border-border bg-surface/30 p-3 text-center text-xs text-muted/60">
            This transcript was shared via YouTube Transcripts.{" "}
            <a href="/" className="text-primary hover:underline">
              Generate your own transcripts for free
            </a>
          </div>

          {/* Transcript content */}
          <div className="mt-4 max-h-[60vh] space-y-0 overflow-y-auto rounded-xl border border-border custom-scrollbar">
            {segments.map((segment, i) => (
              <div
                key={i}
                className="flex gap-3 border-b border-border/50 px-4 py-3 transition-colors last:border-0"
              >
                <span className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-medium text-primary">
                  {formatTime(segment.offset)}
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {segment.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
