"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminKeys, invalidateAfterProductHide } from "../shared/queryKeys";
import {
  getAdminProductDetail,
  getAdminProducts,
  hideAdminProduct,
} from "./api";
import type { AdminProductsParams } from "./types";

export function useAdminProducts(params: AdminProductsParams) {
  return useQuery({
    queryKey: adminKeys.productList(params as Record<string, unknown>),
    queryFn: () => getAdminProducts(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminProductDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: adminKeys.productDetail(id),
    queryFn: () => getAdminProductDetail(id),
    staleTime: 30_000,
    enabled: enabled && Number.isFinite(id) && id > 0,
  });
}

export function useHideAdminProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hideAdminProduct,
    onSuccess: (_data, variables) => {
      void invalidateAfterProductHide(queryClient, variables.productId);
    },
  });
}
