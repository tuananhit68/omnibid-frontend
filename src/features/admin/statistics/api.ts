import { apiRequest } from "@/lib/api/client";
import type { AdminStatistics } from "@/lib/api/contract";

export function getAdminStatistics(): Promise<AdminStatistics> {
  return apiRequest<AdminStatistics>({
    url: "/admin/statistics",
    method: "GET",
  });
}
