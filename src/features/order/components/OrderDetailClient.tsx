"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api/types";
import { useSession } from "@/lib/auth/session";
import {
  calculateCountdown,
  formatDateTime,
  formatDisplayCode,
  formatMoney,
} from "@/lib/format";
import { OrderStatus, UserRole } from "@/types/enums";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useSharedNowMs } from "@/components/ui/CountdownTimer";
import { ErrorState } from "@/components/ui/ErrorState";
import { OrderProgress } from "@/components/ui/OrderProgress";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  FlagIcon,
  InfoIcon,
  TruckIcon,
} from "@/components/icons";
import { ReportModal } from "@/features/report/components";
import { useConfirmReceipt, useOrderDetail } from "../hooks";
import { OrderBuyerPendingCard } from "./OrderBuyerPendingCard";
import { OrderSellerPaidCard } from "./OrderSellerPaidCard";
import { PaymentHistorySection } from "./PaymentHistorySection";

export function OrderDetailClient({ orderId }: { orderId: number }) {
  const toast = useToast();
  const { user } = useSession();
  const nowMs = useSharedNowMs();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const {
    data: result,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useOrderDetail(orderId);

  const confirmMutation = useConfirmReceipt(orderId);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return (
      <Card className="p-8 text-center space-y-4">
        <h1 className="text-h2 text-text">Mã đơn hàng không hợp lệ</h1>
        <p className="text-body text-text-secondary">
          Không tìm thấy đơn hàng với đường dẫn này.
        </p>
        <div>
          <Link
            href="/me/orders"
            className={getButtonClassName({ variant: "primary", size: "md" })}
          >
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !result) {
    if (error instanceof ApiError && error.status === 403) {
      const isAdmin = user?.role === UserRole.ADMIN;
      return (
        <Card className="p-8 md:p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-danger-bg text-danger">
            <AlertCircleIcon className="size-8" />
          </div>
          <h1 className="text-h2 text-text">Bạn không có quyền xem đơn hàng này</h1>
          <p className="text-body text-text-secondary">
            Chỉ người mua và người bán của đơn hàng mới được truy cập trang này.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isAdmin ? (
              <Link
                href={`/admin/orders/${orderId}`}
                className={getButtonClassName({ variant: "primary", size: "md" })}
              >
                Xem trên trang quản trị
              </Link>
            ) : (
              <Link
                href="/me/orders"
                className={getButtonClassName({ variant: "primary", size: "md" })}
              >
                Về danh sách đơn hàng
              </Link>
            )}
          </div>
        </Card>
      );
    }

    if (error instanceof ApiError && error.status === 404) {
      return (
        <Card className="p-8 md:p-12 text-center space-y-4 max-w-lg mx-auto">
          <h1 className="text-h2 text-text">Không tìm thấy đơn hàng</h1>
          <p className="text-body text-text-secondary">
            Đơn hàng {formatDisplayCode("ORD", orderId)} không tồn tại hoặc đã bị gỡ.
          </p>
          <div>
            <Link
              href="/me/orders"
              className={getButtonClassName({ variant: "primary", size: "md" })}
            >
              Về danh sách đơn hàng
            </Link>
          </div>
        </Card>
      );
    }

    const message =
      error instanceof ApiError
        ? error.message
        : "Không thể tải thông tin đơn hàng.";
    return <ErrorState message={message} onRetry={() => refetch()} />;
  }

  const { data: order, serverOffsetMs } = result;
  const isBuyer = order.viewerRole === "BUYER";
  const counterparty = isBuyer ? order.seller : order.buyer;
  const counterpartyLabel = isBuyer ? "Người bán" : "Người mua";

  const confirmCountdown =
    order.status === OrderStatus.SHIPPING && order.confirmDeadline && nowMs > 0
      ? calculateCountdown(order.confirmDeadline, serverOffsetMs, nowMs)
      : null;

  const handleConfirmReceipt = () => {
    setConfirmError(null);
    confirmMutation.mutate(undefined, {
      onSuccess: () => {
        setConfirmOpen(false);
        toast.success("Đã xác nhận nhận hàng. Đơn hàng đã hoàn tất!");
      },
      onError: (err) => {
        setConfirmOpen(false);
        if (err instanceof ApiError) {
          setConfirmError(err.message);
          if (err.code === "INVALID_STATUS_TRANSITION") {
            refetch();
          }
          return;
        }
        setConfirmError("Không thể xác nhận nhận hàng. Vui lòng thử lại.");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={isBuyer ? "/me/orders?role=BUYER" : "/me/orders?role=SELLER"}
          className="inline-flex items-center gap-1.5 text-small font-medium text-text-secondary hover:text-primary-600"
        >
          <ChevronLeftIcon className="size-4" />
          <span>Quay lại đơn hàng của tôi</span>
        </Link>
        {isFetching && (
          <span className="text-caption text-text-tertiary" aria-live="polite">
            Đang cập nhật…
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột chính (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Tóm tắt đơn */}
          <Card className="p-5 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="size-24 sm:size-28 shrink-0 overflow-hidden rounded-xl border border-border-brand bg-surface-subtle">
                {order.primaryImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={order.primaryImageUrl}
                    alt={order.title}
                    className="size-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-caption text-text-tertiary tabular">
                    <span className="font-semibold text-text">
                      {formatDisplayCode("ORD", order.id)}
                    </span>
                    <span>·</span>
                    <Link
                      href={`/auctions/${order.auctionId}`}
                      className="text-primary-600 hover:underline font-medium"
                    >
                      Phiên {formatDisplayCode("AUC", order.auctionId)}
                    </Link>
                  </div>
                  <StatusBadge statusType="order" value={order.status} />
                </div>

                <h1 className="text-h2 text-text">{order.title}</h1>

                <div className="flex flex-wrap items-baseline justify-between gap-3 pt-1">
                  <div>
                    <span className="label block">Giá thắng</span>
                    <span className="text-price-lg text-primary-700 tabular">
                      {formatMoney(order.finalPrice)}
                    </span>
                  </div>
                  <div className="text-small text-text-secondary">
                    {counterpartyLabel}:{" "}
                    <strong className="text-text">{counterparty.fullName}</strong>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Tiến trình đơn hàng */}
          <OrderProgress
            status={order.status}
            createdAt={order.createdAt}
            paidAt={order.paidAt}
            shippedAt={order.shippedAt}
            completedAt={order.completedAt}
            cancelledAt={order.cancelledAt}
            cancelReason={order.cancelReason}
          />

          {/* 3. Khối hành động theo viewerRole × status */}
          {isBuyer && order.status === OrderStatus.PENDING_PAYMENT && (
            <OrderBuyerPendingCard
              order={order}
              serverOffsetMs={serverOffsetMs}
              onRefreshOrder={() => refetch()}
            />
          )}

          {isBuyer && order.status === OrderStatus.PAID && (
            <Card className="p-5 flex items-start gap-3">
              <InfoIcon className="size-5 shrink-0 text-info mt-0.5" />
              <div className="space-y-1">
                <h2 className="text-h4 text-text">Đang chờ người bán gửi hàng</h2>
                <p className="text-small text-text-secondary">
                  Đã thanh toán lúc{" "}
                  <strong className="text-text tabular">
                    {formatDateTime(order.paidAt)}
                  </strong>
                  . Chờ người bán gửi hàng.
                </p>
              </div>
            </Card>
          )}

          {isBuyer && order.status === OrderStatus.SHIPPING && (
            <Card className="p-5 md:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-info-bg text-info">
                  <TruckIcon className="size-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-h3 text-text">Đơn hàng đang được giao</h2>
                  <p className="text-small text-text-secondary">
                    Kiểm tra hàng khi nhận và xác nhận để hoàn tất giao dịch.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border-brand bg-surface-subtle p-4 space-y-2 text-small">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="label">Mã vận đơn</span>
                  <span className="font-semibold text-text tabular">
                    {order.trackingCode ?? "Chưa có mã vận đơn"}
                  </span>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="label">Thời điểm gửi hàng</span>
                  <span className="font-medium text-text tabular">
                    {formatDateTime(order.shippedAt)}
                  </span>
                </div>
                {order.confirmDeadline && (
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="label">Hạn xác nhận nhận hàng</span>
                    <span className="font-medium text-warning-strong tabular">
                      {formatDateTime(order.confirmDeadline)}
                      {confirmCountdown && !confirmCountdown.isZero
                        ? ` (còn ${confirmCountdown.formatted})`
                        : ""}
                    </span>
                  </div>
                )}
              </div>

              {confirmError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-small text-danger-strong"
                >
                  <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                  <span>{confirmError}</span>
                </div>
              )}

              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => setConfirmOpen(true)}
                loading={confirmMutation.isPending}
              >
                Xác nhận đã nhận hàng
              </Button>
            </Card>
          )}

          {!isBuyer && order.status === OrderStatus.PENDING_PAYMENT && (
            <Card className="p-5 flex items-start gap-3">
              <InfoIcon className="size-5 shrink-0 text-warning-strong mt-0.5" />
              <div className="space-y-1">
                <h2 className="text-h4 text-text">Đang chờ người mua thanh toán</h2>
                <p className="text-small text-text-secondary">
                  Đang chờ người mua thanh toán trước{" "}
                  <strong className="text-text tabular">
                    {formatDateTime(order.paymentDeadline)}
                  </strong>
                  .
                </p>
              </div>
            </Card>
          )}

          {!isBuyer && order.status === OrderStatus.PAID && (
            <OrderSellerPaidCard
              order={order}
              onRefreshOrder={() => refetch()}
            />
          )}

          {!isBuyer && order.status === OrderStatus.SHIPPING && (
            <Card className="p-5 flex items-start gap-3">
              <TruckIcon className="size-5 shrink-0 text-info mt-0.5" />
              <div className="space-y-1.5">
                <h2 className="text-h4 text-text">Đã gửi hàng cho người mua</h2>
                <p className="text-small text-text-secondary">
                  Đã gửi lúc{" "}
                  <strong className="text-text tabular">
                    {formatDateTime(order.shippedAt)}
                  </strong>
                  ; người mua xác nhận trước{" "}
                  <strong className="text-text tabular">
                    {formatDateTime(order.confirmDeadline)}
                  </strong>
                  , quá hạn hệ thống tự hoàn tất.
                </p>
                {order.trackingCode && (
                  <p className="text-small text-text-secondary">
                    Mã vận đơn:{" "}
                    <strong className="text-text tabular">
                      {order.trackingCode}
                    </strong>
                  </p>
                )}
              </div>
            </Card>
          )}

          {order.status === OrderStatus.COMPLETED && (
            <Card className="p-5 flex items-start gap-3">
              <CheckCircleIcon className="size-5 shrink-0 text-success-strong mt-0.5" />
              <div className="space-y-2">
                <h2 className="text-h4 text-text">Đơn hàng đã hoàn tất</h2>
                <p className="text-small text-text-secondary">
                  Hoàn tất lúc{" "}
                  <strong className="text-text tabular">
                    {formatDateTime(order.completedAt)}
                  </strong>
                  .
                </p>
                <div className="flex items-center gap-2 text-small text-text-secondary">
                  <span>Trạng thái sản phẩm:</span>
                  <StatusBadge statusType="product" value={order.productStatus} />
                </div>
              </div>
            </Card>
          )}

          {/* 4. Lịch sử thanh toán (chỉ BUYER) */}
          {isBuyer && <PaymentHistorySection orderId={order.id} />}
        </div>

        {/* Cột phụ (4/12) */}
        <aside className="lg:col-span-4 space-y-4">
          <Card className="p-5 space-y-4">
            <h2 className="text-h4 text-text">Thông tin hai bên</h2>
            <dl className="space-y-3 text-small">
              <div className="flex justify-between gap-2">
                <dt className="label">Vai trò của bạn</dt>
                <dd className="font-semibold text-text">
                  {isBuyer ? "Người mua" : "Người bán"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="label">Người mua</dt>
                <dd className="font-medium text-text text-right">
                  {order.buyer.fullName}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="label">Người bán</dt>
                <dd className="font-medium text-text text-right">
                  {order.seller.fullName}
                </dd>
              </div>
              {order.phoneNumber && (
                <div className="flex justify-between gap-2 border-t border-border-subtle pt-3">
                  <dt className="label">SĐT nhận hàng</dt>
                  <dd className="font-medium text-text tabular">
                    {order.phoneNumber}
                  </dd>
                </div>
              )}
              {order.shippingAddress && (
                <div className="space-y-1">
                  <dt className="label">Địa chỉ nhận hàng</dt>
                  <dd className="font-medium text-text">
                    {order.shippingAddress}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          <Card className="p-5 space-y-3">
            <h2 className="text-h4 text-text">Các mốc thời gian</h2>
            <dl className="space-y-2.5 text-small tabular">
              <div className="flex justify-between gap-2">
                <dt className="label">Tạo đơn</dt>
                <dd className="text-text">{formatDateTime(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="label">Hạn thanh toán</dt>
                <dd className="text-text">
                  {formatDateTime(order.paymentDeadline)}
                </dd>
              </div>
              {order.confirmDeadline && (
                <div className="flex justify-between gap-2">
                  <dt className="label">Hạn xác nhận</dt>
                  <dd className="text-text">
                    {formatDateTime(order.confirmDeadline)}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          <Card className="p-5 space-y-3">
            <h2 className="text-h4 text-text">Hỗ trợ & báo cáo</h2>
            <p className="text-caption text-text-secondary">
              Nếu phát hiện dấu hiệu gian lận hoặc vi phạm quy định giao dịch, bạn có thể gửi báo cáo cho quản trị viên.
            </p>
            <Button
              type="button"
              variant="danger-soft"
              size="md"
              className="w-full"
              onClick={() => setReportOpen(true)}
            >
              <FlagIcon className="size-4" />
              <span>Báo cáo vi phạm</span>
            </Button>
          </Card>
        </aside>
      </div>

      {/* ConfirmDialog cho Xác nhận đã nhận hàng */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmReceipt}
        title="Xác nhận đã nhận hàng?"
        description="Sau khi xác nhận, đơn hàng sẽ chuyển sang trạng thái Hoàn tất và không thể hoàn tác. Bạn chắc chắn đã nhận đủ sản phẩm đúng mô tả?"
        confirmLabel="Xác nhận đã nhận hàng"
        loading={confirmMutation.isPending}
      />

      {/* ReportModal gắn đơn hàng + bên kia */}
      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        orderTarget={{ id: order.id, title: order.title }}
        userTarget={{
          id: counterparty.id,
          fullName: counterparty.fullName,
          roleLabel: counterpartyLabel,
        }}
      />
    </div>
  );
}
