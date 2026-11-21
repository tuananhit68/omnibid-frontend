"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  DataTable,
  EmptyState,
  ErrorState,
  Input,
  Pagination,
  SegmentedControl,
  Skeleton,
  StatusBadge,
  type Column,
  type SegmentedOption,
} from "@/components/ui";
import { GavelIcon, PlusCircleIcon, SearchIcon } from "@/components/icons";
import { ApiError } from "@/lib/api/types";
import type { MyAuctionItem } from "@/lib/api/contract";
import { formatDateTime, formatDisplayCode, formatMoney } from "@/lib/format";
import { AUCTION_STATUS_META, AuctionStatus } from "@/types/enums";
import { useMyAuctions } from "../hooks";

type StatusFilter = "ALL" | AuctionStatus;

const STATUS_OPTIONS: SegmentedOption<StatusFilter>[] = [
  { value: "ALL", label: "Tất cả" },
  { value: AuctionStatus.SCHEDULED, label: AUCTION_STATUS_META[AuctionStatus.SCHEDULED].label },
  { value: AuctionStatus.ACTIVE, label: AUCTION_STATUS_META[AuctionStatus.ACTIVE].label },
  { value: AuctionStatus.ENDED, label: AUCTION_STATUS_META[AuctionStatus.ENDED].label },
  { value: AuctionStatus.UNSOLD, label: AUCTION_STATUS_META[AuctionStatus.UNSOLD].label },
  { value: AuctionStatus.CANCELLED, label: AUCTION_STATUS_META[AuctionStatus.CANCELLED].label },
];

function isValidAuctionStatus(val: string | null): val is AuctionStatus {
  if (!val) return false;
  return Object.values(AuctionStatus).includes(val as AuctionStatus);
}

export function MyAuctionsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status");
  const statusFilter: StatusFilter = isValidAuctionStatus(statusParam)
    ? statusParam
    : "ALL";
  const keywordParam = searchParams.get("keyword") ?? "";
  const pageParam = Math.max(0, Number(searchParams.get("page") ?? "0") || 0);

  const [searchInput, setSearchInput] = useState(keywordParam);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === keywordParam) return;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        next.set("keyword", trimmed);
      } else {
        next.delete("keyword");
      }
      next.delete("page");
      const query = next.toString();
      router.replace(query ? `/me/auctions?${query}` : "/me/auctions", {
        scroll: false,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, keywordParam, searchParams, router]);

  const { data, isLoading, isFetching, isError, error, refetch } = useMyAuctions({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    keyword: keywordParam || undefined,
    page: pageParam,
    size: 10,
    sort: "createdAt,desc",
  });

  const updateUrl = (updates: { status?: StatusFilter; page?: number }) => {
    const next = new URLSearchParams(searchParams.toString());
    if (updates.status !== undefined) {
      if (updates.status === "ALL") {
        next.delete("status");
      } else {
        next.set("status", updates.status);
      }
      next.delete("page");
    }
    if (updates.page !== undefined) {
      if (updates.page <= 0) {
        next.delete("page");
      } else {
        next.set("page", String(updates.page));
      }
    }
    const query = next.toString();
    router.replace(query ? `/me/auctions?${query}` : "/me/auctions", {
      scroll: false,
    });
  };

  const renderActions = (row: MyAuctionItem) => (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/me/auctions/${row.id}`}
        className="inline-flex h-8 items-center rounded-md bg-primary-600 px-2.5 text-caption font-medium text-text-inverse hover:bg-primary-700 transition-colors"
      >
        Quản lý
      </Link>
      {row.orderId !== null && (
        <Link
          href={`/orders/${row.orderId}`}
          className="inline-flex h-8 items-center rounded-md border border-border-brand bg-surface px-2.5 text-caption font-medium text-primary-600 hover:bg-primary-50 transition-colors"
        >
          Xem đơn
        </Link>
      )}
    </div>
  );

  const columns: Column<MyAuctionItem>[] = [
    {
      key: "product",
      header: "Sản phẩm",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-52">
          <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-subtle">
            {row.primaryImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.primaryImageUrl}
                alt={row.title}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-text-tertiary">
                <GavelIcon className="size-5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/me/auctions/${row.id}`}
              className="text-small font-semibold text-text hover:text-primary-600 line-clamp-2 transition-colors"
            >
              {row.title}
            </Link>
            <p className="text-caption text-text-tertiary tabular">
              {formatDisplayCode("AUC", row.id)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "currentPrice",
      header: "Giá hiện tại",
      align: "right",
      render: (row) => (
        <span className="text-small font-semibold text-primary-700 tabular whitespace-nowrap">
          {formatMoney(row.currentPrice)}
        </span>
      ),
    },
    {
      key: "reservePrice",
      header: "Giá sàn",
      align: "right",
      render: (row) => (
        <span className="text-small text-text-secondary tabular whitespace-nowrap">
          {row.reservePrice !== null ? formatMoney(row.reservePrice) : "Không đặt"}
        </span>
      ),
    },
    {
      key: "bidCount",
      header: "Lượt",
      align: "center",
      render: (row) => (
        <span className="text-small font-medium text-text tabular">
          {row.bidCount}
        </span>
      ),
    },
    {
      key: "startTime",
      header: "Bắt đầu",
      render: (row) => (
        <span className="text-caption text-text-secondary tabular whitespace-nowrap">
          {formatDateTime(row.startTime)}
        </span>
      ),
    },
    {
      key: "endTime",
      header: "Kết thúc",
      render: (row) => (
        <span className="text-caption text-text-secondary tabular whitespace-nowrap">
          {formatDateTime(row.endTime)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (row) => {
        const meta = AUCTION_STATUS_META[row.status];
        return (
          <StatusBadge
            label={meta.label}
            tone={meta.tone}
            withDot={meta.showDot}
          />
        );
      },
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (row) => renderActions(row),
    },
  ];

  const items = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const hasFilter = statusFilter !== "ALL" || Boolean(keywordParam);
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : "Không thể tải danh sách phiên đấu giá.";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 text-text">Phiên của tôi</h1>
          <p className="mt-1 text-small text-text-secondary">
            Theo dõi giá đặt, giá sàn và quản lý các phiên đấu giá bạn đã mở.
          </p>
        </div>
        <Link
          href="/me/products?status=AVAILABLE"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-small font-semibold text-text-inverse hover:bg-primary-700 transition-colors"
        >
          <PlusCircleIcon className="size-4.5" />
          <span>Tạo phiên mới</span>
        </Link>
      </div>

      {/* Bộ lọc trạng thái + tìm kiếm */}
      <div className="flex flex-col gap-3">
        <div className="overflow-x-auto">
          <SegmentedControl
            ariaLabel="Lọc theo trạng thái phiên đấu giá"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(next) => updateUrl({ status: next })}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo tên sản phẩm…"
              aria-label="Tìm theo tên sản phẩm"
              leftIcon={<SearchIcon className="size-4" />}
            />
          </div>
          {!isLoading && !isError && (
            <p className="text-caption text-text-tertiary tabular">
              {totalElements} phiên{isFetching ? " · Đang cập nhật…" : ""}
            </p>
          )}
        </div>
      </div>

      {isError ? (
        <ErrorState
          title="Không thể tải danh sách phiên của bạn"
          message={errorMessage}
          onRetry={() => refetch()}
        />
      ) : !isLoading && items.length === 0 ? (
        <EmptyState
          icon={<GavelIcon className="size-10" />}
          title={
            hasFilter
              ? "Không tìm thấy phiên phù hợp"
              : "Bạn chưa mở phiên đấu giá nào"
          }
          description={
            hasFilter
              ? "Thử đổi trạng thái lọc hoặc từ khóa tìm kiếm."
              : "Chọn một sản phẩm Sẵn sàng trong kho để mở phiên đấu giá đầu tiên."
          }
          action={
            hasFilter ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSearchInput("");
                  router.replace("/me/auctions", { scroll: false });
                }}
              >
                Xóa bộ lọc
              </Button>
            ) : (
              <Link
                href="/me/products?status=AVAILABLE"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary-600 px-5 text-small font-semibold text-text-inverse hover:bg-primary-700 transition-colors"
              >
                <PlusCircleIcon className="size-4.5" />
                <span>Chọn sản phẩm tạo phiên</span>
              </Link>
            )
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={items}
              keyExtractor={(row) => row.id}
              loading={isLoading}
            />
          </div>

          <div className="space-y-3 md:hidden">
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border-brand bg-surface p-4 space-y-3"
                  >
                    <div className="flex gap-3">
                      <Skeleton className="size-16 shrink-0 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3.5 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))
              : items.map((row) => {
                  const meta = AUCTION_STATUS_META[row.status];
                  return (
                    <article
                      key={row.id}
                      className="rounded-xl border border-border-brand bg-surface p-4 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-subtle">
                          {row.primaryImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={row.primaryImageUrl}
                              alt={row.title}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-text-tertiary">
                              <GavelIcon className="size-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/me/auctions/${row.id}`}
                              className="text-small font-semibold text-text line-clamp-2 hover:text-primary-600"
                            >
                              {row.title}
                            </Link>
                            <StatusBadge
                              label={meta.label}
                              tone={meta.tone}
                              withDot={meta.showDot}
                            />
                          </div>
                          <p className="text-caption text-text-tertiary tabular">
                            {formatDisplayCode("AUC", row.id)} · {row.bidCount} lượt
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-subtle p-3 text-caption">
                        <div>
                          <span className="text-text-tertiary">Giá hiện tại</span>
                          <p className="font-semibold text-primary-700 tabular">
                            {formatMoney(row.currentPrice)}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-tertiary">Giá sàn</span>
                          <p className="font-medium text-text tabular">
                            {row.reservePrice !== null
                              ? formatMoney(row.reservePrice)
                              : "Không đặt"}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-tertiary">Bắt đầu</span>
                          <p className="text-text-secondary tabular">
                            {formatDateTime(row.startTime)}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-tertiary">Kết thúc</span>
                          <p className="text-text-secondary tabular">
                            {formatDateTime(row.endTime)}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-border-subtle pt-3">
                        {renderActions(row)}
                      </div>
                    </article>
                  );
                })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination
                page={pageParam}
                totalPages={totalPages}
                onPageChange={(nextPage) => updateUrl({ page: nextPage })}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
