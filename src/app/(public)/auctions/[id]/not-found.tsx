import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AuctionNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center max-w-md mx-auto space-y-4">
      <span className="text-display font-bold text-primary-700 tabular">
        404
      </span>
      <h1 className="text-h2 font-semibold text-text">
        Không tìm thấy phiên đấu giá
      </h1>
      <p className="text-body text-text-secondary">
        Phiên đấu giá này không tồn tại, đã bị gỡ bỏ hoặc đường dẫn không chính xác.
      </p>
      <div className="pt-2">
        <Link href="/auctions">
          <Button variant="primary" size="lg">
            Khám phá phiên đấu giá khác
          </Button>
        </Link>
      </div>
    </div>
  );
}

