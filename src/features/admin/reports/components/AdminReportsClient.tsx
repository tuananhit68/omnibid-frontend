"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AdminReportItem } from "@/lib/api/contract";
import { isApiError } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatDateTime, formatDisplayCode } from "@/lib/format";
import { ReportStatus } from "@/types/enums";
import { FlagIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tabs, TabList, TabTrigger } from "@/components/ui/Tabs";
import { useAdminStatistics } from "../../statistics/hooks";
import { useAdminReports } from "../hooks";
import type { ReportTargetType } from "../types";
import { AdminReportDetailPanel } from "./AdminReportDetailPanel";

const PAGE_SIZE = 20;

const TARGET_TYPE_OPTIONS = [
  { value: "", label: "Tất cả đối tượng" },
  { value: "PRODUCT", label: "Sản phẩm" },
  { value: "USER", label: "Người dùng" },
  { value: "ORDER", label: "Đơn hàng" },
];

function summarizeTargets(item: AdminReportItem): string {
  const parts: string[] = [];
  if (item.targets.product) {
    parts.push(`Sản phẩm ${formatDisplayCode("PRD", item.targets.product.id)}`);
  }
  if (item.targets.user) {
    parts.push(`Người dùng ${item.targets.user.fullName}`);
  }
  if (item.targets.order) {
    parts.push(`Đơn ${formatDisplayCode("ORD", item.targets.order.id)}`);
  }
  return parts.length > 0 ? parts.join(" · ") : "Không xác định";
}

export function AdminReportsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlStatus =
    (searchParams.get("status") as ReportStatus | null) || ReportStatus.PENDING;
  const urlTargetType = (searchParams.get("targetType") ?? "") as
    | ReportTargetType
    | "";
  const urlSelectedId = Number(searchParams.get("id") ?? "0") || null;
  const urlPage = Math.max(0, Number(searchParams.get("page") ?? "0") || 0);

  const { data: stats } = useAdminStatistics(true);
  const pendingCount = stats?.pendingReports ?? 0;

  const updateUrl = (updates: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === "" || (k === "page" && Number(v) === 0)) {
        next.delete(k);
      } else {
        next.set(k, String(v));
      }
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminReports({
      status: urlStatus,
      targetType: urlTargetType || undefined,
      page: urlPage,
      size: PAGE_SIZE,
      sort: "createdAt,desc",
    });

  const reports = useMemo(() => data?.content ?? [], [data?.content]);
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const activeReportId = useMemo(() => {
    if (urlSelectedId && reports.some((r) => r.id === urlSelectedId)) {
      return urlSelectedId;
    }
    if (urlSelectedId) return urlSelectedId;
    return reports[0]?.id ?? null;
  }, [reports, urlSelectedId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1 text-text">Báo cáo vi phạm</h1>
          <p className="mt-1 text-small text-text-secondary">
            {totalElements} báo cáo trong mục hiện tại
            {isFetching && !isLoading ? " · Đang cập nhật..." : ""}
          </p>
        </div>

        <div className="w-full sm:w-56">
          <Select
            aria-label="Lọc theo loại đối tượng"
            value={urlTargetType}
            options={TARGET_TYPE_OPTIONS}
            onChange={(e) =>
              updateUrl({
                targetType: e.target.value,
                id: undefined,
                page: 0,
              })
            }
          />
        </div>
      </div>

      <Tabs
        value={urlStatus}
        onValueChange={(nextStatus) =>
          updateUrl({
            status: nextStatus,
            id: undefined,
            page: 0,
          })
        }
      >
        <TabList>
          <TabTrigger value={ReportStatus.PENDING} badge={pendingCount}>
            Chờ xử lý
          </TabTrigger>
          <TabTrigger value={ReportStatus.RESOLVED}>Đã xử lý</TabTrigger>
          <TabTrigger value={ReportStatus.REJECTED}>Bác bỏ</TabTrigger>
        </TabList>
      </Tabs>

      {isError ? (
        <ErrorState
          message={
            isApiError(error)
              ? error.message
              : "Không tải được danh sách báo cáo vi phạm."
          }
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <div className="hidden lg:block lg:col-span-7">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      ) : reports.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={<FlagIcon className="size-8" />}
            title="Không có báo cáo nào"
            description={
              urlTargetType
                ? "Không tìm thấy báo cáo phù hợp với bộ lọc đối tượng hiện tại."
                : "Hiện không có báo cáo nào trong trạng thái này."
            }
            action={
              urlTargetType ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateUrl({ targetType: undefined, page: 0 })}
                >
                  Xem tất cả đối tượng
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Danh sách báo cáo (trái trên desktop, toàn bộ trên mobile) */}
          <div className="space-y-3 lg:col-span-5">
            {reports.map((item) => {
              const selected = activeReportId === item.id;
              return (
                <div key={item.id}>
                  {/* Desktop: chọn mở panel phải */}
                  <button
                    type="button"
                    onClick={() => updateUrl({ id: item.id })}
                    className={cn(
                      "hidden lg:block w-full rounded-xl border p-4 text-left transition-colors",
                      selected
                        ? "border-primary-600 bg-primary-50/50"
                        : "border-border-brand bg-surface hover:bg-surface-subtle/60"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-small font-semibold text-text tabular">
                        {formatDisplayCode("REP", item.id)}
                      </span>
                      <span className="text-caption text-text-tertiary tabular">
                        {formatDateTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-caption font-medium text-primary-700 truncate">
                      {summarizeTargets(item)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-small text-text-secondary">
                      {item.reason}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2 text-caption text-text-tertiary">
                      <span>Người gửi: {item.reporter.fullName}</span>
                      <StatusBadge statusType="report" value={item.status} />
                    </div>
                  </button>

                  {/* Mobile/Tablet: điều hướng tới /admin/reports/[id] */}
                  <Link
                    href={`/admin/reports/${item.id}`}
                    className="block lg:hidden rounded-xl border border-border-brand bg-surface p-4 transition-colors hover:bg-surface-subtle/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-small font-semibold text-text tabular">
                        {formatDisplayCode("REP", item.id)}
                      </span>
                      <StatusBadge statusType="report" value={item.status} />
                    </div>
                    <p className="mt-1 text-caption font-medium text-primary-700 truncate">
                      {summarizeTargets(item)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-small text-text-secondary">
                      {item.reason}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2 text-caption text-text-tertiary">
                      <span>Người gửi: {item.reporter.fullName}</span>
                      <span className="tabular">{formatDateTime(item.createdAt)}</span>
                    </div>
                  </Link>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="pt-2">
                <Pagination
                  page={urlPage}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={PAGE_SIZE}
                  onPageChange={(nextPage) =>
                    updateUrl({ page: nextPage, id: undefined })
                  }
                />
              </div>
            )}
          </div>

          {/* Panel chi tiết (chỉ hiện trên desktop) */}
          <div className="hidden lg:block lg:col-span-7 sticky top-20">
            {activeReportId !== null ? (
              <AdminReportDetailPanel
                key={activeReportId}
                reportId={activeReportId}
              />
            ) : (
              <Card className="p-8 text-center text-small text-text-tertiary">
                Chọn một báo cáo ở danh sách bên trái để xem chi tiết và xử lý.
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
