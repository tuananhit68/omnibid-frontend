"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  adminKeys,
  invalidateAfterCategoryMutation,
} from "../shared/queryKeys";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "./api";
import type { AdminCategoriesParams, AdminCategoryPayload } from "./types";

export function useAdminCategories(params: AdminCategoriesParams) {
  return useQuery({
    queryKey: adminKeys.categoryList(params as Record<string, unknown>),
    queryFn: () => getAdminCategories(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminCategoryPayload) => createAdminCategory(payload),
    onSuccess: () => {
      void invalidateAfterCategoryMutation(queryClient);
    },
  });
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: AdminCategoryPayload;
    }) => updateAdminCategory(id, payload),
    onSuccess: () => {
      void invalidateAfterCategoryMutation(queryClient);
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminCategory(id),
    onSuccess: () => {
      void invalidateAfterCategoryMutation(queryClient);
    },
  });
}
