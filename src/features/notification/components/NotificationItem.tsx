"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/lib/api/contract";
import { cn } from "@/lib/cn";
import {
  formatDateTime,
  formatDisplayCode,
  formatRelativeTime,
} from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { NotificationTypeIcon } from "./NotificationTypeIcon";

export interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: number) => void;
  markingId?: number | null;
  compact?: boolean;
  onNavigate?: () => void;
}

export function getNotificationTargetHref(
  notification: Notification
): string | null {
  if (!notification.refId) return null;
  if (notification.refType === "AUCTION") {
    return `/auctions/${notification.refId}`;
  }
  if (notification.refType === "ORDER") {
    return `/orders/${notification.refId}`;
  }
  return null;
}

export function NotificationItem({
  notification,
  onMarkRead,
  markingId,
  compact = false,
  onNavigate,
}: NotificationItemProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const isUnread = !notification.isRead;
  const isReport = notification.refType === "REPORT";
  const targetHref = getNotificationTargetHref(notification);
  const isMarking = markingId === notification.id;

  const handleOpen = () => {
    if (isUnread) {
      onMarkRead(notification.id);
    }
    if (targetHref) {
      onNavigate?.();
      router.push(targetHref);
      return;
    }
    if (isReport) {
      setExpanded((prev) => !prev);
    }
  };

  return (
    <article
      className={cn(
        "group relative flex items-start gap-3 transition-colors",
        compact ? "px-3.5 py-3" : "px-4 py-4 sm:px-5",
        isUnread
          ? "bg-primary-50/40 hover:bg-primary-50/70"
          : "bg-surface hover:bg-surface-subtle"
      )}
    >
      <button
        type="button"
        onClick={handleOpen}
        aria-expanded={isReport ? expanded : undefined}
        className="flex min-w-0 flex-1 items-start gap-3 text-left focus-visible:outline-2 focus-visible:outline-focus rounded-md"
      >
        <NotificationTypeIcon
          type={notification.type}
          size={compact ? "sm" : "md"}
          className="mt-0.5"
        />

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {isUnread && (
                <span
                  className="size-2 shrink-0 rounded-full bg-primary-600"
                  aria-label="Chưa đọc"
                />
              )}
              <p
                className={cn(
                  "text-small text-text leading-snug",
                  isUnread ? "font-semibold" : "font-medium",
                  compact && !expanded ? "line-clamp-1" : ""
                )}
              >
                {notification.title}
              </p>
            </div>
            {isReport && (
              <ChevronDownIcon
                className={cn(
                  "size-4 shrink-0 text-text-tertiary transition-transform mt-0.5",
                  expanded && "rotate-180"
                )}
              />
            )}
          </div>

          <p
            className={cn(
              "text-small text-text-secondary break-words",
              compact && !expanded
                ? "line-clamp-2 text-caption"
                : !expanded && isReport
                  ? "line-clamp-2"
                  : ""
            )}
          >
            {notification.content}
          </p>

          {isReport && expanded && (
            <div className="mt-2 rounded-lg border border-border-brand bg-surface-subtle p-3 text-caption text-text-secondary space-y-1">
              {notification.refId && (
                <p className="font-medium text-text">
                  Mã báo cáo: {formatDisplayCode("REP", notification.refId)}
                </p>
              )}
              <p>{notification.content}</p>
              <p className="text-text-tertiary">
                Báo cáo đã được quản trị viên xử lý. Người dùng không có trang quản lý báo cáo riêng.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {!compact && (
              <StatusBadge
                statusType="notification"
                value={notification.type}
                className="text-caption"
              />
            )}
            <time
              dateTime={notification.createdAt}
              title={formatDateTime(notification.createdAt)}
              className="text-caption text-text-tertiary tabular"
            >
              {formatRelativeTime(notification.createdAt)}
            </time>
            {isReport && !expanded && (
              <span className="text-caption font-medium text-primary-600">
                Xem chi tiết
              </span>
            )}
          </div>
        </div>
      </button>

      {isUnread && !compact && (
        <div className="shrink-0 self-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            loading={isMarking}
            onClick={() => onMarkRead(notification.id)}
            aria-label={`Đánh dấu đã đọc: ${notification.title}`}
            className="text-primary-600 hover:bg-primary-50"
          >
            <CheckIcon className="size-4" />
            <span className="hidden sm:inline">Đánh dấu đã đọc</span>
          </Button>
        </div>
      )}
    </article>
  );
}
