"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertCircleIcon } from "@/components/icons";

export default function AuctionDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi trang chi tiết phiên đấu giá:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto space-y-4">
      <div className="size-14 rounded-full bg-danger-bg text-danger flex items-center justify-center">
        <AlertCircleIcon className="size-8" />
      </div>
      <h1 className="text-h2 font-semibold text-text">
        Không thể tải chi tiết phiên đấu giá
      </h1>
      <p className="text-body text-text-secondary">
        Đã xảy ra lỗi khi tải thông tin phiên. Vui lòng thử lại hoặc quay lại danh sách phiên.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Button variant="primary" size="lg" onClick={() => reset()}>
          Thử lại
        </Button>
        <Link href="/auctions">
          <Button variant="outline" size="lg">
            Xem danh sách phiên
          </Button>
        </Link>
      </div>
    </div>
  );
}

