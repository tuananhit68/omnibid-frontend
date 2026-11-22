import { Skeleton } from "@/components/ui/Skeleton";

export default function MyBidsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Skeleton className="h-11 w-72 max-w-full rounded-lg" />
        <Skeleton className="h-4 w-52" />
      </div>

      <div className="bg-surface border border-border-brand rounded-xl overflow-hidden">
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="size-12 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-4 w-56 max-w-full" />
                </div>
              </div>
              <Skeleton className="hidden md:block h-5 w-24" />
              <Skeleton className="hidden md:block h-5 w-28" />
              <Skeleton className="hidden md:block h-5 w-24" />
              <Skeleton className="hidden md:block h-6 w-24 rounded-full" />
              <Skeleton className="hidden md:block h-8 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
