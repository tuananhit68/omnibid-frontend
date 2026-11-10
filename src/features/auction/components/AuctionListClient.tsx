"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { SearchIcon } from "@/components/icons";
import { ApiError, getStoredUser } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { useAuctions, useCategories, useToggleWatchlist } from "../hooks";
import type { AuctionItem } from "../types";
import { AuctionCard } from "./AuctionCard";
import { FilterPanel, type AuctionFilterState } from "./FilterPanel";
import { FilterChips } from "./FilterChips";

const PAGE_SIZE = 9;
const DEFAULT_SORT = "endTime,asc";

export function AuctionListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [pendingWatchId, setPendingWatchId] = useState<number | null>(null);

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  // Đọc từ khoá từ ?q= hoặc ?keyword=
  const keyword =
    searchParams.get("q") || searchParams.get("keyword") || "";

  // Đọc danh mục: hỗ trợ ?categoryIds=1,2 và ?category=slug (từ trang chủ S00)
  const categoryIds = useMemo(() => {
    const rawIds = searchParams.get("categoryIds");
    if (rawIds) {
      return rawIds
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n) && n > 0);
    }
    const slug = searchParams.get("category");
    if (slug && categories.length > 0) {
      const matched = categories.find((c) => c.slug === slug);
      return matched ? [matched.id] : [];
    }
    return [];
  }, [searchParams, categories]);

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || DEFAULT_SORT;
  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 0 : pageParam - 1;

  const filters: AuctionFilterState = useMemo(
    () => ({
      categoryIds,
      minPrice: minPrice && !Number.isNaN(minPrice) ? minPrice : undefined,
      maxPrice: maxPrice && !Number.isNaN(maxPrice) ? maxPrice : undefined,
      status,
      sort,
    }),
    [categoryIds, minPrice, maxPrice, status, sort]
  );

  // Đồng bộ URL query
  const updateQuery = (
    nextFilters: AuctionFilterState,
    nextKeyword: string,
    nextPageZeroBased: number
  ) => {
    const params = new URLSearchParams();
    if (nextKeyword.trim()) params.set("q", nextKeyword.trim());
    if (nextFilters.categoryIds.length > 0) {
      params.set("categoryIds", nextFilters.categoryIds.join(","));
    }
    if (nextFilters.minPrice && nextFilters.minPrice > 0) {
      params.set("minPrice", String(nextFilters.minPrice));
    }
    if (nextFilters.maxPrice && nextFilters.maxPrice > 0) {
      params.set("maxPrice", String(nextFilters.maxPrice));
    }
    if (nextFilters.status) {
      params.set("status", nextFilters.status);
    }
    if (nextFilters.sort && nextFilters.sort !== DEFAULT_SORT) {
      params.set("sort", nextFilters.sort);
    }
    if (nextPageZeroBased > 0) {
      params.set("page", String(nextPageZeroBased + 1));
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleApplyFilters = (next: AuctionFilterState) => {
    updateQuery(next, keyword, 0);
  };

  const handleResetFilters = () => {
    router.push(pathname);
  };

  const handlePageChange = (newPage: number) => {
    updateQuery(filters, keyword, newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Gọi API danh sách phiên
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAuctions({
    q: keyword || undefined,
    categoryIds:
      filters.categoryIds.length > 0
        ? filters.categoryIds.join(",")
        : undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    status: filters.status || undefined,
    sort: filters.sort,
    page,
    size: PAGE_SIZE,
  });

  const toggleWatchMutation = useToggleWatchlist();

  const handleToggleWatch = (auction: AuctionItem) => {
    const user = getStoredUser();
    if (!user) {
      const currentQs = searchParams.toString();
      const redirectTarget = currentQs ? `${pathname}?${currentQs}` : pathname;
      router.push(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
      return;
    }

    const currentlyWatched = Boolean(auction.isWatched);
    setPendingWatchId(auction.id);
    toggleWatchMutation.mutate(
      { auctionId: auction.id, currentlyWatched },
      {
        onSuccess: (res) => {
          toast.success(
            res.watched
              ? "Đã thêm phiên vào danh sách theo dõi."
              : "Đã bỏ theo dõi phiên đấu giá."
          );
        },
        onError: (err) => {
          const msg =
            err instanceof ApiError
              ? err.message
              : getErrorMessage("INTERNAL_ERROR");
          toast.error(msg);
        },
        onSettled: () => {
          setPendingWatchId(null);
        },
      }
    );
  };

  const auctions = data?.content || [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const startItem = totalElements > 0 ? page * PAGE_SIZE + 1 : 0;
  const endItem =
    totalElements > 0 ? Math.min((page + 1) * PAGE_SIZE, totalElements) : 0;

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : getErrorMessage("INTERNAL_ERROR");

  return (
    <div className="space-y-6">
      {/* Đầu trang */}
      <div className="space-y-2">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tất cả phiên đấu giá" },
          ]}
        />
        <h1 className="text-h1 font-semibold text-text">
          Tất cả phiên đấu giá
        </h1>
        <p className="text-body-lg text-text-secondary">
          Khám phá và tham gia đấu giá các sản phẩm chính hãng với giá khởi điểm hấp dẫn
        </p>
      </div>

      {/* Lưới 2 cột: Trái FilterPanel (280px), Phải Main Content */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <FilterPanel
          filters={filters}
          categories={categories}
          categoriesLoading={categoriesLoading}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* Cột phải */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Thanh tóm tắt & FilterChips */}
          <div className="bg-surface border border-border-brand rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-price-lg font-bold text-text tabular">
                {isLoading ? "Đang tải..." : `${totalElements} phiên đấu giá`}
              </h2>
              {totalElements > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-surface-subtle text-caption font-medium text-text-secondary tabular">
                  Đang hiển thị {startItem} - {endItem}
                </span>
              )}
            </div>

            <FilterChips
              keyword={keyword}
              filters={filters}
              categories={categories}
              onRemoveKeyword={() => updateQuery(filters, "", 0)}
              onRemoveCategory={(catId) =>
                updateQuery(
                  {
                    ...filters,
                    categoryIds: filters.categoryIds.filter(
                      (id) => id !== catId
                    ),
                  },
                  keyword,
                  0
                )
              }
              onRemovePrice={() =>
                updateQuery(
                  { ...filters, minPrice: undefined, maxPrice: undefined },
                  keyword,
                  0
                )
              }
              onRemoveStatus={() =>
                updateQuery({ ...filters, status: "" }, keyword, 0)
              }
            />
          </div>

          {/* Nội dung danh sách */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="bg-surface border border-border-brand rounded-xl overflow-hidden animate-pulse"
                >
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-3.5 w-1/3" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-5 w-2/3" />
                    <div className="pt-2 flex items-end justify-between">
                      <Skeleton className="h-7 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-11 flex-1 rounded-md" />
                      <Skeleton className="h-11 flex-1 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="bg-surface border border-border-brand rounded-xl p-10 text-center space-y-4">
              <p className="text-body font-medium text-danger">{errorMessage}</p>
              <Button variant="outline" size="lg" onClick={() => refetch()}>
                Thử lại
              </Button>
            </div>
          ) : auctions.length === 0 ? (
            <EmptyState
              icon={<SearchIcon />}
              title="Không tìm thấy phiên phù hợp"
              description="Không có phiên đấu giá nào khớp với điều kiện lọc hiện tại. Bạn có thể điều chỉnh lại hoặc khôi phục bộ lọc."
              action={
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleResetFilters}
                >
                  Khôi phục bộ lọc
                </Button>
              }
            />
          ) : (
            <div
              className={
                isFetching
                  ? "opacity-75 transition-opacity space-y-6"
                  : "space-y-6"
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    onToggleWatch={handleToggleWatch}
                    watchLoading={pendingWatchId === auction.id}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="bg-surface border border-border-brand rounded-xl px-4 py-1">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={PAGE_SIZE}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

