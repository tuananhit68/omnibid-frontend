"use client";

import { cn } from "@/lib/cn";
import { NotificationType } from "@/types/enums";
import {
  AwardIcon,
  FlagIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  XCircleIcon,
} from "@/components/icons";

export interface NotificationTypeIconProps {
  type: NotificationType;
  size?: "sm" | "md";
  className?: string;
}

const TYPE_STYLE: Record<NotificationType, string> = {
  [NotificationType.OUTBID]: "bg-tertiary-50 text-tertiary-600",
  [NotificationType.AUCTION_RESULT]: "bg-info-bg text-info",
  [NotificationType.AUCTION_CANCELLED]: "bg-danger-bg text-danger",
  [NotificationType.ORDER_UPDATE]: "bg-primary-50 text-primary-600",
  [NotificationType.REPORT_RESOLVED]: "bg-neutral-bg text-neutral",
};

export function NotificationTypeIcon({
  type,
  size = "md",
  className,
}: NotificationTypeIconProps) {
  const iconClass = size === "sm" ? "size-4" : "size-5";

  const renderIcon = () => {
    switch (type) {
      case NotificationType.OUTBID:
        return <TrendingUpIcon className={iconClass} />;
      case NotificationType.AUCTION_RESULT:
        return <AwardIcon className={iconClass} />;
      case NotificationType.AUCTION_CANCELLED:
        return <XCircleIcon className={iconClass} />;
      case NotificationType.ORDER_UPDATE:
        return <ShoppingBagIcon className={iconClass} />;
      case NotificationType.REPORT_RESOLVED:
        return <FlagIcon className={iconClass} />;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg",
        size === "sm" ? "size-8" : "size-10",
        TYPE_STYLE[type],
        className
      )}
      aria-hidden="true"
    >
      {renderIcon()}
    </span>
  );
}
