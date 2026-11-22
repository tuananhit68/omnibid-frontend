"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "../shared/queryKeys";
import { getAdminStatistics } from "./api";

export function useAdminStatistics(enabled = true) {
  return useQuery({
    queryKey: adminKeys.statistics(),
    queryFn: getAdminStatistics,
    staleTime: 30_000,
    enabled,
  });
}
