import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/Skeleton";
import { AdminUsersClient } from "@/features/admin/users";

export const metadata: Metadata = {
  title: "Quản lý người dùng | OmniBid",
  description: "Danh sách, tìm kiếm và khóa/mở khóa tài khoản người dùng.",
};

export default function AdminUsersPage() {
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
      <AdminUsersClient />
    </Suspense>
  );
}
