"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AdminCategory } from "@/lib/api/contract";
import { isApiError } from "@/lib/api/types";
import { formatNumber } from "@/lib/format";
import { SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/Toast";
import { useDebouncedValue } from "../../shared/useDebouncedValue";
import { useAdminCategories, useDeleteAdminCategory } from "../hooks";
import { CategoryFormModal } from "./CategoryFormModal";

const PAGE_SIZE = 20;

export function AdminCategoriesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  const urlKeyword = searchParams.get("keyword") ?? "";
  const urlPage = Math.max(0, Number(searchParams.get("page") ?? "0") || 0);

  const [keywordInput, setKeywordInput] = useState(urlKeyword);
  const debouncedKeyword = useDebouncedValue(keywordInput, 300);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

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

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminCategories({
      keyword: urlKeyword || undefined,
      page: urlPage,
      size: PAGE_SIZE,
      sort: "name,asc",
    });

  const deleteMutation = useDeleteAdminCategory();

  const categories = useMemo(() => data?.content ?? [], [data?.content]);
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const columns: Column<AdminCategory>[] = useMemo(
    () => [
      {
        key: "icon",
        header: "Biểu tượng",
        render: (row) => (
          <div className="inline-flex size-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <CategoryIcon name={row.icon} className="size-4.5" />
          </div>
        ),
      },
      {
        key: "name",
        header: "Tên danh mục",
        render: (row) => (
          <span className="font-medium text-text">{row.name}</span>
        ),
      },
      {
        key: "slug",
        header: "Slug",
        render: (row) => (
          <code className="rounded bg-surface-subtle px-2 py-0.5 text-caption text-text-secondary">
            {row.slug}
          </code>
        ),
      },
      {
        key: "productCount",
        header: "Số sản phẩm",
        align: "right",
        render: (row) => (
          <span className="tabular font-medium text-text">
            {formatNumber(row.productCount)}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Thao tác",
        align: "right",
        render: (row) => {
          const inUse = row.productCount > 0;
          return (
            <div className="inline-flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingCategory(row);
                  setModalOpen(true);
                }}
              >
                Sửa
              </Button>
              <Button
                variant="danger-soft"
                size="sm"
                disabled={inUse}
                title={
                  inUse
                    ? "Không thể xóa danh mục đang có sản phẩm sử dụng"
                    : "Xóa danh mục"
                }
                onClick={() => setDeleteTarget(row)}
              >
                Xóa
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const errorMessage = isError
    ? isApiError(error)
      ? error.message
      : "Không tải được danh sách danh mục."
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1 text-text">Quản lý danh mục</h1>
          <p className="mt-1 text-small text-text-secondary">
            Tổng cộng {totalElements} danh mục
            {isFetching && !isLoading ? " · Đang cập nhật..." : ""}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
        >
          Thêm danh mục
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 max-w-md">
            <Input
              aria-label="Tìm theo tên hoặc slug"
              placeholder="Tìm theo tên hoặc slug danh mục..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              leftIcon={<SearchIcon className="size-4" />}
            />
          </div>
          {urlKeyword && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setKeywordInput("");
                updateUrl({ keyword: undefined, page: 0 });
              }}
            >
              Đặt lại
            </Button>
          )}
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={categories}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        error={errorMessage}
        onRetry={() => refetch()}
        emptyText={
          urlKeyword
            ? "Không tìm thấy danh mục phù hợp."
            : "Chưa có danh mục nào."
        }
        emptyAction={
          urlKeyword ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setKeywordInput("");
                updateUrl({ keyword: undefined, page: 0 });
              }}
            >
              Xóa từ khóa
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingCategory(null);
                setModalOpen(true);
              }}
            >
              Thêm danh mục đầu tiên
            </Button>
          )
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

      <CategoryFormModal
        key={editingCategory ? `edit-${editingCategory.id}` : "create"}
        open={modalOpen}
        category={editingCategory}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Xóa danh mục"
        description={
          deleteTarget ? (
            <p>
              Bạn có chắc chắn muốn xóa danh mục{" "}
              <span className="font-semibold text-text">{deleteTarget.name}</span>?
              Thao tác này không thể hoàn tác.
            </p>
          ) : null
        }
        confirmLabel="Xóa danh mục"
        confirmVariant="danger-soft"
        tone="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success(`Đã xóa danh mục ${deleteTarget.name}.`);
              setDeleteTarget(null);
            },
            onError: (err) => {
              toast.error(
                isApiError(err) ? err.message : "Không thể xóa danh mục."
              );
            },
          });
        }}
      />
    </div>
  );
}
