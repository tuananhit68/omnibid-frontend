// TODO fe-v4 auction-detail
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AuctionDetailClient,
  fetchAuctionBidsServer,
  fetchAuctionDetailServer,
} from "@/features/auction";

interface AuctionDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AuctionDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const auctionId = Number(id);
  if (!Number.isInteger(auctionId) || auctionId <= 0) {
    return { title: "Không tìm thấy phiên đấu giá" };
  }

  const result = await fetchAuctionDetailServer(auctionId);
  if (!result.data) {
    return { title: `Phiên đấu giá #${auctionId}` };
  }

  return {
    title: result.data.title,
    description: result.data.description.slice(0, 160),
  };
}

export default async function AuctionDetailPage({
  params,
}: AuctionDetailPageProps) {
  const { id } = await params;
  const auctionId = Number(id);
  if (!Number.isInteger(auctionId) || auctionId <= 0) {
    notFound();
  }

  const [detailRes, bidsRes] = await Promise.all([
    fetchAuctionDetailServer(auctionId),
    fetchAuctionBidsServer(auctionId, 10),
  ]);

  if (detailRes.notFound) {
    notFound();
  }

  return (
    <AuctionDetailClient
      auctionId={auctionId}
      initialAuction={detailRes.data}
      initialBids={bidsRes}
    />
  );
}
