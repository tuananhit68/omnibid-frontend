"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import {
  calculateCountdown,
  formatDateTime,
  formatDisplayCode,
  formatMoney,
  formatNumber,
  maskName,
  type CountdownInfo,
} from "@/lib/format";
import { getButtonClassName } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  AlertCircleIcon,
  ClockIcon,
  EyeIcon,
  FileTextIcon,
  GavelIcon,
  HeartIcon,
  InfoIcon,
  SpinnerIcon,
} from "@/components/icons";
import {
  AuctionStatus,
  PRODUCT_CONDITION_LABEL,
  type ProductCondition,
} from "@/types/enums";
import type { WatchlistItem } from "../types";

export interface WatchlistCardProps {
  auction: WatchlistItem;
  onUnwatch: (auction: WatchlistItem) => void;
  unwatching?: boolean;
  priceFlash?: boolean;
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

function useCardCountdown(targetTime: string, enabled: boolean) {
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
    return calculateCountdown(targetTime);
  }, [targetTime, enabled]);

  const getServerSnapshot = useCallback(() => defaultCountdown, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function formatShortDuration(countdown: CountdownInfo): string {
  if (countdown.isZero) return "Sắp mở";
  const totalMins = Math.ceil(countdown.totalSeconds / 60);
  if (totalMins < 60) return `Bắt đầu sau ${totalMins} phút`;
  const hours = Math.floor(countdown.totalSeconds / 3600);
  const mins = Math.floor((countdown.totalSeconds % 3600) / 60);
  if (hours < 24) {
    return `Bắt đầu sau ${String(hours).padStart(2, "0")}g ${String(mins).padStart(2, "0")}p`;
  }
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return `Bắt đầu sau ${days} ngày ${remHours} giờ`;
}

export function WatchlistCard({
  auction,
  onUnwatch,
  unwatching = false,
  priceFlash = false,
  className,
}: WatchlistCardProps) {
  const isActive = auction.status === AuctionStatus.ACTIVE;
  const isScheduled = auction.status === AuctionStatus.SCHEDULED;
  const isEnded = auction.status === AuctionStatus.ENDED;
  const isUnsold = auction.status === AuctionStatus.UNSOLD;
  const isCancelled = auction.status === AuctionStatus.CANCELLED;

  const activeCountdown = useCardCountdown(auction.endTime, isActive);
  const scheduledCountdown = useCardCountdown(auction.startTime, isScheduled);

  const isUnder15Minutes =
    isActive && !activeCountdown.isZero && activeCountdown.totalSeconds < 900;

  const conditionLabel = auction.productCondition
    ? PRODUCT_CONDITION_LABEL[auction.productCondition as ProductCondition]
    : undefined;

  // Giá & nhãn giá theo trạng thái phiên
  let priceLabel = "Giá hiện tại";
  let displayPrice = auction.currentPrice;
  if (isScheduled) {
    priceLabel = "Giá khởi điểm";
    displayPrice = auction.startPrice;
  } else if (isEnded || isUnsold) {
    priceLabel = "Giá trúng cuối cùng";
    displayPrice = auction.finalPrice ?? auction.currentPrice;
  } else if (isCancelled) {
    priceLabel = "Giá lúc huỷ";
    displayPrice = auction.currentPrice;
  }

  return (
    <article
      className={cn(
        "group flex flex-col justify-between bg-surface border border-border-brand rounded-xl overflow-hidden transition-colors",
        "hover:border-primary-600/60",
        className
      )}
    >
      {/* Phần trên: Ảnh + Nội dung */}
      <div>
        {/* Khung ảnh 4:3 */}
        <div className="relative w-full aspect-4/3 bg-surface-subtle overflow-hidden border-b border-border-subtle">
          <Link
            href={`/auctions/${auction.id}`}
            tabIndex={-1}
            aria-hidden="true"
            className="block w-full h-full"
          >
            {auction.primaryImageUrl ? (
              <Image
                src={auction.primaryImageUrl}
                alt={auction.productTitle}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 389px"
                className={cn(
                  "object-cover transition-transform duration-200 group-hover:scale-102",
                  (isEnded || isUnsold || isCancelled) && "opacity-80"
                )}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-tertiary text-h1 font-bold select-none">
                {auction.productTitle.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>

          {/* Chip góc trên trái: Danh mục · Tình trạng · Mã phiên */}
          <div className="absolute top-3 left-3 right-14 flex flex-wrap items-center gap-1.5 pointer-events-none">
            {auction.categoryName && (
              <span className="px-2 py-0.5 rounded-sm bg-surface/95 text-text text-caption font-semibold truncate max-w-36">
                {auction.categoryName}
              </span>
            )}
            {conditionLabel && (
              <span className="px-2 py-0.5 rounded-sm bg-primary-100 text-primary-700 text-caption font-semibold whitespace-nowrap">
                {conditionLabel}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-sm bg-surface/90 text-text-secondary text-caption font-medium tabular whitespace-nowrap">
              {formatDisplayCode("AUC", auction.id)}
            </span>
          </div>

          {/* Nút tim góc trên phải (vùng bấm 44x44px) */}
          <button
            type="button"
            aria-label={`Bỏ theo dõi ${auction.productTitle}`}
            disabled={unwatching}
            onClick={() => onUnwatch(auction)}
            className={cn(
              "absolute top-2 right-2 size-11 rounded-full bg-surface/95 border border-border-brand text-danger",
              "flex items-center justify-center transition-colors",
              "hover:bg-danger-bg focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            {unwatching ? (
              <SpinnerIcon className="size-4 animate-spin" />
            ) : (
              <HeartIcon filled className="size-4.5" />
            )}
          </button>

          {/* Hàng badge đáy ảnh: Trạng thái (trái) & Thời gian (phải) */}
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 pointer-events-none">
            <StatusBadge
              statusType="auction"
              value={auction.status}
              className="bg-surface/95"
            />

            {isActive && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 h-6.5 rounded-full border text-caption font-semibold tabular whitespace-nowrap",
                  isUnder15Minutes || activeCountdown.isZero
                    ? "bg-danger text-text-inverse border-danger"
                    : "bg-text text-text-inverse border-text"
                )}
              >
                <ClockIcon className="size-3.5 shrink-0" />
                <span>
                  {activeCountdown.isZero
                    ? "Đang chốt phiên"
                    : `Còn ${activeCountdown.formatted}`}
                </span>
              </span>
            )}

            {isScheduled && (
              <span className="inline-flex items-center gap-1.5 px-2.5 h-6.5 rounded-full bg-surface/95 border border-border-brand text-text text-caption font-medium tabular whitespace-nowrap">
                <ClockIcon className="size-3.5 shrink-0 text-text-tertiary" />
                <span>
                  Mở lúc {formatDateTime(auction.startTime, "DD/MM HH:mm")}
                </span>
              </span>
            )}

            {(isEnded || isUnsold) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 h-6.5 rounded-full bg-surface/95 border border-border-brand text-text-secondary text-caption font-medium tabular whitespace-nowrap">
                <span>
                  Chốt{" "}
                  {formatDateTime(
                    auction.closedAt || auction.endTime,
                    "DD/MM HH:mm"
                  )}
                </span>
              </span>
            )}

            {isCancelled && (
              <span className="inline-flex items-center gap-1.5 px-2.5 h-6.5 rounded-full bg-surface/95 border border-danger-border text-danger text-caption font-medium tabular whitespace-nowrap">
                <span>
                  {formatDateTime(
                    auction.closedAt || auction.endTime,
                    "DD/MM HH:mm"
                  )}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Nội dung thẻ */}
        <div className="p-4 space-y-3">
          {/* Tên sản phẩm (2 dòng) */}
          <h3 className="text-h4 font-semibold text-text line-clamp-2 min-h-12 group-hover:text-primary-700 transition-colors">
            <Link
              href={`/auctions/${auction.id}`}
              title={auction.productTitle}
              className="focus-visible:outline-2 focus-visible:outline-focus rounded-sm"
            >
              {auction.productTitle}
            </Link>
          </h3>

          {/* Hàng giá & chỉ số phụ */}
          <div className="flex items-end justify-between gap-3 pt-1">
            <div
              className={cn("min-w-0", priceFlash && "price-flash")}
              aria-live={isActive ? "polite" : undefined}
            >
              <span className="label block">{priceLabel}</span>
              <span
                className={cn(
                  "text-price-lg font-bold tabular block mt-0.5",
                  isActive && "text-primary-700",
                  (isScheduled || isEnded || isUnsold) && "text-text",
                  isCancelled && "text-text-subtle line-through"
                )}
              >
                {formatMoney(displayPrice)}
              </span>
            </div>

            {(isActive || isScheduled) && (
              <div className="text-right shrink-0">
                <span className="label block">Bước giá</span>
                <span className="text-small font-semibold text-text tabular block mt-0.5">
                  {formatMoney(auction.bidIncrement)}
                </span>
              </div>
            )}

            {(isEnded || isUnsold) && (
              <div className="text-right shrink-0">
                <span className="label block">Tổng lượt đặt</span>
                <span className="text-small font-semibold text-text tabular block mt-0.5">
                  {formatNumber(auction.bidCount)} lượt
                </span>
              </div>
            )}
          </div>

          {/* Dải thông tin theo trạng thái */}
          {isActive && (
            <div className="bg-surface-subtle rounded-lg px-3 py-2 flex items-center justify-between gap-2 text-caption">
              <span className="inline-flex items-center gap-1.5 text-text-secondary font-medium tabular">
                <GavelIcon className="size-3.5 text-text-tertiary shrink-0" />
                <span>
                  <strong className="text-text font-semibold">
                    {formatNumber(auction.bidCount)}
                  </strong>{" "}
                  lượt đặt
                </span>
              </span>

              {auction.reserveStatus && (
                <StatusBadge
                  statusType="reservePrice"
                  value={auction.reserveStatus}
                  className="h-6 text-caption px-2"
                />
              )}
            </div>
          )}

          {isScheduled && (
            <div className="bg-surface-subtle rounded-lg px-3 py-2 flex items-center justify-between gap-2 text-caption text-text-secondary">
              <span className="inline-flex items-center gap-1.5 font-medium tabular">
                <ClockIcon className="size-3.5 text-text-tertiary shrink-0" />
                <span>{formatShortDuration(scheduledCountdown)}</span>
              </span>
              {auction.reserveStatus && (
                <StatusBadge
                  statusType="reservePrice"
                  value={auction.reserveStatus}
                  className="h-6 text-caption px-2"
                />
              )}
            </div>
          )}

          {isEnded && (
            <div className="bg-surface-subtle rounded-lg px-3 py-2 flex items-center justify-between gap-2 text-caption">
              <span className="text-text-secondary truncate">
                Người thắng:{" "}
                <strong className="font-semibold text-text tabular">
                  {auction.highestBidderName
                    ? maskName(auction.highestBidderName)
                    : "--"}
                </strong>
              </span>
              <span className="font-semibold text-primary-700 whitespace-nowrap shrink-0">
                Đã có người thắng
              </span>
            </div>
          )}

          {isUnsold && (
            <div className="bg-surface-subtle rounded-lg px-3 py-2 flex items-center justify-between gap-2 text-caption">
              <span className="text-text-secondary">Chưa có người trúng</span>
              {auction.reserveStatus && (
                <StatusBadge
                  statusType="reservePrice"
                  value={auction.reserveStatus}
                  className="h-6 text-caption px-2"
                />
              )}
            </div>
          )}

          {isCancelled && (
            <div className="bg-danger-bg border border-danger-border rounded-lg px-3 py-2 flex items-start gap-2 text-caption text-text">
              <AlertCircleIcon className="size-4 text-danger shrink-0 mt-0.5" />
              <p className="line-clamp-2">
                <strong className="font-semibold">Lý do huỷ: </strong>
                {auction.cancelReason || "Phiên đấu giá đã bị huỷ."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hàng nút hành động full-width */}
      <div className="p-4 pt-0">
        {isActive && (
          <Link
            href={`/auctions/${auction.id}`}
            className={getButtonClassName({
              variant: "primary-strong",
              size: "lg",
              className: "w-full",
            })}
          >
            <GavelIcon className="size-4 shrink-0" />
            <span>Vào đặt giá ngay</span>
          </Link>
        )}

        {isScheduled && (
          <Link
            href={`/auctions/${auction.id}`}
            className={getButtonClassName({
              variant: "secondary",
              size: "lg",
              className: "w-full",
            })}
          >
            <EyeIcon className="size-4 shrink-0" />
            <span>Xem chi tiết</span>
          </Link>
        )}

        {(isEnded || isUnsold) && (
          <Link
            href={`/auctions/${auction.id}`}
            className={getButtonClassName({
              variant: "secondary",
              size: "lg",
              className: "w-full",
            })}
          >
            <FileTextIcon className="size-4 shrink-0" />
            <span>Xem kết quả</span>
          </Link>
        )}

        {isCancelled && (
          <Link
            href={`/auctions/${auction.id}`}
            className={getButtonClassName({
              variant: "secondary",
              size: "lg",
              className: "w-full",
            })}
          >
            <InfoIcon className="size-4 shrink-0" />
            <span>Xem chi tiết</span>
          </Link>
        )}
      </div>
    </article>
  );
}

