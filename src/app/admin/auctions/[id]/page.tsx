import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminAuctionDetailClient } from "@/features/admin/auctions";

export const metadata: Metadata = {
  title: "Chi tiết phiên đấu giá (Quản trị) | OmniBid",
};

export default async function AdminAuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }
  return <AdminAuctionDetailClient auctionId={numericId} />;
}
