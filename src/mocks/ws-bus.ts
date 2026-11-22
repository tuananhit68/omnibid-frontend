"use client";

import type { AuctionEvent } from "@/lib/api/contract";
import type {
  AuctionChannel,
  AuctionEventHandler,
  WsConnectionStatus,
  WsStatusListener,
} from "@/lib/ws/types";

class MockAuctionChannel implements AuctionChannel {
  private subscribers = new Map<number, Set<AuctionEventHandler>>();
  private statusListeners = new Set<WsStatusListener>();
  private status: WsConnectionStatus = "connected";

  subscribe(auctionId: number, onEvent: AuctionEventHandler): () => void {
    let set = this.subscribers.get(auctionId);
    if (!set) {
      set = new Set();
      this.subscribers.set(auctionId, set);
    }
    set.add(onEvent);
    this.status = "connected";
    this.statusListeners.forEach((fn) => fn(this.status));

    return () => {
      const current = this.subscribers.get(auctionId);
      if (!current) return;
      current.delete(onEvent);
      if (current.size === 0) {
        this.subscribers.delete(auctionId);
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
    this.status = "connected";
    this.statusListeners.forEach((fn) => fn(this.status));
  }

  publish(event: AuctionEvent): void {
    const handlers = this.subscribers.get(event.auctionId);
    if (!handlers) return;
    handlers.forEach((fn) => {
      try {
        fn(event);
      } catch {
        // ignore listener error
      }
    });
  }
}

let mockChannelSingleton: MockAuctionChannel | null = null;

export function getMockAuctionChannel(): AuctionChannel {
  if (!mockChannelSingleton) {
    mockChannelSingleton = new MockAuctionChannel();
  }
  return mockChannelSingleton;
}

export function publishAuctionEvent(event: AuctionEvent): void {
  if (!mockChannelSingleton) {
    mockChannelSingleton = new MockAuctionChannel();
  }
  mockChannelSingleton.publish(event);
}
