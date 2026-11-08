import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
        <span className="text-[64px] md:text-[96px] font-bold text-primary-700 tabular leading-none">
          404
        </span>
        <h1 className="mt-4 text-h2 font-semibold text-text">
          Không tìm thấy trang
        </h1>
        <p className="mt-2 text-body text-text-secondary max-w-md">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang địa chỉ khác.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link href="/">
            <Button variant="primary" size="lg">
              Về trang chủ
            </Button>
          </Link>
          <Link href="/auctions">
            <Button variant="outline" size="lg">
              Khám phá phiên đấu giá
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
