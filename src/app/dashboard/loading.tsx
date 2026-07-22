import Skeleton from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Stats skeleton */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-3 h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Heading skeleton */}
      <Skeleton className="h-7 w-44" />
      <Skeleton className="mt-1 h-4 w-72" />

      {/* Toolbar skeleton */}
      <div className="mt-6 flex gap-3">
        <Skeleton className="h-9 w-60 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* List skeleton */}
      <div className="mt-4 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border px-4 py-3">
            <Skeleton className="h-5 w-3/4" />
            <div className="mt-2 flex gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
