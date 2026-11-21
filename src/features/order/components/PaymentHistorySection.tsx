"use client";

import { useMemo, useState } from "react";
import { isApiError } from "@/lib/api/types";
import { formatDateTime, formatMoney } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useOrderPayments } from "../hooks";
import type { PaymentHistoryItem } from "../types";

const PAGE_SIZE = 10;

export function PaymentHistorySection({ orderId }: { orderId: number }) {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, error, refetch } = useOrderPayments(
    orderId,
    { page, size: PAGE_SIZE, sort: "createdAt,desc" },
    true
  );

  const items = useMemo(() => data?.content ?? [], [data?.content]);
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const columns: Column<PaymentHistoryItem>[] = useMemo(
    () => [
      {
        key: "attemptNo",
        header: "Lần",
        render: (row) => (
          <span className="font-semibold text-text tabular">#{row.attemptNo}</span>
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
        header: "Lý do",
        render: (row) => (
          <span className="text-small text-text-secondary">
            {row.failureReason ?? "—"}
          </span>
        ),
      },
    ],
    []
  );

  const errorMessage = isError
    ? isApiError(error)
      ? error.message
      : "Không tải được lịch sử thanh toán."
    : undefined;

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle">
        <h2 className="text-h3 text-text">Lịch sử thanh toán</h2>
      </div>

      {errorMessage ? (
        <div className="p-5">
          <ErrorState message={errorMessage} onRetry={() => refetch()} />
        </div>
      ) : !isLoading && items.length === 0 ? (
        <div className="px-5 py-8 text-center text-small text-text-tertiary">
          Chưa có lần thanh toán nào cho đơn hàng này.
        </div>
      ) : (
        <>
          <div className="hidden sm:block">
            <DataTable
              columns={columns}
              data={items}
              keyExtractor={(row) => row.id}
              loading={isLoading}
              className="rounded-none border-0"
            />
          </div>

          <div className="sm:hidden divide-y divide-border-subtle">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))
              : items.map((row) => (
                  <div key={row.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-small font-semibold text-text tabular">
                        Lần #{row.attemptNo} · {formatMoney(row.amount)}
                      </span>
                      <StatusBadge statusType="payment" value={row.status} />
                    </div>
                    <p className="text-caption text-text-tertiary tabular">
                      {formatDateTime(row.createdAt)}
                    </p>
                    {row.failureReason && (
                      <p className="text-caption text-danger">
                        Lý do: {row.failureReason}
                      </p>
                    )}
                  </div>
                ))}
          </div>

          {!isLoading && totalPages > 1 && (
            <div className="border-t border-border-subtle px-4 md:px-5">
              <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
