"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircleIcon } from "@/components/icons";

export default function MyOrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi trang đơn hàng của tôi:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto space-y-4">
      <div className="size-14 rounded-full bg-danger-bg text-danger flex items-center justify-center">
        <AlertCircleIcon className="size-8" />
      </div>
      <h2 className="text-h2 font-semibold text-text">
        Không thể tải danh sách đơn hàng
      </h2>
      <p className="text-body text-text-secondary">
        Đã xảy ra lỗi khi tải dữ liệu. Vui lòng kiểm tra kết nối mạng hoặc thử lại.
      </p>
      <div className="pt-2">
        <Button variant="primary" size="lg" onClick={() => reset()}>
          Thử lại
        </Button>
      </div>
    </div>
  );
}
