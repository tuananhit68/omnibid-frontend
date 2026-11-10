import type { ApiResponse } from "@/lib/api/types";
import type { AuctionDetail, BidItem } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface ServerFetchResult<T> {
  data: T | null;
  notFound: boolean;
  error: boolean;
}

/**
 * Tải chi tiết phiên ở Server Component (không dùng localStorage/axios client interceptor)
 */
export async function fetchAuctionDetailServer(
  id: number
): Promise<ServerFetchResult<AuctionDetail>> {
  try {
    const res = await fetch(`${API_BASE}/auctions/${id}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (res.status === 404) {
      return { data: null, notFound: true, error: false };
    }

    if (!res.ok) {
      return { data: null, notFound: false, error: true };
    }

    const json = (await res.json()) as ApiResponse<AuctionDetail>;
    if (!json.success || !json.data) {
      if (json.errorCode === "NOT_FOUND") {
        return { data: null, notFound: true, error: false };
      }
      return { data: null, notFound: false, error: true };
    }

    return { data: json.data, notFound: false, error: false };
  } catch {
    return { data: null, notFound: false, error: true };
  }
}

/**
 * Tải lịch sử đặt giá ban đầu ở Server Component
 */
export async function fetchAuctionBidsServer(
  id: number,
  limit = 5
): Promise<BidItem[]> {
  try {
    const res = await fetch(`${API_BASE}/auctions/${id}/bids?limit=${limit}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiResponse<BidItem[]>;
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

