import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminReportDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-64" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}
