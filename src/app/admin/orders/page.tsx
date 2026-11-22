import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/Skeleton";
import { AdminOrdersClient } from "@/features/admin/orders";

export const metadata: Metadata = {
  title: "Quản lý đơn hàng | OmniBid",
  description: "Theo dõi và quản trị đơn hàng sau phiên đấu giá.",
};

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <AdminOrdersClient />
    </Suspense>
  );
}
