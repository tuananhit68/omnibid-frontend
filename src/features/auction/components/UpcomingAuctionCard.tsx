// TODO fe-v4 home
"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { AuctionSummary } from "../types";

export interface UpcomingAuctionCardProps {
  auction: AuctionSummary;
}

export function UpcomingAuctionCard({ auction }: UpcomingAuctionCardProps) {
  return (
    <Link
      href={`/auctions/${auction.id}`}
      className="flex flex-col overflow-hidden rounded-xl border border-border-brand bg-surface transition-colors hover:border-primary-400"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-subtle">
        {auction.primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={auction.primaryImageUrl}
            alt={auction.title}
            className="size-full object-cover"
          />
        ) : null}
        <div className="absolute left-3 top-3">
          <StatusBadge statusType="auction" value={auction.status} />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <p className="text-caption text-text-tertiary">{auction.categoryName}</p>
        <h3 className="text-h4 text-text line-clamp-2">{auction.title}</h3>
        <div className="flex items-baseline justify-between pt-2 border-t border-border-subtle">
          <span className="label">Giá khởi điểm</span>
          <span className="text-price-lg text-primary-700 tabular">
            {formatMoney(auction.startPrice)}
          </span>
        </div>
        <p className="text-caption text-text-secondary tabular">
          Bắt đầu: {formatDateTime(auction.startTime)}
        </p>
      </div>
    </Link>
  );
}
