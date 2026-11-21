"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminAuctionsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được trang quản lý phiên đấu giá"
      message="Đã xảy ra lỗi khi tải danh sách phiên đấu giá. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
