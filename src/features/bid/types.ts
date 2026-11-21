import type { MyBidItem } from "@/lib/api/contract";

export type { MyBidItem };

export interface MyBidsParams {
  auctionId?: number;
  page?: number;
  size?: number;
  sort?: string;
}
