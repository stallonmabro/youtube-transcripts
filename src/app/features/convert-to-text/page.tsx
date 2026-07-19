import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TextIcon } from "lucide-react";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Convert YouTube to Text",
  description:
    "Convert any YouTube video to text with our free converter. Extract spoken content from videos and download as TXT, SRT, or VTT.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <TextIcon size={28} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Convert YouTube to Text
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Convert YouTube videos to text in seconds. Our free converter
          extracts spoken content from any YouTube video with captions and
          delivers clean, timestamped text you can copy or download.
        </p>

        <h2 className="mt-12 text-xl font-semibold text-foreground">
          How It Works
        </h2>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-muted">
          <li>Paste a YouTube video URL</li>
          <li>Our tool extracts the transcript automatically</li>
          <li>Copy or download as TXT, SRT, VTT, PDF, or DOCX</li>
        </ol>

        <div className="mt-12 rounded-xl border border-border bg-surface/50 p-6 text-center">
          <p className="text-sm text-muted">
            Convert any YouTube video to text right now.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Convert to Text <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </StaticPage>
  );
}
