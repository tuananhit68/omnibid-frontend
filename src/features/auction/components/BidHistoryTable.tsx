"use client";

import { cn } from "@/lib/cn";
import { formatDateTime, formatMoney, maskName } from "@/lib/format";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BidStatus } from "@/types/enums";
import type { BidItem } from "../types";

export interface BidHistoryTableProps {
  bids: BidItem[];
  currentUserId?: number | null;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export function BidHistoryTable({
  bids,
  currentUserId,
  loading = false,
  error,
  onRetry,
  className,
}: BidHistoryTableProps) {
  const columns: Column<BidItem>[] = [
    {
      key: "bidderName",
      header: "Người đặt",
      render: (row) => {
        const isLeading = row.status === BidStatus.LEADING;
        const isMe = currentUserId != null && row.bidderId === currentUserId;
        const display = maskName(row.bidderName);
        return (
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className={cn(
                "size-8 rounded-full flex items-center justify-center text-caption font-bold shrink-0",
                isLeading || isMe
                  ? "bg-primary-50 text-primary-700"
                  : "bg-neutral-bg text-neutral"
              )}
            >
              {display.charAt(0).toUpperCase()}
            </span>
            <span
              className={cn(
                "font-medium tabular",
                isLeading ? "text-text font-semibold" : "text-text-secondary"
              )}
            >
              {display}
            </span>
            {isMe && (
              <span className="px-1.5 py-0.5 rounded-sm bg-primary-50 border border-primary-200 text-primary-700 text-caption font-semibold whitespace-nowrap">
                Bạn
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "amount",
      header: "Mức giá",
      align: "right",
      render: (row) => (
        <span
          className={cn(
            "tabular font-bold",
            row.status === BidStatus.LEADING ? "text-primary-700" : "text-text"
          )}
        >
          {formatMoney(row.amount)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Thời gian",
      render: (row) => (
        <span className="text-small text-text-tertiary tabular">
          {formatDateTime(row.createdAt, "DD/MM/YYYY HH:mm:ss")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "center",
      render: (row) => <StatusBadge statusType="bid" value={row.status} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={bids}
      keyExtractor={(row) => row.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      emptyText="Chưa có lượt đặt giá nào cho phiên đấu giá này."
      highlightRow={(row) => row.status === BidStatus.LEADING}
      className={className}
    />
  );
}

