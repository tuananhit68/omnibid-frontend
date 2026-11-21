import { apiRequest, apiRequestWithMeta } from "@/lib/api/client";
import type {
  AdminAuctionDetail,
  AdminAuctionItem,
  Page,
} from "@/lib/api/contract";
import type { AdminAuctionsParams, CancelAdminAuctionPayload } from "./types";

export function getAdminAuctions(
  params: AdminAuctionsParams
): Promise<Page<AdminAuctionItem>> {
  return apiRequest<Page<AdminAuctionItem>>({
    url: "/admin/auctions",
    method: "GET",
    params: {
      keyword: params.keyword || undefined,
      status: params.status || undefined,
      sellerId: params.sellerId || undefined,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "createdAt,desc",
    },
  });
}

export function getAdminAuctionDetailWithMeta(
  id: number
): Promise<{ data: AdminAuctionDetail; serverOffsetMs: number }> {
  return apiRequestWithMeta<AdminAuctionDetail>({
    url: `/admin/auctions/${id}`,
    method: "GET",
  });
}

export function cancelAdminAuction({
  auctionId,
  reason,
}: CancelAdminAuctionPayload): Promise<AdminAuctionDetail> {
  return apiRequest<AdminAuctionDetail>({
    url: `/admin/auctions/${auctionId}/cancel`,
    method: "POST",
    data: { reason },
  });
}
