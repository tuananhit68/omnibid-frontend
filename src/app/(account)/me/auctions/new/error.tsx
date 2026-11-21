"use client";

import { ErrorState } from "@/components/ui";

export default function NewAuctionError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không thể tải trang tạo phiên đấu giá"
      message="Đã xảy ra lỗi ngoài ý muốn. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
