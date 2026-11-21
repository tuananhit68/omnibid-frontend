import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui";
import { MyAuctionsClient } from "@/features/auction";

export const metadata: Metadata = {
  title: "Phiên của tôi — Omnibid",
};

export default function MyAuctionsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      }
    >
      <MyAuctionsClient />
    </Suspense>
  );
}
