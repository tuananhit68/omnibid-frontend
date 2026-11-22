import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui";
import { MyProductsClient } from "@/features/product";

export const metadata: Metadata = {
  title: "Sản phẩm của tôi — Omnibid",
};

export default function MyProductsPage() {
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
      <MyProductsClient />
    </Suspense>
  );
}
