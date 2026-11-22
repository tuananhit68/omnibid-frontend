"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PaymentHistoryItem } from "@/lib/api/contract";
import { isApiError } from "@/lib/api/types";
import { formatDateTime, formatDisplayCode, formatMoney } from "@/lib/format";
import { OrderStatus, PAYMENT_METHOD_LABEL } from "@/types/enums";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { OrderProgress } from "@/components/ui/OrderProgress";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  CancelOrderDialog,
  type CancelOrderTarget,
} from "../../shared/AdminActionDialogs";
import { useAdminOrderDetail } from "../hooks";

export function AdminOrderDetailClient({ orderId }: { orderId: number }) {
  const { data: order, isLoading, isError, error, refetch } =
    useAdminOrderDetail(orderId);
  const [cancelTarget, setCancelTarget] = useState<CancelOrderTarget | null>(
    null
  );

  const paymentColumns: Column<PaymentHistoryItem>[] = useMemo(
    () => [
      {
        key: "attemptNo",
        header: "Lần",
        render: (row) => (
          <span className="font-semibold text-text tabular">#{row.attemptNo}</span>
        ),
      },
      {
        key: "method",
        header: "Phương thức",
        render: (row) => (
          <span className="text-small text-text-secondary">
            {PAYMENT_METHOD_LABEL[row.method]}
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
        key: "amount",
        header: "Số tiền",
        align: "right",
        render: (row) => (
          <span className="font-semibold text-text tabular">
            {formatMoney(row.amount)}
          </span>
        ),
      },
      {
        key: "status",
        header: "Kết quả",
        render: (row) => <StatusBadge statusType="payment" value={row.status} />,
      },
      {
        key: "failureReason",
        header: "Lý do thất bại",
        render: (row) => (
          <span className="text-small text-text-secondary">
            {row.failureReason ?? "—"}
          </span>
        ),
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !order) {
    const message = isApiError(error)
      ? error.message
      : "Không tải được thông tin chi tiết đơn hàng.";
    return (
      <div className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Quản trị", href: "/admin" },
            { label: "Đơn hàng", href: "/admin/orders" },
            { label: formatDisplayCode("ORD", orderId) },
          ]}
        />
        <ErrorState message={message} onRetry={() => refetch()} />
      </div>
    );
  }

  const canCancel = order.status === OrderStatus.PENDING_PAYMENT;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Quản trị", href: "/admin" },
          { label: "Đơn hàng", href: "/admin/orders" },
          { label: formatDisplayCode("ORD", order.id) },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-small font-semibold text-text-tertiary tabular">
              {formatDisplayCode("ORD", order.id)}
            </span>
            <StatusBadge statusType="order" value={order.status} />
          </div>
          <h1 className="text-h1 text-text">{order.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/admin/auctions/${order.auctionId}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border-brand bg-surface px-4 text-small font-medium text-text hover:bg-surface-subtle"
          >
            Xem phiên ({formatDisplayCode("AUC", order.auctionId)})
          </Link>
          <Link
            href={`/admin/products/${order.productId}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border-brand bg-surface px-4 text-small font-medium text-text hover:bg-surface-subtle"
          >
            Xem sản phẩm ({formatDisplayCode("PRD", order.productId)})
          </Link>
          {canCancel && (
            <Button
              variant="danger-soft"
              size="md"
              onClick={() =>
                setCancelTarget({ id: order.id, title: order.title })
              }
            >
              Hủy đơn
            </Button>
          )}
        </div>
      </div>

      <Card className="p-5">
        <OrderProgress
          status={order.status}
          createdAt={order.createdAt}
          paidAt={order.paidAt}
          shippedAt={order.shippedAt}
          completedAt={order.completedAt}
        />
      </Card>

      {order.status === OrderStatus.CANCELLED && order.cancelReason && (
        <div className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-small text-danger-strong">
          <span className="font-semibold">Lý do hủy đơn:</span>{" "}
          {order.cancelReason}
          {order.cancelledAt ? ` (${formatDateTime(order.cancelledAt)})` : ""}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Thông tin giao dịch & giao hàng */}
        <Card className="p-5 lg:col-span-7 space-y-5">
          <h2 className="text-h3 text-text">Thông tin đơn hàng & giao nhận</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-small">
            <div>
              <dt className="text-text-tertiary">Giá trị đơn hàng</dt>
              <dd className="mt-1 text-h3 font-bold text-primary-700 tabular">
                {formatMoney(order.finalPrice)}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Trạng thái sản phẩm</dt>
              <dd className="mt-1">
                <StatusBadge statusType="product" value={order.productStatus} />
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Hạn thanh toán</dt>
              <dd className="mt-1 text-text-secondary tabular">
                {formatDateTime(order.paymentDeadline)}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Hạn xác nhận nhận hàng</dt>
              <dd className="mt-1 text-text-secondary tabular">
                {order.confirmDeadline
                  ? formatDateTime(order.confirmDeadline)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Số điện thoại nhận hàng</dt>
              <dd className="mt-1 text-text tabular">
                {order.phoneNumber ?? "Chưa cập nhật"}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Mã vận đơn</dt>
              <dd className="mt-1 text-text tabular">
                {order.trackingCode ?? "—"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-text-tertiary">Địa chỉ giao hàng</dt>
              <dd className="mt-1 text-text">
                {order.shippingAddress ?? "Chưa cập nhật"}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Người mua & Người bán */}
        <Card className="p-5 lg:col-span-5 space-y-5">
          <h2 className="text-h3 text-text">Các bên giao dịch</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-caption font-medium text-text-tertiary">
                Người mua
              </span>
              <div className="flex items-center gap-3">
                <Avatar
                  src={order.buyer.avatarUrl}
                  name={order.buyer.fullName}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium text-text">
                      {order.buyer.fullName}
                    </span>
                    <span className="text-caption text-text-tertiary tabular">
                      {formatDisplayCode("USR", order.buyer.id)}
                    </span>
                    <StatusBadge statusType="user" value={order.buyer.status} />
                  </div>
                  <p className="truncate text-caption text-text-secondary">
                    {order.buyer.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-4 space-y-1.5">
              <span className="text-caption font-medium text-text-tertiary">
                Người bán
              </span>
              <div className="flex items-center gap-3">
                <Avatar
                  src={order.seller.avatarUrl}
                  name={order.seller.fullName}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium text-text">
                      {order.seller.fullName}
                    </span>
                    <span className="text-caption text-text-tertiary tabular">
                      {formatDisplayCode("USR", order.seller.id)}
                    </span>
                    <StatusBadge statusType="user" value={order.seller.status} />
                  </div>
                  <p className="truncate text-caption text-text-secondary">
                    {order.seller.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Lịch sử thanh toán */}
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-border-subtle px-5 py-4">
          <h2 className="text-h3 text-text">
            Lịch sử thanh toán ({order.payments.length})
          </h2>
        </div>
        <DataTable
          columns={paymentColumns}
          data={order.payments}
          keyExtractor={(row) => row.id}
          emptyText="Chưa có giao dịch thanh toán nào cho đơn hàng này."
          className="rounded-none border-0"
        />
      </Card>

      <CancelOrderDialog
        target={cancelTarget}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
}
