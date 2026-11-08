import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function ForbiddenPage() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
        <span className="text-[64px] md:text-[96px] font-bold text-danger tabular leading-none">
          403
        </span>
        <h1 className="mt-4 text-h2 font-semibold text-text">
          Truy cập bị từ chối
        </h1>
        <p className="mt-2 text-body text-text-secondary max-w-md">
          Bạn không có quyền truy cập vào khu vực này. Trang chỉ dành cho quản trị viên hệ thống.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="primary" size="lg">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

