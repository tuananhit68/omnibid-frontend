// TODO fe-v4 auction-list
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { isApiError } from "@/lib/api/types";
import { useAuctions, useCategories } from "../hooks";
import { AuctionCard } from "./AuctionCard";
import { FilterChips } from "./FilterChips";
import { FilterPanel } from "./FilterPanel";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "endTime,asc", label: "Sắp kết thúc" },
  { value: "createdAt,desc", label: "Mới nhất" },
  { value: "currentPrice,asc", label: "Giá thấp đến cao" },
  { value: "currentPrice,desc", label: "Giá cao đến thấp" },
];

export function AuctionListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") || undefined;
  const categoryIdParam = searchParams.get("categoryId");
  const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;
  const status = searchParams.get("status") || undefined;
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
  const sort = searchParams.get("sort") || "endTime,asc";
  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 0 : pageParam - 1;

  const { data: categories = [] } = useCategories();
  const { data, isLoading, isError, error, refetch } = useAuctions({
    keyword,
    categoryId,
    status,
    minPrice,
    maxPrice,
    sort,
    page,
    size: PAGE_SIZE,
  });

  const updateParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === "") next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const auctions = data?.content ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-text">Phiên đấu giá</h1>
          <p className="text-small text-text-secondary">
            Khám phá và tham gia đặt giá trực tuyến
          </p>
        </div>
        <div className="w-56">
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

      <FilterChips
        keyword={keyword}
        categoryId={categoryId}
        status={status}
        minPrice={minPrice}
        maxPrice={maxPrice}
        categories={categories}
        onRemoveKeyword={() => updateParams({ keyword: undefined, page: undefined })}
        onRemoveCategory={() => updateParams({ categoryId: undefined, page: undefined })}
        onRemoveStatus={() => updateParams({ status: undefined, page: undefined })}
        onRemovePrice={() =>
          updateParams({ minPrice: undefined, maxPrice: undefined, page: undefined })
        }
        onClearAll={() => router.replace(pathname, { scroll: false })}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <FilterPanel
            categories={categories}
            categoryId={categoryId}
            status={status}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCategoryChange={(id) =>
              updateParams({ categoryId: id ? String(id) : undefined, page: undefined })
            }
            onStatusChange={(s) => updateParams({ status: s, page: undefined })}
            onPriceChange={(min, max) =>
              updateParams({
                minPrice: min !== undefined ? String(min) : undefined,
                maxPrice: max !== undefined ? String(max) : undefined,
                page: undefined,
              })
            }
            onReset={() => router.replace(pathname, { scroll: false })}
          />
        </aside>

        <section className="lg:col-span-9 space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              message={isApiError(error) ? error.message : undefined}
              onRetry={() => refetch()}
            />
          ) : auctions.length === 0 ? (
            <EmptyState
              title="Không tìm thấy phiên đấu giá"
              description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
              action={
                <Button
                  variant="outline"
                  onClick={() => router.replace(pathname, { scroll: false })}
                >
                  Đặt lại bộ lọc
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
    </div>
  );
}
