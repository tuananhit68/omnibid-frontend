"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminKeys, invalidateAfterReportResolve } from "../shared/queryKeys";
import {
  getAdminReportDetail,
  getAdminReports,
  resolveAdminReport,
} from "./api";
import type { AdminReportsParams } from "./types";

export function useAdminReports(params: AdminReportsParams) {
  return useQuery({
    queryKey: adminKeys.reportList(params as Record<string, unknown>),
    queryFn: () => getAdminReports(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminReportDetail(id: number | null, enabled = true) {
  return useQuery({
    queryKey: adminKeys.reportDetail(id ?? 0),
    queryFn: () => getAdminReportDetail(id as number),
    staleTime: 30_000,
    enabled: enabled && id !== null && Number.isFinite(id) && id > 0,
  });
}

export function useResolveAdminReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resolveAdminReport,
    onSuccess: (_data, variables) => {
      void invalidateAfterReportResolve(queryClient, variables.reportId);
    },
  });
}
