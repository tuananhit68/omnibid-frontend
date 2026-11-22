"use client";

import { ErrorState } from "@/components/ui";

export default function NewProductError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không thể tải trang thêm sản phẩm"
      message="Đã xảy ra lỗi ngoài ý muốn. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
