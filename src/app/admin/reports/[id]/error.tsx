"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminReportDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được chi tiết báo cáo vi phạm"
      message="Đã xảy ra lỗi khi tải thông tin báo cáo. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
