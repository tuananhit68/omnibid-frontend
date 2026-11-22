import type { Metadata } from "next";
import { AdminDashboardClient } from "@/features/admin/statistics";

export const metadata: Metadata = {
  title: "Tổng quan quản trị | OmniBid",
  description: "Thống kê tổng quan hoạt động sàn đấu giá OmniBid.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
