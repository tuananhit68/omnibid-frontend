"use client";

import { useEffect, useRef, useState } from "react";
import { getAuctionChannel } from "./index";
import type { AuctionEventHandler, WsConnectionStatus } from "./types";

export interface UseAuctionChannelOptions {
  enabled?: boolean;
  onReconnect?: () => void;
}

export interface UseAuctionChannelResult {
  status: WsConnectionStatus;
  showReconnectingBanner: boolean;
}

/**
 * Subscribe vào kênh /topic/auctions/{auctionId} (hoặc mock bus khi NEXT_PUBLIC_API_MODE=mock).
 * Hiện banner "Đang kết nối lại…" khi mất kết nối quá 3 giây.
 */
export function useAuctionChannel(
  auctionId: number | null | undefined,
  onEvent: AuctionEventHandler,
  options: UseAuctionChannelOptions = {}
): UseAuctionChannelResult {
  const { enabled = true, onReconnect } = options;
  const [status, setStatus] = useState<WsConnectionStatus>("idle");
  const [showReconnectingBanner, setShowReconnectingBanner] = useState(false);

  const onEventRef = useRef(onEvent);
  const onReconnectRef = useRef(onReconnect);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    onReconnectRef.current = onReconnect;
  }, [onReconnect]);

  useEffect(() => {
    if (!enabled || !auctionId) return;

    const channel = getAuctionChannel();
    const unsubStatus = channel.onStatusChange(setStatus);
    const unsubAuction = channel.subscribe(
      auctionId,
      (event) => onEventRef.current(event),
      () => onReconnectRef.current?.()
    );

    return () => {
      unsubAuction();
      unsubStatus();
    };
  }, [auctionId, enabled]);

  useEffect(() => {
    if (status !== "reconnecting" && status !== "disconnected") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowReconnectingBanner(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowReconnectingBanner(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [status]);

  return { status, showReconnectingBanner };
}
