// TODO fe-v4 auction-detail
"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth/session";
import { isApiError } from "@/lib/api/types";
import { formatDisplayCode, formatMoney } from "@/lib/format";
import { AuctionStatus, PRODUCT_CONDITION_LABEL } from "@/types/enums";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FlagIcon } from "@/components/icons";
import {
  useAuctionBids,
  useAuctionDetail,
  useAuctionRealtime,
} from "../hooks";
import type { AuctionDetail, BidHistoryItem, Page } from "../types";
import { BidForm } from "./BidForm";
import { BidHistoryTable } from "./BidHistoryTable";
import { ImageGallery } from "./ImageGallery";
import { PricePanel } from "./PricePanel";
import { ReportViolationModal } from "./ReportViolationModal";

export interface AuctionDetailClientProps {
  auctionId: number;
  initialAuction?: AuctionDetail | null;
  initialBids?: Page<BidHistoryItem> | null;
}

export function AuctionDetailClient({
  auctionId,
  initialAuction,
  initialBids,
}: AuctionDetailClientProps) {
  const { isAuthenticated, isAdmin } = useSession();
  const [flash, setFlash] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const { data: detailWrap, isLoading, isError, error, refetch } =
    useAuctionDetail(auctionId, initialAuction);
  const { data: bidsPage, isLoading: bidsLoading } = useAuctionBids(
    auctionId,
    0,
    10,
    initialBids
  );

  const triggerFlash = useCallback(() => {
    setFlash(true);
    window.setTimeout(() => setFlash(false), 650);
  }, []);

  const { showReconnectingBanner } = useAuctionRealtime(auctionId, triggerFlash);

  if (isLoading && !detailWrap) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-96 rounded-xl lg:col-span-7" />
        <Skeleton className="h-96 rounded-xl lg:col-span-5" />
      </div>
    );
  }

  if (isError || !detailWrap) {
    return (
      <ErrorState
        message={isApiError(error) ? error.message : "Không tìm thấy phiên đấu giá."}
        onRetry={() => refetch()}
      />
    );
  }

  const auction = detailWrap.data;
  const serverOffsetMs = detailWrap.serverOffsetMs;
  const canPlaceBid =
    auction.status === AuctionStatus.ACTIVE &&
    isAuthenticated &&
    !isAdmin &&
    !auction.viewerIsSeller;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Phiên đấu giá", href: "/auctions" },
          { label: formatDisplayCode("AUC", auction.id) },
        ]}
      />

      {showReconnectingBanner && (
        <div
          role="status"
          className="rounded-xl border border-warning-border bg-warning-bg px-4 py-2.5 text-small text-warning-strong"
        >
          Đang kết nối lại kênh cập nhật giá trực tiếp…
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <ImageGallery images={auction.images} title={auction.title} />

          <Card className="space-y-3">
            <h2 className="text-h3 text-text">Mô tả sản phẩm</h2>
            <p className="text-small text-text-secondary">
              Tình trạng:{" "}
              <strong className="text-text">
                {PRODUCT_CONDITION_LABEL[auction.condition]}
              </strong>{" "}
              · Danh mục: <strong className="text-text">{auction.categoryName}</strong>
            </p>
            <p className="text-body text-text whitespace-pre-line">
              {auction.description}
            </p>
            <p className="text-small text-text-secondary pt-2 border-t border-border-subtle">
              Người bán: <strong className="text-text">{auction.seller.fullName}</strong>
            </p>
          </Card>

          <Card className="space-y-3">
            <h2 className="text-h3 text-text">Lịch sử đặt giá</h2>
            <BidHistoryTable
              bids={bidsPage?.content ?? []}
              loading={bidsLoading}
            />
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge statusType="auction" value={auction.status} />
              <span className="text-caption text-text-tertiary tabular">
                {formatDisplayCode("AUC", auction.id)}
              </span>
            </div>
            <h1 className="text-h1 text-text">{auction.title}</h1>
          </div>

          {auction.status === AuctionStatus.ACTIVE && (
            <CountdownTimer
              endTime={auction.endTime}
              serverOffsetMs={serverOffsetMs}
              onExpire={() => {
                window.setTimeout(() => refetch(), 15_000);
              }}
            />
          )}

          <Card className="space-y-4">
            <PricePanel
              currentPrice={auction.currentPrice}
              startPrice={auction.startPrice}
              minNextBid={auction.minNextBid}
              bidIncrement={auction.bidIncrement}
              bidCount={auction.bidCount}
              highestBidderName={auction.highestBidderName}
              reserveStatus={auction.reserveStatus}
              reservePrice={auction.reservePrice}
              flash={flash}
            />

            {auction.status === AuctionStatus.ACTIVE && (
              <>
                {canPlaceBid ? (
                  <BidForm
                    auctionId={auction.id}
                    minNextBid={auction.minNextBid}
                    bidIncrement={auction.bidIncrement}
                  />
                ) : !isAuthenticated ? (
                  <div className="border-t border-border-subtle pt-4">
                    <Link
                      href={`/login?redirect=${encodeURIComponent(`/auctions/${auction.id}`)}`}
                      className={getButtonClassName({
                        variant: "primary",
                        size: "lg",
                        className: "w-full",
                      })}
                    >
                      Đăng nhập để đặt giá
                    </Link>
                  </div>
                ) : auction.viewerIsSeller ? (
                  <p className="border-t border-border-subtle pt-3 text-small text-text-secondary">
                    Bạn là chủ phiên đấu giá này.
                  </p>
                ) : null}
              </>
            )}

            {auction.status === AuctionStatus.ENDED && (
              <div className="border-t border-border-subtle pt-3 space-y-2 text-small">
                <p className="text-text">
                  Người thắng: <strong>{auction.winnerName ?? "—"}</strong> · Giá cuối:{" "}
                  <strong className="text-primary-700 tabular">
                    {formatMoney(auction.finalPrice ?? auction.currentPrice)}
                  </strong>
                </p>
                {auction.orderId && (
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
            )}

            {auction.status === AuctionStatus.CANCELLED && auction.cancelReason && (
              <p className="border-t border-border-subtle pt-3 text-small text-danger">
                Lý do hủy: {auction.cancelReason}
              </p>
            )}
          </Card>

          {isAuthenticated && !isAdmin && !auction.viewerIsSeller && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<FlagIcon className="size-4" />}
              onClick={() => setReportOpen(true)}
            >
              Báo cáo vi phạm
            </Button>
          )}
        </div>
      </div>

      <ReportViolationModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        reportedProductId={auction.productId}
        targetTitle={auction.title}
      />
    </div>
  );
}
