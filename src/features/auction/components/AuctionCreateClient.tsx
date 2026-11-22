"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  ErrorState,
  Skeleton,
  StatusBadge,
  useToast,
} from "@/components/ui";
import { AlertCircleIcon, BoxIcon } from "@/components/icons";
import { ApiError } from "@/lib/api/types";
import { useProductDetail } from "@/features/product/hooks";
import { dayjs, formatDisplayCode, VIETNAM_TIMEZONE } from "@/lib/format";
import { PRODUCT_STATUS_META, ProductStatus } from "@/types/enums";
import { useCreateAuction } from "../hooks";
import { AuctionScheduleForm } from "./AuctionScheduleForm";

export function AuctionCreateClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const rawProductId = searchParams.get("productId");
  const productId = rawProductId ? Number(rawProductId) : 0;
  const hasValidProductId = Number.isInteger(productId) && productId > 0;

  useEffect(() => {
    if (!hasValidProductId) {
      router.replace("/me/products");
    }
  }, [hasValidProductId, router]);

  const productQuery = useProductDetail(hasValidProductId ? productId : 0);
  const createMutation = useCreateAuction();

  const defaultTimes = useMemo(() => {
    const start = dayjs().tz(VIETNAM_TIMEZONE).add(1, "hour").startOf("minute");
    const end = start.add(3, "day");
    return {
      startTime: start.format(),
      endTime: end.format(),
    };
  }, []);

  if (!hasValidProductId) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (productQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (productQuery.isError || !productQuery.data) {
    const apiErr = productQuery.error instanceof ApiError ? productQuery.error : null;
    return (
      <ErrorState
        title="Không thể tải thông tin sản phẩm"
        message={
          apiErr?.message ||
          "Không tìm thấy sản phẩm hoặc bạn không có quyền tạo phiên cho sản phẩm này."
        }
        onRetry={() => productQuery.refetch()}
      />
    );
  }

  const product = productQuery.data;
  const statusMeta = PRODUCT_STATUS_META[product.status];
  const isBlocked =
    product.status !== ProductStatus.AVAILABLE || product.activeAuctionId !== null;

  const blockReason =
    product.activeAuctionId !== null
      ? "Sản phẩm hiện đang có một phiên đấu giá khác đang diễn ra hoặc sắp diễn ra."
      : product.status === ProductStatus.HIDDEN
        ? "Sản phẩm đã bị quản trị viên ẩn vĩnh viễn nên không thể tạo phiên."
        : "Chỉ sản phẩm ở trạng thái Sẵn sàng mới có thể tạo phiên đấu giá mới.";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 text-text">Tạo phiên đấu giá</h1>
        <p className="mt-1 text-small text-text-secondary">
          Thiết lập giá khởi điểm, bước giá và lịch diễn ra phiên đấu giá cho sản phẩm của bạn.
        </p>
      </div>

      {/* Tóm tắt sản phẩm */}
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="size-20 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-subtle">
            {product.primaryImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.primaryImageUrl}
                alt={product.title}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-text-tertiary">
                <BoxIcon className="size-7" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
              <span className="text-caption text-text-tertiary tabular">
                {formatDisplayCode("PRD", product.id)}
              </span>
            </div>
            <h2 className="text-h4 text-text">{product.title}</h2>
            <p className="text-caption text-text-secondary">
              {product.categoryName} ·{" "}
              <span className="tabular">{product.imageCount} ảnh</span>
            </p>
          </div>
          <Link
            href="/me/products"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-border-brand bg-surface px-3 text-caption font-medium text-text hover:bg-surface-subtle transition-colors"
          >
            Đổi sản phẩm
          </Link>
        </CardContent>
      </Card>

      {isBlocked && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-danger-border bg-danger-bg p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5 text-small text-danger">
            <AlertCircleIcon className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">Không thể tạo phiên cho sản phẩm này</p>
              <p className="mt-0.5 text-caption">{blockReason}</p>
            </div>
          </div>
          {product.activeAuctionId !== null && (
            <Link
              href={`/me/auctions/${product.activeAuctionId}`}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-surface px-3 text-caption font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Xem phiên hiện tại
            </Link>
          )}
        </div>
      )}

      <AuctionScheduleForm
        defaultValues={{
          startPrice: 1000000,
          bidIncrement: 100000,
          reservePrice: null,
          startTime: defaultTimes.startTime,
          endTime: defaultTimes.endTime,
        }}
        submitLabel="Tạo phiên"
        disabled={isBlocked}
        isSubmitting={createMutation.isPending}
        cancelAction={
          <Link
            href="/me/products"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border-strong bg-surface px-5 text-small font-semibold text-text hover:bg-surface-subtle transition-colors"
          >
            Hủy
          </Link>
        }
        onSubmitValues={async (values) => {
          const created = await createMutation.mutateAsync({
            productId: product.id,
            ...values,
          });
          toast.success(
            `Phiên ${formatDisplayCode("AUC", created.id)} đã được lên lịch thành công.`,
            "Đã tạo phiên đấu giá"
          );
          router.push(`/me/auctions/${created.id}`);
        }}
      />
    </div>
  );
}
