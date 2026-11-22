"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import { formatDateTime, formatDisplayCode, formatMoney } from "@/lib/format";
import { AuctionStatus } from "@/types/enums";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CloseIcon, GavelIcon } from "@/components/icons";
import { useMyBids } from "../hooks";
import type { MyBidItem } from "../types";
import { MyBidMobileCard } from "./MyBidMobileCard";
import {
  MyBidActionLink,
  MyBidCurrentPrice,
  MyBidProductSummary,
  MyBidPositionCell,
} from "./MyBidParts";

const PAGE_SIZE = 20;

type QuickFilter = "ALL" | "ACTIVE" | "ENDED";

const QUICK_FILTER_OPTIONS: { value: QuickFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "ACTIVE", label: "Đang diễn ra" },
  { value: "ENDED", label: "Đã kết thúc" },
];

export function MyBidsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 0 : pageParam - 1;

  const rawAuctionId = searchParams.get("auctionId");
  const parsedAuctionId = rawAuctionId ? Number(rawAuctionId) : undefined;
  const auctionId =
    parsedAuctionId && Number.isInteger(parsedAuctionId) && parsedAuctionId > 0
      ? parsedAuctionId
      : undefined;

  const [quickFilter, setQuickFilter] = useState<QuickFilter>("ALL");

  const { data, isLoading, isFetching, isError, error, refetch } = useMyBids({
    auctionId,
    page,
    size: PAGE_SIZE,
    sort: "createdAt,desc",
  });

  const bids = useMemo(() => data?.content ?? [], [data?.content]);
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const filteredBids = useMemo(() => {
    if (quickFilter === "ALL") return bids;
    if (quickFilter === "ACTIVE") {
      return bids.filter((row) => row.auctionStatus === AuctionStatus.ACTIVE);
    }
    return bids.filter(
      (row) =>
        row.auctionStatus === AuctionStatus.ENDED ||
        row.auctionStatus === AuctionStatus.UNSOLD ||
        row.auctionStatus === AuctionStatus.CANCELLED
    );
  }, [bids, quickFilter]);

  const updateUrlParams = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const columns: Column<MyBidItem>[] = useMemo(
    () => [
      {
        key: "product",
        header: "Phiên",
        render: (row) => <MyBidProductSummary row={row} />,
      },
      {
        key: "amount",
        header: "Giá tôi đặt",
        align: "right",
        render: (row) => (
          <span className="font-semibold text-text tabular">
            {formatMoney(row.amount)}
          </span>
        ),
      },
      {
        key: "createdAt",
        header: "Thời điểm",
        render: (row) => (
          <span className="text-small text-text-secondary tabular">
            {formatDateTime(row.createdAt)}
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
        key: "auctionStatus",
        header: "Trạng thái phiên",
        render: (row) => (
          <StatusBadge statusType="auction" value={row.auctionStatus} />
        ),
      },
      {
        key: "position",
        header: "Vị thế",
        render: (row) => <MyBidPositionCell row={row} />,
      },
      {
        key: "actions",
        header: "Thao tác",
        align: "right",
        render: (row) => <MyBidActionLink row={row} />,
      },
    ],
    []
  );

  const errorMessage = isError
    ? isApiError(error)
      ? error.message
      : "Không tải được danh sách lượt đặt giá."
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-h1 text-text">Lượt đặt giá của tôi</h1>
          <p className="text-small text-text-secondary">
            Theo dõi các lượt đặt giá bạn đã tham gia và chuyển nhanh đến đơn hàng khi thắng phiên.
          </p>
        </div>
        {isFetching && !isLoading && (
          <span className="text-caption text-text-tertiary" aria-live="polite">
            Đang cập nhật…
          </span>
        )}
      </div>

      {/* Bộ lọc nhanh + chip lọc theo phiên */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            options={QUICK_FILTER_OPTIONS}
            value={quickFilter}
            onChange={setQuickFilter}
            ariaLabel="Lọc nhanh lượt đặt giá"
          />
          {auctionId && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-info-border bg-info-bg px-3 py-1 text-caption font-medium text-info">
              <span>Phiên {formatDisplayCode("AUC", auctionId)}</span>
              <button
                type="button"
                onClick={() =>
                  updateUrlParams((params) => {
                    params.delete("auctionId");
                    params.delete("page");
                  })
                }
                aria-label="Xóa lọc theo phiên"
                className="inline-flex size-4 items-center justify-center rounded-full hover:bg-surface-strong"
              >
                <CloseIcon className="size-3" />
              </button>
            </div>
          )}
        </div>
        <p className="text-caption text-text-tertiary">
          Lọc nhanh áp dụng trên trang hiện tại.
        </p>
      </div>

      {errorMessage ? (
        <ErrorState message={errorMessage} onRetry={() => refetch()} />
      ) : !isLoading && bids.length === 0 ? (
        <EmptyState
          icon={<GavelIcon />}
          title={
            auctionId
              ? `Bạn chưa đặt giá ở phiên ${formatDisplayCode("AUC", auctionId)}`
              : "Bạn chưa đặt giá phiên nào"
          }
          description={
            auctionId
              ? "Xóa bộ lọc phiên để xem lại toàn bộ lịch sử đặt giá của bạn."
              : "Khám phá các phiên đấu giá đang diễn ra để bắt đầu tham gia."
          }
          action={
            auctionId ? (
              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  updateUrlParams((params) => {
                    params.delete("auctionId");
                    params.delete("page");
                  })
                }
              >
                Xem tất cả lượt đặt
              </Button>
            ) : (
              <Link
                href="/auctions"
                className={getButtonClassName({ variant: "primary", size: "md" })}
              >
                Khám phá phiên đấu giá
              </Link>
            )
          }
        />
      ) : !isLoading && filteredBids.length === 0 ? (
        <EmptyState
          icon={<GavelIcon />}
          title="Không có lượt đặt giá phù hợp trên trang này"
          description="Thử chuyển sang bộ lọc Tất cả hoặc sang trang tiếp theo."
          action={
            <Button
              variant="outline"
              size="md"
              onClick={() => setQuickFilter("ALL")}
            >
              Xem tất cả trên trang này
            </Button>
          }
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredBids}
              keyExtractor={(row) => row.id}
              loading={isLoading}
              className="rounded-none border-0"
            />
          </div>
          <div className="md:hidden">
            {isLoading ? (
              <div className="divide-y divide-border-subtle">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-12 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                    <Skeleton className="h-14 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              filteredBids.map((row) => <MyBidMobileCard key={row.id} row={row} />)
            )}
          </div>
          {!isLoading && totalElements > 0 && (
            <div className="border-t border-border-subtle px-4 md:px-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={(nextPage) => {
                  setQuickFilter("ALL");
                  updateUrlParams((params) => {
                    if (nextPage > 0) params.set("page", String(nextPage + 1));
                    else params.delete("page");
                  });
                }}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
