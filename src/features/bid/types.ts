import type { AuctionStatus, BidStatus } from "@/types/enums";

export interface MyBidItem {
  auctionId: number;
  productTitle: string;
  primaryImageUrl?: string | null;
  categoryName?: string | null;
  auctionStatus: AuctionStatus;
  currentPrice: number;
  endTime: string;
  closedAt?: string | null;
  myHighestBid: number;
  myBidCount: number;
  myLastBidAt: string;
  myStatus: BidStatus;
  isLeading: boolean;
  orderId?: number | null;
}

export interface MyBidsSummary {
  totalAuctions?: number;
  totalBids?: number;
  leading?: number;
  outbid?: number;
  won?: number;
}

export interface MyBidsParams {
  status?: BidStatus | "";
  auctionStatus?: string;
  q?: string;
  page?: number;
  size?: number;
}

