import { apiRequest } from "@/lib/api/client";
import type { AdminOrderDetail, OrderSummary, Page } from "@/lib/api/contract";
import type { AdminOrdersParams, CancelAdminOrderPayload } from "./types";

export function getAdminOrders(
  params: AdminOrdersParams
): Promise<Page<OrderSummary>> {
  return apiRequest<Page<OrderSummary>>({
    url: "/admin/orders",
    method: "GET",
    params: {
      status: params.status || undefined,
      buyerId: params.buyerId || undefined,
      sellerId: params.sellerId || undefined,
      fromDate: params.fromDate || undefined,
      toDate: params.toDate || undefined,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "createdAt,desc",
    },
  });
}

export function getAdminOrderDetail(id: number): Promise<AdminOrderDetail> {
  return apiRequest<AdminOrderDetail>({
    url: `/admin/orders/${id}`,
    method: "GET",
  });
}

export function cancelAdminOrder({
  orderId,
  reason,
}: CancelAdminOrderPayload): Promise<AdminOrderDetail> {
  return apiRequest<AdminOrderDetail>({
    url: `/admin/orders/${orderId}/cancel`,
    method: "POST",
    data: { reason },
  });
}
