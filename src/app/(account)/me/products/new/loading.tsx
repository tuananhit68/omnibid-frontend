import { Skeleton } from "@/components/ui";

export default function NewProductLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-96 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
