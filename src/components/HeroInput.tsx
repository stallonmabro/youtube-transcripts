"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { extractVideoId } from "@/lib/utils";

export default function HeroInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError("Invalid YouTube URL. Please paste a valid YouTube video link.");
      return;
    }

    setLoading(true);
    router.push(`/watch?v=${videoId}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="hero-url" className="sr-only">
            YouTube video URL
          </label>
          <input
            id="hero-url"
            type="text"
            value={url}
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
    </form>
  );
}
