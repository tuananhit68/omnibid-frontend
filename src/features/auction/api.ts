import { apiRequest, apiRequestWithMeta } from "@/lib/api/client";
import type {
  AuctionDetail,
  AuctionSummary,
  BidHistoryItem,
  Category,
  Page,
  PlaceBidResponse,
} from "@/lib/api/contract";
import type { AuctionListParams, PlaceBidRequest } from "./types";

export async function getAuctions(
  params?: AuctionListParams
): Promise<Page<AuctionSummary>> {
  const cleanParams: Record<string, string | number> = {};
  if (params) {
    if (params.keyword?.trim()) cleanParams.keyword = params.keyword.trim();
    if (params.categoryId !== undefined) cleanParams.categoryId = params.categoryId;
    if (params.minPrice !== undefined && params.minPrice > 0) {
      cleanParams.minPrice = params.minPrice;
    }
    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      cleanParams.maxPrice = params.maxPrice;
    }
    if (params.status) cleanParams.status = params.status;
    if (params.endBefore) cleanParams.endBefore = params.endBefore;
    if (params.sort) cleanParams.sort = params.sort;
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
  }

  return apiRequest<Page<AuctionSummary>>({
    method: "GET",
    url: "/auctions",
    params: cleanParams,
  });
}

export async function getCategories(size = 100): Promise<Page<Category>> {
  return apiRequest<Page<Category>>({
    method: "GET",
    url: "/categories",
    params: { page: 0, size },
  });
}

export async function getAuctionDetailWithMeta(
  id: number
): Promise<{ data: AuctionDetail; serverOffsetMs: number }> {
  return apiRequestWithMeta<AuctionDetail>({
    method: "GET",
    url: `/auctions/${id}`,
  });
}

export async function getAuctionBids(
  id: number,
  page = 0,
  size = 10
): Promise<Page<BidHistoryItem>> {
  return apiRequest<Page<BidHistoryItem>>({
    method: "GET",
    url: `/auctions/${id}/bids`,
    params: { page, size, sort: "createdAt,desc" },
  });
}

export async function placeBid(
  body: PlaceBidRequest
): Promise<PlaceBidResponse> {
  return apiRequest<PlaceBidResponse>({
    method: "POST",
    url: `/auctions/${body.auctionId}/bids`,
    data: { amount: body.amount },
  });
}
