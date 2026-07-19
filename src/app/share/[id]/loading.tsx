import Skeleton from "@/components/Skeleton";

export default function ShareLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="mt-2 h-4 w-48" />
        <Skeleton className="mt-6 aspect-video w-full rounded-xl" />
        <Skeleton className="mt-6 h-[50vh] w-full rounded-xl" />
      </div>
    </div>
  );
}
