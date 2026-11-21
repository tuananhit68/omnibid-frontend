"use client";

import Link from "next/link";
import { isApiError } from "@/lib/api/types";
import { formatMoney, formatNumber } from "@/lib/format";
import {
  AUCTION_STATUS_META,
  AuctionStatus,
  ORDER_STATUS_META,
  OrderStatus,
  type StatusTone,
} from "@/types/enums";
import {
  BoxIcon,
  FlagIcon,
  GavelIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";
import { useAdminStatistics } from "../hooks";

const TONE_BAR_CLASS: Record<StatusTone, string> = {
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-neutral-400",
  tertiary: "bg-tertiary-500",
};

const AUCTION_STATUS_ORDER: AuctionStatus[] = [
  AuctionStatus.SCHEDULED,
  AuctionStatus.ACTIVE,
  AuctionStatus.ENDED,
  AuctionStatus.UNSOLD,
  AuctionStatus.CANCELLED,
];

const ORDER_STATUS_ORDER: OrderStatus[] = [
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.PAID,
  OrderStatus.SHIPPING,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
  OrderStatus.EXPIRED,
];

function DistributionCard({
  title,
  total,
  rows,
}: {
  title: string;
  total: number;
  rows: Array<{
    key: string;
    badge: React.ReactNode;
    count: number;
    tone: StatusTone;
    href: string;
  }>;
}) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <h2 className="text-h3 text-text">{title}</h2>
        <span className="text-small text-text-tertiary tabular">
          Tổng: {formatNumber(total)}
        </span>
      </div>
      <div className="divide-y divide-border-subtle">
        {rows.map((row) => {
          const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
          return (
            <Link
              key={row.key}
              href={row.href}
              className="flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-surface-subtle/60"
            >
              <div className="flex items-center justify-between gap-3">
                <div>{row.badge}</div>
                <div className="flex items-center gap-2 text-small tabular">
                  <span className="font-semibold text-text">
                    {formatNumber(row.count)}
                  </span>
                  <span className="w-10 text-right text-caption text-text-tertiary">
                    {pct}%
                  </span>
                </div>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle"
                aria-hidden="true"
              >
                <div
                  className={cn("h-full rounded-full transition-all", TONE_BAR_CLASS[row.tone])}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

export function AdminDashboardClient() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminStatistics(true);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    const message = isApiError(error)
      ? error.message
      : "Không tải được số liệu thống kê quản trị.";
    return (
      <div className="space-y-6">
        <h1 className="text-h1 text-text">Tổng quan quản trị</h1>
        <ErrorState message={message} onRetry={() => refetch()} />
      </div>
    );
  }

  const totalAuctions = AUCTION_STATUS_ORDER.reduce(
    (sum, status) => sum + (data.auctionsByStatus[status] ?? 0),
    0
  );
  const activeAuctions = data.auctionsByStatus[AuctionStatus.ACTIVE] ?? 0;

  const totalOrders = ORDER_STATUS_ORDER.reduce(
    (sum, status) => sum + (data.ordersByStatus[status] ?? 0),
    0
  );
  const pendingOrders = data.ordersByStatus[OrderStatus.PENDING_PAYMENT] ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1 text-text">Tổng quan quản trị</h1>
          <p className="mt-1 text-small text-text-secondary">
            Số liệu tích lũy đến thời điểm xem
            {isFetching ? " · Đang làm mới..." : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Link href="/admin/users" className="block focus:outline-none">
          <StatCard
            label="Người dùng"
            value={formatNumber(data.totalUsers)}
            icon={<UsersIcon />}
            tone="info"
            subText={`${formatNumber(data.bannedUsers)} bị khóa`}
            className="h-full hover:border-primary-300"
          />
        </Link>

        <Link href="/admin/auctions" className="block focus:outline-none">
          <StatCard
            label="Phiên đấu giá"
            value={formatNumber(totalAuctions)}
            icon={<GavelIcon />}
            tone="info"
            subText={`${formatNumber(activeAuctions)} đang diễn ra`}
            className="h-full hover:border-primary-300"
          />
        </Link>

        <Link href="/admin/orders" className="block focus:outline-none">
          <StatCard
            label="Đơn hàng"
            value={formatNumber(totalOrders)}
            icon={<ShoppingBagIcon />}
            tone="warning"
            subText={`${formatNumber(pendingOrders)} chờ thanh toán`}
            className="h-full hover:border-primary-300"
          />
        </Link>

        <StatCard
          label="Giá trị đơn hoàn tất"
          value={formatMoney(data.completedOrderValue)}
          icon={<BoxIcon />}
          tone="success"
          subText={`${formatNumber(data.ordersByStatus[OrderStatus.COMPLETED] ?? 0)} đơn hoàn tất`}
          className="h-full"
        />

        <Link href="/admin/reports" className="block focus:outline-none">
          <StatCard
            label="Báo cáo chờ xử lý"
            value={formatNumber(data.pendingReports)}
            icon={<FlagIcon />}
            tone={data.pendingReports > 0 ? "warning" : "neutral"}
            highlight={data.pendingReports > 0}
            subText="Xem danh sách báo cáo"
            className="h-full hover:border-primary-300"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DistributionCard
          title="Phân bố phiên đấu giá theo trạng thái"
          total={totalAuctions}
          rows={AUCTION_STATUS_ORDER.map((status) => ({
            key: status,
            badge: <StatusBadge statusType="auction" value={status} />,
            count: data.auctionsByStatus[status] ?? 0,
            tone: AUCTION_STATUS_META[status].tone,
            href: `/admin/auctions?status=${status}`,
          }))}
        />

        <DistributionCard
          title="Phân bố đơn hàng theo trạng thái"
          total={totalOrders}
          rows={ORDER_STATUS_ORDER.map((status) => ({
            key: status,
            badge: <StatusBadge statusType="order" value={status} />,
            count: data.ordersByStatus[status] ?? 0,
            tone: ORDER_STATUS_META[status].tone,
            href: `/admin/orders?status=${status}`,
          }))}
        />
      </div>
    </div>
  );
}
