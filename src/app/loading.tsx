import { Skeleton } from "@/components/ui/Skeleton";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function Loading() {
  return (
    <PublicLayout>
      <div className="space-y-12 py-8 animate-pulse">
        {/* Hero Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-48 rounded-lg" />
              <Skeleton className="h-12 w-40 rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-[480px] w-full rounded-xl" />
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

