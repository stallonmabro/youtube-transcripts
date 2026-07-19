import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "SRT to VTT Converter — Free Online",
  description:
    "Convert SRT subtitles to VTT format online for free. Easy SRT to WebVTT converter for HTML5 video players.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          SRT to VTT Converter
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Convert SRT subtitle files to WebVTT (VTT) format for use in HTML5
          video players. Our free converter is fast, secure, and works entirely
          in your browser.
        </p>

        <h2 className="mt-12 text-xl font-semibold text-foreground">
          How to Convert SRT to VTT
        </h2>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-muted">
          <li>First, download your transcript in SRT format using our YouTube transcript generator</li>
          <li>Upload the SRT file to any SRT-to-VTT converter tool</li>
          <li>Download the converted VTT file for use in your video player</li>
        </ol>

        <div className="mt-12 rounded-xl border border-border bg-surface/50 p-6 text-center">
          <p className="text-sm text-muted">
            Generate SRT transcripts from YouTube videos first.
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
