"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Check, LogIn } from "lucide-react";
import { extractVideoId } from "@/lib/utils";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    count: number;
    limit: number;
  } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRateLimitInfo(null);

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError(
        "Invalid YouTube URL. Please paste a valid YouTube video link."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/usage/check");
      const data = await res.json();

      if (!data.allowed) {
        setRateLimitInfo({ count: data.count, limit: data.limit });
        setLoading(false);
        return;
      }
    } catch {
      // proceed even if check fails
    }

    router.push(`/watch?v=${videoId}`);
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-indigo-50/50 to-background">
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Check size={12} />
            Free &bull; 3 free daily &bull; Sign in for 100/day
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            YouTube Transcript
            <span className="mt-2 block text-primary">Generator</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Easily convert a YouTube video to transcript, copy and download the
            generated YouTube transcript in one click. Our free{" "}
            <strong>YouTube transcript generator</strong> extracts text from any
            video with timestamps, AI summaries, and multiple export formats —
            no sign-up required.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <label htmlFor="youtube-url" className="sr-only">
                  YouTube video URL
                </label>
                <input
                  id="youtube-url"
                  type="text"
                  value={url}
                  data-shortcut="search"
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError("");
                  }}
                  placeholder="Paste YouTube video URL here..."
                  className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Generate Transcript
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-left text-sm text-red-500">{error}</p>
            )}
            {rateLimitInfo && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left">
                <p className="text-sm font-medium text-amber-800">
                  Daily limit reached ({rateLimitInfo.count}/{rateLimitInfo.limit})
                </p>
                <p className="mt-1 text-xs text-amber-700">
                  Sign in to generate up to 100 transcripts per day.
                </p>
                <a
                  href="/?signin=true"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:underline"
                >
                  <LogIn size={12} />
                  Sign in
                </a>
              </div>
            )}
          </form>

          <p className="mt-6 text-xs text-muted/60">
            Extract &amp; Download Youtube Transcripts In Seconds &bull;
            Supports URLs, Shorts &amp; video IDs &bull; Works on any device
          </p>
        </div>
      </div>
    </section>
  );
}
