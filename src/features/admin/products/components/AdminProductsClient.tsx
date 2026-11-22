"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IS_MOCK_MODE } from "@/lib/api/client";
import type { AdminProductItem } from "@/lib/api/contract";
import { isApiError } from "@/lib/api/types";
import { formatDateTime, formatDisplayCode } from "@/lib/format";
import { PRODUCT_STATUS_META, ProductStatus } from "@/types/enums";
import { BoxIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAdminCategories } from "../../categories/hooks";
import { useDebouncedValue } from "../../shared/useDebouncedValue";
import { useAdminProducts } from "../hooks";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  ...(Object.values(ProductStatus) as ProductStatus[]).map((s) => ({
    value: s,
    label: PRODUCT_STATUS_META[s].label,
  })),
];

export function AdminProductsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("keyword") ?? "";
  const urlCategoryId = searchParams.get("categoryId") ?? "";
  const urlStatus = (searchParams.get("status") ?? "") as ProductStatus | "";
  const urlPage = Math.max(0, Number(searchParams.get("page") ?? "0") || 0);

  const [keywordInput, setKeywordInput] = useState(urlKeyword);
  const debouncedKeyword = useDebouncedValue(keywordInput, 300);

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

  useEffect(() => {
    if (debouncedKeyword !== urlKeyword) {
      updateUrl({ keyword: debouncedKeyword.trim() || undefined, page: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword]);

  const { data: categoriesPage } = useAdminCategories({
    page: 0,
    size: 100,
    sort: "name,asc",
  });

  const categoryOptions = useMemo(
    () => [
      { value: "", label: "Tất cả danh mục" },
      ...(categoriesPage?.content ?? []).map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    ],
    [categoriesPage?.content]
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminProducts({
      keyword: urlKeyword || undefined,
      categoryId: urlCategoryId ? Number(urlCategoryId) : undefined,
      status: urlStatus || undefined,
      page: urlPage,
      size: PAGE_SIZE,
      sort: "createdAt,desc",
    });

  const products = useMemo(() => data?.content ?? [], [data?.content]);
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const hasFilters = Boolean(urlKeyword || urlCategoryId || urlStatus);

  const columns: Column<AdminProductItem>[] = useMemo(
    () => [
      {
        key: "image",
        header: "Ảnh",
        render: (row) => (
          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-subtle">
            {row.primaryImageUrl ? (
              <Image
                src={row.primaryImageUrl}
                alt={row.title}
                fill
                sizes="40px"
                unoptimized={IS_MOCK_MODE}
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-text-tertiary">
                <BoxIcon className="size-4" />
              </div>
            )}
          </div>
        ),
      },
      {
        key: "title",
        header: "Sản phẩm",
        className: "max-w-xs",
        render: (row) => (
          <div className="min-w-0">
            <Link
              href={`/admin/products/${row.id}`}
              className="block truncate font-medium text-text hover:text-primary-600"
            >
              {row.title}
            </Link>
            <span className="text-caption text-text-tertiary tabular">
              {formatDisplayCode("PRD", row.id)}
            </span>
          </div>
        ),
      },
      {
        key: "seller",
        header: "Người bán",
        render: (row) => (
          <span className="text-small text-text-secondary">
            {row.seller.fullName}
          </span>
        ),
      },
      {
        key: "categoryName",
        header: "Danh mục",
        render: (row) => (
          <span className="text-small text-text-secondary">{row.categoryName}</span>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        render: (row) => <StatusBadge statusType="product" value={row.status} />,
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
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
        render: (row) => (
          <Link
            href={`/admin/products/${row.id}`}
            className="inline-flex h-8 items-center justify-center rounded-md border border-border-brand px-3 text-caption font-medium text-text hover:bg-surface-subtle"
          >
            Xem
          </Link>
        ),
      },
    ],
    []
  );

  const errorMessage = isError
    ? isApiError(error)
      ? error.message
      : "Không tải được danh sách sản phẩm."
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-text">Quản lý sản phẩm</h1>
        <p className="mt-1 text-small text-text-secondary">
          Tổng cộng {totalElements} sản phẩm
          {isFetching && !isLoading ? " · Đang cập nhật..." : ""}
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <Input
              aria-label="Tìm theo tên sản phẩm hoặc người bán"
              placeholder="Tìm theo tên sản phẩm hoặc người bán..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              leftIcon={<SearchIcon className="size-4" />}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              aria-label="Lọc theo danh mục"
              value={urlCategoryId}
              options={categoryOptions}
              onChange={(e) => updateUrl({ categoryId: e.target.value, page: 0 })}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              aria-label="Lọc theo trạng thái"
              value={urlStatus}
              options={STATUS_OPTIONS}
              onChange={(e) => updateUrl({ status: e.target.value, page: 0 })}
            />
          </div>
          <div className="md:col-span-1 flex items-center justify-end">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setKeywordInput("");
                  updateUrl({
                    keyword: undefined,
                    categoryId: undefined,
                    status: undefined,
                    page: 0,
                  });
                }}
              >
                Đặt lại
              </Button>
            )}
          </div>
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={products}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        error={errorMessage}
        onRetry={() => refetch()}
        emptyText={
          hasFilters
            ? "Không tìm thấy sản phẩm phù hợp với bộ lọc."
            : "Chưa có sản phẩm nào trên sàn."
        }
        emptyAction={
          hasFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setKeywordInput("");
                updateUrl({
                  keyword: undefined,
                  categoryId: undefined,
                  status: undefined,
                  page: 0,
                });
              }}
            >
              Xóa bộ lọc
            </Button>
          ) : undefined
        }
      />

      {totalPages > 1 && (
        <Pagination
          page={urlPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={PAGE_SIZE}
          onPageChange={(nextPage) => updateUrl({ page: nextPage })}
        />
      )}
    </div>
  );
}
