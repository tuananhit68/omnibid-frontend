"use client";

import { formatDisplayCode } from "@/lib/format";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AdminReportDetailPanel } from "./AdminReportDetailPanel";

export function AdminReportDetailPageClient({
  reportId,
}: {
  reportId: number;
}) {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Quản trị", href: "/admin" },
          { label: "Báo cáo vi phạm", href: "/admin/reports" },
          { label: formatDisplayCode("REP", reportId) },
        ]}
      />
      <AdminReportDetailPanel reportId={reportId} />
    </div>
  );
}
