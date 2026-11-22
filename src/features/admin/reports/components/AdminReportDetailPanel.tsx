"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isApiError } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatDateTime, formatDisplayCode, formatNumber } from "@/lib/format";
import {
  AuctionStatus,
  ProductStatus,
  ReportStatus,
  USER_ROLE_LABEL,
  UserRole,
  UserStatus,
} from "@/types/enums";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import {
  BanUserDialog,
  CancelAuctionDialog,
  HideProductDialog,
  type BanUserTarget,
  type CancelAuctionTarget,
  type HideProductTarget,
} from "../../shared/AdminActionDialogs";
import { useAdminReportDetail, useResolveAdminReport } from "../hooks";
import { resolveReportSchema, type ResolveReportFormValues } from "../schemas";

export function AdminReportDetailPanel({
  reportId,
  onResolved,
}: {
  reportId: number;
  onResolved?: () => void;
}) {
  const toast = useToast();
  const { data: report, isLoading, isError, error, refetch } =
    useAdminReportDetail(reportId, true);
  const resolveMutation = useResolveAdminReport();

  const [pendingValues, setPendingValues] =
    useState<ResolveReportFormValues | null>(null);
  const [hideTarget, setHideTarget] = useState<HideProductTarget | null>(null);
  const [cancelAuctionTarget, setCancelAuctionTarget] =
    useState<CancelAuctionTarget | null>(null);
  const [banUserTarget, setBanUserTarget] = useState<BanUserTarget | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<ResolveReportFormValues>({
    resolver: zodResolver(resolveReportSchema),
    defaultValues: {
      decision: "RESOLVED",
      note: "",
    },
  });

  const decision = useWatch({ control, name: "decision" });

  if (isLoading) {
    return (
      <Card className="p-5 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </Card>
    );
  }

  if (isError || !report) {
    const message = isApiError(error)
      ? error.message
      : "Không tải được chi tiết báo cáo vi phạm.";
    return (
      <Card className="p-5">
        <ErrorState message={message} onRetry={() => refetch()} />
      </Card>
    );
  }

  const { targets } = report;
  const canHideProduct =
    Boolean(targets.product) &&
    targets.product?.status !== ProductStatus.HIDDEN;
  const canCancelAuction =
    Boolean(targets.product?.activeAuction) &&
    (targets.product?.activeAuction?.status === AuctionStatus.SCHEDULED ||
      targets.product?.activeAuction?.status === AuctionStatus.ACTIVE);
  const canBanUser =
    Boolean(targets.user) &&
    targets.user?.role === UserRole.USER &&
    targets.user?.status === UserStatus.ACTIVE;

  const hasAdminActions = canHideProduct || canCancelAuction || canBanUser;

  const handleConfirmResolve = () => {
    if (!pendingValues) return;
    resolveMutation.mutate(
      {
        reportId: report.id,
        decision: pendingValues.decision,
        note: pendingValues.note.trim(),
      },
      {
        onSuccess: () => {
          toast.success(
            pendingValues.decision === "RESOLVED"
              ? `Đã đánh dấu xử lý báo cáo ${formatDisplayCode("REP", report.id)}.`
              : `Đã bác bỏ báo cáo ${formatDisplayCode("REP", report.id)}.`
          );
          setPendingValues(null);
          reset({ decision: "RESOLVED", note: "" });
          onResolved?.();
        },
        onError: (err) => {
          setPendingValues(null);
          if (isApiError(err) && err.fieldErrors) {
            if (err.fieldErrors.note) {
              setError("note", { message: err.fieldErrors.note });
            }
            if (err.fieldErrors.decision) {
              setError("decision", { message: err.fieldErrors.decision });
            }
            return;
          }
          toast.error(
            isApiError(err) ? err.message : "Không thể xử lý báo cáo."
          );
        },
      }
    );
  };

  return (
    <Card className="p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-h3 font-bold text-text tabular">
              {formatDisplayCode("REP", report.id)}
            </span>
            <StatusBadge statusType="report" value={report.status} />
          </div>
          <p className="text-caption text-text-tertiary">
            Người gửi:{" "}
            <span className="font-medium text-text-secondary">
              {report.reporter.fullName}
            </span>{" "}
            · {formatDateTime(report.createdAt)}
          </p>
        </div>
      </div>

      {/* Đối tượng báo cáo */}
      <div className="space-y-3">
        <h3 className="text-label font-medium text-text-tertiary">
          Đối tượng bị báo cáo
        </h3>

        {targets.product && (
          <div className="rounded-lg border border-border-brand bg-surface-subtle/50 p-3.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-caption font-semibold text-text-tertiary tabular">
                  Sản phẩm {formatDisplayCode("PRD", targets.product.id)}
                </span>
                <StatusBadge statusType="product" value={targets.product.status} />
              </div>
              <Link
                href={`/admin/products/${targets.product.id}`}
                className="text-caption font-medium text-text-link hover:underline"
              >
                Mở trang sản phẩm
              </Link>
            </div>
            <p className="text-small font-medium text-text">
              {targets.product.title}
            </p>
            {targets.product.activeAuction && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-2 text-caption">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-text-secondary">
                    Phiên đang mở:{" "}
                    <strong className="font-semibold text-text tabular">
                      {formatDisplayCode("AUC", targets.product.activeAuction.id)}
                    </strong>
                  </span>
                  <StatusBadge
                    statusType="auction"
                    value={targets.product.activeAuction.status}
                  />
                  <span className="text-text-tertiary tabular">
                    {formatNumber(targets.product.activeAuction.bidCount)} lượt đặt
                    giá
                  </span>
                </div>
                <Link
                  href={`/admin/auctions/${targets.product.activeAuction.id}`}
                  className="font-medium text-text-link hover:underline"
                >
                  Xem phiên
                </Link>
              </div>
            )}
          </div>
        )}

        {targets.user && (
          <div className="rounded-lg border border-border-brand bg-surface-subtle/50 p-3.5 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-caption font-semibold text-text-tertiary tabular">
                  Người dùng {formatDisplayCode("USR", targets.user.id)}
                </span>
                <StatusBadge statusType="user" value={targets.user.status} />
              </div>
              <Link
                href={`/admin/users?keyword=${encodeURIComponent(targets.user.email)}`}
                className="text-caption font-medium text-text-link hover:underline"
              >
                Mở trang người dùng
              </Link>
            </div>
            <p className="text-small font-medium text-text">
              {targets.user.fullName}{" "}
              <span className="font-normal text-text-secondary">
                ({USER_ROLE_LABEL[targets.user.role]})
              </span>
            </p>
            <p className="text-caption text-text-secondary">{targets.user.email}</p>
          </div>
        )}

        {targets.order && (
          <div className="rounded-lg border border-border-brand bg-surface-subtle/50 p-3.5 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-caption font-semibold text-text-tertiary tabular">
                  Đơn hàng {formatDisplayCode("ORD", targets.order.id)}
                </span>
                <StatusBadge statusType="order" value={targets.order.status} />
              </div>
              <Link
                href={`/admin/orders/${targets.order.id}`}
                className="text-caption font-medium text-text-link hover:underline"
              >
                Mở trang đơn hàng
              </Link>
            </div>
            <p className="text-caption text-text-secondary tabular">
              Người mua: {formatDisplayCode("USR", targets.order.buyerId)} · Người
              bán: {formatDisplayCode("USR", targets.order.sellerId)} · Phiên:{" "}
              {formatDisplayCode("AUC", targets.order.auctionId)}
            </p>
          </div>
        )}
      </div>

      {/* Lý do chi tiết */}
      <div className="space-y-1.5">
        <h3 className="text-label font-medium text-text-tertiary">
          Nội dung báo cáo
        </h3>
        <p className="whitespace-pre-line rounded-lg bg-surface-subtle p-3.5 text-body text-text">
          {report.reason}
        </p>
      </div>

      {/* Thao tác quản trị riêng (tiện ích) */}
      {hasAdminActions && (
        <div className="space-y-2.5 border-t border-border-subtle pt-4">
          <div>
            <h3 className="text-label font-semibold text-text">
              Thao tác quản trị riêng
            </h3>
            <p className="text-caption text-text-tertiary">
              Các thao tác dưới đây thực hiện trực tiếp lên đối tượng và không tự
              động đóng báo cáo này.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canHideProduct && targets.product && (
              <Button
                variant="danger-soft"
                size="sm"
                onClick={() =>
                  setHideTarget({
                    id: targets.product!.id,
                    title: targets.product!.title,
                  })
                }
              >
                Ẩn sản phẩm
              </Button>
            )}
            {canCancelAuction && targets.product?.activeAuction && (
              <Button
                variant="danger-soft"
                size="sm"
                onClick={() =>
                  setCancelAuctionTarget({
                    id: targets.product!.activeAuction!.id,
                    title: targets.product!.title,
                    bidCount: targets.product!.activeAuction!.bidCount,
                  })
                }
              >
                Hủy phiên
              </Button>
            )}
            {canBanUser && targets.user && (
              <Button
                variant="danger-soft"
                size="sm"
                onClick={() =>
                  setBanUserTarget({
                    id: targets.user!.id,
                    fullName: targets.user!.fullName,
                    email: targets.user!.email,
                  })
                }
              >
                Khóa người dùng
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Kết quả xử lý hoặc Form xử lý */}
      {report.status === ReportStatus.PENDING ? (
        <form
          onSubmit={handleSubmit((values) => setPendingValues(values))}
          className="space-y-4 border-t border-border-subtle pt-4"
          noValidate
        >
          <h3 className="text-h3 text-text">Kết luận xử lý báo cáo</h3>

          <div>
            <span className="mb-2 block text-label font-medium text-text">
              Kết luận *
            </span>
            <div
              className="grid grid-cols-2 gap-2.5"
              role="radiogroup"
              aria-label="Chọn kết luận báo cáo"
            >
              {[
                { value: "RESOLVED" as const, label: "Đã xử lý" },
                { value: "REJECTED" as const, label: "Bác bỏ" },
              ].map((opt) => {
                const active = decision === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setValue("decision", opt.value)}
                    className={cn(
                      "flex h-11 items-center justify-center rounded-lg border text-small font-medium transition-colors",
                      active
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-border-brand bg-surface text-text-secondary hover:bg-surface-subtle"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {errors.decision?.message && (
              <p className="mt-1 text-caption text-danger">
                {errors.decision.message}
              </p>
            )}
          </div>

          <Textarea
            label="Ghi chú xử lý *"
            placeholder="Nhập kết quả xác minh hoặc lý do kết luận..."
            rows={4}
            error={errors.note?.message}
            {...register("note")}
          />

          <p className="text-caption text-text-tertiary">
            Người gửi nhận thông báo ở cả hai kết luận.
          </p>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={resolveMutation.isPending}
            >
              Hoàn tất xử lý
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-2 border-t border-border-subtle pt-4">
          <h3 className="text-label font-semibold text-text">
            Thông tin xử lý
          </h3>
          <p className="whitespace-pre-line rounded-lg bg-surface-subtle p-3.5 text-body text-text">
            {report.adminNote ?? "Không có ghi chú."}
          </p>
          <p className="text-caption text-text-tertiary">
            Người xử lý:{" "}
            <span className="font-medium text-text-secondary">
              {report.resolvedBy?.fullName ?? "Quản trị viên"}
            </span>
            {report.resolvedAt ? ` · ${formatDateTime(report.resolvedAt)}` : ""}
          </p>
        </div>
      )}

      {/* Dialog xác nhận kết luận báo cáo */}
      <ConfirmDialog
        open={pendingValues !== null}
        onClose={() => setPendingValues(null)}
        title={`Xác nhận xử lý ${formatDisplayCode("REP", report.id)}`}
        description={
          pendingValues ? (
            <div className="space-y-2">
              <p>
                Kết luận:{" "}
                <strong className="font-semibold text-text">
                  {pendingValues.decision === "RESOLVED"
                    ? "Đã xử lý"
                    : "Bác bỏ"}
                </strong>
              </p>
              <p>
                Thao tác này không thể đảo ngược. Người gửi báo cáo sẽ nhận được
                thông báo kèm ghi chú xử lý của bạn.
              </p>
            </div>
          ) : null
        }
        confirmLabel="Xác nhận"
        confirmVariant="primary"
        tone="info"
        loading={resolveMutation.isPending}
        onConfirm={handleConfirmResolve}
      />

      {/* Dialog thao tác quản trị riêng dùng chung */}
      <HideProductDialog
        target={hideTarget}
        onClose={() => setHideTarget(null)}
      />
      <CancelAuctionDialog
        target={cancelAuctionTarget}
        onClose={() => setCancelAuctionTarget(null)}
      />
      <BanUserDialog
        target={banUserTarget}
        onClose={() => setBanUserTarget(null)}
      />
    </Card>
  );
}
