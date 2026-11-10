"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  formatDateTime,
  formatDisplayCode,
  formatMoney,
  maskName,
  parseBackendDateTime,
} from "@/lib/format";
import { ApiError, getStoredUser } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { useWsConnectionStatus } from "@/lib/ws";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tabs, TabList, TabTrigger, TabContent } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import {
  AlertCircleIcon,
  FileTextIcon,
  FlagIcon,
  HeartIcon,
  HistoryIcon,
} from "@/components/icons";
import {
  AuctionStatus,
  PRODUCT_CONDITION_LABEL,
  type ProductCondition,
} from "@/types/enums";
import {
  useAuctionBids,
  useAuctionDetail,
  useAuctionRealtime,
  useToggleWatchlist,
} from "../hooks";
import type { AuctionDetail, BidItem } from "../types";
import { ImageGallery } from "./ImageGallery";
import { PricePanel } from "./PricePanel";
import { BidHistoryTable } from "./BidHistoryTable";
import { SellerSummaryCard } from "./SellerSummaryCard";

export interface AuctionDetailClientProps {
  auctionId: number;
  initialAuction?: AuctionDetail | null;
  initialBids?: BidItem[];
}

interface ParsedDescription {
  specs: { label: string; value: string }[];
  notes: string[];
}

function parseProductDescription(raw?: string): ParsedDescription {
  if (!raw || !raw.trim()) {
    return { specs: [], notes: [] };
  }
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const specs: { label: string; value: string }[] = [];
  const notes: string[] = [];

  for (const line of lines) {
    const match = line.match(/^([^:]{2,50}):\s+(.+)$/);
    if (match) {
      specs.push({ label: match[1].trim(), value: match[2].trim() });
    } else {
      notes.push(line);
    }
  }

  // Chỉ tách bảng khi có từ 2 dòng "Nhãn: Giá trị" trở lên (theo gaps.md G4)
  if (specs.length < 2) {
    return { specs: [], notes: [raw.trim()] };
  }

  return { specs, notes };
}

export function AuctionDetailClient({
  auctionId,
  initialAuction,
  initialBids,
}: AuctionDetailClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [priceFlash, setPriceFlash] = useState(false);
  const [serverOffsetMs, setServerOffsetMs] = useState(0);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expireRefetchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { reconnecting } = useWsConnectionStatus();

  const {
    data: auction,
    isLoading: detailLoading,
    isError: detailError,
    error: detailErrObj,
    refetch: refetchDetail,
  } = useAuctionDetail(auctionId, initialAuction);

  const {
    data: bids = [],
    isLoading: bidsLoading,
    isError: bidsError,
    error: bidsErrObj,
    refetch: refetchBids,
  } = useAuctionBids(auctionId, 5, initialBids);

  const triggerPriceFlash = () => {
    setPriceFlash(false);
    setTimeout(() => setPriceFlash(true), 10);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setPriceFlash(false), 650);
  };

  useAuctionRealtime(auctionId, triggerPriceFlash);

  useEffect(() => {
    if (!auction?.serverTime) return;
    const serverTimeStr = auction.serverTime;
    const timer = setTimeout(() => {
      const serverMs = parseBackendDateTime(serverTimeStr)?.valueOf();
      if (serverMs) {
        setServerOffsetMs(serverMs - Date.now());
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [auction?.serverTime]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      if (expireRefetchRef.current) clearTimeout(expireRefetchRef.current);
    };
  }, []);

  const toggleWatchMutation = useToggleWatchlist();

  const handleCountdownExpire = () => {
    if (expireRefetchRef.current) clearTimeout(expireRefetchRef.current);
    expireRefetchRef.current = setTimeout(() => {
      refetchDetail();
      refetchBids();
    }, 10000);
  };

  const handleGuestActionRedirect = () => {
    router.push(`/login?redirect=${encodeURIComponent(`/auctions/${auctionId}`)}`);
  };

  const handleReportClick = () => {
    const user = getStoredUser();
    if (!user) {
      handleGuestActionRedirect();
      return;
    }
    toast.info("Tính năng gửi báo cáo vi phạm sẽ sẵn sàng ở màn hình S13.");
  };

  const handleToggleWatch = () => {
    if (!auction) return;
    const user = getStoredUser();
    if (!user) {
      handleGuestActionRedirect();
      return;
    }
    toggleWatchMutation.mutate(
      { auctionId: auction.id, currentlyWatched: Boolean(auction.isWatched) },
      {
        onSuccess: (res) => {
          toast.success(
            res.watched
              ? "Đã thêm phiên vào danh sách theo dõi."
              : "Đã bỏ theo dõi phiên đấu giá."
          );
        },
        onError: (err) => {
          const msg =
            err instanceof ApiError
              ? err.message
              : getErrorMessage("INTERNAL_ERROR");
          toast.error(msg);
        },
      }
    );
  };

  const parsedDesc = useMemo(
    () => parseProductDescription(auction?.productDescription),
    [auction?.productDescription]
  );

  if (detailLoading && !auction) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-6 w-2/3" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="aspect-4/3 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-128 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (detailError || !auction) {
    const errMsg =
      detailErrObj instanceof ApiError
        ? detailErrObj.message
        : getErrorMessage("INTERNAL_ERROR");
    return (
      <Card className="p-10 text-center space-y-4">
        <div className="size-12 rounded-full bg-danger-bg text-danger flex items-center justify-center mx-auto">
          <AlertCircleIcon className="size-6" />
        </div>
        <h1 className="text-h2 font-semibold text-text">
          Không thể tải thông tin phiên đấu giá
        </h1>
        <p className="text-body text-text-secondary">{errMsg}</p>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="primary" size="lg" onClick={() => refetchDetail()}>
            Thử lại
          </Button>
          <Link href="/auctions">
            <Button variant="outline" size="lg">
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const conditionLabel = auction.productCondition
    ? PRODUCT_CONDITION_LABEL[auction.productCondition as ProductCondition] ||
      auction.productCondition
    : null;

  const isWatched = Boolean(auction.isWatched);
  const canBidPhase =
    auction.status === AuctionStatus.ACTIVE ||
    auction.status === AuctionStatus.SCHEDULED;

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Phiên đấu giá", href: "/auctions" },
    ...(auction.categoryName
      ? [
          {
            label: auction.categoryName,
            href: auction.categoryId
              ? `/auctions?categoryIds=${auction.categoryId}`
              : "/auctions",
          },
        ]
      : []),
    { label: auction.productTitle },
  ];

  const bidsErrMsg =
    bidsErrObj instanceof ApiError
      ? bidsErrObj.message
      : bidsError
      ? getErrorMessage("INTERNAL_ERROR")
      : undefined;

  return (
    <div className="space-y-6">
      {/* Banner mất kết nối WebSocket quá 3s */}
      {reconnecting && (
        <div
          role="status"
          className="bg-warning-subtle-bg border border-warning-border text-warning-strong rounded-xl px-4 py-2.5 text-small font-medium"
        >
          Đang kết nối lại máy chủ thời gian thực…
        </div>
      )}

      {/* 1. Thanh Breadcrumb & Báo cáo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-brand">
        <div className="min-w-0 flex-1 overflow-hidden">
          <Breadcrumb
            items={breadcrumbItems}
            className="[&_ol]:flex-nowrap [&_li:last-child]:min-w-0 [&_li:last-child>span]:truncate [&_li:last-child>span]:block"
          />
        </div>
        <Button
          variant="tertiary"
          size="md"
          leftIcon={<FlagIcon className="size-4" />}
          onClick={handleReportClick}
          className="self-start sm:self-auto shrink-0"
        >
          Báo cáo phiên này
        </Button>
      </div>

      {/* 2. Lưới 2 cột 8/4 (trái Gallery + Seller, phải Giá + CTA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột trái */}
        <div className="lg:col-span-7 space-y-4">
          <ImageGallery
            images={auction.images}
            primaryImageUrl={auction.primaryImageUrl}
            productTitle={auction.productTitle}
            auctionId={auction.id}
            status={auction.status}
          />

          {/* Dòng meta mã phiên dưới ảnh (theo G3: bỏ chip kiểm duyệt) */}
          <div className="flex items-center justify-between px-1 text-small text-text-tertiary">
            <span>
              Mã phiên:{" "}
              <strong className="text-text font-semibold tabular">
                {formatDisplayCode("AUC", auction.id)}
              </strong>
            </span>
          </div>

          <SellerSummaryCard sellerName={auction.sellerName} />
        </div>

        {/* Cột phải */}
        <div className="lg:col-span-5">
          <Card className="space-y-5">
            {/* Chips danh mục & tình trạng (G3) + Tên sản phẩm */}
            <div className="space-y-3">
              {(auction.categoryName || conditionLabel) && (
                <div className="flex flex-wrap items-center gap-2">
                  {auction.categoryName && (
                    <StatusBadge
                      label={auction.categoryName}
                      tone="info"
                      withDot={false}
                    />
                  )}
                  {conditionLabel && (
                    <StatusBadge
                      label={`Tình trạng: ${conditionLabel}`}
                      tone="success"
                      withDot={false}
                    />
                  )}
                </div>
              )}

              <h1 className="text-h2 font-semibold text-text">
                {auction.productTitle}
              </h1>
            </div>

            {/* Khối thời gian / trạng thái phiên */}
            {auction.status === AuctionStatus.ACTIVE ? (
              <CountdownTimer
                endTime={auction.endTime}
                serverOffsetMs={serverOffsetMs}
                onExpire={handleCountdownExpire}
              />
            ) : auction.status === AuctionStatus.SCHEDULED ? (
              <div className="bg-info-bg border border-info-border rounded-xl p-4 space-y-1">
                <span className="label text-info block">Phiên sắp diễn ra</span>
                <p className="text-body font-semibold text-text tabular">
                  Bắt đầu vào {formatDateTime(auction.startTime)} (GMT+7)
                </p>
              </div>
            ) : auction.status === AuctionStatus.CANCELLED ? (
              <div className="bg-danger-bg border border-danger-border rounded-xl p-4 space-y-1">
                <span className="label text-danger-strong block">
                  Phiên đã bị huỷ
                </span>
                <p className="text-small text-text">
                  {auction.cancelReason ||
                    "Phiên đấu giá đã bị huỷ và không tiếp nhận đặt giá."}
                </p>
              </div>
            ) : (
              <div className="bg-surface-subtle border border-border-brand rounded-xl p-4 space-y-1">
                <span className="label block">Phiên đã kết thúc</span>
                {auction.status === AuctionStatus.ENDED &&
                auction.highestBidderName ? (
                  <p className="text-small text-text">
                    Người thắng:{" "}
                    <strong className="font-semibold tabular">
                      {maskName(auction.highestBidderName)}
                    </strong>{" "}
                    · Giá cuối:{" "}
                    <strong className="font-bold text-primary-700 tabular">
                      {formatMoney(auction.finalPrice ?? auction.currentPrice)}
                    </strong>
                  </p>
                ) : (
                  <p className="text-small text-text-secondary">
                    Phiên kết thúc không có người thắng cuộc.
                  </p>
                )}
              </div>
            )}

            {/* Khối giá */}
            <PricePanel auction={auction} priceFlash={priceFlash} />

            {/* Các nút CTA khách */}
            <div className="space-y-2.5 pt-1">
              {canBidPhase && (
                <Link
                  href={`/login?redirect=${encodeURIComponent(
                    `/auctions/${auction.id}`
                  )}`}
                  className="block w-full"
                >
                  <Button variant="primary" size="xl" className="w-full">
                    Đăng nhập để đặt giá
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                size="lg"
                aria-pressed={isWatched}
                loading={toggleWatchMutation.isPending}
                onClick={handleToggleWatch}
                leftIcon={
                  <HeartIcon
                    filled={isWatched}
                    className={cn(
                      "size-4",
                      isWatched ? "text-danger" : "text-text-tertiary"
                    )}
                  />
                }
                className={cn(
                  "w-full",
                  isWatched &&
                    "border-danger-border bg-danger-bg/40 text-danger"
                )}
              >
                {isWatched ? "Đang theo dõi phiên này" : "Theo dõi phiên này"}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Card Tabs dưới cùng: Mô tả sản phẩm & Lịch sử đặt giá */}
      <Card>
        <Tabs defaultValue="description">
          <TabList variant="underline">
            <TabTrigger value="description">
              <span className="inline-flex items-center gap-2">
                <FileTextIcon className="size-4" />
                <span>Mô tả sản phẩm</span>
              </span>
            </TabTrigger>
            <TabTrigger value="history" badge={auction.bidCount}>
              <span className="inline-flex items-center gap-2">
                <HistoryIcon className="size-4" />
                <span>Lịch sử đặt giá</span>
              </span>
            </TabTrigger>
          </TabList>

          <TabContent value="description" className="pt-6 space-y-6">
            {parsedDesc.specs.length === 0 && parsedDesc.notes.length === 0 ? (
              <p className="text-body text-text-tertiary">
                Người bán chưa cung cấp mô tả chi tiết cho sản phẩm này.
              </p>
            ) : (
              <>
                {parsedDesc.specs.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-h3 font-semibold text-text">
                      Thông số kỹ thuật chi tiết
                    </h2>
                    <div className="border border-border-brand rounded-lg overflow-hidden divide-y divide-border-subtle">
                      {parsedDesc.specs.map((item, idx) => (
                        <div
                          key={`${item.label}-${idx}`}
                          className={cn(
                            "grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 px-4 py-3 text-small",
                            idx % 2 === 0 ? "bg-surface-subtle/60" : "bg-surface"
                          )}
                        >
                          <div className="font-medium text-text-secondary">
                            {item.label}
                          </div>
                          <div className="sm:col-span-2 text-text font-medium">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {parsedDesc.notes.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-h3 font-semibold text-text">
                      Mô tả chi tiết
                    </h2>
                    <div className="text-body text-text-secondary whitespace-pre-line">
                      {parsedDesc.notes.join("\n")}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabContent>

          <TabContent value="history" className="pt-6">
            <BidHistoryTable
              bids={bids}
              loading={bidsLoading && bids.length === 0}
              error={bidsErrMsg}
              onRetry={() => refetchBids()}
            />
          </TabContent>
        </Tabs>
      </Card>
    </div>
  );
}
