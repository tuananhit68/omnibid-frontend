import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatMoney, formatDateTime, formatDisplayCode } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import type { AuctionItem } from "../types";

export interface UpcomingAuctionCardProps {
  auction: AuctionItem;
  className?: string;
}

export function UpcomingAuctionCard({
  auction,
  className,
}: UpcomingAuctionCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col justify-between p-4 bg-surface border border-border-brand rounded-xl transition-all",
        "hover:border-primary-600/60 hover:shadow-xs select-none",
        className
      )}
    >
      <div className="flex gap-4">
        {/* Ảnh 96px */}
        <div className="size-24 rounded-lg bg-surface-subtle shrink-0 border border-border-subtle flex items-center justify-center text-text-tertiary font-bold text-h3">
          {auction.productTitle.charAt(0)}
        </div>

        {/* Thông tin bên phải ảnh */}
        <div className="flex-1 min-w-0 space-y-1">
          <span className="inline-block px-2 py-0.5 rounded-full bg-warning-bg text-warning-strong text-caption font-semibold tabular">
            Bắt đầu {formatDateTime(auction.startTime, "DD/MM HH:mm")}
          </span>

          <h4 className="text-body font-semibold text-text line-clamp-2 group-hover:text-primary-700 transition-colors">
            <Link href={`/auctions/${auction.id}`}>{auction.productTitle}</Link>
          </h4>

          <div className="pt-1 flex items-center gap-2 text-caption text-text-tertiary">
            <span className="tabular font-medium">
              {formatDisplayCode("AUC", auction.id)}
            </span>
            <span>•</span>
            <span>Khởi điểm: <strong className="text-text font-semibold tabular">{formatMoney(auction.startPrice)}</strong></span>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-end">
        <Link href={`/auctions/${auction.id}`} className="w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Xem chi tiết
          </Button>
        </Link>
      </div>
    </div>
  );
}

