"use client";

import { useState, useCallback } from "react";
import { Download, FileUp, AlertCircle, Check } from "lucide-react";
import { parseSrt, srtToVtt, srtToTxt, srtToAss, downloadFile } from "@/lib/srt";

type ConverterMode = "vtt" | "txt" | "ass" | "view";

interface SrtToolProps {
  mode: ConverterMode;
  title: string;
  description: string;
}

const converters: Record<
  Exclude<ConverterMode, "view">,
  {
    label: string;
    ext: string;
    mime: string;
    convert: (srt: string) => string;
  }
> = {
  vtt: { label: "VTT", ext: "vtt", mime: "text/vtt", convert: srtToVtt },
  txt: { label: "TXT", ext: "txt", mime: "text/plain", convert: srtToTxt },
  ass: { label: "ASS", ext: "ass", mime: "text/plain", convert: srtToAss },
};

export default function SrtTool({ mode, title, description }: SrtToolProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError("");
    try {
      const text = await file.text();
      parseSrt(text);
      setInput(text);
    } catch {
      setError("Could not read the file.");
    }
  }, []);

  function handleDownload() {
    setError("");
    try {
      parseSrt(input);
      if (mode === "view") return;
      const cfg = converters[mode];
      const output = cfg.convert(input);
      downloadFile(output, `subtitles.${cfg.ext}`, cfg.mime);
    } catch {
      setError("Invalid SRT content. Check your input.");
    }
  }

  function handleCopy() {
    if (mode !== "view") return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const entries = (() => {
    try {
      return input ? parseSrt(input) : [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Paste SRT content or upload a file
          </label>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground">
            <FileUp size={14} /> Upload .srt
            <input
              type="file"
              accept=".srt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        </div>

        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="1\n00:00:01,000 --> 00:00:04,000\nHello world"
          className="min-h-[200px] w-full rounded-xl border border-border bg-card p-4 text-sm font-mono text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        {mode !== "view" && (
          <button
            onClick={handleDownload}
            disabled={!input.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 sm:w-auto"
          >
            <Download size={16} />
            Download {converters[mode].label}
          </button>
        )}

        {mode === "view" && (
          <button
            onClick={handleCopy}
            disabled={!input.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 sm:w-auto"
          >
            {copied ? (
              <>
                <Check size={16} /> Copied
              </>
            ) : (
              <>
                <CopyIcon size={16} /> Copy SRT
              </>
            )}
          </button>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      {mode === "view" && entries.length > 0 && (
        <div className="mt-8 rounded-xl border border-border">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
            {entries.length} subtitle{entries.length !== 1 ? "s" : ""}
          </div>
          <div className="max-h-[50vh] overflow-y-auto p-4 space-y-3">
            {entries.map((entry) => (
              <div key={entry.index} className="text-sm">
                <span className="font-mono text-xs text-primary">
                  {`${entry.start} --> ${entry.end}`}
                </span>
                <p className="mt-0.5 whitespace-pre-wrap text-muted">{entry.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CopyIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width={14} height={14} x={8} y={8} rx={2} ry={2} />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
