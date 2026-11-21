import type { Metadata } from "next";
import { ProductFormClient } from "@/features/product";

export const metadata: Metadata = {
  title: "Thêm sản phẩm — Omnibid",
};

export default function NewProductPage() {
  return <ProductFormClient mode="create" />;
}
