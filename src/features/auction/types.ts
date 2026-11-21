import type {
  AuctionDetail,
  AuctionSummary,
  BidHistoryItem,
  Category,
  Page,
  PlaceBidResponse,
  ProductImage,
} from "@/lib/api/contract";

export type {
  AuctionDetail,
  AuctionSummary,
  BidHistoryItem,
  Category,
  Page,
  PlaceBidResponse,
  ProductImage,
};

export type AuctionSortOption =
  | "endTime,asc"
  | "createdAt,desc"
  | "currentPrice,asc"
  | "currentPrice,desc";

export interface AuctionListParams {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  endBefore?: string;
  sort?: AuctionSortOption | string;
  page?: number;
  size?: number;
}

export interface PlaceBidRequest {
  auctionId: number;
  amount: number;
}
