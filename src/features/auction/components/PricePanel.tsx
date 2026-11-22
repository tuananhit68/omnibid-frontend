"use client";

import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { AuctionStatus } from "@/types/enums";

export interface PricePanelProps {
  status: AuctionStatus;
  currentPrice: number;
  startPrice: number;
  minNextBid: number;
  bidIncrement: number;
  bidCount: number;
  highestBidderName: string | null;
  flash?: boolean;
}

export function PricePanel({
  status,
  currentPrice,
  startPrice,
  minNextBid,
  bidIncrement,
  bidCount,
  highestBidderName,
  flash = false,
}: PricePanelProps) {
  const isScheduled = status === AuctionStatus.SCHEDULED;
  const priceHeading = isScheduled
    ? "Giá khởi điểm"
    : status === AuctionStatus.ENDED
      ? "Giá chốt cuối"
      : "Giá hiện tại";

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <span className="label block">{priceHeading}</span>
        <p
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "text-price-xl text-primary-700 tabular rounded-md px-1 -mx-1",
            flash && "price-flash"
          )}
        >
          {formatMoney(isScheduled ? startPrice : currentPrice)}
        </p>
      </div>

      {/* Lưới số liệu */}
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 rounded-lg bg-primary-50 px-3.5 py-2.5">
          <span className="label block text-primary-700">
            Mức tối thiểu tiếp theo
          </span>
          <span className="text-h3 font-bold text-primary-700 tabular">
            {formatMoney(minNextBid)}
          </span>
        </div>

        <div className="rounded-lg bg-surface-subtle px-3 py-2.5">
          <span className="label block">Giá khởi điểm</span>
          <span className="text-small font-semibold text-text tabular">
            {formatMoney(startPrice)}
          </span>
        </div>

        <div className="rounded-lg bg-surface-subtle px-3 py-2.5">
          <span className="label block">Bước giá</span>
          <span className="text-small font-semibold text-text tabular">
            {formatMoney(bidIncrement)}
          </span>
        </div>

        <div className="rounded-lg bg-surface-subtle px-3 py-2.5">
          <span className="label block">Số lượt đặt</span>
          <span className="text-small font-semibold text-text tabular">
            {bidCount} lượt
          </span>
        </div>

        <div className="rounded-lg bg-surface-subtle px-3 py-2.5">
          <span className="label block">Người dẫn đầu</span>
          <span className="text-small font-semibold text-text truncate block">
            {highestBidderName ?? "Chưa có"}
          </span>
        </div>
      </div>
    </div>
  );
}
