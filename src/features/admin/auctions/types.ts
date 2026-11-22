import type { AuctionStatus } from "@/types/enums";

export interface AdminAuctionsParams {
  keyword?: string;
  status?: AuctionStatus | "";
  sellerId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CancelAdminAuctionPayload {
  auctionId: number;
  reason: string;
}
