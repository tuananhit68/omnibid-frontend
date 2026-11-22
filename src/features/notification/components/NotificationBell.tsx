"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ApiError } from "@/lib/api/types";
import { useSession } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDialogFocusTrap } from "@/components/ui/useDialogFocusTrap";
import { BellIcon } from "@/components/icons";
import {
  useMarkNotificationRead,
  useRecentNotifications,
  useUnreadNotificationCount,
} from "../hooks";
import { NotificationItem } from "./NotificationItem";

export interface NotificationBellProps {
  className?: string;
}

export function NotificationUnreadBadge({ className }: { className?: string }) {
  const { unreadCount } = useUnreadNotificationCount();
  if (unreadCount <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-danger px-1.5 py-0.5 text-caption font-semibold text-text-inverse tabular",
        className
      )}
    >
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  );
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { isAuthenticated, isAdmin, ready } = useSession();
  const pathname = usePathname();
  const popoverId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [openedPathname, setOpenedPathname] = useState<string | null>(null);
  const open = openedPathname === pathname;
  const closePopover = useCallback(() => setOpenedPathname(null), []);

  const isUser = ready && isAuthenticated && !isAdmin;
  const { unreadCount } = useUnreadNotificationCount();
  const recentQuery = useRecentNotifications(open);
  const markReadMutation = useMarkNotificationRead();

  useDialogFocusTrap(open, popoverRef, closePopover, { lockScroll: false });

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closePopover();
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [open, closePopover]);

  if (!isUser) return null;

  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);
  const items = recentQuery.data?.content ?? [];

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpenedPathname((prev) => (prev === pathname ? null : pathname))}
        aria-label={`Thông báo, ${unreadCount} chưa đọc`}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={popoverId}
        className={cn(
          "relative inline-flex size-11 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
          open
            ? "bg-primary-50 text-primary-600"
            : "text-text-secondary hover:bg-surface-subtle hover:text-text"
        )}
      >
        <BellIcon className="size-5" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 inline-flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-danger px-1 text-caption font-semibold leading-none text-text-inverse tabular"
          >
            {badgeLabel}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={popoverRef}
          id={popoverId}
          role="dialog"
          aria-label="Thông báo mới nhất"
          className="fixed inset-x-3 top-16 z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 rounded-xl border border-border-brand bg-surface shadow-md overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-h4 text-text">Thông báo</h2>
              {unreadCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-caption font-semibold text-primary-700 tabular">
                  {unreadCount} chưa đọc
                </span>
              )}
            </div>
            {recentQuery.isFetching && !recentQuery.isLoading && (
              <span className="text-caption text-text-tertiary">
                Đang cập nhật…
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-border-subtle">
            {recentQuery.isLoading ? (
              <div className="p-3.5 space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Skeleton className="size-8 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentQuery.isError ? (
              <div className="p-6 text-center space-y-3">
                <p className="text-small text-text-secondary">
                  {recentQuery.error instanceof ApiError
                    ? getErrorMessage(
                        recentQuery.error.code,
                        recentQuery.error.message
                      )
                    : getErrorMessage("INTERNAL_ERROR")}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void recentQuery.refetch()}
                >
                  Thử lại
                </Button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center space-y-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-surface-subtle text-text-tertiary">
                  <BellIcon className="size-5" />
                </div>
                <p className="text-small text-text-secondary">
                  Bạn chưa có thông báo nào
                </p>
              </div>
            ) : (
              items.map((item) => (
                <NotificationItem
                  key={item.id}
                  notification={item}
                  compact
                  onMarkRead={(id) => markReadMutation.mutate(id)}
                  markingId={
                    markReadMutation.isPending
                      ? (markReadMutation.variables ?? null)
                      : null
                  }
                  onNavigate={() => setOpenedPathname(null)}
                />
              ))
            )}
          </div>

          <div className="border-t border-border-subtle bg-surface-subtle/50 px-4 py-2.5 text-center">
            <Link
              href="/me/notifications"
              onClick={() => setOpenedPathname(null)}
              className="inline-flex items-center justify-center text-small font-semibold text-primary-600 hover:text-primary-700"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
