"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminDashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được trang tổng quan quản trị"
      message="Đã xảy ra lỗi khi hiển thị số liệu thống kê. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
