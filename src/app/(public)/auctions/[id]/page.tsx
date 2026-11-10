import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AuctionDetailClient } from "@/features/auction/components";
import {
  fetchAuctionBidsServer,
  fetchAuctionDetailServer,
} from "@/features/auction/server-api";
import AuctionDetailLoading from "./loading";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const auctionId = Number(id);
  if (Number.isNaN(auctionId) || auctionId <= 0) {
    return { title: "Không tìm thấy phiên đấu giá | OmniBid" };
  }

  const { data: auction } = await fetchAuctionDetailServer(auctionId);
  if (!auction) {
    return { title: "Chi tiết phiên đấu giá | OmniBid" };
  }

  return {
    title: `${auction.productTitle} | OmniBid`,
    description:
      auction.productDescription?.slice(0, 160) ||
      `Tham gia đấu giá ${auction.productTitle} trực tuyến minh bạch tại OmniBid.`,
    openGraph: auction.primaryImageUrl
      ? {
          images: [{ url: auction.primaryImageUrl, alt: auction.productTitle }],
        }
      : undefined,
  };
}

async function AuctionDetailLoader({ auctionId }: { auctionId: number }) {
  const [detailResult, initialBids] = await Promise.all([
    fetchAuctionDetailServer(auctionId),
    fetchAuctionBidsServer(auctionId, 5),
  ]);

  if (detailResult.notFound) {
    notFound();
  }

  return (
    <AuctionDetailClient
      auctionId={auctionId}
      initialAuction={detailResult.data}
      initialBids={initialBids}
    />
  );
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const auctionId = Number(id);

  if (Number.isNaN(auctionId) || auctionId <= 0) {
    notFound();
  }

  return (
    <Suspense fallback={<AuctionDetailLoading />}>
      <AuctionDetailLoader auctionId={auctionId} />
    </Suspense>
  );
}

