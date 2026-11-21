import type { ReportStatus } from "@/types/enums";

export type ReportTargetType = "PRODUCT" | "USER" | "ORDER";

export interface AdminReportsParams {
  status?: ReportStatus | "";
  targetType?: ReportTargetType | "";
  page?: number;
  size?: number;
  sort?: string;
}

export interface ResolveReportPayload {
  reportId: number;
  decision: "RESOLVED" | "REJECTED";
  note: string;
}
