import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/Skeleton";
import { AdminProductsClient } from "@/features/admin/products";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm | OmniBid",
  description: "Danh sách và kiểm duyệt sản phẩm trên sàn đấu giá.",
};

export default function AdminProductsPage() {
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
      <AdminProductsClient />
    </Suspense>
  );
}
