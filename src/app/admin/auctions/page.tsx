import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/Skeleton";
import { AdminAuctionsClient } from "@/features/admin/auctions";

export const metadata: Metadata = {
  title: "Quản lý phiên đấu giá | OmniBid",
  description: "Theo dõi và quản trị tất cả phiên đấu giá trên sàn.",
};

export default function AdminAuctionsPage() {
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
      <AdminAuctionsClient />
    </Suspense>
  );
}
