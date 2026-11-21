"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function UserProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không thể hiển thị trang hồ sơ"
      message="Đã có lỗi xảy ra khi tải thông tin tài khoản. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
