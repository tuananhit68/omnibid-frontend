"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys, invalidateAfterUserAction } from "../shared/queryKeys";
import { banAdminUser, getAdminUsers, unbanAdminUser } from "./api";
import type { AdminUsersParams } from "./types";

export function useAdminUsers(params: AdminUsersParams) {
  return useQuery({
    queryKey: adminKeys.userList(params as Record<string, unknown>),
    queryFn: () => getAdminUsers(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useBanAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: banAdminUser,
    onSuccess: () => {
      void invalidateAfterUserAction(queryClient);
    },
  });
}

export function useUnbanAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unbanAdminUser,
    onSuccess: () => {
      void invalidateAfterUserAction(queryClient);
    },
  });
}
