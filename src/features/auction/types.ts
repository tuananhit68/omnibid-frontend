import type { AuctionStatus, ReservePriceStatus } from "@/types/enums";

export type AuctionSortOption =
  | "endTime,asc"
  | "startTime,asc"
  | "currentPrice,asc"
  | "currentPrice,desc"
  | "bidCount,desc"
  | "createdAt,desc";

export interface AuctionItem {
  id: number;
  productId: number;
  productTitle: string;
  sellerId: number;
  sellerName: string;
  startPrice: number;
  bidIncrement: number;
  currentPrice: number;
  highestBidderId?: number | null;
  highestBidderName?: string | null;
  bidCount: number;
  startTime: string; // LocalDateTime Việt Nam (YYYY-MM-DDTHH:mm:ss)
  endTime: string;   // LocalDateTime Việt Nam (YYYY-MM-DDTHH:mm:ss)
  status: AuctionStatus;
  winnerId?: number | null;
  finalPrice?: number | null;
  closedAt?: string | null;
  cancelReason?: string | null;
  createdAt?: string;
  categoryId?: number;
  categoryName?: string;
  productCondition?: string;
  primaryImageUrl?: string | null;
  minNextBid?: number | null;
  reserveStatus?: ReservePriceStatus;
  isWatched?: boolean | null;
}

export interface AuctionListParams {
  status?: string;
  q?: string;
  categoryIds?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: number;
  sort?: AuctionSortOption | string;
  page?: number;
  size?: number;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  iconUrl?: string | null;
  auctionCount?: number;
}
