import Skeleton from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-3 h-8 w-12" />
          </div>
        ))}
      </div>
      <Skeleton className="h-7 w-40" />
      <Skeleton className="mt-2 h-4 w-64" />
      <Skeleton className="mt-6 h-10 w-full max-w-md" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border px-4 py-3">
            <Skeleton className="h-5 w-1/2" />
            <div className="mt-2 flex gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
