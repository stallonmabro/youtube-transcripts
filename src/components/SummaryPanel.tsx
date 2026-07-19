"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SummaryLength = "brief" | "detailed" | "bullets";

interface SummaryPanelProps {
  transcript: string;
}

export default function SummaryPanel({ transcript }: SummaryPanelProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [length, setLength] = useState<SummaryLength>("brief");
  const [copied, setCopied] = useState(false);

  async function generateSummary() {
    setLoading(true);
    setError("");
    setSummary(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, length }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate summary");
      }

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate summary"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {!summary && !loading && (
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles size={22} />
          </div>
          <h3 className="font-semibold text-foreground">
            AI-Powered Summary
          </h3>
          <p className="mt-1 text-sm text-muted">
            Get key points and takeaways from this video instantly.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            {(["brief", "detailed", "bullets"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setLength(opt)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  length === opt
                    ? "bg-primary text-white"
                    : "bg-card text-muted hover:text-foreground border border-border"
                )}
              >
                {opt === "brief"
                  ? "Brief"
                  : opt === "detailed"
                    ? "Detailed"
                    : "Bullet Points"}
              </button>
            ))}
          </div>

          <button
            onClick={generateSummary}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Sparkles size={16} />
            Generate Summary
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <Loader2 size={24} className="mx-auto animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted">
            Generating AI summary...
          </p>
        </div>
      )}

      {summary && (
        <div className="rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles size={16} className="text-primary" />
              AI Summary
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-500" /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy
                </>
              )}
            </button>
          </div>
          <div className="whitespace-pre-wrap px-4 py-4 text-sm leading-relaxed text-muted">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}
