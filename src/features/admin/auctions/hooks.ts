"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminKeys, invalidateAfterAuctionCancel } from "../shared/queryKeys";
import {
  cancelAdminAuction,
  getAdminAuctionDetailWithMeta,
  getAdminAuctions,
} from "./api";
import type { AdminAuctionsParams } from "./types";

export function useAdminAuctions(params: AdminAuctionsParams) {
  return useQuery({
    queryKey: adminKeys.auctionList(params as Record<string, unknown>),
    queryFn: () => getAdminAuctions(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminAuctionDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: adminKeys.auctionDetail(id),
    queryFn: () => getAdminAuctionDetailWithMeta(id),
    staleTime: 15_000,
    enabled: enabled && Number.isFinite(id) && id > 0,
  });
}

export function useCancelAdminAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAdminAuction,
    onSuccess: (_data, variables) => {
      void invalidateAfterAuctionCancel(queryClient, variables.auctionId);
    },
  });
}
