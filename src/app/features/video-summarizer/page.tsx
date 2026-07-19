import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "YouTube Video Summarizer — AI-Powered",
  description:
    "Summarize any YouTube video with AI. Get brief, detailed, or bullet-point summaries of YouTube transcripts instantly.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles size={28} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          YouTube Video Summarizer
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Get key takeaways from any YouTube video without watching the entire
          thing. Our AI-powered YouTube video summarizer extracts the most
          important points from any transcript in seconds.
        </p>

        <h2 className="mt-12 text-xl font-semibold text-foreground">
          Summary Types
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          <li><strong>Brief</strong> — 2-3 sentence overview of the main topic and key takeaway.</li>
          <li><strong>Detailed</strong> — Comprehensive summary covering main topics and conclusions.</li>
          <li><strong>Bullet Points</strong> — Scannable list of key ideas and takeaways.</li>
        </ul>

        <div className="mt-12 rounded-xl border border-border bg-surface/50 p-6 text-center">
          <p className="text-sm text-muted">
            Sign in to generate AI summaries of any transcript.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Try It Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </StaticPage>
  );
}
