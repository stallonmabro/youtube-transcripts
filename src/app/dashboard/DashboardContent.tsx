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
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { DAILY_LIMIT } from "@/lib/constants";

interface Transcript {
  id: string;
  video_id: string;
  video_title: string | null;
  channel_name: string | null;
  duration_minutes: number | null;
  word_count: number | null;
  created_at: string;
}

const GRADIENTS = [
  "linear-gradient(135deg, #1e1b4b, #312e81)",
  "linear-gradient(135deg, #0f172a, #1e293b)",
  "linear-gradient(135deg, #1e3a5f, #2563eb)",
  "linear-gradient(135deg, #3b0764, #7c3aed)",
  "linear-gradient(135deg, #064e3b, #10b981)",
  "linear-gradient(135deg, #7c2d12, #ea580c)",
];

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
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
  const { user } = useAuth();
  const [transcripts, setTranscripts] = useState(initial);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "longest" | "shortest">("newest");
  const [timeFilter, setTimeFilter] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 9;

  const usagePercent = Math.min(Math.round((todayUsage / DAILY_LIMIT) * 100), 100);
  const remaining = Math.max(DAILY_LIMIT - todayUsage, 0);
  const displayName = user?.email?.split("@")[0] || "there";

  let filtered = transcripts;

  if (timeFilter !== "all") {
    const now = new Date();
    const cutoff = new Date();
    if (timeFilter === "today") {
      cutoff.setHours(0, 0, 0, 0);
    } else if (timeFilter === "week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeFilter === "month") {
      cutoff.setMonth(now.getMonth() - 1);
    }
    filtered = filtered.filter((t) => new Date(t.created_at) >= cutoff);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.video_title?.toLowerCase().includes(q) ||
        t.video_id.toLowerCase().includes(q) ||
        t.channel_name?.toLowerCase().includes(q)
    );
  }

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Welcome banner */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-primary/10 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Welcome back, {displayName} 👋
          </h2>
          <p className="mt-0.5 text-sm text-muted">
            You&apos;ve saved {totalTranscripts} transcript{totalTranscripts !== 1 ? "s" : ""}. Keep building your knowledge base.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Transcript
        </a>
      </div>

      {/* Stats row */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted">Today</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
              ↑ {todayUsage}
            </span>
          </div>
          <p className="mt-1.5 text-3xl font-bold text-foreground">{todayUsage}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted">This Month</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
              ↑ {monthUsage}
            </span>
          </div>
          <p className="mt-1.5 text-3xl font-bold text-foreground">{monthUsage}</p>
        </div>
        <div className="rounded-xl border border-primary bg-gradient-to-br from-indigo-50 to-white p-4">
          <span className="text-sm font-medium text-muted">Daily Limit</span>
          <p className="mt-1.5 text-3xl font-bold text-foreground">
            {todayUsage}
            <span className="text-base font-normal text-muted"> / {DAILY_LIMIT}</span>
          </p>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted">
            {remaining} remaining today
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground">Saved Transcripts</h1>
        <div className="flex flex-wrap gap-2">
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
              placeholder="Search by title or channel..."
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
          <select
            value={timeFilter}
            onChange={(e) => {
              setTimeFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
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
        <div className="rounded-2xl border border-border bg-card px-4 py-20 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100">
            <FileText size={36} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {search || timeFilter !== "all"
              ? "No matches found"
              : "Your transcript library is empty"}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {search || timeFilter !== "all"
              ? "Try a different search or adjust your filters."
              : "Save transcripts while watching and they'll appear here as beautiful cards. Each card keeps the video stats and quick actions."}
          </p>
          {!search && timeFilter === "all" && (
            <a
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <ExternalLink size={16} />
              Explore & Save Transcripts
            </a>
          )}
        </div>
      ) : (
        <>
          {/* Card Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((t, i) => (
              <div
                key={t.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Thumbnail */}
                <a
                  href={`/watch?v=${t.video_id}`}
                  className="relative flex h-[140px] items-center justify-center overflow-hidden"
                  style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-2 right-3 rounded-md bg-black/50 px-2 py-0.5 text-xs text-white/80">
                    {t.duration_minutes
                      ? t.duration_minutes >= 60
                        ? `${Math.floor(t.duration_minutes / 60)}h ${t.duration_minutes % 60}m`
                        : `${t.duration_minutes}m`
                      : "—"}
                  </span>
                </a>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-3.5">
                  <div className="flex items-start gap-2">
                    {isNew(t.created_at) && (
                      <span className="mt-0.5 inline-block shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        New
                      </span>
                    )}
                    <a
                      href={`/watch?v=${t.video_id}`}
                      className="text-sm font-semibold leading-snug text-foreground transition-colors hover:text-primary line-clamp-2"
                      title={t.video_title || `Video ${t.video_id}`}
                    >
                      {t.video_title || `Video ${t.video_id}`}
                    </a>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                    <span className="truncate">
                      {t.channel_name || "Unknown channel"}
                    </span>
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <FileText size={11} />
                      {t.word_count?.toLocaleString() || "—"} words
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-3">
                    <span className="text-xs text-muted/70">
                      {new Date(t.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/watch?v=${t.video_id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-dark"
                      >
                        View transcript
                        <ArrowRight size={10} />
                      </a>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(t.id);
                        }}
                        disabled={deleting === t.id}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-500 transition-colors hover:text-red-600 disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === t.id ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-7 flex items-center justify-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => {
                  if (totalPages <= 7) return true;
                  if (n === 1 || n === totalPages) return true;
                  if (Math.abs(n - page) <= 1) return true;
                  return false;
                })
                .map((n, idx, arr) => {
                  const showEllipsis =
                    idx > 0 && n - arr[idx - 1] > 1;
                  return (
                    <span key={n} className="flex items-center gap-1">
                      {showEllipsis && (
                        <span className="px-1 text-sm text-muted/40">…</span>
                      )}
                      <button
                        onClick={() => setPage(n)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                          n === page
                            ? "bg-primary text-white"
                            : "border border-border text-muted hover:text-foreground"
                        }`}
                      >
                        {n}
                      </button>
                    </span>
                  );
                })}
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
