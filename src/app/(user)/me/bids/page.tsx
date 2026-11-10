import type { Metadata } from "next";
import { Suspense } from "react";
import { MyBidsClient } from "@/features/bid/components";
import MyBidsLoading from "./loading";

export const metadata: Metadata = {
  title: "Lượt đặt giá của tôi | OmniBid",
  description:
    "Theo dõi và quản lý lịch sử các lệnh đặt giá của bạn trong các phiên đấu giá trực tuyến tại OmniBid.",
};

export default function MyBidsPage() {
  return (
    <Suspense fallback={<MyBidsLoading />}>
      <MyBidsClient />
    </Suspense>
  );
}
