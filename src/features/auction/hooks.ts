"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuctions, getCategories } from "./api";
import type { AuctionListParams } from "./types";

export const auctionKeys = {
  all: ["auctions"] as const,
  list: (params?: AuctionListParams) => ["auctions", "list", params] as const,
  detail: (id: number) => ["auctions", "detail", id] as const,
  categories: ["categories"] as const,
};

export function useAuctions(params?: AuctionListParams) {
  return useQuery({
    queryKey: auctionKeys.list(params),
    queryFn: () => getAuctions(params),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: auctionKeys.categories,
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}

