import { apiClient, type Page } from "@/lib/api";
import type { AuctionItem, AuctionListParams, CategoryItem } from "./types";
import { MOCK_CATEGORIES } from "@/mocks/categories";

/**
 * Lấy danh sách phiên đấu giá từ backend
 * Endpoint: GET /api/v1/auctions
 */
export async function getAuctions(
  params?: AuctionListParams
): Promise<Page<AuctionItem>> {
  const data = await apiClient.get<unknown, Page<AuctionItem>>("/auctions", {
    params,
  });
  return data;
}

/**
 * Lấy danh sách danh mục nổi bật
 * TODO(backend B2): Backend chưa có GET /categories công khai -> dùng mock
 */
export async function getCategories(): Promise<CategoryItem[]> {
  // Giả lập độ trễ mạng nhẹ
  return Promise.resolve(MOCK_CATEGORIES);
}

