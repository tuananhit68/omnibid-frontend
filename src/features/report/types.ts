import type { CreateReportResponse } from "@/lib/api/contract";

export type { CreateReportResponse };

export interface CreateReportRequest {
  reportedProductId?: number;
  reportedUserId?: number;
  reportedOrderId?: number;
  reason: string;
}
