"use client";

import { useSyncExternalStore, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import {
  formatMoney,
  formatDisplayCode,
  formatDateTime,
  calculateCountdown,
  type CountdownInfo,
} from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ClockIcon, GavelIcon, HeartIcon } from "@/components/icons";
import { AuctionStatus } from "@/types/enums";
import type { AuctionItem } from "../types";

export interface AuctionCardProps {
  auction: AuctionItem;
  onToggleWatch?: (auction: AuctionItem) => void;
  watchLoading?: boolean;
  className?: string;
}

const defaultCountdown: CountdownInfo = {
  hours: "00",
  minutes: "00",
  seconds: "00",
  totalSeconds: 0,
  formatted: "00:00:00",
  isLessThanFiveMinutes: false,
  isZero: false,
};

function useCardCountdown(endTime: string, enabled: boolean) {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (!enabled) return () => {};
      const interval = setInterval(callback, 1000);
      return () => clearInterval(interval);
    },
    [enabled]
  );

  const getSnapshot = useCallback(() => {
    if (!enabled) return defaultCountdown;
    return calculateCountdown(endTime);
  }, [endTime, enabled]);

  const getServerSnapshot = useCallback(() => defaultCountdown, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function AuctionCard({
  auction,
  onToggleWatch,
  watchLoading = false,
  className,
}: AuctionCardProps) {
  const isScheduled = auction.status === AuctionStatus.SCHEDULED;
  const isActive = auction.status === AuctionStatus.ACTIVE;
  const countdown = useCardCountdown(auction.endTime, isActive);

  const displayPrice = isScheduled ? auction.startPrice : auction.currentPrice;
  const priceLabel = isScheduled ? "Giá khởi điểm" : "Giá hiện tại";
  const isWatched = Boolean(auction.isWatched);

  return (
    <article
      className={cn(
        "group flex flex-col justify-between bg-surface border border-border-brand rounded-xl overflow-hidden transition-colors",
        "hover:border-primary-600/60",
        className
      )}
    >
      <div>
        {/* Khung ảnh 4:3 */}
        <Link
          href={`/auctions/${auction.id}`}
          className="relative block w-full aspect-[4/3] bg-surface-subtle overflow-hidden border-b border-border-subtle focus-visible:outline-2 focus-visible:outline-focus"
        >
          {auction.primaryImageUrl ? (
            <Image
              src={auction.primaryImageUrl}
              alt={auction.productTitle}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 288px"
              className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-tertiary text-h1 font-bold select-none">
              {auction.productTitle.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Hàng badge trên ảnh */}
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 pointer-events-none">
            {/* Badge thời gian */}
            {isScheduled ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-bg text-warning-strong border border-warning-border text-caption font-medium tabular shadow-xs">
                <ClockIcon className="size-3.5 shrink-0" />
                <span>Bắt đầu {formatDateTime(auction.startTime, "DD/MM HH:mm")}</span>
              </span>
            ) : isActive ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-caption font-semibold tabular shadow-xs",
                  countdown.isLessThanFiveMinutes
                    ? "bg-danger-bg text-danger-strong border-danger-border"
                    : "bg-warning-bg text-warning-strong border-warning-border"
                )}
              >
                <ClockIcon className="size-3.5 shrink-0" />
                <span>
                  {countdown.isZero ? "Đang chốt" : `Còn ${countdown.formatted}`}
                </span>
              </span>
            ) : (
              <span />
            )}

            <StatusBadge
              statusType="auction"
              value={auction.status}
              className="bg-surface/95 shadow-xs"
            />
          </div>
        </Link>

        {/* Nội dung thông tin */}
        <div className="p-4 space-y-2.5">
          {/* Dòng meta */}
          <p className="text-caption text-text-tertiary truncate">
            {auction.categoryName ? `${auction.categoryName} · ` : ""}
            <span className="tabular">{formatDisplayCode("AUC", auction.id)}</span>
          </p>

          {/* Tên sản phẩm */}
          <h3 className="text-h4 font-semibold text-text line-clamp-2 min-h-12 group-hover:text-primary-700 transition-colors">
            <Link
              href={`/auctions/${auction.id}`}
              title={auction.productTitle}
              className="focus-visible:outline-2 focus-visible:outline-focus rounded"
            >
              {auction.productTitle}
            </Link>
          </h3>

          {/* Hàng giá & lượt đặt */}
          <div className="pt-2.5 border-t border-border-subtle flex items-end justify-between gap-2">
            <div>
              <span className="label block">{priceLabel}</span>
              <span className="text-price-lg font-bold text-primary-700 tabular block mt-0.5">
                {formatMoney(displayPrice)}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-caption font-medium text-text-tertiary tabular pb-1 whitespace-nowrap">
              <GavelIcon className="size-3.5 shrink-0" />
              <span>
                {isScheduled && auction.bidCount === 0
                  ? "Chưa có lượt đặt"
                  : `${auction.bidCount} lượt đặt`}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="p-4 pt-0">
        {onToggleWatch ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              aria-pressed={isWatched}
              loading={watchLoading}
              onClick={() => onToggleWatch(auction)}
              leftIcon={
                <HeartIcon
                  filled={isWatched}
                  className={cn(
                    "size-4",
                    isWatched ? "text-danger" : "text-text-tertiary"
                  )}
                />
              }
              className={cn(
                "flex-1 px-3",
                isWatched && "border-danger-border bg-danger-bg/40 text-danger"
              )}
            >
              {isWatched ? "Đang theo dõi" : "Theo dõi"}
            </Button>

            <Link href={`/auctions/${auction.id}`} className="flex-1">
              <Button variant="primary" size="lg" className="w-full px-3">
                Xem chi tiết
              </Button>
            </Link>
          </div>
        ) : (
          <Link href={`/auctions/${auction.id}`}>
            <Button variant="primary" size="lg" className="w-full">
              Xem chi tiết &amp; Đặt giá
            </Button>
          </Link>
        )}
      </div>
    </article>
  );
}
