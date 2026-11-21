import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/Skeleton";
import { AdminCategoriesClient } from "@/features/admin/categories";

export const metadata: Metadata = {
  title: "Quản lý danh mục | OmniBid",
  description: "Thêm, sửa, xóa danh mục sản phẩm của sàn đấu giá.",
};

export default function AdminCategoriesPage() {
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
      <AdminCategoriesClient />
    </Suspense>
  );
}
