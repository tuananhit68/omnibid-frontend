import { Skeleton } from "@/components/ui/Skeleton";

export default function NotificationsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <Skeleton className="h-10 w-56 rounded-lg" />
        <Skeleton className="h-10 w-full sm:w-56 rounded-md" />
      </div>

      <div className="bg-surface border border-border-brand rounded-xl overflow-hidden">
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 sm:px-5 flex items-start gap-3">
              <Skeleton className="size-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3 max-w-md" />
                <Skeleton className="h-4 w-full max-w-xl" />
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
