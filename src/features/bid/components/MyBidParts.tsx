"use client";

import Link from "next/link";
import { getButtonClassName } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDisplayCode, formatMoney } from "@/lib/format";
import { BidPosition, deriveBidPosition } from "@/types/enums";
import type { MyBidItem } from "../types";

export function MyBidProductSummary({ row }: { row: MyBidItem }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-surface-subtle border border-border-brand">
        {row.primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.primaryImageUrl}
            alt={row.title}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="text-caption text-text-tertiary tabular">
          {formatDisplayCode("AUC", row.auctionId)}
        </p>
        <Link
          href={`/auctions/${row.auctionId}`}
          className="text-small font-semibold text-text hover:text-primary-600 line-clamp-1"
        >
          {row.title}
        </Link>
      </div>
    </div>
  );
}

export function MyBidCurrentPrice({ row }: { row: MyBidItem }) {
  return (
    <span className="font-bold text-primary-700 tabular">
      {formatMoney(row.currentPrice)}
    </span>
  );
}

export function MyBidPositionCell({ row }: { row: MyBidItem }) {
  const position = deriveBidPosition(row);
  return <StatusBadge statusType="bidPosition" value={position} />;
}

export function MyBidActionLink({
  row,
  touchSize = "sm",
}: {
  row: MyBidItem;
  touchSize?: "sm" | "md";
}) {
  const position = deriveBidPosition(row);

  if (position === BidPosition.WON && row.orderId) {
    return (
      <Link
        href={`/orders/${row.orderId}`}
        className={getButtonClassName({ variant: "primary", size: touchSize })}
      >
        Thanh toán
      </Link>
    );
  }

  if (position === BidPosition.OUTBID) {
    return (
      <Link
        href={`/auctions/${row.auctionId}`}
        className={getButtonClassName({ variant: "primary", size: touchSize })}
      >
        Đặt lại giá
      </Link>
    );
  }

  return (
    <Link
      href={`/auctions/${row.auctionId}`}
      className={getButtonClassName({ variant: "outline", size: touchSize })}
    >
      Xem phiên
    </Link>
  );
}
