import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Open SRT File Online",
  description:
    "Open and view SRT subtitle files online. Free SRT file viewer that displays subtitles with timestamps in a clean readable format.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Open SRT File Online
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          View SRT subtitle files directly in your browser. Our online SRT
          viewer displays the subtitle text with timestamps in a clean, readable
          format without needing to download any software.
        </p>

        <div className="mt-12 rounded-xl border border-border bg-surface/50 p-6 text-center">
          <p className="text-sm text-muted">
            Generate SRT transcripts from YouTube videos.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Generate Transcript <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </StaticPage>
  );
}
