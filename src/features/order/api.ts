import { apiRequest, apiRequestWithMeta } from "@/lib/api/client";
import type {
  ConfirmReceiptResult,
  OrderDetail,
  OrderSummary,
  Page,
  PaymentHistoryItem,
  PaymentResult,
  ShipResult,
} from "@/lib/api/contract";
import type {
  CreatePaymentRequest,
  OrderPaymentsParams,
  OrdersListParams,
  ShipOrderRequest,
  UpdateShippingInfoRequest,
} from "./types";

export async function getOrders(
  params?: OrdersListParams
): Promise<{ data: Page<OrderSummary>; serverOffsetMs: number }> {
  const cleanParams: Record<string, string | number> = {};
  if (params) {
    if (params.role) cleanParams.role = params.role;
    if (params.status) cleanParams.status = params.status;
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
    if (params.sort) cleanParams.sort = params.sort;
  }

  return apiRequestWithMeta<Page<OrderSummary>>({
    method: "GET",
    url: "/orders",
    params: cleanParams,
  });
}

export async function getOrderDetail(
  id: number
): Promise<{ data: OrderDetail; serverOffsetMs: number }> {
  return apiRequestWithMeta<OrderDetail>({
    method: "GET",
    url: `/orders/${id}`,
  });
}

export async function updateShippingInfo(
  id: number,
  payload: UpdateShippingInfoRequest
): Promise<OrderDetail> {
  return apiRequest<OrderDetail>({
    method: "PATCH",
    url: `/orders/${id}/shipping-info`,
    data: payload,
  });
}

export async function createOrderPayment(
  id: number,
  payload: CreatePaymentRequest,
  idempotencyKey: string
): Promise<PaymentResult> {
  return apiRequest<PaymentResult>({
    method: "POST",
    url: `/orders/${id}/payments`,
    data: payload,
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });
}

export async function getOrderPayments(
  id: number,
  params?: OrderPaymentsParams
): Promise<Page<PaymentHistoryItem>> {
  const cleanParams: Record<string, string | number> = {};
  if (params) {
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
    if (params.sort) cleanParams.sort = params.sort;
  }

  return apiRequest<Page<PaymentHistoryItem>>({
    method: "GET",
    url: `/orders/${id}/payments`,
    params: cleanParams,
  });
}

export async function shipOrder(
  id: number,
  payload: ShipOrderRequest
): Promise<ShipResult> {
  return apiRequest<ShipResult>({
    method: "POST",
    url: `/orders/${id}/ship`,
    data: payload,
  });
}

export async function confirmReceipt(id: number): Promise<ConfirmReceiptResult> {
  return apiRequest<ConfirmReceiptResult>({
    method: "POST",
    url: `/orders/${id}/confirm-receipt`,
  });
}
