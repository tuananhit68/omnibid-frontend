"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminKeys, invalidateAfterOrderCancel } from "../shared/queryKeys";
import { cancelAdminOrder, getAdminOrderDetail, getAdminOrders } from "./api";
import type { AdminOrdersParams } from "./types";

export function useAdminOrders(params: AdminOrdersParams) {
  return useQuery({
    queryKey: adminKeys.orderList(params as Record<string, unknown>),
    queryFn: () => getAdminOrders(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminOrderDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: adminKeys.orderDetail(id),
    queryFn: () => getAdminOrderDetail(id),
    staleTime: 30_000,
    enabled: enabled && Number.isFinite(id) && id > 0,
  });
}

export function useCancelAdminOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAdminOrder,
    onSuccess: (_data, variables) => {
      void invalidateAfterOrderCancel(queryClient, variables.orderId);
    },
  });
}
