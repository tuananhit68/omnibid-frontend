"use client";

import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { AuctionEventSchema, type AuctionEvent } from "@/lib/api/contract";
import { getAccessToken } from "@/lib/auth/session";
import type {
  AuctionChannel,
  AuctionEventHandler,
  WsConnectionStatus,
  WsStatusListener,
} from "./types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

interface SubscriptionEntry {
  auctionId: number;
  handler: AuctionEventHandler;
  onReconnect?: () => void;
  stompSub?: StompSubscription;
}

class StompAuctionChannel implements AuctionChannel {
  private client: Client | null = null;
  private status: WsConnectionStatus = "idle";
  private hasConnectedOnce = false;
  private statusListeners = new Set<WsStatusListener>();
  private entries = new Set<SubscriptionEntry>();

  private setStatus(next: WsConnectionStatus) {
    if (this.status === next) return;
    this.status = next;
    this.statusListeners.forEach((fn) => fn(next));
  }

  private ensureClient(): Client {
    if (this.client) return this.client;

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      beforeConnect: () => {
        const token = getAccessToken();
        client.connectHeaders = token
          ? { Authorization: `Bearer ${token}` }
          : {};
        this.setStatus(this.hasConnectedOnce ? "reconnecting" : "connecting");
      },
      onConnect: () => {
        const wasReconnect = this.hasConnectedOnce;
        this.hasConnectedOnce = true;
        this.setStatus("connected");

        this.entries.forEach((entry) => {
          this.attachStompSubscription(client, entry);
          if (wasReconnect && entry.onReconnect) {
            entry.onReconnect();
          }
        });
      },
      onWebSocketClose: () => {
        if (this.entries.size > 0) {
          this.setStatus("reconnecting");
        } else {
          this.setStatus("disconnected");
        }
      },
      onStompError: () => {
        if (this.entries.size > 0) {
          this.setStatus("reconnecting");
        }
      },
    });

    this.client = client;
    return client;
  }

  private attachStompSubscription(client: Client, entry: SubscriptionEntry) {
    try {
      entry.stompSub?.unsubscribe();
    } catch {
      // Bỏ qua lỗi khi đóng subscription cũ
    }
    if (!client.connected) return;

    const destination = `/topic/auctions/${entry.auctionId}`;
    entry.stompSub = client.subscribe(destination, (message: IMessage) => {
      try {
        const raw = JSON.parse(message.body) as unknown;
        const parsed = AuctionEventSchema.safeParse(raw);
        if (parsed.success) {
          entry.handler(parsed.data as AuctionEvent);
        } else if (process.env.NODE_ENV === "development") {
          console.warn("[WS] Invalid AuctionEvent payload", parsed.error.issues);
        }
      } catch {
        // Bỏ qua frame không phải JSON
      }
    });
  }

  subscribe(
    auctionId: number,
    onEvent: AuctionEventHandler,
    onReconnect?: () => void
  ): () => void {
    const entry: SubscriptionEntry = {
      auctionId,
      handler: onEvent,
      onReconnect,
    };
    this.entries.add(entry);

    const client = this.ensureClient();
    if (client.connected) {
      this.attachStompSubscription(client, entry);
    } else if (!client.active) {
      client.activate();
    }

    return () => {
      try {
        entry.stompSub?.unsubscribe();
      } catch {
        // ignore
      }
      this.entries.delete(entry);
      if (this.entries.size === 0 && this.client?.active) {
        void this.client.deactivate();
        this.setStatus("idle");
      }
    };
  }

  onStatusChange(listener: WsStatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  getStatus(): WsConnectionStatus {
    return this.status;
  }

  reset(): void {
    this.entries.forEach((entry) => {
      try {
        entry.stompSub?.unsubscribe();
      } catch {
        // ignore
      }
      entry.stompSub = undefined;
    });

    if (this.client) {
      const oldClient = this.client;
      this.client = null;
      void oldClient.deactivate();
    }
    this.hasConnectedOnce = false;
    this.setStatus("idle");

    if (this.entries.size > 0) {
      const nextClient = this.ensureClient();
      nextClient.activate();
    }
  }
}

let stompSingleton: StompAuctionChannel | null = null;

export function getStompAuctionChannel(): AuctionChannel {
  if (!stompSingleton) {
    stompSingleton = new StompAuctionChannel();
  }
  return stompSingleton;
}
