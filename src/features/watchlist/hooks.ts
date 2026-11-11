"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import type { Page } from "@/lib/api";
import { getWsClient, subscribeWsStatus, type AuctionWsMessage } from "@/lib/ws";
import { auctionKeys } from "@/features/auction/hooks";
import type { AuctionItem, BidPlacedWsPayload } from "@/features/auction/types";
import { AuctionStatus } from "@/types/enums";
import {
  getWatchlist,
  getWatchlistSummary,
  unwatchAuction,
  watchAuction,
} from "./api";
import type { WatchlistItem, WatchlistParams } from "./types";

export const watchlistKeys = {
  all: ["watchlist"] as const,
  lists: () => ["watchlist", "list"] as const,
  list: (params?: WatchlistParams) => ["watchlist", "list", params] as const,
  summary: ["watchlist", "summary"] as const,
};

export function useWatchlist(params?: WatchlistParams) {
  return useQuery({
    queryKey: watchlistKeys.list(params),
    queryFn: () => getWatchlist(params),
    placeholderData: keepPreviousData,
  });
}

export function useWatchlistSummary() {
  return useQuery({
    queryKey: watchlistKeys.summary,
    queryFn: getWatchlistSummary,
  });
}

export function useUnwatchFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (auctionId: number) => unwatchAuction(auctionId),
    onSuccess: (_res, auctionId) => {
      // Gỡ thẻ ngay khỏi các trang cache đang giữ danh sách theo dõi
      queryClient.setQueriesData<Page<WatchlistItem>>(
        { queryKey: watchlistKeys.lists() },
        (prev) => {
          if (!prev) return prev;
          const nextContent = prev.content.filter(
            (item) => item.id !== auctionId
          );
          if (nextContent.length === prev.content.length) return prev;
          return {
            ...prev,
            content: nextContent,
            totalElements: Math.max(0, prev.totalElements - 1),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      queryClient.invalidateQueries({
        queryKey: auctionKeys.detail(auctionId),
      });
      queryClient.invalidateQueries({ queryKey: auctionKeys.all });
    },
  });
}

export function useRewatchInWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (auctionId: number) => watchAuction(auctionId),
    onSuccess: (_res, auctionId) => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      queryClient.invalidateQueries({
        queryKey: auctionKeys.detail(auctionId),
      });
      queryClient.invalidateQueries({ queryKey: auctionKeys.all });
    },
  });
}

/**
 * Subscribe kênh /topic/auction/{id} cho các phiên ACTIVE đang hiển thị trên trang
 */
export function useWatchlistRealtime(
  activeAuctionIds: number[],
  onPriceFlash?: (auctionId: number) => void
) {
  const queryClient = useQueryClient();
  const flashRef = useRef(onPriceFlash);

  useEffect(() => {
    flashRef.current = onPriceFlash;
  }, [onPriceFlash]);

  const idsKey = useMemo(
    () =>
      Array.from(new Set(activeAuctionIds))
        .sort((a, b) => a - b)
        .join(","),
    [activeAuctionIds]
  );

  useEffect(() => {
    if (!idsKey || typeof window === "undefined") return;

    const ids = idsKey.split(",").map(Number).filter((n) => n > 0);
    if (ids.length === 0) return;

    const subscriptions = new Map<number, StompSubscription>();
    let hasConnectedOnce = false;
    const client = getWsClient();

    const subscribeAll = () => {
      if (!client.connected) return;

      for (const auctionId of ids) {
        if (subscriptions.has(auctionId)) continue;

        const sub = client.subscribe(
          `/topic/auction/${auctionId}`,
          (message: IMessage) => {
            try {
              const parsed = JSON.parse(message.body) as AuctionWsMessage;

              if (parsed.type === "BID_PLACED") {
                const payload = parsed.data as BidPlacedWsPayload;

                queryClient.setQueriesData<Page<WatchlistItem>>(
                  { queryKey: watchlistKeys.lists() },
                  (prev) => {
                    if (!prev) return prev;
                    let changed = false;
                    const content = prev.content.map((item) => {
                      if (item.id !== auctionId) return item;
                      const nextBidCount =
                        payload.auctionBidCount ?? item.bidCount + 1;
                      if (nextBidCount < item.bidCount) return item;
                      changed = true;
                      return {
                        ...item,
                        currentPrice:
                          payload.auctionCurrentPrice ?? payload.amount,
                        bidCount: nextBidCount,
                        minNextBid:
                          payload.minNextBid !== undefined
                            ? payload.minNextBid
                            : item.minNextBid,
                        reserveStatus:
                          payload.reserveStatus ?? item.reserveStatus,
                        highestBidderName: payload.bidderName,
                      };
                    });
                    return changed ? { ...prev, content } : prev;
                  }
                );

                flashRef.current?.(auctionId);
              } else if (parsed.type === "AUCTION_UPDATED") {
                const updated = parsed.data as AuctionItem;
                let statusChanged = false;

                queryClient.setQueriesData<Page<WatchlistItem>>(
                  { queryKey: watchlistKeys.lists() },
                  (prev) => {
                    if (!prev) return prev;
                    let changed = false;
                    const content = prev.content.map((item) => {
                      if (item.id !== auctionId) return item;
                      changed = true;
                      if (updated.status !== item.status) {
                        statusChanged = true;
                      }
                      return {
                        ...item,
                        ...updated,
                        watchedAt: item.watchedAt,
                      };
                    });
                    return changed ? { ...prev, content } : prev;
                  }
                );

                if (
                  statusChanged ||
                  updated.status !== AuctionStatus.ACTIVE
                ) {
                  queryClient.invalidateQueries({
                    queryKey: watchlistKeys.summary,
                  });
                }
              }
            } catch {
              // Bỏ qua frame lỗi định dạng
            }
          }
        );

        subscriptions.set(auctionId, sub);
      }
    };

    if (client.connected) {
      hasConnectedOnce = true;
      subscribeAll();
    }

    const unsubStatus = subscribeWsStatus((connected) => {
      if (connected) {
        subscribeAll();
        if (hasConnectedOnce) {
          queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
        }
        hasConnectedOnce = true;
      } else {
        subscriptions.clear();
      }
    });

    return () => {
      unsubStatus();
      for (const sub of subscriptions.values()) {
        try {
          sub.unsubscribe();
        } catch {
          // Bỏ qua lỗi khi client đã đóng
        }
      }
      subscriptions.clear();
    };
  }, [idsKey, queryClient]);
}

