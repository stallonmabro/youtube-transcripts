"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, X, Copy, Check, Loader2 } from "lucide-react";
import type { TranscriptSegment } from "@/lib/youtube";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  videoId: string;
  segments: TranscriptSegment[];
}

export default function ShareModal({
  open,
  onClose,
  videoId,
  segments,
}: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);

    // Focus trap: focus the dialog on open
    setTimeout(() => dialogRef.current?.focus(), 50);

    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  async function generateShareLink() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, segments }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create share link");
      }

      const data = await res.json();
      const url = `${window.location.origin}/share/${data.id}`;
      setShareUrl(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create share link"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-opacity duration-200"
      onClick={handleBackdrop}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Share transcript"
        className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold text-foreground">
          Share Transcript
        </h3>
        <p className="mt-1 text-sm text-muted">
          Create a shareable link to this transcript.
        </p>

        {!shareUrl && !loading && (
          <button
            onClick={generateShareLink}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Share2 size={16} />
            Generate Share Link
          </button>
        )}

        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border bg-surface py-4">
            <Loader2 size={18} className="animate-spin text-primary" />
            <span className="text-sm text-muted">
              Generating share link...
            </span>
          </div>
        )}

        {shareUrl && (
          <>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-surface p-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-2 py-1 text-sm text-foreground outline-none"
              />
              <button
                onClick={handleCopy}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {copied ? (
                  <>
                    <Check size={14} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted/60">
              Anyone with this link can view the transcript.
            </p>
          </>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
