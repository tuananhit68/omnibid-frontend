import { apiRequest } from "@/lib/api/client";
import type { CreateReportResponse } from "@/lib/api/contract";
import type { CreateReportRequest } from "./types";

export async function createReport(
  body: CreateReportRequest
): Promise<CreateReportResponse> {
  return apiRequest<CreateReportResponse>({
    method: "POST",
    url: "/reports",
    data: body,
  });
}
