"use client";

import { useState } from "react";
import {
  Trash2,
  ExternalLink,
  Search,
  Clock,
  FileText,
  Activity,
  CalendarDays,
  ArrowUpDown,
} from "lucide-react";

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
  const [sort, setSort] = useState<"newest" | "oldest" | "longest" | "shortest">("newest");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const dailyLimit = 100;

  const filtered = search.trim()
    ? transcripts.filter(
        (t) =>
          t.video_title?.toLowerCase().includes(search.toLowerCase()) ||
          t.video_id.toLowerCase().includes(search.toLowerCase())
      )
    : transcripts;

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "longest":
        return (b.duration_minutes ?? 0) - (a.duration_minutes ?? 0);
      case "shortest":
        return (a.duration_minutes ?? 0) - (b.duration_minutes ?? 0);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  async function handleDelete(id: string) {
    setDeleting(id);
    setError("");
    try {
      const res = await fetch(`/api/transcripts?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setTranscripts((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete transcript. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  const usagePercent = Math.min(Math.round((todayUsage / dailyLimit) * 100), 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Stats row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Activity size={14} />
            Today
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{todayUsage}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <CalendarDays size={14} />
            This Month
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{monthUsage}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <FileText size={14} />
            Saved
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{totalTranscripts}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Clock size={14} />
            Daily limit
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {todayUsage}
            <span className="text-base font-normal text-muted"> / {dailyLimit}</span>
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Transcripts</h1>
          <p className="mt-1 text-sm text-muted">View and manage your saved transcripts.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={search}
              data-shortcut="search"
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search transcripts..."
              className="w-60 rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="longest">Longest</option>
            <option value="shortest">Shortest</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content */}
      {paged.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <FileText size={28} className="text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">No transcripts yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            {search
              ? "No transcripts match your search. Try a different query."
              : "Generate your first YouTube transcript — it's free and takes seconds. Your saved transcripts will appear here."}
          </p>
          {!search && (
            <a
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <ExternalLink size={16} />
              Generate Your First Transcript
            </a>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {paged.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-surface/50"
              >
                <div className="min-w-0 flex-1">
                  <a
                    href={`/watch?v=${t.video_id}`}
                    className="block truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
                    title={t.video_title || `Video ${t.video_id}`}
                  >
                    {t.video_title || `Video ${t.video_id}`}
                  </a>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    {t.channel_name && <span>{t.channel_name}</span>}
                    {!t.channel_name && <span>—</span>}
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

                <div className="flex shrink-0 items-center gap-2">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    n === page
                      ? "bg-primary text-white"
                      : "border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
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
