"use client";

import { useState } from "react";
import { Trash2, ExternalLink, Search, Clock, FileText, MessageSquareQuote, Activity, CalendarDays } from "lucide-react";

interface Transcript {
  id: string;
  video_id: string;
  video_title: string | null;
  channel_name: string | null;
  duration_minutes: number | null;
  word_count: number | null;
  created_at: string;
}

export default function DashboardContent({
  transcripts: initial,
  todayUsage,
  monthUsage,
  totalTranscripts,
}: {
  transcripts: Transcript[];
  todayUsage: number;
  monthUsage: number;
  totalTranscripts: number;
}) {
  const [transcripts, setTranscripts] = useState(initial);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = search.trim()
    ? transcripts.filter(
        (t) =>
          t.video_title?.toLowerCase().includes(search.toLowerCase()) ||
          t.video_id.toLowerCase().includes(search.toLowerCase())
      )
    : transcripts;

  async function handleDelete(id: string) {
    setDeleting(id);
    setError("");
    try {
      const res = await fetch(`/api/transcripts?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setTranscripts((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete transcript");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Usage stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Activity size={14} />
            Today
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{todayUsage}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <CalendarDays size={14} />
            This Month
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{monthUsage}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <FileText size={14} />
            Saved
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{totalTranscripts}</p>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-foreground">My Transcripts</h1>
      <p className="mt-1 text-sm text-muted">
        View and manage your saved transcripts.
      </p>

      <div className="mt-6 relative max-w-md">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={search}
          data-shortcut="search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transcripts..."
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border p-12 text-center text-sm text-muted">
          {search
            ? "No transcripts match your search."
            : "No saved transcripts yet. Generate your first transcript!"}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-surface/50"
            >
              <div className="min-w-0 flex-1">
                <a
                  href={`/watch?v=${t.video_id}`}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t.video_title || `Video ${t.video_id}`}
                </a>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                  {t.channel_name && <span>{t.channel_name}</span>}
                  <span className="inline-flex items-center gap-1">
                    <FileText size={11} />
                    {t.word_count?.toLocaleString() || "—"} words
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} />
                    {t.duration_minutes || "—"} min
                  </span>
                  <span>
                    {new Date(t.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/watch?v=${t.video_id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
                >
                  <ExternalLink size={12} />
                  View
                </a>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deleting === t.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  {deleting === t.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <a
        href="/"
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        ← Generate a new transcript
      </a>
    </div>
  );
}
