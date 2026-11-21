"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminCategoriesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Không tải được trang quản lý danh mục"
      message="Đã xảy ra lỗi khi tải danh sách danh mục. Vui lòng thử lại."
      onRetry={reset}
    />
  );
}
