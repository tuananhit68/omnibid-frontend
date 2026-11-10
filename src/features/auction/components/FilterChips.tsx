import { formatMoney } from "@/lib/format";
import { CloseIcon } from "@/components/icons";
import { AuctionStatus } from "@/types/enums";
import type { CategoryItem } from "../types";
import type { AuctionFilterState } from "./FilterPanel";

export interface FilterChipsProps {
  keyword?: string;
  filters: AuctionFilterState;
  categories: CategoryItem[];
  onRemoveKeyword: () => void;
  onRemoveCategory: (categoryId: number) => void;
  onRemovePrice: () => void;
  onRemoveStatus: () => void;
}

export function FilterChips({
  keyword,
  filters,
  categories,
  onRemoveKeyword,
  onRemoveCategory,
  onRemovePrice,
  onRemoveStatus,
}: FilterChipsProps) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (keyword?.trim()) {
    chips.push({
      key: "keyword",
      label: `Từ khoá: "${keyword.trim()}"`,
      onRemove: onRemoveKeyword,
    });
  }

  filters.categoryIds.forEach((catId) => {
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      chips.push({
        key: `cat-${catId}`,
        label: cat.name,
        onRemove: () => onRemoveCategory(catId),
      });
    }
  });

  if (filters.minPrice || filters.maxPrice) {
    let priceLabel = "";
    if (filters.minPrice && filters.maxPrice) {
      priceLabel = `${formatMoney(filters.minPrice)} - ${formatMoney(filters.maxPrice)}`;
    } else if (filters.minPrice) {
      priceLabel = `Từ ${formatMoney(filters.minPrice)}`;
    } else if (filters.maxPrice) {
      priceLabel = `Đến ${formatMoney(filters.maxPrice)}`;
    }
    chips.push({
      key: "price",
      label: priceLabel,
      onRemove: onRemovePrice,
    });
  }

  if (filters.status) {
    const statusLabel =
      filters.status === AuctionStatus.ACTIVE
        ? "Đang diễn ra"
        : filters.status === AuctionStatus.SCHEDULED
        ? "Sắp diễn ra"
        : filters.status;
    chips.push({
      key: "status",
      label: statusLabel,
      onRemove: onRemoveStatus,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-info-bg border border-info-border text-primary-600 text-caption font-medium whitespace-nowrap"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Bỏ lọc ${chip.label}`}
            className="p-0.5 rounded hover:bg-primary-100 transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            <CloseIcon className="size-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}

