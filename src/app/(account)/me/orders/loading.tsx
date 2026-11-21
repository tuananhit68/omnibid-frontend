import { Skeleton } from "@/components/ui/Skeleton";

export default function MyOrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <div className="flex gap-6 border-b border-border pb-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>

      <Skeleton className="h-11 w-full max-w-2xl rounded-lg" />

      <div className="bg-surface border border-border-brand rounded-xl overflow-hidden">
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between gap-4"
            >
              <Skeleton className="h-5 w-16" />
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="size-11 rounded-lg shrink-0" />
                <Skeleton className="h-4 w-56 max-w-full" />
              </div>
              <Skeleton className="hidden md:block h-5 w-28" />
              <Skeleton className="hidden md:block h-5 w-24" />
              <Skeleton className="hidden md:block h-6 w-28 rounded-full" />
              <Skeleton className="hidden md:block h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
