"use client";

import Link from "next/link";
import { IS_MOCK_MODE } from "@/lib/api/client";

export function MockModeBanner() {
  if (!IS_MOCK_MODE) return null;

  return (
    <div className="bg-primary-50 border-b border-border-brand px-4 py-1.5 text-center text-caption text-primary-800">
      <span>Chế độ dữ liệu giả lập</span>
      <span className="mx-2 text-primary-300" aria-hidden="true">
        ·
      </span>
      <Link
        href="/dev/mock"
        className="font-semibold text-primary-600 underline-offset-2 hover:underline"
      >
        Bảng điều khiển mock
      </Link>
    </div>
  );
}
