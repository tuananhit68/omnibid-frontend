"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminOrdersError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được trang quản lý đơn hàng"
      message="Đã xảy ra lỗi khi tải danh sách đơn hàng. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
