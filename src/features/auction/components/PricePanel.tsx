"use client";

import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuctionStatus, ReservePriceStatus } from "@/types/enums";
import type { AuctionDetail } from "../types";

export interface PricePanelProps {
  auction: AuctionDetail;
  priceFlash?: boolean;
  className?: string;
}

export function PricePanel({
  auction,
  priceFlash = false,
  className,
}: PricePanelProps) {
  const isScheduled = auction.status === AuctionStatus.SCHEDULED;
  const isEnded =
    auction.status === AuctionStatus.ENDED ||
    auction.status === AuctionStatus.UNSOLD;

  const displayPrice = isScheduled
    ? auction.startPrice
    : isEnded && auction.finalPrice != null
    ? auction.finalPrice
    : auction.currentPrice;

  const priceLabel = isScheduled
    ? "Giá khởi điểm"
    : isEnded
    ? "Giá chốt phiên"
    : "Giá hiện tại";

  const reserveStatus = auction.reserveStatus ?? ReservePriceStatus.NONE;

  return (
    <div
      className={cn(
        "bg-surface-subtle border border-border-brand rounded-xl p-4 space-y-4",
        className
      )}
    >
      {/* Hàng nhãn + badge giá sàn */}
      <div className="flex items-center justify-between gap-2">
        <span className="label">{priceLabel}</span>
        {auction.reserveStatus && (
          <StatusBadge statusType="reservePrice" value={reserveStatus} />
        )}
      </div>

      {/* Giá lớn */}
      <div
        aria-live="polite"
        className={cn(
          "text-timer md:text-price-xl font-bold text-primary-700 tabular px-1 -mx-1",
          priceFlash && "price-flash"
        )}
      >
        {formatMoney(displayPrice)}
      </div>

      {/* Bảng 4 thông số */}
      <dl className="bg-surface border border-border-brand rounded-lg p-3.5 space-y-2.5 text-small">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-text-tertiary">Giá khởi điểm</dt>
          <dd className="font-semibold text-text tabular">
            {formatMoney(auction.startPrice)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-text-tertiary">Bước giá tối thiểu</dt>
          <dd className="font-semibold text-text tabular">
            {formatMoney(auction.bidIncrement)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-text-tertiary">Tổng số lượt đặt</dt>
          <dd className="font-semibold text-text tabular">
            {auction.bidCount} lượt đặt giá
          </dd>
        </div>

        {(auction.status === AuctionStatus.ACTIVE || isScheduled) &&
          auction.minNextBid != null && (
            <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-4">
              <dt className="font-medium text-text">Giá tối thiểu tiếp theo</dt>
              <dd className="font-bold text-primary-700 tabular">
                {formatMoney(auction.minNextBid)}
              </dd>
            </div>
          )}
      </dl>
    </div>
  );
}

