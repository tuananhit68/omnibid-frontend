"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getButtonClassName } from "@/components/ui/Button";
import { useSharedNowMs } from "@/components/ui/CountdownTimer";
import { calculateCountdown, formatDateTime, formatMoney } from "@/lib/format";
import { AUCTION_STATUS_META, AuctionStatus } from "@/types/enums";
import type { AuctionSummary } from "../types";
import { ReserveBadge } from "./ReserveBadge";

export interface AuctionCardProps {
  auction: AuctionSummary;
}

function ActiveAuctionMeta({
  endTime,
  bidCount,
}: {
  endTime: string;
  bidCount: number;
}) {
  const nowMs = useSharedNowMs();
  const countdown =
    nowMs > 0 ? calculateCountdown(endTime, 0, nowMs) : null;

  return (
    <>
      {bidCount} lượt ·{" "}
      {!countdown
        ? "Đang tải…"
        : countdown.isZero
          ? "Đang chốt phiên…"
          : `còn ${countdown.formatted}`}
    </>
  );
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const isActive = auction.status === AuctionStatus.ACTIVE;
  const isScheduled = auction.status === AuctionStatus.SCHEDULED;

  const priceLabel = isScheduled
    ? "Giá khởi điểm"
    : isActive
      ? "Giá hiện tại"
      : auction.status === AuctionStatus.ENDED
        ? "Giá cuối"
        : "Giá hiện tại";

  const displayPrice = isScheduled ? auction.startPrice : auction.currentPrice;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border-brand bg-surface transition-colors hover:border-border-strong">
      <Link
        href={`/auctions/${auction.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-4/3 w-full overflow-hidden bg-surface-subtle"
      >
        {auction.primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={auction.primaryImageUrl}
            alt=""
            loading="lazy"
            decoding="async"
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
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-caption text-text-tertiary truncate">
              {auction.categoryName}
            </span>
            <ReserveBadge status={auction.reserveStatus} compact />
          </div>
          <Link
            href={`/auctions/${auction.id}`}
            className="block text-h4 text-text hover:text-primary-600 line-clamp-2 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 rounded-xs"
          >
            {auction.title}
          </Link>
        </div>

        <div className="mt-auto space-y-2.5 border-t border-border-subtle pt-3">
          <div className="space-y-0.5">
            <span className="label block">{priceLabel}</span>
            <p className="text-price-lg text-primary-700 tabular">
              {formatMoney(displayPrice)}
            </p>
          </div>

          <p className="text-caption text-text-secondary tabular">
            {isActive ? (
              <ActiveAuctionMeta
                endTime={auction.endTime}
                bidCount={auction.bidCount}
              />
            ) : isScheduled ? (
              <>Bắt đầu {formatDateTime(auction.startTime, "HH:mm DD/MM")}</>
            ) : (
              <>
                {AUCTION_STATUS_META[auction.status].label} · {auction.bidCount} lượt
              </>
            )}
          </p>

          <Link
            href={`/auctions/${auction.id}`}
            className={getButtonClassName({
              variant: "secondary",
              size: "md",
              className: "w-full min-h-11 md:min-h-10",
            })}
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}
