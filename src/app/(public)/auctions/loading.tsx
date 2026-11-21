import { Skeleton } from "@/components/ui/Skeleton";

export default function AuctionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Đầu trang skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      {/* Lưới 2 cột */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="hidden md:block w-full lg:w-70 bg-surface border border-border-brand rounded-xl p-6 space-y-5 shrink-0">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>

        <div className="flex-1 min-w-0 w-full space-y-6">
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface border border-border-brand rounded-xl overflow-hidden"
              >
                <Skeleton className="aspect-4/3 w-full rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-7 w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-11 flex-1 rounded-md" />
                    <Skeleton className="h-11 flex-1 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

