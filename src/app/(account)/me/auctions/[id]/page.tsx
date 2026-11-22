import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MyAuctionManageClient } from "@/features/auction";

export const metadata: Metadata = {
  title: "Quản lý phiên đấu giá — Omnibid",
};

export default async function MyAuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auctionId = Number(id);
  if (!Number.isInteger(auctionId) || auctionId <= 0) {
    notFound();
  }
  return <MyAuctionManageClient auctionId={auctionId} />;
}
