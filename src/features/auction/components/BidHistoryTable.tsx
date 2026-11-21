// TODO fe-v4 auction-detail
"use client";

import { formatBidTimestamp, formatMoney } from "@/lib/format";
import type { BidHistoryItem } from "../types";

export interface BidHistoryTableProps {
  bids: BidHistoryItem[];
  loading?: boolean;
}

export function BidHistoryTable({ bids, loading = false }: BidHistoryTableProps) {
  if (loading) {
    return (
      <div className="space-y-2 py-4">
        <div className="h-10 rounded-md bg-surface-subtle animate-pulse" />
        <div className="h-10 rounded-md bg-surface-subtle animate-pulse" />
        <div className="h-10 rounded-md bg-surface-subtle animate-pulse" />
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <p className="py-6 text-center text-small text-text-tertiary">
        Chưa có lượt đặt giá nào.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-subtle">
            <th className="label px-3 py-2.5">Thời điểm</th>
            <th className="label px-3 py-2.5">Người đặt</th>
            <th className="label px-3 py-2.5 text-right">Mức giá</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid, index) => (
            <tr
              key={bid.id}
              className="border-b border-border-subtle last:border-b-0"
            >
              <td className="px-3 py-3 text-small text-text-secondary tabular">
                {formatBidTimestamp(bid.createdAt)}
              </td>
              <td className="px-3 py-3 text-small font-medium text-text">
                {bid.bidderName}
                {index === 0 && (
                  <span className="ml-2 rounded-sm bg-success-bg px-1.5 py-0.5 text-caption text-success-strong">
                    Cao nhất
                  </span>
                )}
              </td>
              <td className="px-3 py-3 text-right text-small font-bold text-primary-700 tabular">
                {formatMoney(bid.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
