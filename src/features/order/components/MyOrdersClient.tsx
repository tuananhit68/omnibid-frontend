"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import { formatDisplayCode, formatMoney } from "@/lib/format";
import { ORDER_STATUS_META, OrderStatus } from "@/types/enums";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TabList, Tabs, TabTrigger } from "@/components/ui/Tabs";
import { ShoppingBagIcon } from "@/components/icons";
import { useOrders } from "../hooks";
import type { OrderRole, OrderSummary } from "../types";
import { isOrderActionNeeded, OrderDeadlineCell } from "./OrderDeadlineCell";
import { OrderMobileCard } from "./OrderMobileCard";

const PAGE_SIZE = 10;

type StatusFilterValue = "ALL" | OrderStatus;

const VALID_STATUSES = new Set<string>(Object.values(OrderStatus));

const STATUS_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  {
    value: OrderStatus.PENDING_PAYMENT,
    label: ORDER_STATUS_META[OrderStatus.PENDING_PAYMENT].label,
  },
  {
    value: OrderStatus.PAID,
    label: ORDER_STATUS_META[OrderStatus.PAID].label,
  },
  {
    value: OrderStatus.SHIPPING,
    label: ORDER_STATUS_META[OrderStatus.SHIPPING].label,
  },
  {
    value: OrderStatus.COMPLETED,
    label: ORDER_STATUS_META[OrderStatus.COMPLETED].label,
  },
  {
    value: OrderStatus.CANCELLED,
    label: ORDER_STATUS_META[OrderStatus.CANCELLED].label,
  },
  {
    value: OrderStatus.EXPIRED,
    label: ORDER_STATUS_META[OrderStatus.EXPIRED].label,
  },
];

export function MyOrdersClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawRole = searchParams.get("role");
  const role: OrderRole = rawRole === "SELLER" ? "SELLER" : "BUYER";

  const rawStatus = searchParams.get("status");
  const statusFilter: StatusFilterValue =
    rawStatus && VALID_STATUSES.has(rawStatus)
      ? (rawStatus as OrderStatus)
      : "ALL";

  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 0 : pageParam - 1;

  const { data: result, isLoading, isFetching, isError, error, refetch } =
    useOrders({
      role,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      page,
      size: PAGE_SIZE,
      sort: "createdAt,desc",
    });

  const orders = useMemo(() => result?.data.content ?? [], [result?.data.content]);
  const totalPages = result?.data.totalPages ?? 0;
  const totalElements = result?.data.totalElements ?? 0;
  const serverOffsetMs = result?.serverOffsetMs ?? 0;

  const updateUrlParams = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleRoleChange = (nextRole: string) => {
    updateUrlParams((params) => {
      params.set("role", nextRole);
      params.delete("page");
    });
  };

  const handleStatusChange = (nextStatus: StatusFilterValue) => {
    updateUrlParams((params) => {
      if (nextStatus === "ALL") params.delete("status");
      else params.set("status", nextStatus);
      params.delete("page");
    });
  };

  const columns: Column<OrderSummary>[] = useMemo(
    () => [
      {
        key: "code",
        header: "Mã đơn",
        render: (row) => {
          const needsAction = isOrderActionNeeded(row, role);
          return (
            <div className="space-y-1">
              <Link
                href={`/orders/${row.id}`}
                className="font-semibold text-primary-600 hover:underline tabular"
              >
                {formatDisplayCode("ORD", row.id)}
              </Link>
              {needsAction && (
                <div>
                  <span className="inline-flex items-center rounded-full bg-warning-bg px-2 py-0.5 text-caption font-medium text-warning-strong">
                    Cần bạn xử lý
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: "product",
        header: "Sản phẩm",
        render: (row) => (
          <div className="flex items-center gap-3 min-w-0 max-w-xs">
            <div className="size-11 shrink-0 overflow-hidden rounded-lg border border-border-brand bg-surface-subtle">
              {row.primaryImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={row.primaryImageUrl}
                  alt={row.title}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              ) : null}
            </div>
            <Link
              href={`/orders/${row.id}`}
              className="text-small font-semibold text-text hover:text-primary-600 line-clamp-1 whitespace-normal"
            >
              {row.title}
            </Link>
          </div>
        ),
      },
      {
        key: "counterparty",
        header: role === "BUYER" ? "Người bán" : "Người mua",
        render: (row) => (
          <span className="text-small text-text">
            {role === "BUYER" ? row.seller.fullName : row.buyer.fullName}
          </span>
        ),
      },
      {
        key: "finalPrice",
        header: "Giá",
        align: "right",
        render: (row) => (
          <span className="font-bold text-primary-700 tabular">
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
        key: "deadline",
        header: "Hạn",
        render: (row) => (
          <OrderDeadlineCell order={row} serverOffsetMs={serverOffsetMs} />
        ),
      },
      {
        key: "actions",
        header: "Thao tác",
        align: "right",
        render: (row) => {
          const needsAction = isOrderActionNeeded(row, role);
          return (
            <Link
              href={`/orders/${row.id}`}
              className={getButtonClassName({
                variant: needsAction ? "primary" : "outline",
                size: "sm",
              })}
            >
              Xem
            </Link>
          );
        },
      },
    ],
    [role, serverOffsetMs]
  );

  const errorMessage = isError
    ? isApiError(error)
      ? error.message
      : "Không tải được danh sách đơn hàng."
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-h1 text-text">Đơn hàng của tôi</h1>
          <p className="text-small text-text-secondary">
            Quản lý các đơn hàng đã thắng đấu giá và các đơn cần gửi cho người mua.
          </p>
        </div>
        {isFetching && !isLoading && (
          <span className="text-caption text-text-tertiary" aria-live="polite">
            Đang cập nhật…
          </span>
        )}
      </div>

      <Tabs value={role} onValueChange={handleRoleChange}>
        <TabList>
          <TabTrigger value="BUYER">Đơn mua</TabTrigger>
          <TabTrigger value="SELLER">Đơn bán</TabTrigger>
        </TabList>
      </Tabs>

      <div className="overflow-x-auto pb-1">
        <SegmentedControl
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={handleStatusChange}
          ariaLabel="Lọc đơn hàng theo trạng thái"
        />
      </div>

      {errorMessage ? (
        <ErrorState message={errorMessage} onRetry={() => refetch()} />
      ) : !isLoading && orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBagIcon />}
          title={
            statusFilter !== "ALL"
              ? "Không có đơn hàng nào ở trạng thái này"
              : role === "BUYER"
                ? "Bạn chưa có đơn mua nào"
                : "Bạn chưa có đơn bán nào"
          }
          description={
            statusFilter !== "ALL"
              ? "Thử xóa bộ lọc trạng thái để xem toàn bộ đơn hàng của bạn."
              : role === "BUYER"
                ? "Khi bạn thắng một phiên đấu giá, đơn hàng sẽ tự động xuất hiện tại đây."
                : "Khi phiên đấu giá của bạn kết thúc có người thắng, đơn bán sẽ xuất hiện tại đây."
          }
          action={
            statusFilter !== "ALL" ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => handleStatusChange("ALL")}
              >
                Xem tất cả trạng thái
              </Button>
            ) : (
              <Link
                href={role === "BUYER" ? "/auctions" : "/me/auctions"}
                className={getButtonClassName({ variant: "primary", size: "md" })}
              >
                {role === "BUYER" ? "Khám phá phiên đấu giá" : "Xem phiên của tôi"}
              </Link>
            )
          }
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={orders}
              keyExtractor={(row) => row.id}
              loading={isLoading}
              rowClassName={(row) =>
                isOrderActionNeeded(row, role)
                  ? "bg-warning-subtle-bg hover:bg-warning-subtle-bg/90"
                  : undefined
              }
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
              orders.map((order) => (
                <OrderMobileCard
                  key={order.id}
                  order={order}
                  role={role}
                  serverOffsetMs={serverOffsetMs}
                />
              ))
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
