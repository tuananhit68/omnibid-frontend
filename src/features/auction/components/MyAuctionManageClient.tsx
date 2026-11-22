"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  CountdownTimer,
  ErrorState,
  Skeleton,
  StatusBadge,
  useToast,
} from "@/components/ui";
import {
  AlertCircleIcon,
  AwardIcon,
  ClockIcon,
  GavelIcon,
  InfoIcon,
} from "@/components/icons";
import { ApiError } from "@/lib/api/types";
import { useProductDetail } from "@/features/product/hooks";
import { formatDateTime, formatDisplayCode, formatMoney } from "@/lib/format";
import {
  AUCTION_STATUS_META,
  AuctionStatus,
  ProductStatus,
} from "@/types/enums";
import {
  useAuctionBidsInfinite,
  useAuctionDetail,
  useAuctionRealtime,
  useCancelAuction,
  useUpdateAuction,
} from "../hooks";
import { AuctionScheduleForm } from "./AuctionScheduleForm";
import { BidHistoryTable } from "./BidHistoryTable";
import { ReserveBadge } from "./ReserveBadge";

export interface MyAuctionManageClientProps {
  auctionId: number;
}

export function MyAuctionManageClient({ auctionId }: MyAuctionManageClientProps) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [closingHint, setClosingHint] = useState(false);

  const detailQuery = useAuctionDetail(auctionId);
  const bidsQuery = useAuctionBidsInfinite(auctionId, 20);
  const updateMutation = useUpdateAuction();
  const cancelMutation = useCancelAuction();

  const auction = detailQuery.data?.data ?? null;
  const serverOffsetMs = detailQuery.data?.serverOffsetMs ?? 0;

  // Chỉ kiểm tra trạng thái sản phẩm khi phiên UNSOLD hoặc CANCELLED để hiển thị nút "Tạo phiên mới"
  const shouldCheckProduct =
    auction !== null &&
    auction.viewerIsSeller &&
    (auction.status === AuctionStatus.UNSOLD ||
      auction.status === AuctionStatus.CANCELLED);
  const productQuery = useProductDetail(
    shouldCheckProduct && auction ? auction.productId : 0
  );

  const { showReconnectingBanner } = useAuctionRealtime(auctionId);

  if (detailQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (detailQuery.isError || !auction) {
    const apiErr = detailQuery.error instanceof ApiError ? detailQuery.error : null;
    return (
      <ErrorState
        title="Không thể tải thông tin phiên đấu giá"
        message={apiErr?.message || "Phiên đấu giá không tồn tại hoặc đã bị ẩn."}
        onRetry={() => detailQuery.refetch()}
      />
    );
  }

  // Bảo vệ quyền sở hữu (viewerIsSeller bắt buộc true)
  if (!auction.viewerIsSeller) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-danger-bg text-danger">
            <AlertCircleIcon className="size-6" />
          </div>
          <h1 className="text-h3 text-text">Bạn không có quyền truy cập</h1>
          <p className="max-w-md text-small text-text-secondary">
            Bạn chỉ có thể quản lý các phiên đấu giá do chính tài khoản của bạn tạo.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/me/auctions"
              className="inline-flex h-10 items-center rounded-lg bg-primary-600 px-4 text-small font-semibold text-text-inverse hover:bg-primary-700 transition-colors"
            >
              Về Phiên của tôi
            </Link>
            <Link
              href={`/auctions/${auction.id}`}
              className="inline-flex h-10 items-center rounded-lg border border-border-strong bg-surface px-4 text-small font-semibold text-text hover:bg-surface-subtle transition-colors"
            >
              Xem trang công khai
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusMeta = AUCTION_STATUS_META[auction.status];
  const allBids = bidsQuery.data?.pages.flatMap((p) => p.content) ?? [];
  const isScheduled = auction.status === AuctionStatus.SCHEDULED;
  const isActive = auction.status === AuctionStatus.ACTIVE;
  const isEnded = auction.status === AuctionStatus.ENDED;
  const isUnsoldOrCancelled =
    auction.status === AuctionStatus.UNSOLD ||
    auction.status === AuctionStatus.CANCELLED;
  const canCancel = isScheduled || (isActive && auction.bidCount === 0);
  const canRecreateAuction =
    isUnsoldOrCancelled && productQuery.data?.status === ProductStatus.AVAILABLE;

  const handleConfirmCancel = async (reason?: string) => {
    const trimmed = (reason ?? "").trim();
    if (!trimmed) return;
    try {
      await cancelMutation.mutateAsync({
        id: auction.id,
        payload: { reason: trimmed },
      });
      toast.success(
        `Phiên ${formatDisplayCode("AUC", auction.id)} đã được hủy. Sản phẩm đã trở về trạng thái Sẵn sàng.`,
        "Đã hủy phiên đấu giá"
      );
      setCancelOpen(false);
      setEditing(false);
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : null;
      toast.error(
        apiErr?.message || "Không thể hủy phiên đấu giá.",
        "Hủy phiên thất bại"
      );
      setCancelOpen(false);
      detailQuery.refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Đầu trang: Tiêu đề + Trạng thái + Link công khai */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              label={statusMeta.label}
              tone={statusMeta.tone}
              withDot={statusMeta.showDot}
            />
            <span className="text-caption text-text-tertiary tabular">
              {formatDisplayCode("AUC", auction.id)}
            </span>
            {(isActive || isScheduled) && showReconnectingBanner && (
              <span className="text-caption text-warning-strong">
                Đang kết nối lại cập nhật trực tiếp…
              </span>
            )}
          </div>
          <h1 className="text-h2 text-text">{auction.title}</h1>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href={`/auctions/${auction.id}`}
            className="inline-flex h-10 items-center rounded-lg border border-border-brand bg-surface px-3.5 text-small font-medium text-text hover:bg-surface-subtle transition-colors"
          >
            Xem trang công khai
          </Link>
          <Link
            href="/me/auctions"
            className="inline-flex h-10 items-center rounded-lg border border-border-brand bg-surface px-3.5 text-small font-medium text-text-secondary hover:bg-surface-subtle transition-colors"
          >
            Danh sách phiên
          </Link>
        </div>
      </div>

      {/* Lưới số liệu */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="space-y-1">
            <p className="text-caption text-text-tertiary">Giá hiện tại</p>
            <p className="text-h3 font-bold text-primary-700 tabular">
              {formatMoney(auction.currentPrice)}
            </p>
            <p className="text-caption text-text-secondary tabular">
              Khởi điểm: {formatMoney(auction.startPrice)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1.5">
            <p className="text-caption text-text-tertiary">Giá sàn (chỉ bạn thấy)</p>
            <p className="text-h4 font-semibold text-text tabular">
              {auction.reservePrice !== null && auction.reservePrice !== undefined
                ? formatMoney(auction.reservePrice)
                : "Không đặt"}
            </p>
            <div>
              <ReserveBadge status={auction.reserveStatus} compact />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1">
            <p className="text-caption text-text-tertiary">Bước giá &amp; Lượt đặt</p>
            <p className="text-h4 font-semibold text-text tabular">
              +{formatMoney(auction.bidIncrement)}
            </p>
            <p className="text-caption text-text-secondary tabular">
              {auction.bidCount} lượt · Dẫn đầu:{" "}
              <span className="font-medium text-text">
                {auction.highestBidderName ?? "Chưa có"}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-caption text-text-tertiary">
              <ClockIcon className="size-3.5" />
              <span>
                {isScheduled
                  ? "Bắt đầu sau"
                  : isActive
                    ? "Còn lại"
                    : "Thời gian phiên"}
              </span>
            </div>
            {isScheduled || isActive ? (
              <div className="space-y-1">
                <CountdownTimer
                  endTime={isScheduled ? auction.startTime : auction.endTime}
                  serverOffsetMs={serverOffsetMs}
                  onExpire={() => {
                    setClosingHint(true);
                    detailQuery.refetch();
                  }}
                />
                {closingHint && (
                  <p className="text-caption text-warning-strong">
                    {isScheduled ? "Đang mở phiên…" : "Đang chốt phiên…"}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-small font-medium text-text tabular">
                {auction.closedAt
                  ? `Đóng lúc ${formatDateTime(auction.closedAt)}`
                  : formatDateTime(auction.endTime)}
              </p>
            )}
            <p className="text-caption text-text-tertiary tabular">
              {formatDateTime(auction.startTime)} → {formatDateTime(auction.endTime)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Khối thao tác theo trạng thái */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác quản lý</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isScheduled && !editing && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-small text-text-secondary">
                Phiên chưa bắt đầu. Bạn có thể chỉnh sửa giá, thời gian hoặc hủy phiên nếu cần.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(true)}
                >
                  Sửa phiên
                </Button>
                <Button
                  type="button"
                  variant="danger-soft"
                  onClick={() => setCancelOpen(true)}
                >
                  Hủy phiên
                </Button>
              </div>
            </div>
          )}

          {isScheduled && editing && (
            <AuctionScheduleForm
              defaultValues={{
                startPrice: auction.startPrice,
                bidIncrement: auction.bidIncrement,
                reservePrice: auction.reservePrice ?? null,
                startTime: auction.startTime,
                endTime: auction.endTime,
              }}
              submitLabel="Lưu thay đổi"
              isSubmitting={updateMutation.isPending}
              cancelAction={
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => setEditing(false)}
                  disabled={updateMutation.isPending}
                >
                  Hủy chỉnh sửa
                </Button>
              }
              onSubmitValues={async (values) => {
                try {
                  await updateMutation.mutateAsync({
                    id: auction.id,
                    payload: values,
                  });
                  toast.success(
                    "Thông tin phiên đấu giá đã được cập nhật.",
                    "Đã lưu thay đổi"
                  );
                  setEditing(false);
                } catch (err) {
                  if (err instanceof ApiError && err.code === "AUCTION_NOT_EDITABLE") {
                    toast.error(err.message, "Không thể chỉnh sửa");
                    setEditing(false);
                    detailQuery.refetch();
                    return;
                  }
                  throw err;
                }
              }}
            />
          )}

          {isActive && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {canCancel ? (
                <>
                  <p className="text-small text-text-secondary">
                    Phiên đang diễn ra và chưa có lượt đặt giá nào. Bạn vẫn có thể hủy phiên nếu cần.
                  </p>
                  <Button
                    type="button"
                    variant="danger-soft"
                    onClick={() => setCancelOpen(true)}
                  >
                    Hủy phiên
                  </Button>
                </>
              ) : (
                <div className="flex items-start gap-2.5 rounded-lg bg-surface-subtle px-4 py-3 text-small text-text-secondary w-full">
                  <InfoIcon className="mt-0.5 size-4.5 shrink-0 text-primary-600" />
                  <span>Phiên đã có lượt đặt giá nên không thể hủy.</span>
                </div>
              )}
            </div>
          )}

          {isEnded && (
            <div className="flex flex-col gap-4 rounded-lg border border-success-border bg-success-bg p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AwardIcon className="mt-0.5 size-5 shrink-0 text-success-strong" />
                <div className="space-y-1">
                  <p className="text-small font-semibold text-success-strong">
                    Phiên đấu giá đã kết thúc thành công
                  </p>
                  <p className="text-small text-text">
                    Người thắng:{" "}
                    <strong>{auction.winnerName ?? "Đang cập nhật"}</strong> · Giá chốt:{" "}
                    <strong className="tabular">
                      {formatMoney(auction.finalPrice ?? auction.currentPrice)}
                    </strong>
                  </p>
                </div>
              </div>
              {auction.orderId !== null && auction.orderId !== undefined && (
                <Link
                  href={`/orders/${auction.orderId}`}
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary-600 px-4 text-small font-semibold text-text-inverse hover:bg-primary-700 transition-colors"
                >
                  Xem đơn hàng
                </Link>
              )}
            </div>
          )}

          {isUnsoldOrCancelled && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-small font-medium text-text">
                  {auction.status === AuctionStatus.CANCELLED
                    ? "Phiên đấu giá này đã bị hủy."
                    : "Phiên kết thúc nhưng không bán được (chưa đạt giá sàn hoặc không có người thắng hợp lệ)."}
                </p>
                {auction.cancelReason && (
                  <p className="text-small text-text-secondary">
                    Lý do hủy: {auction.cancelReason}
                  </p>
                )}
              </div>
              {canRecreateAuction && (
                <Link
                  href={`/me/auctions/new?productId=${auction.productId}`}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-small font-semibold text-text-inverse hover:bg-primary-700 transition-colors"
                >
                  <GavelIcon className="size-4" />
                  <span>Tạo phiên mới cho sản phẩm</span>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lịch sử đặt giá */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Lịch sử đặt giá</CardTitle>
          <span className="text-caption text-text-tertiary tabular">
            {auction.bidCount} lượt
          </span>
        </CardHeader>
        <CardContent>
          <BidHistoryTable
            bids={allBids}
            loading={bidsQuery.isLoading}
            error={bidsQuery.isError}
            errorMessage={
              bidsQuery.error instanceof ApiError
                ? bidsQuery.error.message
                : "Không thể tải lịch sử đặt giá."
            }
            onRetry={() => bidsQuery.refetch()}
            hasMore={Boolean(bidsQuery.hasNextPage)}
            loadingMore={bidsQuery.isFetchingNextPage}
            onLoadMore={() => bidsQuery.fetchNextPage()}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Hủy phiên đấu giá"
        description={
          <p>
            Bạn có chắc muốn hủy phiên{" "}
            <strong className="text-text">
              {formatDisplayCode("AUC", auction.id)}
            </strong>
            ? Hành động này không thể hoàn tác và sản phẩm sẽ quay về trạng thái Sẵn sàng.
          </p>
        }
        confirmLabel="Xác nhận hủy phiên"
        confirmVariant="danger-soft"
        tone="danger"
        reasonMode="required"
        reasonLabel="Lý do hủy phiên"
        reasonPlaceholder="Nhập lý do hủy phiên đấu giá…"
        loading={cancelMutation.isPending}
      />
    </div>
  );
}
