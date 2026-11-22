import { apiRequest } from "@/lib/api/client";
import type { MyBidItem, Page } from "@/lib/api/contract";
import type { MyBidsParams } from "./types";

export async function getMyBids(params?: MyBidsParams): Promise<Page<MyBidItem>> {
  const cleanParams: Record<string, string | number> = {};
  if (params) {
    if (params.auctionId !== undefined) cleanParams.auctionId = params.auctionId;
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
    if (params.sort) cleanParams.sort = params.sort;
  }

  return apiRequest<Page<MyBidItem>>({
    method: "GET",
    url: "/bids/mine",
    params: cleanParams,
  });
}
