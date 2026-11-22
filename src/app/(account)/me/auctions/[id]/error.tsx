"use client";

import { ErrorState } from "@/components/ui";

export default function MyAuctionDetailError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không thể tải trang quản lý phiên"
      message="Đã xảy ra lỗi ngoài ý muốn. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
