"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  NOTIFICATION_TYPE_META,
  NotificationType,
} from "@/types/enums";
import { ApiError } from "@/lib/api/types";
import { getErrorMessage } from "@/lib/errors";
import { Card } from "@/components/ui/Card";
import { Tabs, TabList, TabTrigger } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { BellIcon } from "@/components/icons";
import {
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "../hooks";
import type { NotificationListParams, NotificationReadTab } from "../types";
import { NotificationItem } from "./NotificationItem";

const PAGE_SIZE = 20;

const NOTIFICATION_TYPE_OPTIONS: Array<{
  value: "" | NotificationType;
  label: string;
}> = [
  { value: "", label: "Tất cả loại thông báo" },
  {
    value: NotificationType.OUTBID,
    label: NOTIFICATION_TYPE_META[NotificationType.OUTBID].label,
  },
  {
    value: NotificationType.AUCTION_RESULT,
    label: NOTIFICATION_TYPE_META[NotificationType.AUCTION_RESULT].label,
  },
  {
    value: NotificationType.AUCTION_CANCELLED,
    label: NOTIFICATION_TYPE_META[NotificationType.AUCTION_CANCELLED].label,
  },
  {
    value: NotificationType.ORDER_UPDATE,
    label: NOTIFICATION_TYPE_META[NotificationType.ORDER_UPDATE].label,
  },
  {
    value: NotificationType.REPORT_RESOLVED,
    label: NOTIFICATION_TYPE_META[NotificationType.REPORT_RESOLVED].label,
  },
];

const VALID_TYPES = new Set<string>(Object.values(NotificationType));

export function NotificationsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab: NotificationReadTab =
    searchParams.get("isRead") === "false" ? "unread" : "all";
  const rawType = searchParams.get("type") ?? "";
  const selectedType: NotificationType | undefined = VALID_TYPES.has(rawType)
    ? (rawType as NotificationType)
    : undefined;
  const rawPage = Number(searchParams.get("page") ?? "0");
  const page = Number.isInteger(rawPage) && rawPage >= 0 ? rawPage : 0;

  const queryParams: NotificationListParams = useMemo(
    () => ({
      isRead: tab === "unread" ? false : undefined,
      type: selectedType,
      page,
      size: PAGE_SIZE,
      sort: "createdAt,desc",
    }),
    [tab, selectedType, page]
  );

  const listQuery = useNotifications(queryParams);
  const { unreadCount } = useUnreadNotificationCount();
  const markReadMutation = useMarkNotificationRead();

  const updateQuery = useCallback(
    (updates: {
      tab?: NotificationReadTab;
      type?: NotificationType | "";
      page?: number;
    }) => {
      const next = new URLSearchParams(searchParams.toString());

      if (updates.tab !== undefined) {
        if (updates.tab === "unread") {
          next.set("isRead", "false");
        } else {
          next.delete("isRead");
        }
        next.delete("page");
      }

      if (updates.type !== undefined) {
        if (updates.type) {
          next.set("type", updates.type);
        } else {
          next.delete("type");
        }
        next.delete("page");
      }

      if (updates.page !== undefined) {
        if (updates.page > 0) {
          next.set("page", String(updates.page));
        } else {
          next.delete("page");
        }
      }

      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const hasFilters = tab === "unread" || Boolean(selectedType);
  const items = listQuery.data?.content ?? [];
  const totalPages = listQuery.data?.totalPages ?? 0;
  const totalElements = listQuery.data?.totalElements ?? 0;

  const handleClearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-h1 text-text">Thông báo</h1>
        <p className="text-body text-text-secondary">
          Cập nhật lượt đặt giá, kết quả phiên đấu giá, đơn hàng và kết quả báo cáo của bạn.
        </p>
      </div>

      {/* Thanh tab + lọc loại */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-3">
        <Tabs
          value={tab}
          onValueChange={(val) =>
            updateQuery({ tab: val as NotificationReadTab })
          }
          className="w-auto"
        >
          <TabList variant="segmented">
            <TabTrigger value="all" variant="segmented">
              Tất cả
            </TabTrigger>
            <TabTrigger
              value="unread"
              variant="segmented"
              badge={unreadCount > 0 ? unreadCount : undefined}
            >
              Chưa đọc
            </TabTrigger>
          </TabList>
        </Tabs>

        <div className="flex items-center gap-3">
          {listQuery.isFetching && !listQuery.isLoading && (
            <span className="text-caption text-text-tertiary whitespace-nowrap">
              Đang cập nhật…
            </span>
          )}
          <div className="w-full sm:w-56">
            <Select
              aria-label="Lọc theo loại thông báo"
              value={selectedType ?? ""}
              onChange={(e) =>
                updateQuery({
                  type: e.target.value as NotificationType | "",
                })
              }
              options={NOTIFICATION_TYPE_OPTIONS}
            />
          </div>
        </div>
      </div>

      {/* Nội dung danh sách */}
      {listQuery.isLoading ? (
        <Card className="p-0 md:p-0 overflow-hidden">
          <div className="divide-y divide-border-subtle">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 sm:px-5">
                <Skeleton className="size-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3 max-w-md" />
                  <Skeleton className="h-4 w-full max-w-xl" />
                  <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : listQuery.isError ? (
        <ErrorState
          title="Không thể tải thông báo"
          message={
            listQuery.error instanceof ApiError
              ? getErrorMessage(listQuery.error.code, listQuery.error.message)
              : getErrorMessage("INTERNAL_ERROR")
          }
          onRetry={() => void listQuery.refetch()}
        />
      ) : items.length === 0 ? (
        <Card className="p-6 md:p-8">
          <EmptyState
            icon={<BellIcon className="size-7" />}
            title={
              hasFilters
                ? "Không có thông báo phù hợp bộ lọc"
                : "Bạn chưa có thông báo nào"
            }
            description={
              hasFilters
                ? "Thử chuyển sang mục Tất cả hoặc bỏ lọc loại thông báo để xem các thông báo khác."
                : "Khi có hoạt động đặt giá, kết quả phiên hoặc cập nhật đơn hàng, thông báo sẽ hiển thị tại đây."
            }
            action={
              hasFilters ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleClearFilters}
                >
                  Xóa bộ lọc
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => router.push("/auctions")}
                >
                  Khám phá phiên đấu giá
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <>
          <Card className="p-0 md:p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5 sm:px-5 text-caption text-text-tertiary">
              <span className="tabular">
                Hiển thị {items.length} / {totalElements} thông báo
              </span>
              <span>Sắp xếp: Mới nhất</span>
            </div>
            <div className="divide-y divide-border-subtle">
              {items.map((item) => (
                <NotificationItem
                  key={item.id}
                  notification={item}
                  onMarkRead={(id) => markReadMutation.mutate(id)}
                  markingId={
                    markReadMutation.isPending
                      ? (markReadMutation.variables ?? null)
                      : null
                  }
                />
              ))}
            </div>
          </Card>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={PAGE_SIZE}
              onPageChange={(nextPage) => updateQuery({ page: nextPage })}
            />
          )}
        </>
      )}
    </div>
  );
}
