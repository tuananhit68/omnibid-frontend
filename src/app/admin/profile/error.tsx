"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-240">
      <ErrorState
        title="Không thể hiển thị trang hồ sơ"
        message="Đã có lỗi xảy ra khi tải thông tin tài khoản quản trị. Vui lòng thử lại."
        onRetry={reset}
      />
    </div>
  );
}
