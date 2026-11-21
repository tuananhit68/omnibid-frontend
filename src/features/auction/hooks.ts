"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
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
  bids: (id: number, size = 20) => ["auctions", "bids", id, size] as const,
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

export function useAuctionBidsInfinite(
  id: number,
  size = 20,
  initialData?: Page<BidHistoryItem> | null
) {
  return useInfiniteQuery({
    queryKey: auctionKeys.bids(id, size),
    queryFn: ({ pageParam }) => getAuctionBids(id, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialData: initialData
      ? { pages: [initialData], pageParams: [0] }
      : undefined,
    enabled: Boolean(id),
    staleTime: 30_000,
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
    onSuccess: (res, variables) => {
      queryClient.setQueryData<{ data: AuctionDetail; serverOffsetMs: number }>(
        auctionKeys.detail(variables.auctionId),
        (prev) => {
          if (!prev) return prev;
          if (res.bidCount < prev.data.bidCount) return prev;
          return {
            ...prev,
            data: {
              ...prev.data,
              currentPrice: res.currentPrice,
              bidCount: res.bidCount,
              minNextBid: res.minNextBid,
              viewerIsLeading: true,
            },
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: auctionKeys.detail(variables.auctionId),
      });
      queryClient.invalidateQueries({
        queryKey: ["auctions", "bids", variables.auctionId],
      });
    },
  });
}

export interface UseAuctionRealtimeCallbacks {
  onBidFlash?: () => void;
  onOutbid?: (event: AuctionEvent) => void;
}

/**
 * Subscribe kênh realtime /topic/auctions/{id} và cập nhật cache TanStack Query.
 */
export function useAuctionRealtime(
  auctionId: number,
  callbacks: UseAuctionRealtimeCallbacks = {}
) {
  const queryClient = useQueryClient();
  const callbacksRef = useRef(callbacks);
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const handleEvent = useCallback(
    (event: AuctionEvent) => {
      if (event.type === "BID_PLACED") {
        let wasOutbid = false;
        let accepted = false;

        queryClient.setQueryData<{ data: AuctionDetail; serverOffsetMs: number }>(
          auctionKeys.detail(auctionId),
          (prev) => {
            if (!prev) return prev;
            if (event.bidCount < prev.data.bidCount) return prev;

            const isNewerBid = event.bidCount > prev.data.bidCount;
            accepted = true;

            if (isNewerBid && prev.data.viewerIsLeading) {
              wasOutbid = true;
            }

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
                viewerIsLeading: isNewerBid ? false : prev.data.viewerIsLeading,
              },
            };
          }
        );

        if (event.bid) {
          const newBid = event.bid;
          queryClient.setQueriesData<InfiniteData<Page<BidHistoryItem>>>(
            { queryKey: ["auctions", "bids", auctionId] },
            (prev) => {
              if (!prev || prev.pages.length === 0) return prev;
              const firstPage = prev.pages[0];
              if (firstPage.content.some((b) => b.id === newBid.id)) {
                return prev;
              }
              const updatedFirst: Page<BidHistoryItem> = {
                ...firstPage,
                content: [newBid, ...firstPage.content],
                totalElements: firstPage.totalElements + 1,
              };
              return {
                ...prev,
                pages: [updatedFirst, ...prev.pages.slice(1)],
              };
            }
          );
        }

        if (accepted) {
          callbacksRef.current.onBidFlash?.();
        }
        if (wasOutbid) {
          callbacksRef.current.onOutbid?.(event);
        }
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
