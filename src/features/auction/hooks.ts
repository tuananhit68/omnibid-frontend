"use client";

import { useEffect, useRef } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { getWsClient, subscribeWsStatus, type AuctionWsMessage } from "@/lib/ws";
import { BidStatus } from "@/types/enums";
import {
  getAuctions,
  getAuctionDetail,
  getAuctionBids,
  getCategories,
  watchAuction,
  unwatchAuction,
} from "./api";
import type {
  AuctionDetail,
  AuctionItem,
  AuctionListParams,
  BidItem,
  BidPlacedWsPayload,
} from "./types";

export const auctionKeys = {
  all: ["auctions"] as const,
  list: (params?: AuctionListParams) => ["auctions", "list", params] as const,
  detail: (id: number) => ["auctions", "detail", id] as const,
  bids: (id: number, limit?: number) =>
    limit !== undefined
      ? (["auctions", "bids", id, limit] as const)
      : (["auctions", "bids", id] as const),
  categories: ["categories"] as const,
};

export function useAuctions(params?: AuctionListParams) {
  return useQuery({
    queryKey: auctionKeys.list(params),
    queryFn: () => getAuctions(params),
    placeholderData: keepPreviousData,
  });
}

export function useAuctionDetail(
  id: number,
  initialData?: AuctionDetail | null
) {
  return useQuery({
    queryKey: auctionKeys.detail(id),
    queryFn: () => getAuctionDetail(id),
    initialData: initialData ?? undefined,
    enabled: Boolean(id),
  });
}

export function useAuctionBids(
  id: number,
  limit?: number,
  initialData?: BidItem[]
) {
  return useQuery({
    queryKey: auctionKeys.bids(id, limit),
    queryFn: () => getAuctionBids(id, limit),
    initialData,
    enabled: Boolean(id),
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
    onSuccess: (res) => {
      queryClient.setQueryData<AuctionDetail>(
        auctionKeys.detail(res.auctionId),
        (prev) => (prev ? { ...prev, isWatched: res.watched } : prev)
      );
      queryClient.invalidateQueries({ queryKey: auctionKeys.all });
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}

/**
 * Subscribe kênh realtime /topic/auction/{id} và cập nhật trực tiếp cache TanStack Query
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

  useEffect(() => {
    if (!auctionId || typeof window === "undefined") return;

    let subscription: StompSubscription | null = null;
    let isSubscribed = false;
    let hasConnectedOnce = false;
    const client = getWsClient();

    const doSubscribe = () => {
      if (!client.connected || isSubscribed) return;

      subscription = client.subscribe(
        `/topic/auction/${auctionId}`,
        (message: IMessage) => {
          try {
            const parsed = JSON.parse(message.body) as AuctionWsMessage;

            if (parsed.type === "BID_PLACED") {
              const payload = parsed.data as BidPlacedWsPayload;

              // Cập nhật chi tiết phiên nếu tin mới hơn
              queryClient.setQueryData<AuctionDetail>(
                auctionKeys.detail(auctionId),
                (prev) => {
                  if (!prev) return prev;
                  const nextBidCount =
                    payload.auctionBidCount ?? prev.bidCount + 1;
                  if (nextBidCount < prev.bidCount) {
                    return prev;
                  }
                  return {
                    ...prev,
                    currentPrice: payload.auctionCurrentPrice ?? payload.amount,
                    bidCount: nextBidCount,
                    minNextBid:
                      payload.minNextBid !== undefined
                        ? payload.minNextBid
                        : prev.minNextBid,
                    reserveStatus:
                      payload.reserveStatus ?? prev.reserveStatus,
                    highestBidderName: payload.bidderName,
                  };
                }
              );

              // Chèn bid mới vào đầu các query lịch sử đặt giá của phiên
              const bidEntry: BidItem = {
                id: payload.id,
                auctionId: payload.auctionId,
                bidderId: payload.bidderId,
                bidderName: payload.bidderName,
                amount: payload.amount,
                status: payload.status,
                createdAt: payload.createdAt,
              };

              queryClient.setQueriesData<BidItem[]>(
                { queryKey: ["auctions", "bids", auctionId] },
                (prev) => {
                  if (!Array.isArray(prev)) return [bidEntry];
                  if (prev.some((b) => b.id === bidEntry.id)) return prev;
                  const updatedOld = prev.map((b) =>
                    b.status === BidStatus.LEADING
                      ? { ...b, status: BidStatus.OUTBID }
                      : b
                  );
                  return [bidEntry, ...updatedOld];
                }
              );

              flashRef.current?.();
            } else if (parsed.type === "AUCTION_UPDATED") {
              const updated = parsed.data as AuctionItem;
              queryClient.setQueryData<AuctionDetail>(
                auctionKeys.detail(auctionId),
                (prev) => {
                  if (!prev) return updated;
                  return {
                    ...prev,
                    ...updated,
                    productDescription: prev.productDescription,
                    images: prev.images,
                    serverTime: prev.serverTime,
                    isWatched: prev.isWatched,
                  };
                }
              );
            }
          } catch {
            // Bỏ qua frame lỗi định dạng
          }
        }
      );
      isSubscribed = true;
    };

    if (client.connected) {
      hasConnectedOnce = true;
      doSubscribe();
    }

    const unsubStatus = subscribeWsStatus((connected) => {
      if (connected) {
        doSubscribe();
        // Chỉ refetch khi nối lại sau mất kết nối để bù tin bị lỡ
        if (hasConnectedOnce) {
          queryClient.invalidateQueries({
            queryKey: auctionKeys.detail(auctionId),
          });
          queryClient.invalidateQueries({
            queryKey: ["auctions", "bids", auctionId],
          });
        }
        hasConnectedOnce = true;
      } else {
        isSubscribed = false;
      }
    });

    return () => {
      unsubStatus();
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch {
          // Bỏ qua lỗi khi client đã đóng
        }
      }
    };
  }, [auctionId, queryClient]);
}
