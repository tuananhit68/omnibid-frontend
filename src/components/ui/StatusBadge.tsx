import { cn } from "@/lib/cn";
import {
  type StatusTone,
  AUCTION_STATUS_META,
  BID_STATUS_META,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  SHIPMENT_STATUS_META,
  PRODUCT_STATUS_META,
  REPORT_STATUS_META,
  USER_STATUS_META,
  RESERVE_PRICE_STATUS_META,
  NOTIFICATION_TYPE_META,
  type AuctionStatus,
  type BidStatus,
  type OrderStatus,
  type PaymentStatus,
  type ShipmentStatus,
  type ProductStatus,
  type ReportStatus,
  type UserStatus,
  type ReservePriceStatus,
  type NotificationType,
} from "@/types/enums";

export type StatusType =
  | "auction"
  | "bid"
  | "order"
  | "payment"
  | "shipment"
  | "product"
  | "report"
  | "user"
  | "reservePrice"
  | "notification";

export interface StatusBadgeProps {
  statusType?: StatusType;
  value?: string;
  label?: string;
  tone?: StatusTone;
  withDot?: boolean;
  className?: string;
}

const toneStyles: Record<StatusTone, { badge: string; dot: string }> = {
  info: {
    badge: "bg-info-bg text-info border-info-border",
    dot: "bg-info",
  },
  success: {
    badge: "bg-success-bg text-success-strong border-success-border",
    dot: "bg-success-strong",
  },
  warning: {
    badge: "bg-warning-bg text-warning-strong border-warning-border",
    dot: "bg-warning-strong",
  },
  danger: {
    badge: "bg-danger-bg text-danger-strong border-danger-border",
    dot: "bg-danger-strong",
  },
  neutral: {
    badge: "bg-neutral-bg text-neutral border-border",
    dot: "bg-neutral",
  },
  tertiary: {
    badge: "bg-tertiary-100 text-tertiary-800 border-tertiary-200",
    dot: "bg-tertiary-800",
  },
};

function resolveStatusMeta(
  statusType?: StatusType,
  value?: string,
  explicitLabel?: string,
  explicitTone?: StatusTone
): { label: string; tone: StatusTone; isAuction: boolean } {
  if (explicitLabel && explicitTone) {
    return {
      label: explicitLabel,
      tone: explicitTone,
      isAuction: statusType === "auction",
    };
  }

  if (!statusType || !value) {
    return {
      label: explicitLabel || value || "--",
      tone: explicitTone || "neutral",
      isAuction: false,
    };
  }

  let meta: { label: string; tone: StatusTone } | undefined;
  let isAuction = false;

  switch (statusType) {
    case "auction":
      meta = AUCTION_STATUS_META[value as AuctionStatus];
      isAuction = true;
      break;
    case "bid":
      meta = BID_STATUS_META[value as BidStatus];
      break;
    case "order":
      meta = ORDER_STATUS_META[value as OrderStatus];
      break;
    case "payment":
      meta = PAYMENT_STATUS_META[value as PaymentStatus];
      break;
    case "shipment":
      meta = SHIPMENT_STATUS_META[value as ShipmentStatus];
      break;
    case "product":
      meta = PRODUCT_STATUS_META[value as ProductStatus];
      break;
    case "report":
      meta = REPORT_STATUS_META[value as ReportStatus];
      break;
    case "user":
      meta = USER_STATUS_META[value as UserStatus];
      break;
    case "reservePrice":
      meta = RESERVE_PRICE_STATUS_META[value as ReservePriceStatus];
      break;
    case "notification":
      meta = NOTIFICATION_TYPE_META[value as NotificationType];
      break;
  }

  return {
    label: explicitLabel || meta?.label || value,
    tone: explicitTone || meta?.tone || "neutral",
    isAuction,
  };
}

export function StatusBadge({
  statusType,
  value,
  label: explicitLabel,
  tone: explicitTone,
  withDot,
  className,
}: StatusBadgeProps) {
  const resolved = resolveStatusMeta(
    statusType,
    value,
    explicitLabel,
    explicitTone
  );
  const showDot = withDot !== undefined ? withDot : resolved.isAuction;
  const styles = toneStyles[resolved.tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-[26px] px-2.5 text-label font-medium rounded-full border whitespace-nowrap select-none",
        styles.badge,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("size-1.5 rounded-full shrink-0", styles.dot)}
          aria-hidden="true"
        />
      )}
      <span>{resolved.label}</span>
    </span>
  );
}
