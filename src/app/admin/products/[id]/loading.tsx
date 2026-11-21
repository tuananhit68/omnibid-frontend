import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminProductDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-64" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-96 rounded-xl lg:col-span-5" />
        <Skeleton className="h-96 rounded-xl lg:col-span-7" />
      </div>
    </div>
  );
}
