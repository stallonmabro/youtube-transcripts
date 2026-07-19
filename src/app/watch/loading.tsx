import Skeleton from "@/components/Skeleton";

export default function WatchLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <Skeleton className="h-5 w-32" />
      </div>

      <div className="mx-auto mt-4 max-w-4xl px-4 sm:px-6">
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>

      <div className="mx-auto mt-6 max-w-4xl px-4 sm:px-6">
        <Skeleton className="h-6 w-2/3" />
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        <Skeleton className="mt-4 h-[40vh] w-full rounded-xl" />
      </div>
    </div>
  );
}
