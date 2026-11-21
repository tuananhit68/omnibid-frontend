"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AdminAuctionItem } from "@/lib/api/contract";
import { isApiError } from "@/lib/api/types";
import {
  formatDateTime,
  formatDisplayCode,
  formatMoney,
  formatNumber,
} from "@/lib/format";
import { AUCTION_STATUS_META, AuctionStatus } from "@/types/enums";
import { SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useDebouncedValue } from "../../shared/useDebouncedValue";
import { useAdminAuctions } from "../hooks";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  ...(Object.values(AuctionStatus) as AuctionStatus[]).map((s) => ({
    value: s,
    label: AUCTION_STATUS_META[s].label,
  })),
];

export function AdminAuctionsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("keyword") ?? "";
  const urlStatus = (searchParams.get("status") ?? "") as AuctionStatus | "";
  const urlSellerId = searchParams.get("sellerId") ?? "";
  const urlPage = Math.max(0, Number(searchParams.get("page") ?? "0") || 0);

  const [keywordInput, setKeywordInput] = useState(urlKeyword);
  const [sellerIdInput, setSellerIdInput] = useState(urlSellerId);
  const debouncedKeyword = useDebouncedValue(keywordInput, 300);
  const debouncedSellerId = useDebouncedValue(sellerIdInput, 300);

  const updateUrl = (updates: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === "" || (k === "page" && Number(v) === 0)) {
        next.delete(k);
      } else {
        next.set(k, String(v));
      }
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (debouncedKeyword !== urlKeyword) {
      updateUrl({ keyword: debouncedKeyword.trim() || undefined, page: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword]);

  useEffect(() => {
    if (debouncedSellerId !== urlSellerId) {
      const cleaned = debouncedSellerId.replace(/\D/g, "");
      updateUrl({ sellerId: cleaned || undefined, page: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSellerId]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminAuctions({
      keyword: urlKeyword || undefined,
      status: urlStatus || undefined,
      sellerId: urlSellerId ? Number(urlSellerId) : undefined,
      page: urlPage,
      size: PAGE_SIZE,
      sort: "createdAt,desc",
    });

  const auctions = useMemo(() => data?.content ?? [], [data?.content]);
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const hasFilters = Boolean(urlKeyword || urlStatus || urlSellerId);

  const columns: Column<AdminAuctionItem>[] = useMemo(
    () => [
      {
        key: "id",
        header: "Mã",
        render: (row) => (
          <Link
            href={`/admin/auctions/${row.id}`}
            className="text-small font-semibold text-text-link hover:underline tabular"
          >
            {formatDisplayCode("AUC", row.id)}
          </Link>
        ),
      },
      {
        key: "title",
        header: "Sản phẩm",
        className: "max-w-xs",
        render: (row) => (
          <Link
            href={`/admin/auctions/${row.id}`}
            className="block truncate font-medium text-text hover:text-primary-600"
          >
            {row.title}
          </Link>
        ),
      },
      {
        key: "seller",
        header: "Người bán",
        render: (row) => (
          <span className="text-small text-text-secondary">
            {row.seller.fullName}
          </span>
        ),
      },
      {
        key: "currentPrice",
        header: "Giá hiện tại",
        align: "right",
        render: (row) => (
          <span className="font-semibold text-text tabular">
            {formatMoney(row.currentPrice)}
          </span>
        ),
      },
      {
        key: "reservePrice",
        header: "Giá sàn",
        align: "right",
        render: (row) => (
          <span className="text-small text-text-secondary tabular">
            {row.reservePrice != null ? formatMoney(row.reservePrice) : "Không"}
          </span>
        ),
      },
      {
        key: "bidCount",
        header: "Lượt",
        align: "right",
        render: (row) => (
          <span className="text-small text-text tabular">
            {formatNumber(row.bidCount)}
          </span>
        ),
      },
      {
        key: "startTime",
        header: "Bắt đầu",
        render: (row) => (
          <span className="text-small text-text-secondary tabular">
            {formatDateTime(row.startTime)}
          </span>
        ),
      },
      {
        key: "endTime",
        header: "Kết thúc",
        render: (row) => (
          <span className="text-small text-text-secondary tabular">
            {formatDateTime(row.endTime)}
          </span>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        render: (row) => <StatusBadge statusType="auction" value={row.status} />,
      },
      {
        key: "actions",
        header: "Thao tác",
        align: "right",
        render: (row) => (
          <Link
            href={`/admin/auctions/${row.id}`}
            className="inline-flex h-8 items-center justify-center rounded-md border border-border-brand px-3 text-caption font-medium text-text hover:bg-surface-subtle"
          >
            Xem
          </Link>
        ),
      },
    ],
    []
  );

  const errorMessage = isError
    ? isApiError(error)
      ? error.message
      : "Không tải được danh sách phiên đấu giá."
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-text">Quản lý phiên đấu giá</h1>
        <p className="mt-1 text-small text-text-secondary">
          Tổng cộng {totalElements} phiên
          {isFetching && !isLoading ? " · Đang cập nhật..." : ""}
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <Input
              aria-label="Tìm theo tên sản phẩm, mã phiên hoặc người bán"
              placeholder="Tìm theo tên sản phẩm, mã phiên..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              leftIcon={<SearchIcon className="size-4" />}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              aria-label="Lọc theo trạng thái phiên"
              value={urlStatus}
              options={STATUS_OPTIONS}
              onChange={(e) => updateUrl({ status: e.target.value, page: 0 })}
            />
          </div>
          <div className="md:col-span-3">
            <Input
              aria-label="Lọc theo ID người bán"
              placeholder="Mã người bán (ví dụ: 2)"
              inputMode="numeric"
              value={sellerIdInput}
              onChange={(e) => setSellerIdInput(e.target.value)}
            />
          </div>
          <div className="md:col-span-1 flex items-center justify-end">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setKeywordInput("");
                  setSellerIdInput("");
                  updateUrl({
                    keyword: undefined,
                    status: undefined,
                    sellerId: undefined,
                    page: 0,
                  });
                }}
              >
                Đặt lại
              </Button>
            )}
          </div>
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={auctions}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        error={errorMessage}
        onRetry={() => refetch()}
        emptyText={
          hasFilters
            ? "Không tìm thấy phiên đấu giá phù hợp với bộ lọc."
            : "Chưa có phiên đấu giá nào."
        }
        emptyAction={
          hasFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setKeywordInput("");
                setSellerIdInput("");
                updateUrl({
                  keyword: undefined,
                  status: undefined,
                  sellerId: undefined,
                  page: 0,
                });
              }}
            >
              Xóa bộ lọc
            </Button>
          ) : undefined
        }
      />

      {totalPages > 1 && (
        <Pagination
          page={urlPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={PAGE_SIZE}
          onPageChange={(nextPage) => updateUrl({ page: nextPage })}
        />
      )}
    </div>
  );
}
