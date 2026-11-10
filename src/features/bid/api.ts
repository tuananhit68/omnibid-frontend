import { apiClient, type Page } from "@/lib/api";
import type { MyBidItem, MyBidsParams, MyBidsSummary } from "./types";

/**
 * Lấy danh sách phiên đấu giá mà người dùng hiện tại đã đặt giá (mỗi phiên một dòng)
 * Endpoint: GET /api/v1/bids/mine
 */
export async function getMyBids(
  params?: MyBidsParams
): Promise<Page<MyBidItem>> {
  const cleanParams: Record<string, string | number> = {};
  if (params) {
    if (params.status) cleanParams.status = params.status;
    if (params.auctionStatus) cleanParams.auctionStatus = params.auctionStatus;
    if (params.q?.trim()) cleanParams.q = params.q.trim();
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
  }

  return apiClient.get<unknown, Page<MyBidItem>>("/bids/mine", {
    params: cleanParams,
  });
}

/**
 * Lấy thống kê tổng quan các lượt đặt giá của người dùng hiện tại
 * Endpoint: GET /api/v1/bids/mine/summary
 */
export async function getMyBidsSummary(): Promise<MyBidsSummary> {
  return apiClient.get<unknown, MyBidsSummary>("/bids/mine/summary");
}

