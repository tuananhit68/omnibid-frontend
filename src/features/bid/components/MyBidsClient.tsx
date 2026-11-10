"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { extractApiError } from "@/lib/errors";
import {
  formatDate,
  formatDateTime,
  formatMoney,
  formatNumber,
} from "@/lib/format";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { TabList, Tabs, TabTrigger } from "@/components/ui/Tabs";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  AwardIcon,
  GavelIcon,
  SearchIcon,
  SpinnerIcon,
  TrendingUpIcon,
} from "@/components/icons";
import { AuctionStatus, BID_STATUS_META, BidStatus } from "@/types/enums";
import { useMyBids, useMyBidsSummary } from "../hooks";
import type { MyBidItem } from "../types";
import { MyBidMobileCard } from "./MyBidMobileCard";
import {
  MyBidActionLink,
  MyBidCurrentPrice,
  MyBidProductSummary,
  MyBidStatusCell,
} from "./MyBidParts";

const PAGE_SIZE = 10;

type BidTabKey = "all" | "active" | "ended";

const TAB_AUCTION_STATUS: Record<BidTabKey, string | undefined> = {
  all: undefined,
  active: AuctionStatus.ACTIVE,
  ended: `${AuctionStatus.ENDED},${AuctionStatus.UNSOLD},${AuctionStatus.CANCELLED}`,
};

const BID_STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: BidStatus.LEADING, label: BID_STATUS_META[BidStatus.LEADING].label },
  { value: BidStatus.OUTBID, label: BID_STATUS_META[BidStatus.OUTBID].label },
  { value: BidStatus.WON, label: BID_STATUS_META[BidStatus.WON].label },
  { value: BidStatus.NOT_WON, label: BID_STATUS_META[BidStatus.NOT_WON].label },
  {
    value: BidStatus.INVALIDATED,
    label: BID_STATUS_META[BidStatus.INVALIDATED].label,
  },
];

function parseTabParam(raw: string | null): BidTabKey {
  if (raw === "active" || raw === "ended") return raw;
  return "all";
}

function parseStatusParam(raw: string | null): BidStatus | "" {
  if (
    raw === BidStatus.LEADING ||
    raw === BidStatus.OUTBID ||
    raw === BidStatus.WON ||
    raw === BidStatus.NOT_WON ||
    raw === BidStatus.INVALIDATED
  ) {
    return raw;
  }
  return "";
}

export function MyBidsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = parseTabParam(searchParams.get("tab"));
  const bidStatus = parseStatusParam(searchParams.get("status"));
  const urlQuery = searchParams.get("q") || "";
  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 0 : pageParam - 1;

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Đồng bộ ô tìm kiếm khi URL đổi từ bên ngoài (Back/Forward hoặc reset)
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setSearchInput(urlQuery);
  }

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const updateUrlParams = (updates: {
    tab?: BidTabKey;
    status?: BidStatus | "";
    q?: string;
    pageZeroBased?: number;
  }) => {
    const nextTab = updates.tab !== undefined ? updates.tab : tab;
    const nextStatus = updates.status !== undefined ? updates.status : bidStatus;
    const nextQ = updates.q !== undefined ? updates.q : urlQuery;
    const nextPage =
      updates.pageZeroBased !== undefined ? updates.pageZeroBased : page;

    const params = new URLSearchParams();
    if (nextTab !== "all") params.set("tab", nextTab);
    if (nextStatus) params.set("status", nextStatus);
    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextPage > 0) params.set("page", String(nextPage + 1));

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      updateUrlParams({ q: value.trim(), pageZeroBased: 0 });
    }, 300);
  };

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryIsError,
    error: summaryError,
    refetch: refetchSummary,
  } = useMyBidsSummary();

  const {
    data: bidsPage,
    isLoading: bidsLoading,
    isFetching: bidsFetching,
    isError: bidsIsError,
    error: bidsError,
    refetch: refetchBids,
  } = useMyBids({
    status: bidStatus || undefined,
    auctionStatus: TAB_AUCTION_STATUS[tab],
    q: urlQuery || undefined,
    page,
    size: PAGE_SIZE,
  });

  const bids = bidsPage?.content ?? [];
  const totalPages = bidsPage?.totalPages ?? 0;
  const totalElements = bidsPage?.totalElements ?? 0;
  const hasActiveFilter = tab !== "all" || Boolean(bidStatus) || Boolean(urlQuery);

  const handleResetFilters = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  const columns: Column<MyBidItem>[] = useMemo(
    () => [
      {
        key: "product",
        header: "Sản phẩm & phiên",
        className: "whitespace-normal min-w-72 max-w-md",
        render: (row) => <MyBidProductSummary row={row} />,
      },
      {
        key: "myHighestBid",
        header: "Mức giá của tôi",
        align: "right",
        render: (row) => (
          <span
            className={cn(
              "font-bold tabular",
              row.myStatus === BidStatus.INVALIDATED
                ? "line-through text-text-subtle"
                : "text-text"
            )}
          >
            {formatMoney(row.myHighestBid)}
          </span>
        ),
      },
      {
        key: "currentPrice",
        header: "Giá hiện tại",
        align: "right",
        render: (row) => <MyBidCurrentPrice row={row} />,
      },
      {
        key: "myLastBidAt",
        header: "Thời gian đặt",
        render: (row) => (
          <div className="flex flex-col">
            <span className="text-small text-text tabular">
              {formatDate(row.myLastBidAt)}
            </span>
            <span className="text-caption text-text-tertiary tabular">
              {formatDateTime(row.myLastBidAt, "HH:mm:ss")}
            </span>
          </div>
        ),
      },
      {
        key: "myStatus",
        header: "Trạng thái",
        align: "center",
        render: (row) => <MyBidStatusCell row={row} />,
      },
      {
        key: "actions",
        header: "Thao tác",
        align: "right",
        headerClassName: "sticky right-0 bg-surface-subtle z-10",
        className: "sticky right-0 bg-surface/95 backdrop-blur-xs",
        render: (row) => <MyBidActionLink row={row} touchSize="sm" />,
      },
    ],
    []
  );

  // Xây danh sách KPI theo G18: chỉ hiển thị thẻ khi backend trả về trường số tương ứng
  const visibleKpis = useMemo(() => {
    if (!summary) return [];
    const items: Array<{
      key: string;
      label: string;
      value: string;
      subText: string;
      tone: "neutral" | "success" | "warning" | "info";
      highlight?: boolean;
      icon: React.ReactNode;
    }> = [];

    if (summary.totalBids != null) {
      items.push({
        key: "totalBids",
        label: "Tổng lượt đặt",
        value: formatNumber(summary.totalBids),
        subText:
          summary.totalAuctions != null
            ? `lượt · ${formatNumber(summary.totalAuctions)} phiên`
            : "lượt",
        tone: "neutral",
        icon: <GavelIcon />,
      });
    }
    if (summary.leading != null) {
      items.push({
        key: "leading",
        label: "Đang dẫn đầu",
        value: formatNumber(summary.leading),
        subText: "phiên",
        tone: "success",
        icon: <TrendingUpIcon />,
      });
    }
    if (summary.outbid != null) {
      items.push({
        key: "outbid",
        label: "Bị vượt giá",
        value: formatNumber(summary.outbid),
        subText: "phiên",
        tone: "warning",
        highlight: summary.outbid > 0,
        icon: <AlertTriangleIcon />,
      });
    }
    if (summary.won != null) {
      items.push({
        key: "won",
        label: "Đã thắng",
        value: formatNumber(summary.won),
        subText: "phiên",
        tone: "info",
        icon: <AwardIcon />,
      });
    }

    return items;
  }, [summary]);

  const listErrorMessage = bidsIsError
    ? extractApiError(bidsError).message
    : undefined;
  const summaryErrorMessage = summaryIsError
    ? extractApiError(summaryError).message
    : undefined;

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumb & Tiêu đề */}
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tài khoản của tôi" },
            { label: "Lượt đặt giá của tôi" },
          ]}
        />
        <div className="space-y-1">
          <h1 className="text-h1 text-text">Lượt đặt giá của tôi</h1>
          <p className="text-body text-text-secondary">
            Theo dõi và quản lý lịch sử tất cả các lệnh đặt giá của bạn trong
            các phiên đấu giá trực tuyến.
          </p>
        </div>
      </div>

      {/* 2. Hàng 4 KPI (G18) */}
      {summaryLoading ? (
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          aria-label="Đang tải thống kê lượt đặt giá"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-border-brand rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="size-10 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3.5 w-20" />
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
            aria-label="Thống kê lượt đặt giá"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {visibleKpis.map((kpi) => (
              <StatCard
                key={kpi.key}
                label={kpi.label}
                value={kpi.value}
                subText={kpi.subText}
                tone={kpi.tone}
                highlight={kpi.highlight}
                icon={kpi.icon}
              />
            ))}
          </section>
        )
      )}

      {/* 3. Card Bảng & Bộ lọc */}
      <Card className="p-0 md:p-0 overflow-hidden">
        {/* Thanh công cụ: Tabs + Tìm kiếm + Lọc trạng thái (G22) */}
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto">
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
                  badge={summary?.totalAuctions}
                >
                  Tất cả
                </TabTrigger>
                <TabTrigger value="active" variant="segmented">
                  Đang diễn ra
                </TabTrigger>
                <TabTrigger value="ended" variant="segmented">
                  Đã kết thúc
                </TabTrigger>
              </TabList>
            </Tabs>

            {bidsFetching && !bidsLoading && (
              <span
                className="inline-flex items-center gap-1.5 text-caption text-text-tertiary shrink-0"
                role="status"
                aria-live="polite"
              >
                <SpinnerIcon className="size-3.5 animate-spin" />
                <span>Đang cập nhật…</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-72">
              <Input
                type="search"
                variant="filter"
                controlSize="md"
                leftIcon={<SearchIcon />}
                aria-label="Tìm kiếm tài sản hoặc mã phiên"
                placeholder="Tìm kiếm tài sản, mã phiên..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-48 shrink-0">
              <Select
                controlSize="md"
                aria-label="Lọc theo trạng thái lượt đặt"
                options={BID_STATUS_FILTER_OPTIONS}
                value={bidStatus}
                onChange={(e) =>
                  updateUrlParams({
                    status: parseStatusParam(e.target.value),
                    pageZeroBased: 0,
                  })
                }
                className="bg-bg border-border-strong"
              />
            </div>
          </div>
        </div>

        {/* Nội dung dữ liệu: Error / Empty / Bảng desktop + Thẻ mobile */}
        {listErrorMessage ? (
          <div
            role="alert"
            className="border-t border-border-brand py-12 px-4 flex flex-col items-center justify-center text-center gap-3"
          >
            <div className="size-12 rounded-full bg-danger-bg text-danger flex items-center justify-center">
              <AlertCircleIcon className="size-6" />
            </div>
            <p className="text-body font-medium text-danger">
              {listErrorMessage}
            </p>
            <Button variant="outline" size="md" onClick={() => refetchBids()}>
              Thử lại
            </Button>
          </div>
        ) : !bidsLoading && bids.length === 0 ? (
          <div className="border-t border-border-brand p-4 md:p-6">
            {hasActiveFilter ? (
              <EmptyState
                icon={<SearchIcon />}
                title="Không tìm thấy lượt đặt giá phù hợp"
                description="Không có phiên đấu giá nào khớp với từ khoá tìm kiếm hoặc bộ lọc hiện tại."
                action={
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleResetFilters}
                  >
                    Xóa bộ lọc
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={<GavelIcon />}
                title="Bạn chưa đặt giá phiên nào"
                description="Khám phá các phiên đấu giá đang diễn ra để bắt đầu đặt giá sản phẩm yêu thích."
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
          <>
            {/* Bảng Desktop / Tablet (>= 768px) */}
            <div className="hidden md:block">
              <DataTable
                columns={columns}
                data={bids}
                keyExtractor={(row) => row.auctionId}
                loading={bidsLoading}
                rowClassName={(row) => {
                  if (row.myStatus === BidStatus.OUTBID) {
                    return "bg-warning-subtle-bg/60";
                  }
                  if (row.myStatus === BidStatus.INVALIDATED) {
                    return "bg-danger-bg/40";
                  }
                  return undefined;
                }}
                className="rounded-none border-0 border-t border-border-brand"
              />
            </div>

            {/* Danh sách thẻ Mobile (< 768px) */}
            <div className="md:hidden border-t border-border-brand">
              {bidsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 border-b border-border-subtle last:border-b-0 space-y-3"
                    >
                      <div className="flex gap-3">
                        <Skeleton className="size-12 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3.5 w-32" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3.5 w-40" />
                        </div>
                      </div>
                      <Skeleton className="h-16 w-full rounded-lg" />
                      <Skeleton className="h-11 w-full rounded-md" />
                    </div>
                  ))
                : bids.map((row) => (
                    <MyBidMobileCard key={row.auctionId} row={row} />
                  ))}
            </div>
          </>
        )}

        {/* Phân trang */}
        {!bidsLoading && !listErrorMessage && (totalPages > 1 || totalElements > 0) && (
          <div className="border-t border-border-subtle px-4 md:px-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={PAGE_SIZE}
              onPageChange={(nextPage) =>
                updateUrlParams({ pageZeroBased: nextPage })
              }
            />
          </div>
        )}
      </Card>
    </div>
  );
}
