"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { extractApiError } from "@/lib/errors";
import { formatNumber } from "@/lib/format";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { TabList, Tabs, TabTrigger } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  GavelIcon,
  HeartIcon,
  ListIcon,
  SpinnerIcon,
  XCircleIcon,
} from "@/components/icons";
import { AuctionStatus, type StatusTone } from "@/types/enums";
import {
  useRewatchInWatchlist,
  useUnwatchFromWatchlist,
  useWatchlist,
  useWatchlistRealtime,
  useWatchlistSummary,
} from "../hooks";
import type { WatchlistItem } from "../types";
import { WatchlistCard } from "./WatchlistCard";

const PAGE_SIZE = 9;

type WatchlistTabKey = "all" | "active" | "scheduled" | "ended";

const TAB_STATUS_PARAM: Record<WatchlistTabKey, string | undefined> = {
  all: undefined,
  active: AuctionStatus.ACTIVE,
  scheduled: AuctionStatus.SCHEDULED,
  ended: `${AuctionStatus.ENDED},${AuctionStatus.UNSOLD},${AuctionStatus.CANCELLED}`,
};

function parseTabParam(raw: string | null): WatchlistTabKey {
  if (raw === "active" || raw === "scheduled" || raw === "ended") return raw;
  return "all";
}

export function WatchlistClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  const tab = parseTabParam(searchParams.get("tab"));
  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 0 : pageParam - 1;

  const [pendingUnwatchId, setPendingUnwatchId] = useState<number | null>(null);
  const [flashingIds, setFlashingIds] = useState<Set<number>>(() => new Set());
  const flashTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  useEffect(() => {
    const timers = flashTimersRef.current;
    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  const triggerPriceFlash = useCallback((auctionId: number) => {
    setFlashingIds((prev) => {
      const next = new Set(prev);
      next.add(auctionId);
      return next;
    });

    const existing = flashTimersRef.current.get(auctionId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      setFlashingIds((prev) => {
        if (!prev.has(auctionId)) return prev;
        const next = new Set(prev);
        next.delete(auctionId);
        return next;
      });
      flashTimersRef.current.delete(auctionId);
    }, 650);

    flashTimersRef.current.set(auctionId, timer);
  }, []);

  const updateUrlParams = (updates: {
    tab?: WatchlistTabKey;
    pageZeroBased?: number;
  }) => {
    const nextTab = updates.tab !== undefined ? updates.tab : tab;
    const nextPage =
      updates.pageZeroBased !== undefined ? updates.pageZeroBased : page;

    const params = new URLSearchParams();
    if (nextTab !== "all") params.set("tab", nextTab);
    if (nextPage > 0) params.set("page", String(nextPage + 1));

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryIsError,
    error: summaryError,
    refetch: refetchSummary,
  } = useWatchlistSummary();

  const {
    data: watchlistPage,
    isLoading: listLoading,
    isFetching: listFetching,
    isError: listIsError,
    error: listError,
    refetch: refetchList,
  } = useWatchlist({
    status: TAB_STATUS_PARAM[tab],
    page,
    size: PAGE_SIZE,
  });

  const items = useMemo(
    () => watchlistPage?.content ?? [],
    [watchlistPage?.content]
  );
  const totalPages = watchlistPage?.totalPages ?? 0;
  const totalElements = watchlistPage?.totalElements ?? 0;

  // Khi xoá thẻ cuối cùng ở trang > 1, tự lùi về trang hợp lệ gần nhất
  useEffect(() => {
    if (
      !listLoading &&
      !listFetching &&
      page > 0 &&
      items.length === 0 &&
      totalPages > 0 &&
      page >= totalPages
    ) {
      const targetPage = Math.max(0, totalPages - 1);
      const params = new URLSearchParams();
      if (tab !== "all") params.set("tab", tab);
      if (targetPage > 0) params.set("page", String(targetPage + 1));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [listLoading, listFetching, page, items.length, totalPages, tab, pathname, router]);

  // Đăng ký WebSocket cho các phiên ACTIVE đang hiển thị trên trang
  const activeAuctionIds = useMemo(
    () =>
      items
        .filter((item) => item.status === AuctionStatus.ACTIVE)
        .map((item) => item.id),
    [items]
  );

  useWatchlistRealtime(activeAuctionIds, triggerPriceFlash);

  const unwatchMutation = useUnwatchFromWatchlist();
  const rewatchMutation = useRewatchInWatchlist();

  const handleUnwatch = (auction: WatchlistItem) => {
    setPendingUnwatchId(auction.id);
    unwatchMutation.mutate(auction.id, {
      onSuccess: () => {
        let toastId = "";
        toastId = toast.showToast({
          type: "info",
          message: (
            <div className="flex items-center justify-between gap-3">
              <span>
                Đã bỏ theo dõi{" "}
                <strong className="font-semibold text-text">
                  {auction.productTitle}
                </strong>
                .
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (toastId) toast.dismiss(toastId);
                  rewatchMutation.mutate(auction.id, {
                    onSuccess: () => {
                      toast.success("Đã khôi phục theo dõi phiên đấu giá.");
                    },
                    onError: (err) => {
                      toast.error(extractApiError(err).message);
                    },
                  });
                }}
                className="shrink-0 bg-surface"
              >
                Hoàn tác
              </Button>
            </div>
          ),
        });
      },
      onError: (err) => {
        toast.error(extractApiError(err).message);
      },
      onSettled: () => {
        setPendingUnwatchId(null);
      },
    });
  };

  // Xây dựng 5 thẻ KPI từ /watchlist/summary theo G18 & G23
  const visibleKpis = useMemo(() => {
    if (!summary) return [];
    const cards: Array<{
      key: string;
      label: string;
      value: string;
      tone: StatusTone;
      highlight?: boolean;
      icon: React.ReactNode;
    }> = [];

    if (summary.total != null) {
      cards.push({
        key: "total",
        label: "Tổng theo dõi",
        value: formatNumber(summary.total),
        tone: "neutral",
        icon: <ListIcon />,
      });
    }
    if (summary.active != null) {
      cards.push({
        key: "active",
        label: "Đang diễn ra",
        value: formatNumber(summary.active),
        tone: "info",
        icon: <GavelIcon />,
      });
    }
    if (summary.scheduled != null) {
      cards.push({
        key: "scheduled",
        label: "Sắp diễn ra",
        value: formatNumber(summary.scheduled),
        tone: "warning",
        icon: <ClockIcon />,
      });
    }
    if (summary.ended != null) {
      cards.push({
        key: "ended",
        label: "Đã kết thúc",
        value: formatNumber(summary.ended),
        tone: "success",
        icon: <CheckCircleIcon />,
      });
    }
    if (summary.cancelled != null) {
      cards.push({
        key: "cancelled",
        label: "Đã huỷ",
        value: formatNumber(summary.cancelled),
        tone: "danger",
        highlight: summary.cancelled > 0,
        icon: <XCircleIcon />,
      });
    }

    return cards;
  }, [summary]);

  const endedTabCount = useMemo(() => {
    if (!summary) return undefined;
    if (summary.ended == null && summary.cancelled == null) return undefined;
    return (summary.ended ?? 0) + (summary.cancelled ?? 0);
  }, [summary]);

  const summaryErrorMessage = summaryIsError
    ? extractApiError(summaryError).message
    : undefined;
  const listErrorMessage = listIsError
    ? extractApiError(listError).message
    : undefined;

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumb & Tiêu đề */}
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tài khoản của tôi" },
            { label: "Phiên đang theo dõi" },
          ]}
        />
        <div className="space-y-1">
          <h1 className="text-h1 text-text">Phiên đang theo dõi</h1>
          <p className="text-body text-text-secondary">
            Quản lý và cập nhật thời gian thực các phiên đấu giá bạn đang quan
            tâm.
          </p>
        </div>
      </div>

      {/* 2. Hàng 5 StatCard (G18 & G23) */}
      {summaryLoading ? (
        <div
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
          aria-label="Đang tải thống kê theo dõi"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-border-brand rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="size-10 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3.5 w-12" />
            </div>
          ))}
        </div>
      ) : summaryErrorMessage ? (
        <div
          role="alert"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-danger-bg border border-danger-border text-danger-strong"
        >
          <div className="flex items-center gap-2.5 text-small">
            <AlertCircleIcon className="size-5 shrink-0" />
            <span>{summaryErrorMessage}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchSummary()}
            className="self-start sm:self-auto shrink-0"
          >
            Thử lại
          </Button>
        </div>
      ) : (
        visibleKpis.length > 0 && (
          <section
            aria-label="Thống kê phiên đang theo dõi"
            className="grid grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {visibleKpis.map((kpi) => (
              <StatCard
                key={kpi.key}
                label={kpi.label}
                value={kpi.value}
                subText="phiên"
                tone={kpi.tone}
                highlight={kpi.highlight}
                icon={kpi.icon}
                className={
                  kpi.key === "total" && visibleKpis.length === 5
                    ? "col-span-2 lg:col-span-1"
                    : undefined
                }
              />
            ))}
          </section>
        )
      )}

      {/* 3. Thanh lọc: Tabs trạng thái (G23: ẩn tìm kiếm & sắp xếp) */}
      <div className="bg-surface border border-border-brand rounded-xl p-2 flex items-center justify-between gap-3">
        <div className="overflow-x-auto max-w-full">
          <Tabs
            value={tab}
            onValueChange={(nextVal) =>
              updateUrlParams({
                tab: parseTabParam(nextVal),
                pageZeroBased: 0,
              })
            }
            className="w-auto"
          >
            <TabList variant="segmented">
              <TabTrigger
                value="all"
                variant="segmented"
                badge={summary?.total}
              >
                Tất cả
              </TabTrigger>
              <TabTrigger
                value="active"
                variant="segmented"
                badge={summary?.active}
              >
                Đang diễn ra
              </TabTrigger>
              <TabTrigger
                value="scheduled"
                variant="segmented"
                badge={summary?.scheduled}
              >
                Sắp diễn ra
              </TabTrigger>
              <TabTrigger
                value="ended"
                variant="segmented"
                badge={endedTabCount}
              >
                Đã kết thúc
              </TabTrigger>
            </TabList>
          </Tabs>
        </div>

        {listFetching && !listLoading && (
          <span
            className="hidden sm:inline-flex items-center gap-1.5 pr-2 text-caption text-text-tertiary shrink-0"
            role="status"
            aria-live="polite"
          >
            <SpinnerIcon className="size-3.5 animate-spin" />
            <span>Đang cập nhật…</span>
          </span>
        )}
      </div>

      {/* 4. Lưới thẻ phiên: Error / Empty / Cards */}
      {listErrorMessage ? (
        <div
          role="alert"
          className="bg-surface border border-border-brand rounded-xl py-12 px-4 flex flex-col items-center justify-center text-center gap-3"
        >
          <div className="size-12 rounded-full bg-danger-bg text-danger flex items-center justify-center">
            <AlertCircleIcon className="size-6" />
          </div>
          <p className="text-body font-medium text-danger">{listErrorMessage}</p>
          <Button variant="outline" size="md" onClick={() => refetchList()}>
            Thử lại
          </Button>
        </div>
      ) : listLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Đang tải danh sách phiên theo dõi"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-border-brand rounded-xl overflow-hidden"
            >
              <Skeleton className="w-full aspect-4/3 rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-6 w-3/5" />
                <div className="flex items-end justify-between pt-1">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-7 w-32" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-surface border border-border-brand rounded-xl p-6">
          {tab !== "all" ? (
            <EmptyState
              icon={<HeartIcon />}
              title="Không có phiên nào trong mục này"
              description="Chưa có phiên đấu giá đang theo dõi nào ở trạng thái đã chọn."
              action={
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => updateUrlParams({ tab: "all", pageZeroBased: 0 })}
                >
                  Xem tất cả phiên đang theo dõi
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={<HeartIcon />}
              title="Danh sách theo dõi đang trống"
              description="Nhấn nút theo dõi ở các phiên đấu giá bạn quan tâm để cập nhật giá và thời gian kết thúc theo thời gian thực."
              action={
                <Link
                  href="/auctions"
                  className={getButtonClassName({
                    variant: "primary",
                    size: "lg",
                  })}
                >
                  Khám phá phiên đấu giá
                </Link>
              }
            />
          )}
        </div>
      ) : (
        <section aria-label="Danh sách phiên đang theo dõi">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((auction) => (
              <WatchlistCard
                key={auction.id}
                auction={auction}
                onUnwatch={handleUnwatch}
                unwatching={pendingUnwatchId === auction.id}
                priceFlash={flashingIds.has(auction.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Phân trang */}
      {!listLoading &&
        !listErrorMessage &&
        (totalPages > 1 || totalElements > 0) && (
          <div className="bg-surface border border-border-brand rounded-xl px-4 md:px-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={PAGE_SIZE}
              onPageChange={(nextPage) => {
                updateUrlParams({ pageZeroBased: nextPage });
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            />
          </div>
        )}
    </div>
  );
}

