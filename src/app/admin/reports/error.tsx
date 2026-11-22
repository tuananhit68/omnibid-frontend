"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminReportsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được trang báo cáo vi phạm"
      message="Đã xảy ra lỗi khi tải danh sách báo cáo. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
