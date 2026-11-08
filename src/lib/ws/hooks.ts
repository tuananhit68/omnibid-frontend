"use client";

import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { getWsClient, subscribeWsStatus } from "./stomp";
import type { AuctionWsMessage, BidWsData, NotificationWsData } from "./types";
import { getStoredToken } from "../api/auth-storage";

/**
 * Hook lắng nghe trạng thái kết nối WebSocket.
 * Hiển thị reconnecting = true nếu mất kết nối quá 3 giây.
 */
export function useWsConnectionStatus() {
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const unsubscribe = subscribeWsStatus((status) => {
      setConnected(status);
      if (status) {
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        setReconnecting(false);
      } else {
        reconnectTimeout = setTimeout(() => {
          setReconnecting(true);
        }, 3000);
      }
    });

    return () => {
      unsubscribe();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  return { connected, reconnecting };
}

interface UseAuctionChannelOptions {
  onMessage?: (msg: AuctionWsMessage) => void;
  onBidPlaced?: (bid: BidWsData) => void;
  onAuctionUpdated?: (data: unknown) => void;
}

/**
 * Hook lắng nghe tin trên kênh phiên đấu giá (/topic/auction/{id})
 */
export function useAuctionChannel(
  auctionId: number | null | undefined,
  options?: UseAuctionChannelOptions
) {
  const queryClient = useQueryClient();
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!auctionId || typeof window === "undefined") return;

    let subscription: StompSubscription | null = null;
    let isSubscribed = false;

    const client = getWsClient();

    const doSubscribe = () => {
      if (!client.connected || isSubscribed) return;

      subscription = client.subscribe(
        `/topic/auction/${auctionId}`,
        (message: IMessage) => {
          try {
            const parsed = JSON.parse(message.body) as AuctionWsMessage;
            optionsRef.current?.onMessage?.(parsed);

            if (parsed.type === "BID_PLACED") {
              const bidData = parsed.data as BidWsData;
              optionsRef.current?.onBidPlaced?.(bidData);

              // Cập nhật giá và số lượt đặt trong chi tiết phiên
              queryClient.setQueryData(
                ["auction", auctionId],
                (oldData: Record<string, unknown> | undefined) => {
                  if (!oldData) return oldData;
                  const currentBidCount = (oldData.bidCount as number) || 0;
                  return {
                    ...oldData,
                    currentPrice: bidData.amount,
                    bidCount: currentBidCount + 1,
                    leadingBidderName: bidData.bidderName,
                  };
                }
              );

              // Thêm bid mới vào đầu danh sách lịch sử
              queryClient.setQueryData(
                ["auction", auctionId, "bids"],
                (oldBids: BidWsData[] | undefined) => {
                  if (!Array.isArray(oldBids)) return [bidData];
                  return [bidData, ...oldBids];
                }
              );
            } else if (parsed.type === "AUCTION_UPDATED") {
              optionsRef.current?.onAuctionUpdated?.(parsed.data);
              queryClient.setQueryData(["auction", auctionId], parsed.data);
            }
          } catch (err) {
            console.error("Lỗi xử lý tin WebSocket auction:", err);
          }
        }
      );
      isSubscribed = true;
    };

    if (client.connected) {
      doSubscribe();
    }

    const unsubStatus = subscribeWsStatus((connected) => {
      if (connected) {
        doSubscribe();
        // Nối lại thành công: refetch dữ liệu phiên để bù tin bị lỡ
        queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
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
          // Bỏ qua lỗi huỷ khi client đã ngắt
        }
      }
    };
  }, [auctionId, queryClient]);
}

interface UseUserNotificationsOptions {
  onNotification?: (notif: NotificationWsData) => void;
}

/**
 * Hook lắng nghe tin trên kênh cá nhân (/user/queue/notifications)
 */
export function useUserNotifications(options?: UseUserNotificationsOptions) {
  const queryClient = useQueryClient();
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = getStoredToken();
    if (!token) return;

    let subscription: StompSubscription | null = null;
    let isSubscribed = false;

    const client = getWsClient();

    const doSubscribe = () => {
      if (!client.connected || isSubscribed) return;

      subscription = client.subscribe(
        "/user/queue/notifications",
        (message: IMessage) => {
          try {
            const notif = JSON.parse(message.body) as NotificationWsData;
            optionsRef.current?.onNotification?.(notif);

            // Cập nhật số thông báo chưa đọc
            if (typeof notif.unreadCount === "number") {
              queryClient.setQueryData(
                ["notifications", "unread-count"],
                { unreadCount: notif.unreadCount }
              );
            }

            // Invalidate danh sách thông báo
            queryClient.invalidateQueries({ queryKey: ["notifications"] });

            // Invalidate query liên quan tuỳ loại thông báo
            if (notif.type === "OUTBID" && notif.refId) {
              queryClient.invalidateQueries({ queryKey: ["auction", notif.refId] });
            } else if (
              (notif.type === "PAYMENT_RESULT" || notif.type === "ORDER_CREATED") &&
              notif.refId
            ) {
              queryClient.invalidateQueries({ queryKey: ["order", notif.refId] });
              queryClient.invalidateQueries({ queryKey: ["orders"] });
            }
          } catch (err) {
            console.error("Lỗi xử lý tin WebSocket notification:", err);
          }
        }
      );
      isSubscribed = true;
    };

    if (client.connected) {
      doSubscribe();
    }

    const unsubStatus = subscribeWsStatus((connected) => {
      if (connected) {
        doSubscribe();
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
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
          // Bỏ qua lỗi huỷ khi client đã ngắt
        }
      }
    };
  }, [queryClient]);
}
