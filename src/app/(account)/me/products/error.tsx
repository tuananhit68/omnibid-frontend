"use client";

import { ErrorState } from "@/components/ui";

export default function MyProductsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không thể tải trang Sản phẩm của tôi"
      message="Đã xảy ra lỗi ngoài ý muốn. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
