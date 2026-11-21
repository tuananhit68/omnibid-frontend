"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuctionChannel, type AuctionEvent } from "@/lib/ws";
import type {
  AuctionDetail,
  AuctionSummary,
  BidHistoryItem,
  Category,
  Page,
} from "@/lib/api/contract";
import {
  getAuctionBids,
  getAuctionDetailWithMeta,
  getAuctions,
  getCategories,
  placeBid,
} from "./api";
import type { AuctionListParams, PlaceBidRequest } from "./types";

export const auctionKeys = {
  all: ["auctions"] as const,
  list: (params?: AuctionListParams) => ["auctions", "list", params] as const,
  detail: (id: number) => ["auctions", "detail", id] as const,
  bids: (id: number, page = 0, size = 10) =>
    ["auctions", "bids", id, page, size] as const,
  categories: ["categories"] as const,
};

export function useAuctions(
  params?: AuctionListParams,
  initialData?: Page<AuctionSummary> | null
) {
  return useQuery({
    queryKey: auctionKeys.list(params),
    queryFn: () => getAuctions(params),
    initialData: initialData ?? undefined,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useAuctionDetail(
  id: number,
  initialData?: AuctionDetail | null
) {
  return useQuery({
    queryKey: auctionKeys.detail(id),
    queryFn: () => getAuctionDetailWithMeta(id),
    initialData: initialData
      ? { data: initialData, serverOffsetMs: 0 }
      : undefined,
    refetchOnMount: "always",
    enabled: Boolean(id),
  });
}

export function useAuctionBids(
  id: number,
  page = 0,
  size = 10,
  initialData?: Page<BidHistoryItem> | null
) {
  return useQuery({
    queryKey: auctionKeys.bids(id, page, size),
    queryFn: () => getAuctionBids(id, page, size),
    initialData: initialData ?? undefined,
    placeholderData: keepPreviousData,
    enabled: Boolean(id),
  });
}

export function useCategories(initialData?: Category[] | null) {
  return useQuery({
    queryKey: auctionKeys.categories,
    queryFn: async () => {
      const page = await getCategories(100);
      return page.content;
    },
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlaceBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PlaceBidRequest) => placeBid(body),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({
        queryKey: auctionKeys.detail(variables.auctionId),
      });
      queryClient.invalidateQueries({
        queryKey: ["auctions", "bids", variables.auctionId],
      });
    },
  });
}

/**
 * Subscribe kênh realtime /topic/auctions/{id} và cập nhật cache TanStack Query.
 */
export function useAuctionRealtime(
  auctionId: number,
  onBidFlash?: () => void
) {
  const queryClient = useQueryClient();
  const flashRef = useRef(onBidFlash);
  useEffect(() => {
    flashRef.current = onBidFlash;
  }, [onBidFlash]);

  const handleEvent = useCallback(
    (event: AuctionEvent) => {
      if (event.type === "BID_PLACED") {
        queryClient.setQueryData<{ data: AuctionDetail; serverOffsetMs: number }>(
          auctionKeys.detail(auctionId),
          (prev) => {
            if (!prev) return prev;
            if (event.bidCount <= prev.data.bidCount) return prev;
            return {
              ...prev,
              data: {
                ...prev.data,
                status: event.status,
                currentPrice: event.currentPrice,
                minNextBid: event.minNextBid,
                bidCount: event.bidCount,
                highestBidderName: event.highestBidderName,
                reserveStatus: event.reserveStatus,
                viewerIsLeading: false,
              },
            };
          }
        );

        if (event.bid) {
          const newBid = event.bid;
          queryClient.setQueriesData<Page<BidHistoryItem>>(
            { queryKey: ["auctions", "bids", auctionId] },
            (prev) => {
              if (!prev || prev.page !== 0) return prev;
              if (prev.content.some((b) => b.id === newBid.id)) return prev;
              return {
                ...prev,
                content: [newBid, ...prev.content].slice(0, prev.size),
                totalElements: prev.totalElements + 1,
              };
            }
          );
        }

        flashRef.current?.();
        return;
      }

      // AUCTION_UPDATED, AUCTION_STARTED, AUCTION_ENDED, AUCTION_CANCELLED -> cập nhật nhanh + refetch chi tiết
      queryClient.setQueryData<{ data: AuctionDetail; serverOffsetMs: number }>(
        auctionKeys.detail(auctionId),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: {
              ...prev.data,
              status: event.status,
              currentPrice: event.currentPrice,
              minNextBid: event.minNextBid,
              bidCount: event.bidCount,
              highestBidderName: event.highestBidderName,
              reserveStatus: event.reserveStatus,
              startTime: event.startTime,
              endTime: event.endTime,
            },
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: auctionKeys.detail(auctionId),
      });
    },
    [auctionId, queryClient]
  );

  const handleReconnect = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionId) });
    queryClient.invalidateQueries({ queryKey: ["auctions", "bids", auctionId] });
  }, [auctionId, queryClient]);

  return useAuctionChannel(auctionId, handleEvent, {
    enabled: Boolean(auctionId),
    onReconnect: handleReconnect,
  });
}
