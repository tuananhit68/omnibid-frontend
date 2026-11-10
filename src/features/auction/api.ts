import { apiClient, type Page } from "@/lib/api";
import type {
  AuctionDetail,
  AuctionItem,
  AuctionListParams,
  BidItem,
  CategoryItem,
} from "./types";

/**
 * Lấy danh sách phiên đấu giá từ backend
 * Endpoint: GET /api/v1/auctions
 */
export async function getAuctions(
  params?: AuctionListParams
): Promise<Page<AuctionItem>> {
  const cleanParams: Record<string, string | number> = {};
  if (params) {
    if (params.status) cleanParams.status = params.status;
    if (params.q?.trim()) cleanParams.q = params.q.trim();
    if (params.categoryIds) cleanParams.categoryIds = params.categoryIds;
    if (params.minPrice !== undefined && params.minPrice > 0) {
      cleanParams.minPrice = params.minPrice;
    }
    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      cleanParams.maxPrice = params.maxPrice;
    }
    if (params.sellerId !== undefined) cleanParams.sellerId = params.sellerId;
    if (params.sort) cleanParams.sort = params.sort;
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
  }

  return apiClient.get<unknown, Page<AuctionItem>>("/auctions", {
    params: cleanParams,
  });
}

/**
 * Lấy danh sách danh mục công khai
 * Endpoint: GET /api/v1/categories
 */
export async function getCategories(): Promise<CategoryItem[]> {
  return apiClient.get<unknown, CategoryItem[]>("/categories");
}

/**
 * Thêm phiên đấu giá vào danh sách theo dõi
 * Endpoint: POST /api/v1/watchlist/{auctionId}
 */
export async function watchAuction(
  auctionId: number
): Promise<{ auctionId: number; watchedAt: string }> {
  return apiClient.post<unknown, { auctionId: number; watchedAt: string }>(
    `/watchlist/${auctionId}`
  );
}

/**
 * Bỏ theo dõi phiên đấu giá
 * Endpoint: DELETE /api/v1/watchlist/{auctionId}
 */
export async function unwatchAuction(auctionId: number): Promise<void> {
  await apiClient.delete(`/watchlist/${auctionId}`);
}

/**
 * Lấy chi tiết phiên đấu giá
 * Endpoint: GET /api/v1/auctions/{id}
 */
export async function getAuctionDetail(id: number): Promise<AuctionDetail> {
  return apiClient.get<unknown, AuctionDetail>(`/auctions/${id}`);
}

/**
 * Lấy lịch sử đặt giá của phiên
 * Endpoint: GET /api/v1/auctions/{id}/bids
 */
export async function getAuctionBids(
  id: number,
  limit?: number
): Promise<BidItem[]> {
  return apiClient.get<unknown, BidItem[]>(`/auctions/${id}/bids`, {
    params: limit !== undefined ? { limit } : undefined,
  });
}
