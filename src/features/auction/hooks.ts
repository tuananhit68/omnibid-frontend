"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getAuctions,
  getCategories,
  watchAuction,
  unwatchAuction,
} from "./api";
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
    placeholderData: keepPreviousData,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: auctionKeys.categories,
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}

export function useToggleWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      auctionId,
      currentlyWatched,
    }: {
      auctionId: number;
      currentlyWatched: boolean;
    }) => {
      if (currentlyWatched) {
        await unwatchAuction(auctionId);
        return { auctionId, watched: false };
      }
      await watchAuction(auctionId);
      return { auctionId, watched: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.all });
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}
