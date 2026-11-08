import type { AuctionStatus } from "@/types/enums";

export interface AuctionItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  categoryName?: string;
  startPrice: number;
  currentPrice: number;
  bidIncrement: number;
  reservePrice?: number | null;
  status: AuctionStatus;
  startTime: string; // LocalDateTime Việt Nam (YYYY-MM-DDTHH:mm:ss)
  endTime: string;   // LocalDateTime Việt Nam (YYYY-MM-DDTHH:mm:ss)
  bidCount: number;
  sellerId: number;
  sellerName: string;
  leadingBidderName?: string;
}

export interface AuctionListParams {
  status?: AuctionStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  auctionCount?: number;
  icon?: string;
}

