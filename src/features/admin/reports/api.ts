import { apiRequest } from "@/lib/api/client";
import type {
  AdminReportDetail,
  AdminReportItem,
  Page,
} from "@/lib/api/contract";
import type { AdminReportsParams, ResolveReportPayload } from "./types";

export function getAdminReports(
  params: AdminReportsParams
): Promise<Page<AdminReportItem>> {
  return apiRequest<Page<AdminReportItem>>({
    url: "/admin/reports",
    method: "GET",
    params: {
      status: params.status || undefined,
      targetType: params.targetType || undefined,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "createdAt,desc",
    },
  });
}

export function getAdminReportDetail(id: number): Promise<AdminReportDetail> {
  return apiRequest<AdminReportDetail>({
    url: `/admin/reports/${id}`,
    method: "GET",
  });
}

export function resolveAdminReport({
  reportId,
  decision,
  note,
}: ResolveReportPayload): Promise<AdminReportDetail> {
  return apiRequest<AdminReportDetail>({
    url: `/admin/reports/${reportId}/resolve`,
    method: "POST",
    data: { decision, note },
  });
}
