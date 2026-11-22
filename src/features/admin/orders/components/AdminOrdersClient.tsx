"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { OrderSummary } from "@/lib/api/contract";
import { isApiError } from "@/lib/api/types";
import {
  formatDateTime,
  formatDisplayCode,
  formatMoney,
  toBackendDateTimeString,
} from "@/lib/format";
import { ORDER_STATUS_META, OrderStatus } from "@/types/enums";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useDebouncedValue } from "../../shared/useDebouncedValue";
import { useAdminOrders } from "../hooks";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  ...(Object.values(OrderStatus) as OrderStatus[]).map((s) => ({
    value: s,
    label: ORDER_STATUS_META[s].label,
  })),
];

export function AdminOrdersClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlStatus = (searchParams.get("status") ?? "") as OrderStatus | "";
  const urlBuyerId = searchParams.get("buyerId") ?? "";
  const urlSellerId = searchParams.get("sellerId") ?? "";
  const urlFromDate = searchParams.get("fromDate") ?? "";
  const urlToDate = searchParams.get("toDate") ?? "";
  const urlPage = Math.max(0, Number(searchParams.get("page") ?? "0") || 0);

  const [buyerIdInput, setBuyerIdInput] = useState(urlBuyerId);
  const [sellerIdInput, setSellerIdInput] = useState(urlSellerId);
  const debouncedBuyerId = useDebouncedValue(buyerIdInput, 300);
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
    if (debouncedBuyerId !== urlBuyerId) {
      const cleaned = debouncedBuyerId.replace(/\D/g, "");
      updateUrl({ buyerId: cleaned || undefined, page: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedBuyerId]);

  useEffect(() => {
    if (debouncedSellerId !== urlSellerId) {
      const cleaned = debouncedSellerId.replace(/\D/g, "");
      updateUrl({ sellerId: cleaned || undefined, page: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSellerId]);

  const fromDateIso = urlFromDate
    ? toBackendDateTimeString(`${urlFromDate}T00:00:00`)
    : undefined;
  const toDateIso = urlToDate
    ? toBackendDateTimeString(`${urlToDate}T23:59:59`)
    : undefined;

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminOrders({
      status: urlStatus || undefined,
      buyerId: urlBuyerId ? Number(urlBuyerId) : undefined,
      sellerId: urlSellerId ? Number(urlSellerId) : undefined,
      fromDate: fromDateIso,
      toDate: toDateIso,
      page: urlPage,
      size: PAGE_SIZE,
      sort: "createdAt,desc",
    });

  const orders = useMemo(() => data?.content ?? [], [data?.content]);
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const hasFilters = Boolean(
    urlStatus || urlBuyerId || urlSellerId || urlFromDate || urlToDate
  );

  const columns: Column<OrderSummary>[] = useMemo(
    () => [
      {
        key: "id",
        header: "Mã đơn",
        render: (row) => (
          <Link
            href={`/admin/orders/${row.id}`}
            className="text-small font-semibold text-text-link hover:underline tabular"
          >
            {formatDisplayCode("ORD", row.id)}
          </Link>
        ),
      },
      {
        key: "title",
        header: "Sản phẩm",
        className: "max-w-xs",
        render: (row) => (
          <Link
            href={`/admin/orders/${row.id}`}
            className="block truncate font-medium text-text hover:text-primary-600"
          >
            {row.title}
          </Link>
        ),
      },
      {
        key: "buyer",
        header: "Người mua",
        render: (row) => (
          <span className="text-small text-text-secondary">
            {row.buyer.fullName}
          </span>
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
        key: "finalPrice",
        header: "Giá",
        align: "right",
        render: (row) => (
          <span className="font-semibold text-text tabular">
            {formatMoney(row.finalPrice)}
          </span>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        render: (row) => <StatusBadge statusType="order" value={row.status} />,
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        render: (row) => (
          <span className="text-small text-text-secondary tabular">
            {formatDateTime(row.createdAt)}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Thao tác",
        align: "right",
        render: (row) => (
          <Link
            href={`/admin/orders/${row.id}`}
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
      : "Không tải được danh sách đơn hàng."
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-text">Quản lý đơn hàng</h1>
        <p className="mt-1 text-small text-text-secondary">
          Tổng cộng {totalElements} đơn hàng
          {isFetching && !isLoading ? " · Đang cập nhật..." : ""}
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Select
              aria-label="Lọc theo trạng thái đơn"
              value={urlStatus}
              options={STATUS_OPTIONS}
              onChange={(e) => updateUrl({ status: e.target.value, page: 0 })}
            />
          </div>
          <div className="lg:col-span-2">
            <Input
              aria-label="Lọc theo mã người mua"
              placeholder="ID người mua"
              inputMode="numeric"
              value={buyerIdInput}
              onChange={(e) => setBuyerIdInput(e.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <Input
              aria-label="Lọc theo mã người bán"
              placeholder="ID người bán"
              inputMode="numeric"
              value={sellerIdInput}
              onChange={(e) => setSellerIdInput(e.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <Input
              type="date"
              aria-label="Từ ngày"
              value={urlFromDate}
              onChange={(e) => updateUrl({ fromDate: e.target.value, page: 0 })}
            />
          </div>
          <div className="lg:col-span-2">
            <Input
              type="date"
              aria-label="Đến ngày"
              value={urlToDate}
              onChange={(e) => updateUrl({ toDate: e.target.value, page: 0 })}
            />
          </div>
          <div className="lg:col-span-1 flex items-center justify-end">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setBuyerIdInput("");
                  setSellerIdInput("");
                  updateUrl({
                    status: undefined,
                    buyerId: undefined,
                    sellerId: undefined,
                    fromDate: undefined,
                    toDate: undefined,
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
        data={orders}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        error={errorMessage}
        onRetry={() => refetch()}
        emptyText={
          hasFilters
            ? "Không tìm thấy đơn hàng phù hợp với bộ lọc."
            : "Chưa có đơn hàng nào."
        }
        emptyAction={
          hasFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBuyerIdInput("");
                setSellerIdInput("");
                updateUrl({
                  status: undefined,
                  buyerId: undefined,
                  sellerId: undefined,
                  fromDate: undefined,
                  toDate: undefined,
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
