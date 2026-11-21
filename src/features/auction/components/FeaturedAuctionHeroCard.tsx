// TODO fe-v4 home
"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getButtonClassName } from "@/components/ui/Button";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { AuctionSummary } from "../types";

export interface FeaturedAuctionHeroCardProps {
  auction: AuctionSummary;
}

export function FeaturedAuctionHeroCard({
  auction,
}: FeaturedAuctionHeroCardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 rounded-xl border border-border-brand bg-surface p-6 lg:grid-cols-12">
      <div className="lg:col-span-6 overflow-hidden rounded-lg bg-surface-subtle aspect-4/3">
        {auction.primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={auction.primaryImageUrl}
            alt={auction.title}
            className="size-full object-cover"
          />
        ) : null}
      </div>
      <div className="lg:col-span-6 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge statusType="auction" value={auction.status} />
            <StatusBadge statusType="reserve" value={auction.reserveStatus} />
          </div>
          <p className="text-small text-text-tertiary">{auction.categoryName}</p>
          <h2 className="text-h1 text-text">{auction.title}</h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-primary-50 p-4">
            <span className="label block">Giá hiện tại</span>
            <p className="text-price-xl text-primary-700 tabular">
              {formatMoney(auction.currentPrice)}
            </p>
            <p className="text-caption text-text-secondary tabular mt-1">
              {auction.bidCount} lượt đặt · Kết thúc {formatDateTime(auction.endTime)}
            </p>
          </div>

          <Link
            href={`/auctions/${auction.id}`}
            className={getButtonClassName({
              variant: "primary",
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            Xem chi tiết phiên
          </Link>
        </div>
      </div>
    </div>
  );
}
