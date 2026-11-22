import type {
  AuctionDetail,
  AuctionSummary,
  BidHistoryItem,
  Category,
  MyAuctionItem,
  Page,
  PlaceBidResponse,
  ProductImage,
} from "@/lib/api/contract";

export type {
  AuctionDetail,
  AuctionSummary,
  BidHistoryItem,
  Category,
  MyAuctionItem,
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

export interface MyAuctionsParams {
  status?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CreateAuctionPayload {
  productId: number;
  startPrice: number;
  bidIncrement: number;
  reservePrice: number | null;
  startTime: string;
  endTime: string;
}

export interface UpdateAuctionPayload {
  startPrice: number;
  bidIncrement: number;
  reservePrice: number | null;
  startTime: string;
  endTime: string;
}

export interface CancelAuctionPayload {
  reason: string;
}
