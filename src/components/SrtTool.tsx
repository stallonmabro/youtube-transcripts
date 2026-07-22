"use client";

import { useState, useCallback } from "react";
import {
  Download,
  FileUp,
  AlertCircle,
  Check,
  Copy,
  RefreshCw,
} from "lucide-react";
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

const toolLinks = [
  { href: "/srt-to-vtt", label: "SRT to VTT" },
  { href: "/srt-to-txt", label: "SRT to TXT" },
  { href: "/srt-to-ass", label: "SRT to ASS" },
  { href: "/open-srt-file", label: "Open SRT File" },
];

export default function SrtTool({ mode, title, description }: SrtToolProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError("");
    setConverted(false);
    setOutput("");
    try {
      const text = await file.text();
      parseSrt(text);
      setInput(text);
    } catch {
      setError("Could not read the file.");
    }
  }, []);

  function handleConvert() {
    setError("");
    setConverted(false);
    try {
      parseSrt(input);
      if (mode === "view") {
        setOutput(input);
      } else {
        const cfg = converters[mode];
        setOutput(cfg.convert(input));
      }
      setConverted(true);
    } catch {
      setError("Invalid SRT content. Check your input and try again.");
    }
  }

  function handleDownload() {
    if (!output) return;
    if (mode === "view") return;
    const cfg = converters[mode];
    downloadFile(output, `subtitles.${cfg.ext}`, cfg.mime);
  }

  function handleCopy() {
    const text = mode === "view" ? input : output;
    if (!text) return;
    navigator.clipboard.writeText(text);
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
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted">
          {description}
        </p>
      </div>

      {/* Side-by-side tool area */}
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {/* Input */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              SRT Input
            </label>
            <div className="flex gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground">
                <FileUp size={14} /> Upload .srt
                <input
                  type="file"
                  accept=".srt"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFile(e.target.files[0])
                  }
                />
              </label>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
              setConverted(false);
            }}
            placeholder={`1\n00:00:01,000 --> 00:00:04,000\nHello world`}
            className="min-h-[300px] w-full rounded-xl border border-border bg-card p-4 font-mono text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
          />
          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw size={16} />
            {mode === "view" ? "Preview" : `Convert to ${converters[mode]?.label ?? "text"}`}
          </button>
        </div>

        {/* Output */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              {mode === "view" ? "SRT Preview" : `${converters[mode]?.label ?? ""} Output`}
            </label>
            {converted && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy
                    </>
                  )}
                </button>
                {mode !== "view" && (
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
                  >
                    <Download size={14} /> Download
                  </button>
                )}
              </div>
            )}
          </div>
          <div
            className={`min-h-[300px] w-full rounded-xl border border-border p-4 font-mono text-sm overflow-y-auto ${
              converted
                ? "bg-surface text-foreground"
                : "bg-surface/50 text-muted"
            }`}
          >
            {converted ? (
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {output}
              </pre>
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center text-center text-sm">
                Converted output will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Tool links */}
      <div className="mt-14 border-t border-border pt-10">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          All SRT Tools
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {toolLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
