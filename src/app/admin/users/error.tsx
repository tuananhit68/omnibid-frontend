"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminUsersError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được trang quản lý người dùng"
      message="Đã xảy ra lỗi khi tải danh sách tài khoản. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
