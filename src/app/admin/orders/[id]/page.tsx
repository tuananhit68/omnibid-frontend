import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminOrderDetailClient } from "@/features/admin/orders";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng (Quản trị) | OmniBid",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }
  return <AdminOrderDetailClient orderId={numericId} />;
}
