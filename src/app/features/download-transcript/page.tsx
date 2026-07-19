import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Download YouTube Transcript",
  description:
    "Download YouTube transcripts in TXT, SRT, VTT, PDF, and DOCX formats. Copy any transcript with timestamps in one click.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Download size={28} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Download YouTube Transcript
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Download any YouTube video transcript in your preferred format. Our
          free YouTube transcript generator supports TXT, SRT, VTT, PDF, and
          DOCX export formats — all from your browser, no software required.
        </p>

        <h2 className="mt-12 text-xl font-semibold text-foreground">
          Supported Export Formats
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          <li><strong>TXT</strong> — Plain text with timestamps, ready for any text editor.</li>
          <li><strong>SRT</strong> — SubRip subtitle format, compatible with video players.</li>
          <li><strong>VTT</strong> — WebVTT format for web-based video playback.</li>
          <li><strong>PDF</strong> — Printable document with formatted timestamps (sign in required).</li>
          <li><strong>DOCX</strong> — Microsoft Word document (sign in required).</li>
        </ul>

        <div className="mt-12 rounded-xl border border-border bg-surface/50 p-6 text-center">
          <p className="text-sm text-muted">
            Paste any YouTube URL to get started.
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
