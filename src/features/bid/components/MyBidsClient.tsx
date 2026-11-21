// TODO fe-v4 my-bids
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import { formatDateTime, formatMoney } from "@/lib/format";
import { getButtonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GavelIcon } from "@/components/icons";
import { useMyBids } from "../hooks";
import type { MyBidItem } from "../types";
import { MyBidMobileCard } from "./MyBidMobileCard";
import {
  MyBidActionLink,
  MyBidCurrentPrice,
  MyBidProductSummary,
  MyBidPositionCell,
} from "./MyBidParts";

const PAGE_SIZE = 10;

export function MyBidsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 0 : pageParam - 1;

  const { data, isLoading, isError, error, refetch } = useMyBids({
    page,
    size: PAGE_SIZE,
  });

  const bids = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const columns: Column<MyBidItem>[] = useMemo(
    () => [
      {
        key: "product",
        header: "Sản phẩm & phiên",
        render: (row) => <MyBidProductSummary row={row} />,
      },
      {
        key: "amount",
        header: "Mức giá đã đặt",
        align: "right",
        render: (row) => (
          <span className="font-semibold text-text tabular">
            {formatMoney(row.amount)}
          </span>
        ),
      },
      {
        key: "currentPrice",
        header: "Giá hiện tại",
        align: "right",
        render: (row) => <MyBidCurrentPrice row={row} />,
      },
      {
        key: "auctionStatus",
        header: "Trạng thái phiên",
        render: (row) => (
          <StatusBadge statusType="auction" value={row.auctionStatus} />
        ),
      },
      {
        key: "position",
        header: "Vị thế",
        render: (row) => <MyBidPositionCell row={row} />,
      },
      {
        key: "createdAt",
        header: "Thời điểm đặt",
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
        render: (row) => <MyBidActionLink row={row} />,
      },
    ],
    []
  );

  const errorMessage = isError
    ? isApiError(error)
      ? error.message
      : "Không tải được danh sách lượt đặt giá."
    : undefined;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-h1 text-text">Lượt đặt giá của tôi</h1>
        <p className="text-small text-text-secondary">
          Theo dõi các lượt đặt giá bạn đã tham gia và chuyển nhanh đến đơn hàng khi thắng phiên.
        </p>
      </div>

      {errorMessage ? (
        <ErrorState message={errorMessage} onRetry={() => refetch()} />
      ) : !isLoading && bids.length === 0 ? (
        <EmptyState
          icon={<GavelIcon />}
          title="Bạn chưa đặt giá phiên nào"
          description="Khám phá các phiên đấu giá đang diễn ra để bắt đầu tham gia."
          action={
            <Link
              href="/auctions"
              className={getButtonClassName({ variant: "primary", size: "md" })}
            >
              Khám phá phiên đấu giá
            </Link>
          }
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={bids}
              keyExtractor={(row) => row.id}
              loading={isLoading}
              className="rounded-none border-0"
            />
          </div>
          <div className="md:hidden">
            {bids.map((row) => (
              <MyBidMobileCard key={row.id} row={row} />
            ))}
          </div>
          {!isLoading && totalElements > 0 && (
            <div className="border-t border-border-subtle px-4 md:px-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={(nextPage) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (nextPage > 0) params.set("page", String(nextPage + 1));
                  else params.delete("page");
                  const qs = params.toString();
                  router.replace(qs ? `${pathname}?${qs}` : pathname, {
                    scroll: false,
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
