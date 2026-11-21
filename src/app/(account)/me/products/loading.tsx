import { Skeleton } from "@/components/ui";

export default function MyProductsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-11 w-40 rounded-lg" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}
