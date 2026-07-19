import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "SRT to ASS Converter — Free Online",
  description:
    "Convert SRT subtitles to ASS (Advanced SubStation Alpha) format. Free online converter for advanced subtitle formatting.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          SRT to ASS Converter
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Convert SRT subtitle files to ASS (Advanced SubStation Alpha) format
          for advanced subtitle styling and positioning. Our converter helps
          you get started with ASS format subtitles.
        </p>

        <div className="mt-12 rounded-xl border border-border bg-surface/50 p-6 text-center">
          <p className="text-sm text-muted">
            First, download your transcript in SRT format.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Generate SRT <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </StaticPage>
  );
}
