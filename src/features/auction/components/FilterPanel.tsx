"use client";

import { useState, useEffect, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import { Select } from "@/components/ui/Select";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { CloseIcon, FilterIcon } from "@/components/icons";
import { AuctionStatus } from "@/types/enums";
import type { AuctionSortOption, CategoryItem } from "../types";

export interface AuctionFilterState {
  categoryIds: number[];
  minPrice?: number;
  maxPrice?: number;
  status: string; // "" = tất cả, "ACTIVE", "SCHEDULED"
  sort: AuctionSortOption | string;
}

export interface FilterPanelProps {
  filters: AuctionFilterState;
  categories: CategoryItem[];
  categoriesLoading?: boolean;
  onApply: (next: AuctionFilterState) => void;
  onReset: () => void;
  className?: string;
}

const SORT_OPTIONS = [
  { value: "endTime,asc", label: "Sắp kết thúc" },
  { value: "startTime,asc", label: "Sắp bắt đầu" },
  { value: "currentPrice,asc", label: "Giá thấp đến cao" },
  { value: "currentPrice,desc", label: "Giá cao đến thấp" },
  { value: "bidCount,desc", label: "Nhiều lượt đặt nhất" },
  { value: "createdAt,desc", label: "Mới nhất" },
];

function FilterFormContent({
  filters,
  categories,
  categoriesLoading,
  onApply,
  onReset,
  onAfterApply,
}: FilterPanelProps & { onAfterApply?: () => void }) {
  const [draft, setDraft] = useState<AuctionFilterState>(filters);
  const [priceError, setPriceError] = useState<string | undefined>();

  const validatePrice = (min?: number, max?: number): boolean => {
    if (
      min !== undefined &&
      min > 0 &&
      max !== undefined &&
      max > 0 &&
      min > max
    ) {
      setPriceError('Giá "Từ" phải nhỏ hơn hoặc bằng giá "Đến"');
      return false;
    }
    setPriceError(undefined);
    return true;
  };

  const toggleCategory = (id: number) => {
    setDraft((prev) => {
      const exists = prev.categoryIds.includes(id);
      return {
        ...prev,
        categoryIds: exists
          ? prev.categoryIds.filter((c) => c !== id)
          : [...prev.categoryIds, id],
      };
    });
  };

  const handleApplyPrice = () => {
    if (!validatePrice(draft.minPrice, draft.maxPrice)) return;
    onApply(draft);
    onAfterApply?.();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validatePrice(draft.minPrice, draft.maxPrice)) return;
    onApply(draft);
    onAfterApply?.();
  };

  const handleReset = () => {
    setPriceError(undefined);
    onReset();
    onAfterApply?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2 min-w-0">
          <FilterIcon className="size-4.5 text-primary-600 shrink-0" />
          <h2 className="text-h3 font-semibold text-text truncate">
            Bộ lọc tìm kiếm
          </h2>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-small font-medium text-text-link hover:underline shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-focus rounded"
        >
          Xóa bộ lọc
        </button>
      </div>

      {/* Nhóm 1: Danh mục sản phẩm */}
      <div className="space-y-2.5 pb-5 border-b border-border-subtle">
        <h3 className="text-small font-semibold text-text">Danh mục sản phẩm</h3>
        {categoriesLoading ? (
          <div className="space-y-2.5 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-caption text-text-tertiary">Chưa có danh mục</p>
        ) : (
          <div className="space-y-1">
            {categories.map((cat) => {
              const checked = draft.categoryIds.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-2"
                >
                  <Checkbox
                    label={cat.name}
                    checked={checked}
                    onChange={() => toggleCategory(cat.id)}
                    className="flex-1 min-w-0"
                  />
                  {cat.auctionCount !== undefined && (
                    <span className="text-caption text-text-tertiary tabular shrink-0">
                      {cat.auctionCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Nhóm 2: Khoảng giá */}
      <div className="space-y-3 pb-5 border-b border-border-subtle">
        <h3 className="text-small font-semibold text-text">Khoảng giá (₫)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          <MoneyInput
            label="Từ"
            placeholder="0"
            value={draft.minPrice}
            onChange={(val) => {
              const nextMin = val > 0 ? val : undefined;
              setDraft((prev) => ({ ...prev, minPrice: nextMin }));
              if (priceError) validatePrice(nextMin, draft.maxPrice);
            }}
          />
          <MoneyInput
            label="Đến"
            placeholder="Không giới hạn"
            value={draft.maxPrice}
            onChange={(val) => {
              const nextMax = val > 0 ? val : undefined;
              setDraft((prev) => ({ ...prev, maxPrice: nextMax }));
              if (priceError) validatePrice(draft.minPrice, nextMax);
            }}
            error={priceError}
          />
        </div>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleApplyPrice}
          className="w-full"
        >
          Áp dụng giá
        </Button>
      </div>

      {/* Nhóm 3: Trạng thái phiên */}
      <div className="space-y-2 pb-5 border-b border-border-subtle">
        <h3 className="text-small font-semibold text-text">Trạng thái phiên</h3>
        <div className="space-y-0.5">
          <Radio
            name="auction-status"
            label="Đang diễn ra"
            checked={draft.status === AuctionStatus.ACTIVE}
            onChange={() =>
              setDraft((prev) => ({ ...prev, status: AuctionStatus.ACTIVE }))
            }
          />
          <Radio
            name="auction-status"
            label="Sắp diễn ra"
            checked={draft.status === AuctionStatus.SCHEDULED}
            onChange={() =>
              setDraft((prev) => ({ ...prev, status: AuctionStatus.SCHEDULED }))
            }
          />
          <Radio
            name="auction-status"
            label="Tất cả"
            checked={draft.status === ""}
            onChange={() => setDraft((prev) => ({ ...prev, status: "" }))}
          />
        </div>
      </div>

      {/* Nhóm 4: Sắp xếp */}
      <div className="space-y-2">
        <Select
          label="Sắp xếp theo"
          value={draft.sort}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, sort: e.target.value }))
          }
          options={SORT_OPTIONS}
        />
      </div>

      {/* Action Footer */}
      <div className="pt-2 space-y-2">
        <Button type="submit" variant="primary" size="lg" className="w-full">
          Áp dụng bộ lọc
        </Button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full min-h-11 text-center text-small font-medium text-text-secondary hover:text-text transition-colors rounded-md focus-visible:outline-2 focus-visible:outline-focus"
        >
          Khôi phục mặc định
        </button>
      </div>
    </form>
  );
}

export function FilterPanel({
  filters,
  categories,
  categoriesLoading,
  onApply,
  onReset,
  className,
}: FilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount =
    filters.categoryIds.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.status ? 1 : 0);

  // Khoá cuộn & Esc khi mở bottom sheet trên mobile
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const filterKey = `${filters.status}-${filters.sort}-${filters.minPrice ?? ""}-${filters.maxPrice ?? ""}-${filters.categoryIds.join(",")}`;

  return (
    <>
      {/* Nút mở bộ lọc trên mobile (< 768px) */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          size="lg"
          leftIcon={<FilterIcon className="size-4" />}
          onClick={() => setMobileOpen(true)}
          className="w-full justify-center"
        >
          {activeCount > 0 ? `Lọc (${activeCount})` : "Bộ lọc tìm kiếm"}
        </Button>
      </div>

      {/* Bottom sheet trên mobile (< 768px) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-overlay backdrop-blur-xs md:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Bộ lọc tìm kiếm"
            className="w-full max-h-[88vh] bg-surface rounded-t-2xl shadow-lg p-5 overflow-y-auto"
          >
            <div className="flex items-center justify-end pb-2">
              <IconButton
                label="Đóng bộ lọc"
                icon={<CloseIcon />}
                size="md"
                onClick={() => setMobileOpen(false)}
              />
            </div>
            <FilterFormContent
              key={filterKey}
              filters={filters}
              categories={categories}
              categoriesLoading={categoriesLoading}
              onApply={onApply}
              onReset={onReset}
              onAfterApply={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Card Sidebar cho tablet & desktop (>= 768px) */}
      <aside
        className={cn(
          "hidden md:block bg-surface border border-border-brand rounded-xl p-6 shrink-0",
          "w-full lg:w-70", // 280px theo spec S01
          className
        )}
      >
        <FilterFormContent
          key={filterKey}
          filters={filters}
          categories={categories}
          categoriesLoading={categoriesLoading}
          onApply={onApply}
          onReset={onReset}
        />
      </aside>
    </>
  );
}
