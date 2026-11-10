"use client";

import { useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import {
  calculateCountdown,
  formatDate,
  formatDisplayCode,
  formatMoney,
} from "@/lib/format";
import { getButtonClassName } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ArrowRightIcon,
  ClockIcon,
  EyeIcon,
  FileTextIcon,
  InfoIcon,
  PlusCircleIcon,
} from "@/components/icons";
import { AuctionStatus, BidStatus } from "@/types/enums";
import type { MyBidItem } from "../types";

const INVALIDATED_TOOLTIP_TEXT =
  "Lượt đặt này đã bị hệ thống vô hiệu và không được tính vào kết quả phiên.";

export function InvalidatedInfoTooltip() {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placeBelow: boolean;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const tooltipId = useId();

  const showTooltip = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const placeBelow = rect.top < 110;
      const rightEdge = Math.min(window.innerWidth - 12, rect.right);
      const left = Math.max(12, rightEdge - 256);
      setCoords({
        top: placeBelow ? rect.bottom + 8 : rect.top - 8,
        left,
        placeBelow,
      });
    }
    setOpen(true);
  };

  const hideTooltip = () => {
    setOpen(false);
  };

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label="Lý do lượt đặt bị vô hiệu"
        aria-describedby={open ? tooltipId : undefined}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            hideTooltip();
          }
        }}
        className="inline-flex items-center justify-center size-11 -my-2 rounded-full text-danger hover:bg-danger-bg focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 transition-colors"
      >
        <InfoIcon className="size-4" />
      </button>

      {open &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            id={tooltipId}
            role="tooltip"
            // Ngoại lệ style: toạ độ cố định theo getBoundingClientRect để tránh bị cắt bởi overflow-x-auto của bảng
            style={{
              top: coords.top,
              left: coords.left,
              transform: coords.placeBelow ? undefined : "translateY(-100%)",
            }}
            className="fixed w-64 p-3 rounded-lg bg-text text-text-inverse text-caption leading-snug shadow-md z-50 text-left pointer-events-none"
          >
            {INVALIDATED_TOOLTIP_TEXT}
          </span>,
          document.body
        )}
    </span>
  );
}

export function MyBidStatusCell({ row }: { row: MyBidItem }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <StatusBadge statusType="bid" value={row.myStatus} />
      {row.myStatus === BidStatus.INVALIDATED && <InvalidatedInfoTooltip />}
    </div>
  );
}

export function getBidAuctionTimeMeta(row: MyBidItem): {
  text: string;
  toneClass: string;
  showDot?: boolean;
} {
  if (row.myStatus === BidStatus.INVALIDATED) {
    return {
      text: "Lệnh đặt giá đã bị vô hiệu",
      toneClass: "text-danger",
    };
  }

  if (row.auctionStatus === AuctionStatus.ACTIVE) {
    const countdown = calculateCountdown(row.endTime);
    if (countdown.isZero) {
      return {
        text: "Đang chốt phiên…",
        toneClass: "text-warning-strong",
        showDot: true,
      };
    }
    if (countdown.totalSeconds >= 86400) {
      const days = Math.floor(countdown.totalSeconds / 86400);
      const remHours = Math.floor((countdown.totalSeconds % 86400) / 3600);
      return {
        text: `Còn ${days} ngày ${remHours} giờ`,
        toneClass: "text-success",
        showDot: true,
      };
    }
    if (countdown.totalSeconds >= 3600) {
      return {
        text: `Còn ${countdown.hours} giờ ${countdown.minutes} phút`,
        toneClass: "text-success",
        showDot: true,
      };
    }
    const mins = Math.max(1, Math.ceil(countdown.totalSeconds / 60));
    return {
      text: `Kết thúc sau ${mins} phút`,
      toneClass: countdown.isLessThanFiveMinutes
        ? "text-danger"
        : "text-warning-strong",
      showDot: true,
    };
  }

  return {
    text: `Đã kết thúc: ${formatDate(row.closedAt || row.endTime)}`,
    toneClass: "text-text-tertiary",
  };
}

export function MyBidThumbnail({
  src,
  title,
}: {
  src?: string | null;
  title: string;
}) {
  return (
    <div className="size-12 rounded-lg bg-surface-subtle border border-border-subtle overflow-hidden shrink-0 flex items-center justify-center">
      {src ? (
        <Image
          src={src}
          alt={title}
          width={48}
          height={48}
          className="size-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="text-body font-bold text-text-tertiary select-none"
        >
          {title.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export function MyBidProductSummary({ row }: { row: MyBidItem }) {
  const timeMeta = getBidAuctionTimeMeta(row);

  return (
    <div className="flex items-start gap-3">
      <Link
        href={`/auctions/${row.auctionId}`}
        tabIndex={-1}
        aria-hidden="true"
        className="shrink-0"
      >
        <MyBidThumbnail src={row.primaryImageUrl} title={row.productTitle} />
      </Link>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap text-caption">
          <span className="font-semibold text-primary-600 tabular">
            {formatDisplayCode("AUC", row.auctionId)}
          </span>
          {row.categoryName && (
            <>
              <span className="text-text-placeholder" aria-hidden="true">
                ·
              </span>
              <span className="text-text-tertiary truncate">
                {row.categoryName}
              </span>
            </>
          )}
        </div>

        <Link
          href={`/auctions/${row.auctionId}`}
          className="block text-body font-semibold text-text hover:text-primary-600 transition-colors line-clamp-2 focus-visible:outline-2 focus-visible:outline-focus rounded-sm"
        >
          {row.productTitle}
        </Link>

        <div className="flex items-center gap-1.5 flex-wrap text-caption">
          <span className="text-text-tertiary tabular">
            {row.myBidCount} lượt đặt
          </span>
          <span className="text-text-placeholder" aria-hidden="true">
            ·
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              timeMeta.toneClass
            )}
          >
            {timeMeta.showDot ? (
              <span
                className="size-1.5 rounded-full bg-current shrink-0"
                aria-hidden="true"
              />
            ) : (
              <ClockIcon className="size-3.5 shrink-0" />
            )}
            <span>{timeMeta.text}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function MyBidCurrentPrice({ row }: { row: MyBidItem }) {
  let priceColor = "text-text";
  let subLabel = "";
  let subColor = "text-text-tertiary";

  switch (row.myStatus) {
    case BidStatus.LEADING:
      priceColor = "text-success";
      subLabel = "Bạn đang cao nhất";
      subColor = "text-success";
      break;
    case BidStatus.OUTBID: {
      const diff = Math.max(0, row.currentPrice - row.myHighestBid);
      priceColor = "text-danger";
      subLabel = `Bị dẫn +${formatMoney(diff)}`;
      subColor = "text-danger";
      break;
    }
    case BidStatus.WON:
      priceColor = "text-primary-700";
      subLabel = "Giá trúng thầu";
      subColor = "text-text-tertiary";
      break;
    case BidStatus.NOT_WON:
      priceColor = "text-text";
      if (row.auctionStatus === AuctionStatus.UNSOLD) {
        subLabel = "Không đạt giá sàn";
      } else if (row.auctionStatus === AuctionStatus.CANCELLED) {
        subLabel = "Phiên đã huỷ";
      } else {
        subLabel = "Người khác trúng thầu";
      }
      subColor = "text-text-tertiary";
      break;
    case BidStatus.INVALIDATED:
      priceColor = "text-text";
      subLabel =
        row.auctionStatus === AuctionStatus.ACTIVE
          ? "Phiên tiếp tục"
          : "Phiên đã kết thúc";
      subColor = "text-text-tertiary";
      break;
  }

  return (
    <div className="flex flex-col items-end">
      <span className={cn("font-bold tabular", priceColor)}>
        {formatMoney(row.currentPrice)}
      </span>
      <span className={cn("text-caption font-medium", subColor)}>
        {subLabel}
      </span>
    </div>
  );
}

export function MyBidActionLink({
  row,
  fullWidth = false,
  touchSize = "sm",
}: {
  row: MyBidItem;
  fullWidth?: boolean;
  touchSize?: "sm" | "lg";
}) {
  if (
    row.myStatus === BidStatus.OUTBID &&
    row.auctionStatus === AuctionStatus.ACTIVE
  ) {
    return (
      <Link
        href={`/auctions/${row.auctionId}`}
        className={getButtonClassName({
          variant: "primary-strong",
          size: touchSize,
          className: fullWidth ? "w-full" : undefined,
        })}
      >
        <PlusCircleIcon className="size-4 shrink-0" />
        <span>Đặt giá lại</span>
      </Link>
    );
  }

  if (row.myStatus === BidStatus.WON && row.orderId) {
    return (
      <Link
        href={`/orders/${row.orderId}`}
        className={getButtonClassName({
          variant: "primary",
          size: touchSize,
          className: fullWidth ? "w-full" : undefined,
        })}
      >
        <FileTextIcon className="size-4 shrink-0" />
        <span>Xem đơn hàng</span>
      </Link>
    );
  }

  if (row.myStatus === BidStatus.INVALIDATED) {
    return (
      <Link
        href={`/auctions/${row.auctionId}`}
        className={getButtonClassName({
          variant: "tertiary",
          size: touchSize,
          className: fullWidth ? "w-full" : undefined,
        })}
      >
        <InfoIcon className="size-4 shrink-0" />
        <span>Xem chi tiết</span>
      </Link>
    );
  }

  if (row.myStatus === BidStatus.NOT_WON) {
    return (
      <Link
        href={`/auctions/${row.auctionId}`}
        className={getButtonClassName({
          variant: "outline",
          size: touchSize,
          className: fullWidth ? "w-full" : undefined,
        })}
      >
        <EyeIcon className="size-4 shrink-0" />
        <span>Xem phiên</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/auctions/${row.auctionId}`}
      className={getButtonClassName({
        variant: "outline",
        size: touchSize,
        className: fullWidth ? "w-full" : undefined,
      })}
    >
      <span>Xem phiên</span>
      <ArrowRightIcon className="size-4 shrink-0" />
    </Link>
  );
}
