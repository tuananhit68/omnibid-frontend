"use client";

import { IS_MOCK_MODE } from "@/lib/api/client";
import { getMockAuctionChannel } from "@/mocks/ws-bus";
import { getStompAuctionChannel } from "./stomp";
import type { AuctionChannel } from "./types";

export * from "./types";
export * from "./hooks";

export function getAuctionChannel(): AuctionChannel {
  if (IS_MOCK_MODE) {
    return getMockAuctionChannel();
  }
  return getStompAuctionChannel();
}

export function resetWsClient(): void {
  getAuctionChannel().reset();
}
