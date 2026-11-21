// TODO fe-v4 auction-detail
"use client";

import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ReserveStatus } from "@/types/enums";

export interface PricePanelProps {
  currentPrice: number;
  startPrice: number;
  minNextBid: number;
  bidIncrement: number;
  bidCount: number;
  highestBidderName: string | null;
  reserveStatus: ReserveStatus;
  reservePrice?: number | null;
  flash?: boolean;
}

export function PricePanel({
  currentPrice,
  startPrice,
  minNextBid,
  bidIncrement,
  bidCount,
  highestBidderName,
  reserveStatus,
  reservePrice,
  flash = false,
}: PricePanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="label">
          {bidCount > 0 ? "Giá hiện tại" : "Giá khởi điểm"}
        </span>
        <StatusBadge statusType="reserve" value={reserveStatus} />
      </div>

      <p
        className={cn(
          "text-price-xl text-primary-700 tabular px-1 -mx-1",
          flash && "price-flash"
        )}
      >
        {formatMoney(currentPrice)}
      </p>

      <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-subtle p-3 text-small">
        <div>
          <span className="label block">Mức tối thiểu tiếp theo</span>
          <span className="font-semibold text-text tabular">
            {formatMoney(minNextBid)}
          </span>
        </div>
        <div>
          <span className="label block">Bước giá</span>
          <span className="font-semibold text-text tabular">
            {formatMoney(bidIncrement)}
          </span>
        </div>
        <div>
          <span className="label block">Số lượt đặt</span>
          <span className="font-semibold text-text tabular">{bidCount}</span>
        </div>
        <div>
          <span className="label block">Người dẫn đầu</span>
          <span className="font-semibold text-text">
            {highestBidderName ?? "Chưa có"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-caption text-text-tertiary">
        <span>Giá khởi điểm: {formatMoney(startPrice)}</span>
        {reservePrice !== undefined && reservePrice !== null && (
          <span>Giá sàn (chỉ bạn thấy): {formatMoney(reservePrice)}</span>
        )}
      </div>
    </div>
  );
}
