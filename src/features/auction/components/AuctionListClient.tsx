"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterIcon, SearchIcon, SpinnerIcon } from "@/components/icons";
import { isApiError } from "@/lib/api/types";
import { dayjs, toBackendDateTimeString } from "@/lib/format";
import { useAuctions, useCategories } from "../hooks";
import type { AuctionSortOption } from "../types";
import { AuctionCard } from "./AuctionCard";
import { FilterChips } from "./FilterChips";
import { FilterPanel, type EndingInOption } from "./FilterPanel";

const PAGE_SIZE = 12;

const ALLOWED_SORTS: AuctionSortOption[] = [
  "endTime,asc",
  "createdAt,desc",
  "currentPrice,asc",
  "currentPrice,desc",
];

const SORT_OPTIONS: Array<{ value: AuctionSortOption; label: string }> = [
  { value: "endTime,asc", label: "Sắp kết thúc" },
  { value: "createdAt,desc", label: "Mới nhất" },
  { value: "currentPrice,asc", label: "Giá tăng" },
  { value: "currentPrice,desc", label: "Giá giảm" },
];

function normalizeSort(raw: string | null): AuctionSortOption {
  if (raw && (ALLOWED_SORTS as string[]).includes(raw)) {
    return raw as AuctionSortOption;
  }
  return "endTime,asc";
}

function normalizeEndingIn(raw: string | null): EndingInOption {
  if (raw === "1h" || raw === "24h" || raw === "7d") {
    return raw;
  }
  return "";
}

function computeEndBefore(endingIn: EndingInOption): string | undefined {
  if (!endingIn) return undefined;
  const now = dayjs();
  if (endingIn === "1h") return toBackendDateTimeString(now.add(1, "hour"));
  if (endingIn === "24h") return toBackendDateTimeString(now.add(24, "hour"));
  if (endingIn === "7d") return toBackendDateTimeString(now.add(7, "day"));
  return undefined;
}

export function AuctionListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") || undefined;
  const categoryIdParam = searchParams.get("categoryId");
  const categoryId =
    categoryIdParam && !Number.isNaN(Number(categoryIdParam))
      ? Number(categoryIdParam)
      : undefined;
  const status = searchParams.get("status") || undefined;
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const minPrice =
    minPriceParam && !Number.isNaN(Number(minPriceParam))
      ? Number(minPriceParam)
      : undefined;
  const maxPrice =
    maxPriceParam && !Number.isNaN(Number(maxPriceParam))
      ? Number(maxPriceParam)
      : undefined;
  const endingIn = normalizeEndingIn(searchParams.get("endingIn"));
  const sort = normalizeSort(searchParams.get("sort"));
  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 0 : pageParam - 1;

  const [keywordInput, setKeywordInput] = useState(keyword ?? "");
  const [syncedKeyword, setSyncedKeyword] = useState(keyword ?? "");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  if ((keyword ?? "") !== syncedKeyword) {
    setSyncedKeyword(keyword ?? "");
    setKeywordInput(keyword ?? "");
  }

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === undefined || v === "") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Debounce tìm kiếm 300ms
  useEffect(() => {
    const trimmed = keywordInput.trim();
    const current = (keyword ?? "").trim();
    if (trimmed === current) return;

    const timer = window.setTimeout(() => {
      updateParams({
        keyword: trimmed || undefined,
        page: undefined,
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [keywordInput, keyword, updateParams]);

  const endBefore = useMemo(() => computeEndBefore(endingIn), [endingIn]);

  const { data: categories = [] } = useCategories();
  const { data, isLoading, isFetching, isError, error, refetch } = useAuctions({
    keyword,
    categoryId,
    status,
    minPrice,
    maxPrice,
    endBefore,
    sort,
    page,
    size: PAGE_SIZE,
  });

  const activeFilterCount =
    (categoryId !== undefined ? 1 : 0) +
    (status ? 1 : 0) +
    (endingIn ? 1 : 0) +
    (minPrice !== undefined || maxPrice !== undefined ? 1 : 0);

  const handleResetAll = () => {
    setKeywordInput("");
    router.replace(pathname, { scroll: false });
    setMobileFilterOpen(false);
  };

  const auctions = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Phiên đấu giá" },
          ]}
        />
        <h1 className="text-h1 text-text">Phiên đấu giá</h1>
      </div>

      {/* Thanh tìm kiếm + kết quả + sắp xếp + nút lọc mobile */}
      <div className="flex flex-col gap-3 rounded-xl border border-border-brand bg-surface p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-placeholder" />
          <input
            type="search"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Tìm theo tên sản phẩm…"
            aria-label="Tìm theo tên sản phẩm"
            className="h-11 w-full rounded-md border border-border-brand bg-surface-subtle pl-10 pr-3 text-body-lg md:text-small text-text placeholder:text-text-placeholder transition-colors focus-visible:border-primary-600 focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 md:justify-end">
          <p className="inline-flex items-center gap-2 text-small text-text-secondary tabular">
            <span>{totalElements} phiên phù hợp</span>
            {isFetching && !isLoading && (
              <SpinnerIcon className="size-4 animate-spin text-primary-600" />
            )}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              leftIcon={<FilterIcon className="size-4" />}
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden"
            >
              {activeFilterCount > 0 ? `Lọc (${activeFilterCount})` : "Lọc"}
            </Button>

            <div className="w-44 sm:w-52">
              <Select
                aria-label="Sắp xếp"
                value={sort}
                onChange={(e) =>
                  updateParams({ sort: e.target.value, page: undefined })
                }
                options={SORT_OPTIONS}
              />
            </div>
          </div>
        </div>
      </div>

      <FilterChips
        keyword={keyword}
        categoryId={categoryId}
        status={status}
        minPrice={minPrice}
        maxPrice={maxPrice}
        endingIn={endingIn}
        categories={categories}
        onRemoveKeyword={() => {
          setKeywordInput("");
          updateParams({ keyword: undefined, page: undefined });
        }}
        onRemoveCategory={() =>
          updateParams({ categoryId: undefined, page: undefined })
        }
        onRemoveStatus={() =>
          updateParams({ status: undefined, page: undefined })
        }
        onRemovePrice={() =>
          updateParams({
            minPrice: undefined,
            maxPrice: undefined,
            page: undefined,
          })
        }
        onRemoveEndingIn={() =>
          updateParams({ endingIn: undefined, page: undefined })
        }
        onClearAll={handleResetAll}
      />

      {/* Bố cục cột lọc 280px + lưới 3 cột */}
      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <aside className="hidden w-full shrink-0 lg:block lg:w-70">
          <FilterPanel
            categories={categories}
            categoryId={categoryId}
            status={status}
            minPrice={minPrice}
            maxPrice={maxPrice}
            endingIn={endingIn}
            onCategoryChange={(id) =>
              updateParams({
                categoryId: id ? String(id) : undefined,
                page: undefined,
              })
            }
            onStatusChange={(s) =>
              updateParams({ status: s, page: undefined })
            }
            onPriceChange={(min, max) =>
              updateParams({
                minPrice: min !== undefined ? String(min) : undefined,
                maxPrice: max !== undefined ? String(max) : undefined,
                page: undefined,
              })
            }
            onEndingInChange={(val) =>
              updateParams({ endingIn: val || undefined, page: undefined })
            }
            onReset={handleResetAll}
          />
        </aside>

        <section className="min-w-0 flex-1 w-full space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              message={isApiError(error) ? error.message : undefined}
              onRetry={() => refetch()}
            />
          ) : auctions.length === 0 ? (
            <EmptyState
              title="Không có phiên phù hợp"
              description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm phiên đấu giá."
              action={
                <Button variant="outline" onClick={handleResetAll}>
                  Xóa bộ lọc
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {auctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>

              {data && data.totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  totalElements={data.totalElements}
                  pageSize={PAGE_SIZE}
                  onPageChange={(nextPage) =>
                    updateParams({
                      page: nextPage > 0 ? String(nextPage + 1) : undefined,
                    })
                  }
                />
              )}
            </>
          )}
        </section>
      </div>

      {/* Bộ lọc di động */}
      <Modal
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Bộ lọc phiên đấu giá"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" size="md" onClick={handleResetAll}>
              Xóa bộ lọc
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setMobileFilterOpen(false)}
            >
              Xem {totalElements} phiên
            </Button>
          </>
        }
      >
        <FilterPanel
          inSheet
          categories={categories}
          categoryId={categoryId}
          status={status}
          minPrice={minPrice}
          maxPrice={maxPrice}
          endingIn={endingIn}
          onCategoryChange={(id) =>
            updateParams({
              categoryId: id ? String(id) : undefined,
              page: undefined,
            })
          }
          onStatusChange={(s) => updateParams({ status: s, page: undefined })}
          onPriceChange={(min, max) =>
            updateParams({
              minPrice: min !== undefined ? String(min) : undefined,
              maxPrice: max !== undefined ? String(max) : undefined,
              page: undefined,
            })
          }
          onEndingInChange={(val) =>
            updateParams({ endingIn: val || undefined, page: undefined })
          }
          onReset={handleResetAll}
        />
      </Modal>
    </div>
  );
}
