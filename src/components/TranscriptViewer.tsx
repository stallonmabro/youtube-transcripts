"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Copy,
  Check,
  Download,
  Search,
  Clock,
  FileText,
  MessageSquareQuote,
  Loader2,
  ChevronDown,
  Share2,
  Bookmark,
  BookmarkCheck,
  Lock,
  LogIn,
  Sparkles,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  exportTxt,
  exportSrt,
  exportVtt,
  exportPdf,
  exportDocx,
} from "@/lib/export";
import SummaryPanel from "./SummaryPanel";
import ChatPanel from "./ChatPanel";
import TranslatePanel from "./TranslatePanel";
import ShareModal from "./ShareModal";
import AuthModal from "./AuthModal";
import { useAuth } from "./AuthProvider";
import type { TranscriptSegment } from "@/lib/youtube";

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  videoId: string;
  videoInfo?: {
    title: string;
    channelTitle: string;
    thumbnails: {
      default?: string;
      medium?: string;
      high?: string;
    };
  };
}

type ActiveTab = "transcript" | "summary" | "chat" | "translate";
type CopyMode = "text" | "timestamps";

export default function TranscriptViewer({
  segments,
  videoId,
  videoInfo,
}: TranscriptViewerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("transcript");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState<CopyMode | null>(null);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();

  // Log usage on mount (once per transcript view)
  useEffect(() => {
    fetch("/api/usage/log", { method: "POST" }).catch(() => {});
  }, []);

  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    const q = searchQuery.toLowerCase();
    return segments.filter((s) => s.text.toLowerCase().includes(q));
  }, [segments, searchQuery]);

  const fullText = segments.map((s) => s.text).join(" ");

  const wordCount = useMemo(
    () => fullText.split(/\s+/).filter(Boolean).length,
    [fullText]
  );

  const durationMinutes = useMemo(() => {
    const last = segments[segments.length - 1];
    return last ? Math.ceil((last.offset + last.duration) / 60) : 0;
  }, [segments]);

  function handleCopy(mode: CopyMode) {
    const text =
      mode === "timestamps"
        ? segments
            .map(
              (s) =>
                `${formatTime(s.offset)}\n${s.text}`
            )
            .join("\n\n")
        : fullText;

    navigator.clipboard.writeText(text);
    setCopied(mode);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleDownload(
    format: "txt" | "srt" | "vtt" | "pdf" | "docx"
  ) {
    if (!user && (format === "pdf" || format === "docx")) return;
    switch (format) {
      case "txt":
        exportTxt(segments, videoId);
        break;
      case "srt":
        exportSrt(segments, videoId);
        break;
      case "vtt":
        exportVtt(segments, videoId);
        break;
      case "pdf":
        exportPdf(segments, videoId, `YouTube Transcript — ${videoId}`);
        break;
      case "docx":
        exportDocx(segments, videoId);
        break;
    }
    setDownloadOpen(false);
  }

  async function handleSaveToHistory() {
    setSaving(true);
    try {
      await fetch("/api/transcripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: videoId,
          segments,
          duration_minutes: durationMinutes,
          word_count: wordCount,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  function jumpToVideo(offset: number) {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "#youtube-player"
    );
    if (iframe) {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [offset, true],
        }),
        "*"
      );
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Video info */}
      {videoInfo && videoInfo.title !== "YouTube Video" && (
        <div className="mb-4 flex items-center gap-4">
          <img
            src={videoInfo.thumbnails?.medium || videoInfo.thumbnails?.default}
            alt=""
            className="h-20 w-36 rounded-lg object-cover shadow-sm"
          />
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground leading-snug line-clamp-2">
              {videoInfo.title}
            </h2>
            {videoInfo.channelTitle && (
              <p className="mt-1 text-sm text-muted">{videoInfo.channelTitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <FileText size={14} />
          {segments.length} segments
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageSquareQuote size={14} />
          {wordCount.toLocaleString()} words
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} />
          {durationMinutes} min
        </span>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex items-center border-b border-border">
        <button
          onClick={() => setActiveTab("transcript")}
          className={cn(
            "px-4 py-3 text-sm font-medium transition-colors",
            activeTab === "transcript"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted hover:text-foreground"
          )}
        >
          Transcript
        </button>
        <button
          onClick={() => {
            if (!user) {
              setAuthOpen(true);
              return;
            }
            setActiveTab("summary");
          }}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === "summary"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted hover:text-foreground"
          )}
        >
          {!user && <Lock size={12} />}
          Summary
        </button>
        <button
          onClick={() => {
            if (!user) {
              setAuthOpen(true);
              return;
            }
            setActiveTab("chat");
          }}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === "chat"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted hover:text-foreground"
          )}
        >
          {!user && <Lock size={12} />}
          Chat
        </button>
        <button
          onClick={() => {
            if (!user) {
              setAuthOpen(true);
              return;
            }
            setActiveTab("translate");
          }}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === "translate"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted hover:text-foreground"
          )}
        >
          {!user && <Lock size={12} />}
          Translate
        </button>
      </div>

      {activeTab === "transcript" ? (
        <>
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transcript..."
                className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy("text")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                {copied === "text" ? (
                  <>
                    <Check size={14} className="text-green-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy
                  </>
                )}
              </button>

              <button
                onClick={() => handleCopy("timestamps")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                {copied === "timestamps" ? (
                  <>
                    <Check size={14} className="text-green-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy w/ Time
                  </>
                )}
              </button>

              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                <Share2 size={14} /> Share
              </button>

              {user && (
                <button
                  onClick={handleSaveToHistory}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : saved ? (
                    <BookmarkCheck size={14} className="text-green-500" />
                  ) : (
                    <Bookmark size={14} />
                  )}
                  {saved ? "Saved" : "Save"}
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setDownloadOpen(!downloadOpen)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  <Download size={14} /> Download
                  <ChevronDown size={12} />
                </button>

                {downloadOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDownloadOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-border bg-card shadow-lg">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted/60">
                        Text
                      </div>
                      {(["txt", "srt", "vtt"] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => handleDownload(fmt)}
                          className="block w-full px-4 py-2 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                        >
                          .{fmt.toUpperCase()}
                        </button>
                      ))}
                      <div className="border-t border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted/60">
                        Document
                      </div>
                      {(["pdf", "docx"] as const).map((fmt) =>
                        user ? (
                          <button
                            key={fmt}
                            onClick={() => handleDownload(fmt)}
                            className="block w-full px-4 py-2 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-foreground last:rounded-b-lg"
                          >
                            .{fmt.toUpperCase()}
                          </button>
                        ) : (
                          <button
                            key={fmt}
                            disabled
                            className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-muted/50 last:rounded-b-lg"
                            title="Sign in to unlock"
                          >
                            <span>.{fmt.toUpperCase()}</span>
                            <Lock size={12} />
                          </button>
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Transcript content */}
          <div className="max-h-[60vh] space-y-0 overflow-y-auto rounded-xl border border-border custom-scrollbar">
            {filteredSegments.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">
                {searchQuery
                  ? "No matching segments found."
                  : "No transcript segments available."}
              </div>
            ) : (
              filteredSegments.map((segment, i) => (
                <div
                  key={i}
                  className="group flex gap-3 border-b border-border/50 px-4 py-3 transition-colors last:border-0 hover:bg-surface/50"
                >
                  <button
                    onClick={() => jumpToVideo(segment.offset)}
                    className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    title="Jump to this timestamp"
                  >
                    {formatTime(segment.offset)}
                  </button>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {segment.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {searchQuery && filteredSegments.length > 0 && (
            <p className="mt-2 text-xs text-muted">
              Found {filteredSegments.length} matching segment
              {filteredSegments.length !== 1 ? "s" : ""}
            </p>
          )}
        </>
      ) : activeTab === "summary" ? (
        user ? (
          <SummaryPanel transcript={fullText} />
        ) : (
          <div className="rounded-xl border border-border bg-surface/30 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles size={22} />
            </div>
            <h3 className="font-semibold text-foreground">
              AI-Powered Summary
            </h3>
            <p className="mt-1 text-sm text-muted">
              Sign in to generate AI summaries of any transcript.
            </p>
            <button
              onClick={() => setAuthOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <LogIn size={16} />
              Sign In
            </button>
          </div>
        )
      ) : activeTab === "chat" ? (
        user ? (
          <ChatPanel transcript={fullText} />
        ) : (
          <div className="rounded-xl border border-border bg-surface/30 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles size={22} />
            </div>
            <h3 className="font-semibold text-foreground">
              AI Chat
            </h3>
            <p className="mt-1 text-sm text-muted">
              Sign in to ask questions about this transcript.
            </p>
            <button
              onClick={() => setAuthOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <LogIn size={16} />
              Sign In
            </button>
          </div>
        )
      ) : (
        user ? (
          <TranslatePanel transcript={fullText} />
        ) : (
          <div className="rounded-xl border border-border bg-surface/30 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Languages size={22} />
            </div>
            <h3 className="font-semibold text-foreground">
              Translate
            </h3>
            <p className="mt-1 text-sm text-muted">
              Sign in to translate this transcript.
            </p>
            <button
              onClick={() => setAuthOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <LogIn size={16} />
              Sign In
            </button>
          </div>
        )
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        videoId={videoId}
        segments={segments}
      />
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
