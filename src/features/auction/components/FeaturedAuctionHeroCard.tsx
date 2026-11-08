"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatMoney, formatDisplayCode, maskName } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import type { AuctionItem } from "../types";
import { getStoredUser } from "@/lib/api/auth-storage";

export interface FeaturedAuctionHeroCardProps {
  auction: AuctionItem;
  className?: string;
}

export function FeaturedAuctionHeroCard({
  auction,
  className,
}: FeaturedAuctionHeroCardProps) {
  const currentUser = typeof window !== "undefined" ? getStoredUser() : null;
  const isAuthenticated = Boolean(currentUser);

  return (
    <div
      className={cn(
        "w-full max-w-[492px] bg-surface border border-border-brand rounded-xl p-5 md:p-6 flex flex-col justify-between shadow-xs select-none",
        className
      )}
    >
      <div>
        {/* Header trên ảnh */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle">
          <StatusBadge statusType="auction" value={auction.status} />
          <span className="text-caption text-text-tertiary tabular">
            {auction.bidCount} lượt đặt giá
          </span>
        </div>

        {/* Khung ảnh & Đồng hồ đếm ngược */}
        <div className="relative mt-4 w-full h-[200px] sm:h-[224px] bg-surface-subtle rounded-lg overflow-hidden border border-border-subtle flex flex-col justify-between p-3">
          <div className="self-start">
            <span className="px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-xs text-caption font-semibold text-text tabular">
              {formatDisplayCode("AUC", auction.id)}
            </span>
          </div>

          {/* Đồng hồ đếm ngược gắn trong ảnh */}
          <div className="w-full">
            <CountdownTimer
              endTime={auction.endTime}
              className="p-2 sm:p-3 bg-surface/95 backdrop-blur-md border-border-subtle"
            />
          </div>
        </div>

        {/* Tên sản phẩm */}
        <div className="mt-4">
          <h3 className="text-h3 font-semibold text-text line-clamp-2 hover:text-primary-700 transition-colors">
            <Link href={`/auctions/${auction.id}`}>{auction.productName}</Link>
          </h3>
        </div>

        {/* Lưới số liệu giá (2x2) */}
        <div className="mt-4 p-4 bg-surface-subtle rounded-lg border border-border-brand/60 grid grid-cols-2 gap-3 text-small">
          <div>
            <span className="label block text-text-tertiary">Giá hiện tại</span>
            <span className="text-[20px] leading-[28px] font-bold text-primary-700 tabular block mt-0.5">
              {formatMoney(auction.currentPrice)}
            </span>
          </div>

          <div>
            <span className="label block text-text-tertiary">Bước giá</span>
            <span className="font-semibold text-text tabular block mt-1">
              +{formatMoney(auction.bidIncrement)}
            </span>
          </div>

          <div>
            <span className="label block text-text-tertiary">Người dẫn đầu</span>
            <span className="font-medium text-text tabular block mt-0.5">
              {auction.leadingBidderName
                ? maskName(auction.leadingBidderName)
                : "Chưa có"}
            </span>
          </div>

          <div>
            <span className="label block text-text-tertiary">Giá khởi điểm</span>
            <span className="font-medium text-text tabular block mt-0.5">
              {formatMoney(auction.startPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Hàng nút hành động */}
      <div className="mt-5 flex items-center gap-3">
        <Link href={`/auctions/${auction.id}`} className="flex-1">
          <Button
            variant="primary-strong"
            size="lg"
            className="w-full"
          >
            {isAuthenticated ? "Đặt giá ngay" : "Đăng nhập để đặt giá"}
          </Button>
        </Link>
        <Link href={`/auctions/${auction.id}`}>
          <Button variant="outline" size="lg">
            Xem chi tiết
          </Button>
        </Link>
      </div>
    </div>
  );
}

