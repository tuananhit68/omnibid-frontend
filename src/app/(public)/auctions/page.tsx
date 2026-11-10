import type { Metadata } from "next";
import { Suspense } from "react";
import { AuctionListClient } from "@/features/auction/components";
import AuctionsLoading from "./loading";

export const metadata: Metadata = {
  title: "Tất cả phiên đấu giá | OmniBid",
  description:
    "Khám phá, tìm kiếm và tham gia đấu giá các sản phẩm chính hãng với giá khởi điểm hấp dẫn tại OmniBid.",
};

export default function AuctionsPage() {
  return (
    <Suspense fallback={<AuctionsLoading />}>
      <AuctionListClient />
    </Suspense>
  );
}

