"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import type { Notification, Page } from "@/lib/api/contract";
import { ApiError } from "@/lib/api/types";
import { useSession } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import { useToast } from "@/components/ui/Toast";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
} from "./api";
import type { NotificationListParams } from "./types";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params: NotificationListParams) =>
    [...notificationKeys.lists(), params] as const,
  recent: () => [...notificationKeys.all, "recent"] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
};

/**
 * Số thông báo chưa đọc (chỉ USER):
 * - GET /notifications?isRead=false&size=1 -> totalElements
 * - Refetch khi focus cửa sổ, khi điều hướng, và mỗi 60 giây
 */
export function useUnreadNotificationCount() {
  const { isAuthenticated, isAdmin, ready } = useSession();
  const enabled = ready && isAuthenticated && !isAdmin;
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  const query = useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    enabled,
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  const { refetch } = query;

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      if (enabled) {
        void refetch();
      }
    }
  }, [pathname, enabled, refetch]);

  return {
    ...query,
    unreadCount: enabled ? (query.data ?? 0) : 0,
  };
}

/**
 * 5 thông báo mới nhất cho popover chuông header
 */
export function useRecentNotifications(open: boolean) {
  const { isAuthenticated, isAdmin, ready } = useSession();
  const enabled = ready && isAuthenticated && !isAdmin && open;

  return useQuery({
    queryKey: notificationKeys.recent(),
    queryFn: () =>
      getNotifications({ page: 0, size: 5, sort: "createdAt,desc" }),
    enabled,
    staleTime: 30_000,
  });
}

/**
 * Danh sách thông báo phân trang cho /me/notifications
 */
export function useNotifications(params: NotificationListParams) {
  const { isAuthenticated, isAdmin, ready } = useSession();
  const enabled = ready && isAuthenticated && !isAdmin;

  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

interface MarkReadContext {
  previousQueries: Array<[QueryKey, unknown]>;
}

function isNotificationPage(value: unknown): value is Page<Notification> {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as Page<Notification>).content) &&
    typeof (value as Page<Notification>).totalElements === "number"
  );
}

/**
 * Đánh dấu đã đọc 1 thông báo — Optimistic update + rollback khi lỗi
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { error: showErrorToast } = useToast();

  return useMutation<Notification, unknown, number, MarkReadContext>({
    mutationFn: markNotificationRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previousQueries = queryClient.getQueriesData<unknown>({
        queryKey: notificationKeys.all,
      });

      let wasUnread = false;

      for (const [key, data] of previousQueries) {
        if (!isNotificationPage(data)) continue;
        const target = data.content.find((item) => item.id === notificationId);
        if (!target) continue;
        if (!target.isRead) {
          wasUnread = true;
        }

        const listParams =
          Array.isArray(key) &&
          key[1] === "list" &&
          typeof key[2] === "object" &&
          key[2] !== null
            ? (key[2] as NotificationListParams)
            : null;

        if (listParams?.isRead === false) {
          const nextContent = data.content.filter(
            (item) => item.id !== notificationId
          );
          const nextTotal = Math.max(0, data.totalElements - (target.isRead ? 0 : 1));
          queryClient.setQueryData<Page<Notification>>(key, {
            ...data,
            content: nextContent,
            totalElements: nextTotal,
            totalPages: Math.ceil(nextTotal / data.size),
          });
        } else {
          queryClient.setQueryData<Page<Notification>>(key, {
            ...data,
            content: data.content.map((item) =>
              item.id === notificationId ? { ...item, isRead: true } : item
            ),
          });
        }
      }

      if (wasUnread) {
        queryClient.setQueryData<number>(
          notificationKeys.unreadCount(),
          (prev) => Math.max(0, (prev ?? 0) - 1)
        );
      }

      return { previousQueries };
    },
    onError: (err, _id, context) => {
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data);
        }
      }
      const message =
        err instanceof ApiError
          ? getErrorMessage(err.code, err.message)
          : getErrorMessage("INTERNAL_ERROR");
      showErrorToast(message, "Không thể đánh dấu đã đọc");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
