import type { AuctionEvent } from "@/lib/api/contract";

export type { AuctionEvent };

export type WsConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export type AuctionEventHandler = (event: AuctionEvent) => void;
export type WsStatusListener = (status: WsConnectionStatus) => void;

export interface AuctionChannel {
  subscribe(
    auctionId: number,
    onEvent: AuctionEventHandler,
    onReconnect?: () => void
  ): () => void;
  onStatusChange(listener: WsStatusListener): () => void;
  getStatus(): WsConnectionStatus;
  reset(): void;
}
