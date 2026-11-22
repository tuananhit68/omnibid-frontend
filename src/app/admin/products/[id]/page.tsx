import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminProductDetailClient } from "@/features/admin/products";

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm (Quản trị) | OmniBid",
};

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }
  return <AdminProductDetailClient productId={numericId} />;
}
