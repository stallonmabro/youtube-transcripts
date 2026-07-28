"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SummaryLength = "brief" | "detailed" | "bullets";

interface SummaryPanelProps {
  transcript: string;
}

function renderMarkdown(text: string): React.ReactNode {
  // Split into blocks (paragraphs separated by blank lines)
  const blocks = text.split(/\n\n+/);

  return blocks.map((block, bi) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Bullet list detection: lines that start with - * • or numbered 1. 2.
    const lines = trimmed.split("\n");
    const isBulletList = lines.every(
      (l) => /^[-*•]\s/.test(l.trim()) || /^\d+[.)]\s/.test(l.trim())
    );

    if (isBulletList) {
      return (
        <ul key={bi} className="mb-3 space-y-1 pl-5">
          {lines.map((line, li) => {
            const cleaned = line.replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s*/, "");
            return (
              <li key={li} className="text-sm leading-relaxed text-foreground/85">
                {formatInlineMarkdown(cleaned)}
              </li>
            );
          })}
        </ul>
      );
    }

    // Bold heading detection (line that is entirely bold or ends with :)
    const isHeading =
      /^\*\*.*\*\*$/.test(trimmed) ||
      (lines.length === 1 && trimmed.endsWith(":") && trimmed.length < 80);

    if (isHeading) {
      return (
        <h4 key={bi} className="mb-2 mt-4 text-sm font-bold text-foreground first:mt-0">
          {formatInlineMarkdown(trimmed.replace(/^\*\*|\*\*$/g, ""))}
        </h4>
      );
    }

    // Regular paragraph
    return (
      <p key={bi} className="mb-3 text-sm leading-relaxed text-foreground/85 last:mb-0">
        {formatInlineMarkdown(trimmed)}
      </p>
    );
  });
}

function formatInlineMarkdown(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
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
          <div className="px-5 py-4">
            {renderMarkdown(summary)}
          </div>
        </div>
      )}
    </div>
  );
}
