import { Skeleton } from "@/components/ui/Skeleton";

export default function WatchlistLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumb & Tiêu đề */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-56" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
      </div>

      {/* Hàng 5 KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border-brand rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-10 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3.5 w-12" />
          </div>
        ))}
      </div>

      {/* Thanh tabs */}
      <div className="bg-surface border border-border-brand rounded-xl p-2">
        <Skeleton className="h-10 w-96 max-w-full rounded-lg" />
      </div>

      {/* Lưới thẻ phiên */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border-brand rounded-xl overflow-hidden"
          >
            <Skeleton className="w-full aspect-4/3 rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-3/5" />
              <div className="flex items-end justify-between pt-1">
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-7 w-32" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

