import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <PublicLayout>
      <div className="py-12 md:py-20 text-center max-w-3xl mx-auto space-y-6">
        <span className="label font-semibold text-primary-700">
          Sàn đấu giá trực tuyến OmniBid
        </span>
        <h1 className="text-display font-bold text-text">
          Đấu giá minh bạch, chuẩn xác và tin cậy
        </h1>
        <p className="text-body-lg text-text-secondary">
          Nền tảng đấu giá trực tuyến thời gian thực với công nghệ WebSocket tốc độ cao, quy trình thanh toán và vận chuyển an toàn.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/auctions">
            <Button variant="primary" size="lg">
              Khám phá phiên đấu giá
            </Button>
          </Link>
          <Link href="/dev/ui">
            <Button variant="outline" size="lg">
              Thư viện UI Component (/dev/ui)
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
