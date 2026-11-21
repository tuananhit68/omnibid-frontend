import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminReportDetailPageClient } from "@/features/admin/reports";

export const metadata: Metadata = {
  title: "Chi tiết báo cáo vi phạm | OmniBid",
};

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }
  return <AdminReportDetailPageClient reportId={numericId} />;
}
