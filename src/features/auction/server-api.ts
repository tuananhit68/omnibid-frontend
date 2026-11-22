import type { ApiResponse } from "@/lib/api/types";
import type {
  AuctionDetail,
  AuctionSummary,
  BidHistoryItem,
  Category,
  Page,
} from "@/lib/api/contract";
import type { AuctionListParams } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_API_MODE === "mock";

export interface ServerFetchResult<T> {
  data: T | null;
  notFound: boolean;
  error: boolean;
}

export async function fetchCategoriesServer(
  size = 100
): Promise<Category[] | null> {
  if (IS_MOCK_MODE) {
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/categories?page=0&size=${size}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse<Page<Category>>;
    return json.success ? json.data.content : null;
  } catch {
    return null;
  }
}

export async function fetchAuctionsServer(
  params?: AuctionListParams
): Promise<Page<AuctionSummary> | null> {
  if (IS_MOCK_MODE) {
    return null;
  }

  try {
    const search = new URLSearchParams();
    if (params) {
      if (params.keyword?.trim()) search.set("keyword", params.keyword.trim());
      if (params.categoryId !== undefined) {
        search.set("categoryId", String(params.categoryId));
      }
      if (params.minPrice !== undefined && params.minPrice > 0) {
        search.set("minPrice", String(params.minPrice));
      }
      if (params.maxPrice !== undefined && params.maxPrice > 0) {
        search.set("maxPrice", String(params.maxPrice));
      }
      if (params.status) search.set("status", params.status);
      if (params.endBefore) search.set("endBefore", params.endBefore);
      if (params.sort) search.set("sort", params.sort);
      if (params.page !== undefined) search.set("page", String(params.page));
      if (params.size !== undefined) search.set("size", String(params.size));
    }

    const qs = search.toString();
    const res = await fetch(`${API_BASE}/auctions${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse<Page<AuctionSummary>>;
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function fetchAuctionDetailServer(
  id: number
): Promise<ServerFetchResult<AuctionDetail>> {
  // Ở chế độ mock, kho dữ liệu nằm trên trình duyệt -> bỏ tải phía server
  if (IS_MOCK_MODE) {
    return { data: null, notFound: false, error: false };
  }

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
    if (!json.success) {
      if (json.error.code === "NOT_FOUND") {
        return { data: null, notFound: true, error: false };
      }
      return { data: null, notFound: false, error: true };
    }

    return { data: json.data, notFound: false, error: false };
  } catch {
    return { data: null, notFound: false, error: true };
  }
}

export async function fetchAuctionBidsServer(
  id: number,
  size = 10
): Promise<Page<BidHistoryItem> | null> {
  if (IS_MOCK_MODE) {
    return null;
  }

  try {
    const res = await fetch(
      `${API_BASE}/auctions/${id}/bids?page=0&size=${size}&sort=createdAt,desc`,
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse<Page<BidHistoryItem>>;
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}
