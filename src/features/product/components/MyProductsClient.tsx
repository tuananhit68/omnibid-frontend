"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  ConfirmDialog,
  DataTable,
  EmptyState,
  ErrorState,
  Input,
  Pagination,
  SegmentedControl,
  Skeleton,
  StatusBadge,
  type Column,
  type SegmentedOption,
  useToast,
} from "@/components/ui";
import {
  BoxIcon,
  PlusCircleIcon,
  SearchIcon,
} from "@/components/icons";
import { ApiError } from "@/lib/api/types";
import type { ProductListItem } from "@/lib/api/contract";
import { formatDateTime, formatDisplayCode } from "@/lib/format";
import {
  PRODUCT_CONDITION_LABEL,
  PRODUCT_STATUS_META,
  ProductStatus,
} from "@/types/enums";
import { useDeleteProduct, useMyProducts } from "../hooks";

type StatusFilter = "ALL" | ProductStatus;

const STATUS_OPTIONS: SegmentedOption<StatusFilter>[] = [
  { value: "ALL", label: "Tất cả" },
  { value: ProductStatus.AVAILABLE, label: PRODUCT_STATUS_META[ProductStatus.AVAILABLE].label },
  { value: ProductStatus.IN_AUCTION, label: PRODUCT_STATUS_META[ProductStatus.IN_AUCTION].label },
  { value: ProductStatus.RESERVED, label: PRODUCT_STATUS_META[ProductStatus.RESERVED].label },
  { value: ProductStatus.SOLD, label: PRODUCT_STATUS_META[ProductStatus.SOLD].label },
  { value: ProductStatus.HIDDEN, label: PRODUCT_STATUS_META[ProductStatus.HIDDEN].label },
];

function isValidStatus(val: string | null): val is ProductStatus {
  if (!val) return false;
  return Object.values(ProductStatus).includes(val as ProductStatus);
}

export function MyProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const statusParam = searchParams.get("status");
  const statusFilter: StatusFilter = isValidStatus(statusParam) ? statusParam : "ALL";
  const keywordParam = searchParams.get("keyword") ?? "";
  const pageParam = Math.max(0, Number(searchParams.get("page") ?? "0") || 0);

  const [searchInput, setSearchInput] = useState(keywordParam);
  const [deleteTarget, setDeleteTarget] = useState<ProductListItem | null>(null);

  // Debounce keyword 300ms -> sync URL & reset page về 0
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === keywordParam) return;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        next.set("keyword", trimmed);
      } else {
        next.delete("keyword");
      }
      next.delete("page");
      const query = next.toString();
      router.replace(query ? `/me/products?${query}` : "/me/products", {
        scroll: false,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, keywordParam, searchParams, router]);

  const { data, isLoading, isFetching, isError, error, refetch } = useMyProducts({
    keyword: keywordParam || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page: pageParam,
    size: 10,
    sort: "createdAt,desc",
  });

  const deleteMutation = useDeleteProduct();

  const updateUrl = (updates: { status?: StatusFilter; page?: number }) => {
    const next = new URLSearchParams(searchParams.toString());
    if (updates.status !== undefined) {
      if (updates.status === "ALL") {
        next.delete("status");
      } else {
        next.set("status", updates.status);
      }
      next.delete("page");
    }
    if (updates.page !== undefined) {
      if (updates.page <= 0) {
        next.delete("page");
      } else {
        next.set("page", String(updates.page));
      }
    }
    const query = next.toString();
    router.replace(query ? `/me/products?${query}` : "/me/products", {
      scroll: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(
        `Sản phẩm "${deleteTarget.title}" đã được xóa khỏi kho của bạn.`,
        "Đã xóa sản phẩm"
      );
      setDeleteTarget(null);
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : null;
      const message =
        apiErr?.code === "INVALID_STATUS_TRANSITION"
          ? "Sản phẩm đã từng lên phiên nên không thể xóa"
          : apiErr?.message || "Không thể xóa sản phẩm. Vui lòng thử lại.";
      toast.error(message, "Xóa sản phẩm thất bại");
      setDeleteTarget(null);
      refetch();
    }
  };

  const renderActions = (row: ProductListItem) => {
    if (row.status === ProductStatus.HIDDEN) {
      return (
        <span className="text-caption text-danger">
          Bị ẩn bởi quản trị viên — không bỏ ẩn được
        </span>
      );
    }

    if (row.status === ProductStatus.AVAILABLE) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/me/products/${row.id}/edit`}
            className="inline-flex min-h-11 md:min-h-8 items-center rounded-md border border-border-brand bg-surface px-3 md:px-2.5 text-small md:text-caption font-medium text-text hover:bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
          >
            Sửa
          </Link>
          <Link
            href={`/me/auctions/new?productId=${row.id}`}
            className="inline-flex min-h-11 md:min-h-8 items-center rounded-md bg-primary-600 px-3 md:px-2.5 text-small md:text-caption font-medium text-text-inverse hover:bg-primary-700 transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
          >
            Tạo phiên
          </Link>
          {!row.everAuctioned && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="min-h-11 md:min-h-8 px-3 md:px-2.5 text-small md:text-caption text-danger hover:bg-danger-bg hover:text-danger"
              onClick={() => setDeleteTarget(row)}
            >
              Xóa
            </Button>
          )}
        </div>
      );
    }

    if (row.activeAuctionId !== null) {
      return (
        <Link
          href={`/me/auctions/${row.activeAuctionId}`}
          className="inline-flex min-h-11 md:min-h-8 items-center rounded-md border border-border-brand bg-surface px-3 md:px-2.5 text-small md:text-caption font-medium text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
        >
          Xem phiên
        </Link>
      );
    }

    if (
      row.status === ProductStatus.RESERVED ||
      row.status === ProductStatus.SOLD
    ) {
      return (
        <Link
          href="/me/orders?role=SELLER"
          className="inline-flex min-h-11 md:min-h-8 items-center rounded-md border border-border-brand bg-surface px-3 md:px-2.5 text-small md:text-caption font-medium text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
        >
          Xem đơn
        </Link>
      );
    }

    return <span className="text-caption text-text-tertiary">—</span>;
  };

  const columns: Column<ProductListItem>[] = [
    {
      key: "product",
      header: "Sản phẩm",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-52">
          <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-subtle">
            {row.primaryImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.primaryImageUrl}
                alt={row.title}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-text-tertiary">
                <BoxIcon className="size-5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-small font-semibold text-text line-clamp-2">
              {row.title}
            </p>
            <p className="text-caption text-text-tertiary tabular">
              {formatDisplayCode("PRD", row.id)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "categoryName",
      header: "Danh mục",
      render: (row) => (
        <span className="text-small text-text-secondary whitespace-nowrap">
          {row.categoryName}
        </span>
      ),
    },
    {
      key: "condition",
      header: "Tình trạng",
      render: (row) => (
        <span className="text-small text-text-secondary whitespace-nowrap">
          {PRODUCT_CONDITION_LABEL[row.condition]}
        </span>
      ),
    },
    {
      key: "imageCount",
      header: "Số ảnh",
      align: "center",
      render: (row) => (
        <span className="text-small text-text-secondary tabular">
          {row.imageCount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (row) => {
        const meta = PRODUCT_STATUS_META[row.status];
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (row) => (
        <span className="text-small text-text-secondary tabular whitespace-nowrap">
          {formatDateTime(row.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (row) => renderActions(row),
    },
  ];

  const items = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const hasFilter = statusFilter !== "ALL" || Boolean(keywordParam);
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : "Không thể tải danh sách sản phẩm.";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 text-text">Sản phẩm của tôi</h1>
          <p className="mt-1 text-small text-text-secondary">
            Quản lý kho sản phẩm, cập nhật thông tin và tạo phiên đấu giá.
          </p>
        </div>
        <Link
          href="/me/products/new"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-small font-semibold text-text-inverse hover:bg-primary-700 transition-colors"
        >
          <PlusCircleIcon className="size-4.5" />
          <span>Thêm sản phẩm</span>
        </Link>
      </div>

      {/* Thanh công cụ lọc + tìm kiếm */}
      <div className="flex flex-col gap-3">
        <div className="overflow-x-auto">
          <SegmentedControl
            ariaLabel="Lọc theo trạng thái sản phẩm"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(next) => updateUrl({ status: next })}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo tên sản phẩm…"
              aria-label="Tìm theo tên sản phẩm"
              leftIcon={<SearchIcon className="size-4" />}
            />
          </div>
          {!isLoading && !isError && (
            <p className="text-caption text-text-tertiary tabular">
              {totalElements} sản phẩm{isFetching ? " · Đang cập nhật…" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Trạng thái lỗi */}
      {isError ? (
        <ErrorState
          title="Không thể tải danh sách sản phẩm"
          message={errorMessage}
          onRetry={() => refetch()}
        />
      ) : !isLoading && items.length === 0 ? (
        <EmptyState
          icon={<BoxIcon className="size-10" />}
          title={
            hasFilter
              ? "Không tìm thấy sản phẩm phù hợp"
              : "Bạn chưa có sản phẩm nào"
          }
          description={
            hasFilter
              ? "Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm."
              : "Đăng sản phẩm đầu tiên để bắt đầu tạo phiên đấu giá trên Omnibid."
          }
          action={
            hasFilter ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSearchInput("");
                  router.replace("/me/products", { scroll: false });
                }}
              >
                Xóa bộ lọc
              </Button>
            ) : (
              <Link
                href="/me/products/new"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary-600 px-5 text-small font-semibold text-text-inverse hover:bg-primary-700 transition-colors"
              >
                <PlusCircleIcon className="size-4.5" />
                <span>Thêm sản phẩm</span>
              </Link>
            )
          }
        />
      ) : (
        <>
          {/* Bảng desktop */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={items}
              keyExtractor={(row) => row.id}
              loading={isLoading}
            />
          </div>

          {/* Danh sách thẻ mobile */}
          <div className="space-y-3 md:hidden">
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border-brand bg-surface p-4 space-y-3"
                  >
                    <div className="flex gap-3">
                      <Skeleton className="size-16 shrink-0 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3.5 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))
              : items.map((row) => {
                  const meta = PRODUCT_STATUS_META[row.status];
                  return (
                    <article
                      key={row.id}
                      className="rounded-xl border border-border-brand bg-surface p-4 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-subtle">
                          {row.primaryImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={row.primaryImageUrl}
                              alt={row.title}
                              loading="lazy"
                              decoding="async"
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-text-tertiary">
                              <BoxIcon className="size-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h2 className="text-small font-semibold text-text line-clamp-2">
                              {row.title}
                            </h2>
                            <StatusBadge label={meta.label} tone={meta.tone} />
                          </div>
                          <p className="text-caption text-text-tertiary tabular">
                            {formatDisplayCode("PRD", row.id)} · {row.categoryName}
                          </p>
                          <p className="text-caption text-text-secondary">
                            {PRODUCT_CONDITION_LABEL[row.condition]} ·{" "}
                            <span className="tabular">{row.imageCount} ảnh</span> ·{" "}
                            <span className="tabular">{formatDateTime(row.createdAt)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-border-subtle pt-3">
                        {renderActions(row)}
                      </div>
                    </article>
                  );
                })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination
                page={pageParam}
                totalPages={totalPages}
                onPageChange={(nextPage) => updateUrl({ page: nextPage })}
              />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa sản phẩm"
        description={
          deleteTarget ? (
            <p>
              Bạn có chắc muốn xóa vĩnh viễn sản phẩm{" "}
              <strong className="text-text">{deleteTarget.title}</strong>? Hành động này
              không thể hoàn tác.
            </p>
          ) : (
            ""
          )
        }
        confirmLabel="Xóa sản phẩm"
        confirmVariant="danger-soft"
        tone="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
