import type { AuctionItem } from "@/features/auction/types";

export interface WatchlistItem extends AuctionItem {
  watchedAt: string;
}

export interface WatchlistSummary {
  total?: number;
  active?: number;
  scheduled?: number;
  ended?: number;
  cancelled?: number;
}

export interface WatchlistParams {
  status?: string;
  page?: number;
  size?: number;
}

