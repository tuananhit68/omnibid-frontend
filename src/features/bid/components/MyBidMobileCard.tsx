"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { MyBidItem } from "../types";
import {
  MyBidActionLink,
  MyBidProductSummary,
  MyBidPositionCell,
} from "./MyBidParts";

export function MyBidMobileCard({ row }: { row: MyBidItem }) {
  return (
    <div className="p-4 border-b border-border-subtle last:border-b-0 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <MyBidProductSummary row={row} />
        <MyBidPositionCell row={row} />
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-subtle p-3 text-small">
        <div>
          <span className="label block">Giá tôi đặt</span>
          <span className="font-semibold text-text tabular">
            {formatMoney(row.amount)}
          </span>
        </div>
        <div>
          <span className="label block">Giá hiện tại</span>
          <span className="font-bold text-primary-700 tabular">
            {formatMoney(row.currentPrice)}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StatusBadge statusType="auction" value={row.auctionStatus} />
          <span className="text-caption text-text-tertiary tabular">
            {formatDateTime(row.createdAt)}
          </span>
        </div>
        <MyBidActionLink row={row} touchSize="md" />
      </div>
    </div>
  );
}
