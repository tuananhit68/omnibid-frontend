"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminAuctionDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được chi tiết phiên đấu giá"
      message="Đã xảy ra lỗi khi tải thông tin phiên đấu giá. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
