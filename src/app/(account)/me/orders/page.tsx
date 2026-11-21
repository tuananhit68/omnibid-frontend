import type { Metadata } from "next";
import { Suspense } from "react";
import { MyOrdersClient } from "@/features/order/components";
import MyOrdersLoading from "./loading";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi | OmniBid",
  description:
    "Quản lý các đơn mua và đơn bán từ phiên đấu giá trực tuyến tại OmniBid.",
};

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<MyOrdersLoading />}>
      <MyOrdersClient />
    </Suspense>
  );
}
