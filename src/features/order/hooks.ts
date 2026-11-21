"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  confirmReceipt,
  createOrderPayment,
  getOrderDetail,
  getOrderPayments,
  getOrders,
  shipOrder,
  updateShippingInfo,
} from "./api";
import type {
  CreatePaymentRequest,
  OrderPaymentsParams,
  OrdersListParams,
  ShipOrderRequest,
  UpdateShippingInfoRequest,
} from "./types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => ["orders", "list"] as const,
  list: (params?: OrdersListParams) => ["orders", "list", params] as const,
  details: () => ["orders", "detail"] as const,
  detail: (id: number) => ["orders", "detail", id] as const,
  payments: (id: number, params?: OrderPaymentsParams) =>
    ["orders", "detail", id, "payments", params] as const,
};

export function useOrders(params?: OrdersListParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function useOrderDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderDetail(id),
    enabled: enabled && Number.isInteger(id) && id > 0,
  });
}

export function useOrderPayments(
  id: number,
  params?: OrderPaymentsParams,
  enabled = true
) {
  return useQuery({
    queryKey: orderKeys.payments(id, params),
    queryFn: () => getOrderPayments(id, params),
    enabled: enabled && Number.isInteger(id) && id > 0,
    placeholderData: keepPreviousData,
  });
}

export function useUpdateShippingInfo(orderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateShippingInfoRequest) =>
      updateShippingInfo(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useCreateOrderPayment(orderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      idempotencyKey,
    }: {
      payload: CreatePaymentRequest;
      idempotencyKey: string;
    }) => createOrderPayment(orderId, payload, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({
        queryKey: ["orders", "detail", orderId, "payments"],
      });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useShipOrder(orderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShipOrderRequest) => shipOrder(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useConfirmReceipt(orderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => confirmReceipt(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
