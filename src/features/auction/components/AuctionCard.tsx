// TODO fe-v4 auction-list
"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getButtonClassName } from "@/components/ui/Button";
import { calculateCountdown, formatDateTime, formatMoney } from "@/lib/format";
import { AuctionStatus } from "@/types/enums";
import type { AuctionSummary } from "../types";

export interface AuctionCardProps {
  auction: AuctionSummary;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const countdown = calculateCountdown(auction.endTime);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border-brand bg-surface">
      <Link
        href={`/auctions/${auction.id}`}
        className="relative aspect-4/3 w-full overflow-hidden bg-surface-subtle"
      >
        {auction.primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={auction.primaryImageUrl}
            alt={auction.title}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-caption text-text-tertiary">
            Chưa có ảnh
          </div>
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge statusType="auction" value={auction.status} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-caption text-text-tertiary">{auction.categoryName}</p>
          <Link
            href={`/auctions/${auction.id}`}
            className="text-h4 text-text hover:text-primary-600 line-clamp-2"
          >
            {auction.title}
          </Link>
        </div>

        <div className="mt-auto space-y-2 border-t border-border-subtle pt-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="label">
              {auction.bidCount > 0 ? "Giá hiện tại" : "Giá khởi điểm"}
            </span>
            <span className="text-caption text-text-tertiary tabular">
              {auction.bidCount} lượt đặt
            </span>
          </div>
          <p className="text-price-lg text-primary-700 tabular">
            {formatMoney(auction.currentPrice)}
          </p>
          <p className="text-caption text-text-secondary tabular">
            {auction.status === AuctionStatus.ACTIVE
              ? countdown.isZero
                ? "Đang chốt phiên…"
                : `Còn ${countdown.formatted}`
              : auction.status === AuctionStatus.SCHEDULED
                ? `Bắt đầu ${formatDateTime(auction.startTime)}`
                : `Kết thúc ${formatDateTime(auction.endTime)}`}
          </p>
          <Link
            href={`/auctions/${auction.id}`}
            className={getButtonClassName({
              variant: "secondary",
              size: "md",
              className: "w-full",
            })}
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}
