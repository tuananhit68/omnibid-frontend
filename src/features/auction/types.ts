import type {
  AuctionStatus,
  BidStatus,
  ProductCondition,
  ReservePriceStatus,
} from "@/types/enums";

export type AuctionSortOption =
  | "endTime,asc"
  | "startTime,asc"
  | "currentPrice,asc"
  | "currentPrice,desc"
  | "bidCount,desc"
  | "createdAt,desc";

export interface AuctionImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

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
  productCondition?: ProductCondition | string;
  primaryImageUrl?: string | null;
  minNextBid?: number | null;
  reserveStatus?: ReservePriceStatus;
  isWatched?: boolean | null;
}

export interface AuctionDetail extends AuctionItem {
  productDescription?: string;
  images?: AuctionImage[];
  serverTime?: string;
}

export interface BidItem {
  id: number;
  auctionId: number;
  bidderId: number;
  bidderName: string; // đã che ở backend
  amount: number;
  status: BidStatus;
  createdAt: string;
}

export interface BidPlacedWsPayload extends BidItem {
  auctionCurrentPrice?: number;
  auctionBidCount?: number;
  minNextBid?: number | null;
  reserveStatus?: ReservePriceStatus;
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
