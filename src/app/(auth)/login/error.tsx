"use client";

import { useEffect } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { AlertCircleIcon } from "@/components/icons";

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi trang đăng nhập:", error);
  }, [error]);

  return (
    <AuthLayout maxWidth="md" title="Đăng nhập">
      <div className="flex flex-col items-center text-center space-y-4 py-6">
        <div className="size-12 rounded-full bg-danger-bg text-danger flex items-center justify-center">
          <AlertCircleIcon className="size-6" />
        </div>
        <p className="text-body text-text-secondary">
          Không thể tải biểu mẫu đăng nhập. Vui lòng thử lại.
        </p>
        <Button variant="primary" size="lg" onClick={() => reset()}>
          Thử lại
        </Button>
      </div>
    </AuthLayout>
  );
}

