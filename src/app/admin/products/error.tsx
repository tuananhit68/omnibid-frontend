"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminProductsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được trang quản lý sản phẩm"
      message="Đã xảy ra lỗi khi tải danh sách sản phẩm. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
