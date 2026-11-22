"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IS_MOCK_MODE } from "@/lib/api/client";
import { isApiError } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatDateTime, formatDisplayCode } from "@/lib/format";
import { PRODUCT_CONDITION_LABEL, ProductStatus } from "@/types/enums";
import { BoxIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  HideProductDialog,
  type HideProductTarget,
} from "../../shared/AdminActionDialogs";
import { useAdminProductDetail } from "../hooks";

export function AdminProductDetailClient({ productId }: { productId: number }) {
  const { data: product, isLoading, isError, error, refetch } =
    useAdminProductDetail(productId);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hideTarget, setHideTarget] = useState<HideProductTarget | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-64" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Skeleton className="h-96 rounded-xl lg:col-span-5" />
          <Skeleton className="h-96 rounded-xl lg:col-span-7" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    const message = isApiError(error)
      ? error.message
      : "Không tải được thông tin chi tiết sản phẩm.";
    return (
      <div className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Quản trị", href: "/admin" },
            { label: "Sản phẩm", href: "/admin/products" },
            { label: formatDisplayCode("PRD", productId) },
          ]}
        />
        <ErrorState message={message} onRetry={() => refetch()} />
      </div>
    );
  }

  const images = product.images ?? [];
  const safeIndex = selectedIndex < images.length ? selectedIndex : 0;
  const activeImage = images[safeIndex];
  const isHidden = product.status === ProductStatus.HIDDEN;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Quản trị", href: "/admin" },
          { label: "Sản phẩm", href: "/admin/products" },
          { label: formatDisplayCode("PRD", product.id) },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-small font-semibold text-text-tertiary tabular">
              {formatDisplayCode("PRD", product.id)}
            </span>
            <StatusBadge statusType="product" value={product.status} />
          </div>
          <h1 className="text-h1 text-text">{product.title}</h1>
        </div>

        {!isHidden && (
          <Button
            variant="danger-soft"
            size="md"
            onClick={() =>
              setHideTarget({ id: product.id, title: product.title })
            }
          >
            Ẩn sản phẩm
          </Button>
        )}
      </div>

      {isHidden && (
        <div className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-small text-danger-strong">
          Sản phẩm này đã bị ẩn vĩnh viễn và không còn hiển thị với người dùng trên
          sàn.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Thư viện ảnh */}
        <Card className="p-4 lg:col-span-5 space-y-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border-subtle bg-surface-subtle">
            {activeImage ? (
              <Image
                src={activeImage.imageUrl}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                unoptimized={IS_MOCK_MODE}
                className="object-contain"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-text-tertiary">
                <BoxIcon className="size-10" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md border bg-surface-subtle",
                    idx === safeIndex
                      ? "border-primary-600 ring-2 ring-primary-100"
                      : "border-border-subtle hover:border-border-brand"
                  )}
                >
                  <Image
                    src={img.imageUrl}
                    alt={`${product.title} ${idx + 1}`}
                    fill
                    sizes="80px"
                    unoptimized={IS_MOCK_MODE}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Thông tin chi tiết */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="p-5 space-y-4">
            <h2 className="text-h3 text-text">Thông tin sản phẩm</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-small">
              <div>
                <dt className="text-text-tertiary">Danh mục</dt>
                <dd className="mt-1 font-medium text-text">
                  {product.categoryName}
                </dd>
              </div>
              <div>
                <dt className="text-text-tertiary">Tình trạng</dt>
                <dd className="mt-1 font-medium text-text">
                  {PRODUCT_CONDITION_LABEL[product.condition]}
                </dd>
              </div>
              <div>
                <dt className="text-text-tertiary">Phiên đấu giá đang mở</dt>
                <dd className="mt-1 font-medium text-text">
                  {product.activeAuctionId ? (
                    <Link
                      href={`/admin/auctions/${product.activeAuctionId}`}
                      className="text-text-link hover:underline tabular"
                    >
                      {formatDisplayCode("AUC", product.activeAuctionId)}
                    </Link>
                  ) : (
                    <span className="text-text-tertiary">Không có</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-text-tertiary">Ngày tạo / Cập nhật</dt>
                <dd className="mt-1 text-text-secondary tabular">
                  {formatDateTime(product.createdAt)} ·{" "}
                  {formatDateTime(product.updatedAt)}
                </dd>
              </div>
            </dl>

            <div className="border-t border-border-subtle pt-4">
              <h3 className="text-label font-medium text-text-tertiary">Mô tả</h3>
              <p className="mt-2 whitespace-pre-line text-body text-text">
                {product.description || "Không có mô tả."}
              </p>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-h3 text-text">Người bán</h2>
              <Link
                href={`/admin/users?keyword=${encodeURIComponent(product.seller.email)}`}
                className="text-small font-medium text-text-link hover:underline"
              >
                Xem trong quản lý người dùng
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Avatar
                src={product.seller.avatarUrl}
                name={product.seller.fullName}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-text">
                    {product.seller.fullName}
                  </span>
                  <span className="text-caption text-text-tertiary tabular">
                    {formatDisplayCode("USR", product.seller.id)}
                  </span>
                  <StatusBadge statusType="user" value={product.seller.status} />
                </div>
                <p className="text-small text-text-secondary truncate">
                  {product.seller.email}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <HideProductDialog
        target={hideTarget}
        onClose={() => setHideTarget(null)}
      />
    </div>
  );
}
