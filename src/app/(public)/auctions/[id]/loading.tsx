import { Skeleton } from "@/components/ui/Skeleton";

export default function AuctionDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumb bar */}
      <div className="flex items-center justify-between pb-4 border-b border-border-brand">
        <Skeleton className="h-5 w-80 max-w-full" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* 8/4 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="aspect-4/3 w-full rounded-xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-20 md:size-24 rounded-lg shrink-0" />
            ))}
          </div>
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>

        <div className="lg:col-span-5 bg-surface border border-border-brand rounded-xl p-6 space-y-5">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-13 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
      </div>

      {/* Tabs */}
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}
