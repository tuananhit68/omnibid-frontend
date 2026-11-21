"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminOrderDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được chi tiết đơn hàng"
      message="Đã xảy ra lỗi khi tải thông tin đơn hàng. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
