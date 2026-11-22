"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminProductDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được chi tiết sản phẩm"
      message="Đã xảy ra lỗi khi tải thông tin sản phẩm. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
