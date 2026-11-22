"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatBidTimestamp, formatDateTime, formatMoney } from "@/lib/format";
import type { BidHistoryItem } from "../types";

export interface BidHistoryTableProps {
  bids: BidHistoryItem[];
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export function BidHistoryTable({
  bids,
  loading = false,
  error = false,
  errorMessage,
  onRetry,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
}: BidHistoryTableProps) {
  if (loading) {
    return (
      <div className="space-y-2.5 py-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (bids.length === 0) {
    return (
      <EmptyState
        title="Chưa có lượt đặt giá nào"
        description="Hãy là người đầu tiên đặt giá cho phiên đấu giá này."
        className="py-8"
      />
    );
  }

  return (
    <div className="space-y-4">
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
                className="h-13 border-b border-border-subtle last:border-b-0"
              >
                <td
                  className="px-3 py-3 text-small text-text-secondary tabular whitespace-nowrap"
                  title={formatDateTime(bid.createdAt)}
                >
                  {formatBidTimestamp(bid.createdAt)}
                </td>
                <td className="px-3 py-3 text-small font-medium text-text">
                  <span>{bid.bidderName}</span>
                  {index === 0 && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-success-bg px-2 py-0.5 text-caption font-medium text-success-strong">
                      Cao nhất
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-right text-small font-bold text-primary-700 tabular whitespace-nowrap">
                  {formatMoney(bid.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-1">
          <Button
            type="button"
            variant="secondary"
            size="md"
            loading={loadingMore}
            onClick={onLoadMore}
          >
            Xem thêm
          </Button>
        </div>
      )}
    </div>
  );
}
