"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AlertCircleIcon } from "@/components/icons";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi ứng dụng:", error);
  }, [error]);

  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto space-y-4">
        <div className="size-14 rounded-full bg-danger-bg text-danger flex items-center justify-center">
          <AlertCircleIcon className="size-8" />
        </div>
        <h2 className="text-h2 font-semibold text-text">Đã xảy ra lỗi</h2>
        <p className="text-body text-text-secondary">
          Không thể tải dữ liệu trang chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.
        </p>
        <div className="pt-2">
          <Button variant="primary" size="lg" onClick={() => reset()}>
            Thử lại
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}

