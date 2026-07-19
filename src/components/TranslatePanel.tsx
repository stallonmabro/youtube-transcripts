"use client";

import { useState } from "react";
import {
  Languages,
  Loader2,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";

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
];

interface TranslatePanelProps {
  transcript: string;
}

export default function TranslatePanel({ transcript }: TranslatePanelProps) {
  const [targetLang, setTargetLang] = useState("es");
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleTranslate() {
    setLoading(true);
    setError("");
    setTranslation(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript, targetLanguage: targetLang }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Translation failed");
      }

      const data = await res.json();
      setTranslation(data.translation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to translate"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!translation) return;
    navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {!translation && !loading && (
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Languages size={22} />
          </div>
          <h3 className="font-semibold text-foreground">
            Translate Transcript
          </h3>
          <p className="mt-1 text-sm text-muted">
            Translate this transcript to another language.
          </p>

          <div className="mx-auto mt-4 max-w-xs">
            <div className="relative">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full appearance-none rounded-lg border border-border bg-white px-3 py-2.5 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            Translating...
          </p>
        </div>
      )}

      {translation && (
        <div className="rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Languages size={16} className="text-primary" />
              Translation (
              {LANGUAGES.find((l) => l.code === targetLang)?.name ||
                targetLang}
              )
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
            {translation}
          </div>
        </div>
      )}
    </div>
  );
}
