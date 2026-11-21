"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { isApiError } from "@/lib/api/types";
import {
  formatDateTime,
  formatDisplayCode,
  formatMoney,
  formatNumber,
} from "@/lib/format";
import { useAuctionChannel } from "@/lib/ws/hooks";
import { AuctionStatus, PRODUCT_CONDITION_LABEL } from "@/types/enums";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BidHistoryTable } from "@/features/auction/components/BidHistoryTable";
import { auctionKeys, useAuctionBidsInfinite } from "@/features/auction/hooks";
import {
  CancelAuctionDialog,
  type CancelAuctionTarget,
} from "../../shared/AdminActionDialogs";
import { adminKeys } from "../../shared/queryKeys";
import { useAdminAuctionDetail } from "../hooks";

export function AdminAuctionDetailClient({ auctionId }: { auctionId: number }) {
  const queryClient = useQueryClient();
  const { data: meta, isLoading, isError, error, refetch } =
    useAdminAuctionDetail(auctionId);
  const [cancelTarget, setCancelTarget] = useState<CancelAuctionTarget | null>(
    null
  );

  const auction = meta?.data;
  const serverOffsetMs = meta?.serverOffsetMs ?? 0;

  const bidsQuery = useAuctionBidsInfinite(auctionId, 20);
  const bids = useMemo(
    () => bidsQuery.data?.pages.flatMap((p) => p.content) ?? [],
    [bidsQuery.data?.pages]
  );

  const isLive =
    auction?.status === AuctionStatus.SCHEDULED ||
    auction?.status === AuctionStatus.ACTIVE;

  const handleRealtimeEvent = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: adminKeys.auctionDetail(auctionId),
    });
    void queryClient.invalidateQueries({
      queryKey: auctionKeys.bids(auctionId, 20),
    });
  }, [auctionId, queryClient]);

  const { showReconnectingBanner } = useAuctionChannel(
    auctionId,
    handleRealtimeEvent,
    {
      enabled: Boolean(isLive),
      onReconnect: () => {
        void refetch();
        void bidsQuery.refetch();
      },
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !auction) {
    const message = isApiError(error)
      ? error.message
      : "Không tải được thông tin chi tiết phiên đấu giá.";
    return (
      <div className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Quản trị", href: "/admin" },
            { label: "Phiên đấu giá", href: "/admin/auctions" },
            { label: formatDisplayCode("AUC", auctionId) },
          ]}
        />
        <ErrorState message={message} onRetry={() => refetch()} />
      </div>
    );
  }

  const canCancel =
    auction.status === AuctionStatus.SCHEDULED ||
    auction.status === AuctionStatus.ACTIVE;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Quản trị", href: "/admin" },
          { label: "Phiên đấu giá", href: "/admin/auctions" },
          { label: formatDisplayCode("AUC", auction.id) },
        ]}
      />

      {showReconnectingBanner && (
        <div
          role="status"
          className="rounded-xl border border-warning-border bg-warning-subtle-bg px-4 py-2.5 text-small text-warning-strong"
        >
          Đang kết nối lại kênh cập nhật trực tiếp...
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-small font-semibold text-text-tertiary tabular">
              {formatDisplayCode("AUC", auction.id)}
            </span>
            <StatusBadge statusType="auction" value={auction.status} />
            <StatusBadge statusType="reserve" value={auction.reserveStatus} />
          </div>
          <h1 className="text-h1 text-text">{auction.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/admin/products/${auction.productId}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border-brand bg-surface px-4 text-small font-medium text-text hover:bg-surface-subtle"
          >
            Xem sản phẩm ({formatDisplayCode("PRD", auction.productId)})
          </Link>
          {auction.orderId != null && (
            <Link
              href={`/admin/orders/${auction.orderId}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border-brand bg-surface px-4 text-small font-medium text-text hover:bg-surface-subtle"
            >
              Xem đơn ({formatDisplayCode("ORD", auction.orderId)})
            </Link>
          )}
          {canCancel && (
            <Button
              variant="danger-soft"
              size="md"
              onClick={() =>
                setCancelTarget({
                  id: auction.id,
                  title: auction.title,
                  bidCount: auction.bidCount,
                })
              }
            >
              Hủy phiên
            </Button>
          )}
        </div>
      </div>

      {auction.status === AuctionStatus.CANCELLED && auction.cancelReason && (
        <div className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-small text-danger-strong">
          <span className="font-semibold">Lý do hủy phiên:</span>{" "}
          {auction.cancelReason}
        </div>
      )}

      {/* Số liệu giá & thời gian */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="p-5 lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-h3 text-text">Số liệu phiên đấu giá</h2>
            {isLive && (
              <div className="flex items-center gap-2 text-small text-text-secondary">
                <span>
                  {auction.status === AuctionStatus.SCHEDULED
                    ? "Bắt đầu sau:"
                    : "Còn lại:"}
                </span>
                <CountdownTimer
                  endTime={
                    auction.status === AuctionStatus.SCHEDULED
                      ? auction.startTime
                      : auction.endTime
                  }
                  serverOffsetMs={serverOffsetMs}
                  onExpire={() => void refetch()}
                />
              </div>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-small">
            <div>
              <dt className="text-text-tertiary">Giá hiện tại</dt>
              <dd className="mt-1 text-h3 font-bold text-primary-700 tabular">
                {formatMoney(auction.currentPrice)}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Giá khởi điểm</dt>
              <dd className="mt-1 font-semibold text-text tabular">
                {formatMoney(auction.startPrice)}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Bước giá</dt>
              <dd className="mt-1 font-semibold text-text tabular">
                {formatMoney(auction.bidIncrement)}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Giá sàn (chỉ quản trị)</dt>
              <dd className="mt-1 font-semibold text-text tabular">
                {auction.reservePrice != null
                  ? formatMoney(auction.reservePrice)
                  : "Không đặt giá sàn"}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Tổng lượt đặt giá</dt>
              <dd className="mt-1 font-semibold text-text tabular">
                {formatNumber(auction.bidCount)}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Giá chốt cuối</dt>
              <dd className="mt-1 font-semibold text-text tabular">
                {auction.finalPrice != null
                  ? formatMoney(auction.finalPrice)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Bắt đầu</dt>
              <dd className="mt-1 text-text-secondary tabular">
                {formatDateTime(auction.startTime)}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Kết thúc</dt>
              <dd className="mt-1 text-text-secondary tabular">
                {formatDateTime(auction.endTime)}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Thời điểm đóng</dt>
              <dd className="mt-1 text-text-secondary tabular">
                {auction.closedAt ? formatDateTime(auction.closedAt) : "—"}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-4 border-t border-border-subtle pt-4 text-small">
            <div className="flex items-center gap-2">
              <span className="text-text-tertiary">Trạng thái sản phẩm:</span>
              <StatusBadge statusType="product" value={auction.productStatus} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-tertiary">Tình trạng:</span>
              <span className="font-medium text-text">
                {PRODUCT_CONDITION_LABEL[auction.condition]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-tertiary">Danh mục:</span>
              <span className="font-medium text-text">{auction.categoryName}</span>
            </div>
          </div>
        </Card>

        {/* Các bên liên quan */}
        <Card className="p-5 lg:col-span-5 space-y-5">
          <h2 className="text-h3 text-text">Các bên liên quan</h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-caption font-medium text-text-tertiary">
                Người bán
              </span>
              <div className="flex items-center gap-3">
                <Avatar
                  src={auction.seller.avatarUrl}
                  name={auction.seller.fullName}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-text">
                      {auction.seller.fullName}
                    </span>
                    <StatusBadge statusType="user" value={auction.seller.status} />
                  </div>
                  <p className="truncate text-caption text-text-secondary">
                    {auction.seller.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-4 space-y-1.5">
              <span className="text-caption font-medium text-text-tertiary">
                Người đang dẫn đầu
              </span>
              {auction.highestBidder ? (
                <div className="flex items-center gap-3">
                  <Avatar
                    src={auction.highestBidder.avatarUrl}
                    name={auction.highestBidder.fullName}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-text">
                        {auction.highestBidder.fullName}
                      </span>
                      <StatusBadge
                        statusType="user"
                        value={auction.highestBidder.status}
                      />
                    </div>
                    <p className="truncate text-caption text-text-secondary">
                      {auction.highestBidder.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-small text-text-tertiary">Chưa có lượt đặt giá</p>
              )}
            </div>

            <div className="border-t border-border-subtle pt-4 space-y-1.5">
              <span className="text-caption font-medium text-text-tertiary">
                Người thắng cuộc
              </span>
              {auction.winner ? (
                <div className="flex items-center gap-3">
                  <Avatar
                    src={auction.winner.avatarUrl}
                    name={auction.winner.fullName}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-text">
                        {auction.winner.fullName}
                      </span>
                      <StatusBadge
                        statusType="user"
                        value={auction.winner.status}
                      />
                    </div>
                    <p className="truncate text-caption text-text-secondary">
                      {auction.winner.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-small text-text-tertiary">Chưa có người thắng</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Lịch sử đặt giá */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-h3 text-text">
            Lịch sử đặt giá ({formatNumber(auction.bidCount)})
          </h2>
        </div>
        <BidHistoryTable
          bids={bids}
          loading={bidsQuery.isLoading}
          error={bidsQuery.isError}
          errorMessage={
            bidsQuery.isError && isApiError(bidsQuery.error)
              ? bidsQuery.error.message
              : "Không tải được lịch sử đặt giá."
          }
          onRetry={() => void bidsQuery.refetch()}
          hasMore={Boolean(bidsQuery.hasNextPage)}
          loadingMore={bidsQuery.isFetchingNextPage}
          onLoadMore={() => void bidsQuery.fetchNextPage()}
        />
      </Card>

      <CancelAuctionDialog
        target={cancelTarget}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
}
