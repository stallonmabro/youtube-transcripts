"use client";

import { useState } from "react";
import {
  Languages,
  Loader2,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import type { TranscriptSegment } from "@/lib/youtube";

const LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "ha", name: "Hausa" },
  { code: "yo", name: "Yoruba" },
  { code: "ig", name: "Igbo" },
];

interface TranslatePanelProps {
  transcript: string;
  segments: TranscriptSegment[];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TranslatePanel({ transcript, segments }: TranslatePanelProps) {
  const [targetLang, setTargetLang] = useState("es");
  const [translatedSegments, setTranslatedSegments] = useState<TranscriptSegment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleTranslate() {
    setLoading(true);
    setError("");
    setTranslatedSegments(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segments: segments.map((s) => ({ offset: s.offset, text: s.text })),
          targetLanguage: targetLang,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Translation failed");
      }

      const data = await res.json();
      setTranslatedSegments(data.segments || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to translate"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!translatedSegments || translatedSegments.length === 0) return;
    const text = translatedSegments
      .map((s) => `[${formatTime(s.offset)}] ${s.text}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const langName = LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang;

  return (
    <div className="space-y-4">
      {!translatedSegments && !loading && (
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Languages size={22} />
          </div>
          <h3 className="font-semibold text-foreground">
            Translate Transcript
          </h3>
          <p className="mt-1 text-sm text-muted">
            Translate this transcript to another language while keeping all timestamps intact.
          </p>

          <div className="mx-auto mt-4 max-w-xs">
            <div className="relative">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full appearance-none rounded-lg border border-border bg-card px-3 py-2.5 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <button
            onClick={handleTranslate}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Languages size={16} />
            Translate
          </button>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <Loader2 size={24} className="mx-auto animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted">
            Translating with timestamps preserved...
          </p>
        </div>
      )}

      {translatedSegments && (
        <div className="rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Languages size={16} className="text-primary" />
              Translation — {langName}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">
                {translatedSegments.length} segments
              </span>
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
          </div>
          <div className="max-h-[60vh] space-y-0 overflow-y-auto custom-scrollbar">
            {translatedSegments.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">
                Translation produced no output. Try again.
              </div>
            ) : (
              translatedSegments.map((seg, i) => (
                <div
                  key={i}
                  className={`group flex gap-3 border-b border-border/50 px-4 py-3 transition-colors last:border-0 ${
                    i % 2 === 0 ? "bg-transparent" : "bg-surface/30"
                  } hover:bg-surface/60`}
                >
                  <span className="mt-0.5 shrink-0 select-none text-xs font-medium text-muted/50 tabular-nums">
                    {String(i + 1).padStart(3, "0")}
                  </span>
                  <button
                    className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    title="Jump to this timestamp"
                  >
                    {formatTime(seg.offset)}
                  </button>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {seg.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
