import { Skeleton } from "@/components/ui/Skeleton";

export default function MyBidsLoading() {
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

      {/* Hàng 4 KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border-brand rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-10 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>

      {/* Card Bảng */}
      <div className="bg-surface border border-border-brand rounded-xl overflow-hidden">
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <Skeleton className="h-10 w-80 max-w-full rounded-lg" />
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 w-full sm:w-72 rounded-md" />
            <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
          </div>
        </div>

        <div className="border-t border-border-brand divide-y divide-border-subtle">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="size-12 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3.5 w-36" />
                  <Skeleton className="h-4 w-64 max-w-full" />
                  <Skeleton className="h-3.5 w-44" />
                </div>
              </div>
              <Skeleton className="hidden md:block h-5 w-24" />
              <Skeleton className="hidden md:block h-5 w-28" />
              <Skeleton className="hidden md:block h-5 w-24" />
              <Skeleton className="hidden md:block h-7 w-24 rounded-full" />
              <Skeleton className="hidden md:block h-8 w-28 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
