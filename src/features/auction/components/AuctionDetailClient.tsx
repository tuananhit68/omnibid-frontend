"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { isApiError } from "@/lib/api/types";
import {
  formatDateTime,
  formatDisplayCode,
  formatMoney,
} from "@/lib/format";
import { AuctionStatus, PRODUCT_CONDITION_LABEL } from "@/types/enums";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import {
  AlertTriangleIcon,
  AwardIcon,
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  InfoIcon,
  XCircleIcon,
} from "@/components/icons";
import { ReportModal } from "@/features/report";
import {
  useAuctionBidsInfinite,
  useAuctionDetail,
  useAuctionRealtime,
} from "../hooks";
import type { AuctionDetail, BidHistoryItem, Page } from "../types";
import { BidForm } from "./BidForm";
import { BidHistoryTable } from "./BidHistoryTable";
import { ImageGallery } from "./ImageGallery";
import { PricePanel } from "./PricePanel";
import { ReserveBadge } from "./ReserveBadge";

export interface AuctionDetailClientProps {
  auctionId: number;
  initialAuction?: AuctionDetail | null;
  initialBids?: Page<BidHistoryItem> | null;
}

const BIDS_PAGE_SIZE = 20;

export function AuctionDetailClient({
  auctionId,
  initialAuction,
  initialBids,
}: AuctionDetailClientProps) {
  const { isAuthenticated, isAdmin } = useSession();
  const toast = useToast();
  const [flash, setFlash] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const expireTimerRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  const {
    data: detailWrap,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuctionDetail(auctionId, initialAuction);

  const {
    data: bidsInfinite,
    isLoading: bidsLoading,
    isError: bidsError,
    error: bidsErrObj,
    refetch: refetchBids,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAuctionBidsInfinite(auctionId, BIDS_PAGE_SIZE, initialBids);

  const triggerFlash = useCallback(() => {
    setFlash(true);
    if (flashTimerRef.current !== null) {
      window.clearTimeout(flashTimerRef.current);
    }
    flashTimerRef.current = window.setTimeout(() => setFlash(false), 650);
  }, []);

  const handleOutbid = useCallback(() => {
    toast.info("Bạn vừa bị vượt giá");
  }, [toast]);

  const { showReconnectingBanner } = useAuctionRealtime(auctionId, {
    onBidFlash: triggerFlash,
    onOutbid: handleOutbid,
  });

  useEffect(() => {
    return () => {
      if (expireTimerRef.current !== null) {
        window.clearTimeout(expireTimerRef.current);
      }
      if (flashTimerRef.current !== null) {
        window.clearTimeout(flashTimerRef.current);
      }
    };
  }, []);

  const handleExpire = useCallback(() => {
    setTimerExpired(true);
    if (expireTimerRef.current !== null) {
      window.clearTimeout(expireTimerRef.current);
    }
    expireTimerRef.current = window.setTimeout(() => {
      refetch();
    }, 15_000);
  }, [refetch]);

  const allBids = useMemo(() => {
    if (!bidsInfinite) return [];
    const seen = new Set<number>();
    const merged: BidHistoryItem[] = [];
    for (const page of bidsInfinite.pages) {
      for (const item of page.content) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          merged.push(item);
        }
      }
    }
    return merged;
  }, [bidsInfinite]);

  if (isLoading && !detailWrap) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-9 w-96 max-w-full" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Skeleton className="h-96 rounded-xl lg:col-span-7" />
          <Skeleton className="h-96 rounded-xl lg:col-span-5" />
        </div>
      </div>
    );
  }

  if (isError && isApiError(error) && error.code === "NOT_FOUND") {
    notFound();
  }

  if (isError || !detailWrap) {
    return (
      <ErrorState
        message={
          isApiError(error) ? error.message : "Không thể tải thông tin phiên đấu giá."
        }
        onRetry={() => refetch()}
      />
    );
  }

  const auction = detailWrap.data;
  const serverOffsetMs = detailWrap.serverOffsetMs;
  const isClosing = timerExpired && auction.status === AuctionStatus.ACTIVE;

  const isWinnerWithOrder =
    auction.status === AuctionStatus.ENDED &&
    !auction.viewerIsSeller &&
    Boolean(auction.orderId);

  const showMobileStickyBidBar =
    auction.status === AuctionStatus.ACTIVE &&
    !isClosing &&
    !isAdmin &&
    !auction.viewerIsSeller &&
    !auction.viewerIsLeading;

  const loginRedirectHref = `/login?redirect=${encodeURIComponent(
    `/auctions/${auction.id}`
  )}`;

  const scrollToBidCard = () => {
    const el = document.getElementById("bid-card");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={showMobileStickyBidBar ? "space-y-6 pb-20 lg:pb-0" : "space-y-6"}>
      {/* Đầu trang */}
      <div className="space-y-2.5">
        <Breadcrumb
          items={[
            { label: "Phiên đấu giá", href: "/auctions" },
            {
              label: auction.categoryName,
              href: `/auctions?categoryId=${auction.categoryId}`,
            },
          ]}
        />

        <h1 className="text-h1 text-text">{auction.title}</h1>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge statusType="auction" value={auction.status} />
          <ReserveBadge status={auction.reserveStatus} />
          <span className="text-caption text-text-tertiary tabular">
            {formatDisplayCode("AUC", auction.id)}
          </span>
        </div>
      </div>

      {/* Banner mất kết nối WebSocket */}
      {showReconnectingBanner && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-small text-warning-strong"
        >
          <AlertTriangleIcon className="size-4 shrink-0" />
          <span>Đang kết nối lại…</span>
        </div>
      )}

      {/* Lưới chính: Desktop 7/5; Mobile: Ảnh -> Giá/Đặt giá -> Mô tả -> Lịch sử */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* 1. Ảnh sản phẩm */}
        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <ImageGallery images={auction.images} title={auction.title} />
        </div>

        {/* 2. Card giá + đặt giá + báo cáo */}
        <div
          id="bid-card"
          className="space-y-4 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-3 lg:sticky lg:top-20"
        >
          <Card className="space-y-5">
            <PricePanel
              status={auction.status}
              currentPrice={auction.currentPrice}
              startPrice={auction.startPrice}
              minNextBid={auction.minNextBid}
              bidIncrement={auction.bidIncrement}
              bidCount={auction.bidCount}
              highestBidderName={auction.highestBidderName}
              flash={flash}
            />

            {/* Đồng hồ đếm ngược / giờ bắt đầu */}
            {auction.status === AuctionStatus.ACTIVE && (
              <CountdownTimer
                endTime={auction.endTime}
                serverOffsetMs={serverOffsetMs}
                onExpire={handleExpire}
              />
            )}

            {auction.status === AuctionStatus.SCHEDULED && (
              <div className="flex items-center gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3.5 text-small text-warning-strong">
                <ClockIcon className="size-5 shrink-0" />
                <div>
                  <p className="font-semibold">Phiên chưa bắt đầu</p>
                  <p className="text-caption tabular">
                    Bắt đầu lúc {formatDateTime(auction.startTime)} (GMT+7)
                  </p>
                </div>
              </div>
            )}

            {/* Khối đặt giá / trạng thái theo người xem */}
            {isAdmin ? (
              <div className="space-y-3 border-t border-border-subtle pt-4">
                <div className="flex items-start gap-2.5 rounded-lg bg-surface-subtle px-3.5 py-3 text-small text-text-secondary">
                  <InfoIcon className="mt-0.5 size-4 shrink-0 text-text-tertiary" />
                  <span>Tài khoản quản trị không tham gia đặt giá.</span>
                </div>
                <Link
                  href={`/admin/auctions/${auction.id}`}
                  className={getButtonClassName({
                    variant: "secondary",
                    size: "md",
                    className: "w-full",
                  })}
                >
                  Xem trong trang quản trị
                </Link>
              </div>
            ) : auction.viewerIsSeller ? (
              <div className="space-y-3 border-t border-border-subtle pt-4">
                <div className="space-y-1 rounded-lg bg-surface-subtle px-3.5 py-3 text-small">
                  <p className="font-semibold text-text">Đây là phiên của bạn</p>
                  {auction.reservePrice !== undefined &&
                    auction.reservePrice !== null && (
                      <p className="text-text-secondary tabular">
                        Giá sàn:{" "}
                        <strong className="text-text">
                          {formatMoney(auction.reservePrice)}
                        </strong>
                      </p>
                    )}
                </div>
                <Link
                  href={`/me/auctions/${auction.id}`}
                  className={getButtonClassName({
                    variant: "secondary",
                    size: "md",
                    className: "w-full",
                  })}
                >
                  Quản lý phiên của bạn
                </Link>
                {auction.status === AuctionStatus.ENDED && auction.orderId && (
                  <Link
                    href={`/orders/${auction.orderId}`}
                    className={getButtonClassName({
                      variant: "primary",
                      size: "md",
                      className: "w-full",
                    })}
                  >
                    Xem đơn hàng {formatDisplayCode("ORD", auction.orderId)}
                  </Link>
                )}
              </div>
            ) : auction.status === AuctionStatus.ACTIVE ? (
              isClosing ? (
                <div className="flex items-center gap-2.5 border-t border-border-subtle pt-4 text-small font-medium text-warning-strong">
                  <ClockIcon className="size-4 shrink-0" />
                  <span>Đang chốt phiên… Vui lòng chờ hệ thống công bố kết quả.</span>
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-2.5 border-t border-border-subtle pt-4">
                  <Link
                    href={loginRedirectHref}
                    className={getButtonClassName({
                      variant: "primary",
                      size: "xl",
                      className: "w-full",
                    })}
                  >
                    Đăng nhập để đặt giá
                  </Link>
                  <p className="text-caption text-text-tertiary text-center">
                    Lượt đặt giá đã ghi nhận không thể rút.
                  </p>
                </div>
              ) : auction.viewerIsLeading ? (
                <div className="space-y-2 border-t border-border-subtle pt-4">
                  <div className="flex items-start gap-2.5 rounded-lg border border-success-border bg-success-bg px-3.5 py-3 text-small text-success-strong">
                    <CheckCircleIcon className="mt-0.5 size-4 shrink-0" />
                    <div>
                      <p className="font-semibold">
                        Bạn đang dẫn đầu với {formatMoney(auction.currentPrice)}
                      </p>
                      <p className="text-caption mt-0.5">
                        Hệ thống sẽ thông báo nếu có người đặt giá cao hơn.
                      </p>
                    </div>
                  </div>
                  <p className="text-caption text-text-tertiary text-center">
                    Lượt đặt giá đã ghi nhận không thể rút.
                  </p>
                </div>
              ) : (
                <BidForm
                  auctionId={auction.id}
                  minNextBid={auction.minNextBid}
                  bidIncrement={auction.bidIncrement}
                  disabled={isClosing}
                />
              )
            ) : auction.status === AuctionStatus.SCHEDULED ? (
              <div className="border-t border-border-subtle pt-4 text-small text-text-secondary">
                Phiên bắt đầu lúc{" "}
                <strong className="text-text tabular">
                  {formatDateTime(auction.startTime)}
                </strong>
                . Nút đặt giá sẽ tự động mở khi phiên bắt đầu.
              </div>
            ) : auction.status === AuctionStatus.ENDED ? (
              <div className="space-y-3 border-t border-border-subtle pt-4">
                {isWinnerWithOrder && auction.orderId ? (
                  <>
                    <div className="flex items-start gap-2.5 rounded-lg border border-success-border bg-success-bg px-3.5 py-3 text-small text-success-strong">
                      <AwardIcon className="mt-0.5 size-5 shrink-0" />
                      <div>
                        <p className="font-semibold">Bạn đã thắng phiên này</p>
                        <p className="text-caption mt-0.5 tabular">
                          Giá thắng:{" "}
                          {formatMoney(auction.finalPrice ?? auction.currentPrice)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/orders/${auction.orderId}`}
                      className={getButtonClassName({
                        variant: "money",
                        size: "xl",
                        className: "w-full",
                      })}
                    >
                      Thanh toán đơn hàng
                    </Link>
                  </>
                ) : (
                  <div className="space-y-1.5 rounded-lg bg-surface-subtle px-3.5 py-3 text-small">
                    <p className="font-semibold text-text">Phiên đã kết thúc</p>
                    <p className="text-text-secondary">
                      Người thắng:{" "}
                      <strong className="text-text">
                        {auction.winnerName ?? "—"}
                      </strong>
                    </p>
                    <p className="text-text-secondary tabular">
                      Giá cuối:{" "}
                      <strong className="text-primary-700">
                        {formatMoney(auction.finalPrice ?? auction.currentPrice)}
                      </strong>
                    </p>
                    {auction.closedAt && (
                      <p className="text-caption text-text-tertiary tabular">
                        Chốt lúc {formatDateTime(auction.closedAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : auction.status === AuctionStatus.UNSOLD ? (
              <div className="space-y-1 rounded-lg bg-surface-subtle px-3.5 py-3 border-t border-border-subtle text-small">
                <p className="font-semibold text-text">
                  Phiên kết thúc không bán được
                </p>
                <p className="text-text-secondary">
                  Không có lượt đặt giá hợp lệ hoặc chưa đạt giá sàn.
                </p>
                {auction.closedAt && (
                  <p className="text-caption text-text-tertiary tabular">
                    Đóng lúc {formatDateTime(auction.closedAt)}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-3 text-small text-danger-strong">
                <XCircleIcon className="mt-0.5 size-4 shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold">Phiên đấu giá đã bị hủy</p>
                  {auction.cancelReason && (
                    <p>Lý do: {auction.cancelReason}</p>
                  )}
                  {auction.closedAt && (
                    <p className="text-caption tabular">
                      Hủy lúc {formatDateTime(auction.closedAt)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Báo cáo vi phạm */}
          {!isAdmin && !auction.viewerIsSeller && (
            <div className="flex justify-end">
              {isAuthenticated ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  leftIcon={<FlagIcon className="size-4" />}
                  onClick={() => setReportOpen(true)}
                >
                  Báo cáo vi phạm
                </Button>
              ) : (
                <Link
                  href={loginRedirectHref}
                  className={getButtonClassName({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  <FlagIcon className="size-4" />
                  <span>Đăng nhập để báo cáo vi phạm</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* 3. Mô tả sản phẩm */}
        <Card className="space-y-4 lg:col-span-7 lg:col-start-1 lg:row-start-2">
          <h2 className="text-h3 text-text">Mô tả sản phẩm</h2>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-surface-subtle px-3.5 py-2.5">
              <span className="label block">Tình trạng</span>
              <span className="text-small font-semibold text-text">
                {PRODUCT_CONDITION_LABEL[auction.condition]}
              </span>
            </div>
            <div className="rounded-lg bg-surface-subtle px-3.5 py-2.5">
              <span className="label block">Người bán</span>
              <span className="text-small font-semibold text-text">
                {auction.seller.fullName}
              </span>
            </div>
          </div>

          <p className="text-body text-text whitespace-pre-line">
            {auction.description}
          </p>
        </Card>

        {/* 4. Lịch sử đặt giá */}
        <Card className="space-y-4 lg:col-span-7 lg:col-start-1 lg:row-start-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-h3 text-text">Lịch sử đặt giá</h2>
            <span className="text-caption text-text-tertiary tabular">
              {auction.bidCount} lượt
            </span>
          </div>

          <BidHistoryTable
            bids={allBids}
            loading={bidsLoading}
            error={bidsError}
            errorMessage={
              isApiError(bidsErrObj) ? bidsErrObj.message : undefined
            }
            onRetry={() => refetchBids()}
            hasMore={Boolean(hasNextPage)}
            loadingMore={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </Card>
      </div>

      {/* Thanh đáy cố định trên mobile */}
      {showMobileStickyBidBar && (
        <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-border-brand bg-surface px-4 py-3 lg:hidden">
          <div className="min-w-0">
            <span className="label block">Giá hiện tại</span>
            <p className="text-h4 font-bold text-primary-700 tabular truncate">
              {formatMoney(auction.currentPrice)}
            </p>
          </div>
          {isAuthenticated ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={scrollToBidCard}
              className="shrink-0 px-6"
            >
              Đặt giá
            </Button>
          ) : (
            <Link
              href={loginRedirectHref}
              className={getButtonClassName({
                variant: "primary",
                size: "lg",
                className: "shrink-0",
              })}
            >
              Đăng nhập để đặt giá
            </Link>
          )}
        </div>
      )}

      {/* Modal báo cáo vi phạm */}
      {isAuthenticated && !isAdmin && !auction.viewerIsSeller && (
        <ReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          productTarget={{ id: auction.productId, title: auction.title }}
          userTarget={{
            id: auction.seller.id,
            fullName: auction.seller.fullName,
            roleLabel: "Người bán",
          }}
        />
      )}
    </div>
  );
}
