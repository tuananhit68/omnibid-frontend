import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui";
import { AuctionCreateClient } from "@/features/auction/components/AuctionCreateClient";

export const metadata: Metadata = {
  title: "Tạo phiên đấu giá — Omnibid",
};

export default function NewAuctionPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <AuctionCreateClient />
    </Suspense>
  );
}
