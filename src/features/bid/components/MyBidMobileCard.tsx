"use client";

import { cn } from "@/lib/cn";
import { formatDateTime, formatMoney } from "@/lib/format";
import { BidStatus } from "@/types/enums";
import type { MyBidItem } from "../types";
import {
  MyBidActionLink,
  MyBidCurrentPrice,
  MyBidProductSummary,
  MyBidStatusCell,
} from "./MyBidParts";

export interface MyBidMobileCardProps {
  row: MyBidItem;
}

export function MyBidMobileCard({ row }: MyBidMobileCardProps) {
  const isOutbid = row.myStatus === BidStatus.OUTBID;
  const isInvalidated = row.myStatus === BidStatus.INVALIDATED;

  return (
    <article
      className={cn(
        "p-4 border-b border-border-subtle last:border-b-0 space-y-3",
        isOutbid && "bg-warning-subtle-bg/60",
        isInvalidated && "bg-danger-bg/40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <MyBidProductSummary row={row} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-surface-subtle">
        <div>
          <span className="label block">Mức giá của tôi</span>
          <span
            className={cn(
              "mt-0.5 block text-body font-bold tabular text-text",
              isInvalidated && "line-through text-text-subtle"
            )}
          >
            {formatMoney(row.myHighestBid)}
          </span>
        </div>

        <div className="text-right">
          <span className="label block">Giá hiện tại</span>
          <div className="mt-0.5">
            <MyBidCurrentPrice row={row} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-caption text-text-tertiary tabular">
          Đặt lúc {formatDateTime(row.myLastBidAt, "DD/MM/YYYY HH:mm:ss")}
        </span>
        <MyBidStatusCell row={row} />
      </div>

      <div className="pt-1">
        <MyBidActionLink row={row} fullWidth touchSize="lg" />
      </div>
    </article>
  );
}
