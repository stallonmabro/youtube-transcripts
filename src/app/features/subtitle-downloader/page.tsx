import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Captions } from "lucide-react";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "YouTube Subtitle Downloader",
  description:
    "Download YouTube subtitles and captions in SRT and VTT formats. Extract closed captions from any YouTube video for free.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Captions size={28} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          YouTube Subtitle Downloader
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Download YouTube subtitles and captions as SRT or VTT files. Our free
          YouTube subtitle downloader extracts closed captions from any video
          and converts them to standard subtitle formats.
        </p>

        <h2 className="mt-12 text-xl font-semibold text-foreground">
          Available Formats
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          <li><strong>SRT</strong> — Standard subtitle format for video players like VLC, MPC.</li>
          <li><strong>VTT</strong> — WebVTT format for HTML5 video players.</li>
          <li><strong>TXT</strong> — Plain text with timestamps for easy reading.</li>
        </ul>

        <div className="mt-12 rounded-xl border border-border bg-surface/50 p-6 text-center">
          <p className="text-sm text-muted">
            Paste a YouTube URL to generate and download transcripts.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </StaticPage>
  );
}
