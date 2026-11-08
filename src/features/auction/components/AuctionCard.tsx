"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatMoney, formatDisplayCode } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import type { AuctionItem } from "../types";

export interface AuctionCardProps {
  auction: AuctionItem;
  className?: string;
}

export function AuctionCard({ auction, className }: AuctionCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col justify-between bg-surface border border-border-brand rounded-xl overflow-hidden transition-all",
        "hover:border-primary-600/60 hover:shadow-xs select-none",
        className
      )}
    >
      <div>
        {/* Khung ảnh 4:3 */}
        <div className="relative w-full aspect-[4/3] bg-surface-subtle flex flex-col justify-between p-3 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <StatusBadge statusType="auction" value={auction.status} />
          </div>

          <div className="w-full">
            <CountdownTimer
              endTime={auction.endTime}
              className="p-1.5 sm:p-2 bg-surface/95 backdrop-blur-md border-border-subtle"
            />
          </div>
        </div>

        {/* Nội dung thông tin */}
        <div className="p-4 space-y-3">
          {/* Dòng meta */}
          <p className="text-caption text-text-tertiary">
            {auction.categoryName ? `${auction.categoryName} · ` : ""}
            <span className="tabular">{formatDisplayCode("AUC", auction.id)}</span>
          </p>

          {/* Tên sản phẩm */}
          <h4 className="text-h4 font-semibold text-text line-clamp-2 group-hover:text-primary-700 transition-colors">
            <Link href={`/auctions/${auction.id}`}>{auction.productName}</Link>
          </h4>

          {/* Hàng giá & lượt đặt */}
          <div className="pt-2 border-t border-border-subtle flex items-end justify-between">
            <div>
              <span className="label block text-text-tertiary">Giá hiện tại</span>
              <span className="text-price-lg font-bold text-primary-700 tabular block mt-0.5">
                {formatMoney(auction.currentPrice)}
              </span>
            </div>

            <span className="text-caption font-medium text-text-tertiary tabular pb-1">
              {auction.bidCount} lượt đặt
            </span>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="p-4 pt-0">
        <Link href={`/auctions/${auction.id}`}>
          <Button variant="primary" size="lg" className="w-full">
            Xem chi tiết &amp; Đặt giá
          </Button>
        </Link>
      </div>
    </div>
  );
}

