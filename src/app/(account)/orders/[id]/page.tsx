import type { Metadata } from "next";
import { OrderDetailClient } from "@/features/order/components";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng | OmniBid",
  description:
    "Xem tiến trình, thanh toán, gửi hàng và xác nhận nhận hàng cho đơn đấu giá tại OmniBid.",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);
  return <OrderDetailClient orderId={orderId} />;
}
