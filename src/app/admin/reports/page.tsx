import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/Skeleton";
import { AdminReportsClient } from "@/features/admin/reports";

export const metadata: Metadata = {
  title: "Báo cáo vi phạm | OmniBid",
  description: "Xem xét và xử lý báo cáo vi phạm từ người dùng.",
};

export default function AdminReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <AdminReportsClient />
    </Suspense>
  );
}
