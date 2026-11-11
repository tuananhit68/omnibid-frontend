import type { Metadata } from "next";
import { Suspense } from "react";
import { WatchlistClient } from "@/features/watchlist/components";
import WatchlistLoading from "./loading";

export const metadata: Metadata = {
  title: "Phiên đang theo dõi | OmniBid",
  description:
    "Quản lý và theo dõi cập nhật thời gian thực các phiên đấu giá bạn quan tâm tại OmniBid.",
};

export default function WatchlistPage() {
  return (
    <Suspense fallback={<WatchlistLoading />}>
      <WatchlistClient />
    </Suspense>
  );
}

