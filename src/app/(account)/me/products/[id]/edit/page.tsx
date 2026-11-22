import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductFormClient } from "@/features/product";

export const metadata: Metadata = {
  title: "Chỉnh sửa sản phẩm — Omnibid",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }
  return <ProductFormClient mode="edit" productId={productId} />;
}
