import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "YouTube Transcript Extractor",
  description:
    "Extract text from any YouTube video. Free YouTube transcript extractor converts video speech to readable text with timestamps.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText size={28} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          YouTube Transcript Extractor
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Extract text from any YouTube video instantly. Our YouTube transcript
          extractor pulls the transcript from any video with captions enabled,
          giving you clean, readable text with accurate timestamps.
        </p>

        <h2 className="mt-12 text-xl font-semibold text-foreground">
          Features
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          <li>Extract transcripts from any YouTube video with captions</li>
          <li>Copy with or without timestamps</li>
          <li>Download in multiple formats</li>
          <li>Search within transcripts</li>
          <li>AI-powered summaries (sign in required)</li>
        </ul>

        <div className="mt-12 rounded-xl border border-border bg-surface/50 p-6 text-center">
          <p className="text-sm text-muted">
            Start extracting transcripts from any YouTube video.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Extract Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </StaticPage>
  );
}
