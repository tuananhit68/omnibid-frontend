import { apiClient, type Page } from "@/lib/api";
import { unwatchAuction, watchAuction } from "@/features/auction/api";
import type {
  WatchlistItem,
  WatchlistParams,
  WatchlistSummary,
} from "./types";

/**
 * Lấy danh sách phiên đấu giá đang theo dõi (sắp theo watchedAt giảm dần)
 * Endpoint: GET /api/v1/watchlist
 */
export async function getWatchlist(
  params?: WatchlistParams
): Promise<Page<WatchlistItem>> {
  const cleanParams: Record<string, string | number> = {};
  if (params) {
    if (params.status) cleanParams.status = params.status;
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
  }

  return apiClient.get<unknown, Page<WatchlistItem>>("/watchlist", {
    params: cleanParams,
  });
}

/**
 * Lấy thống kê tóm tắt danh sách đang theo dõi
 * Endpoint: GET /api/v1/watchlist/summary
 */
export async function getWatchlistSummary(): Promise<WatchlistSummary> {
  return apiClient.get<unknown, WatchlistSummary>("/watchlist/summary");
}

export { watchAuction, unwatchAuction };

