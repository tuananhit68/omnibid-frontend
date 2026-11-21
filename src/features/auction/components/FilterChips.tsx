// TODO fe-v4 auction-list
"use client";

import { CloseIcon } from "@/components/icons";
import { formatMoney } from "@/lib/format";
import { AUCTION_STATUS_META, type AuctionStatus } from "@/types/enums";
import type { Category } from "../types";

export interface FilterChipsProps {
  keyword?: string;
  categoryId?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  categories: Category[];
  onRemoveKeyword: () => void;
  onRemoveCategory: () => void;
  onRemoveStatus: () => void;
  onRemovePrice: () => void;
  onClearAll: () => void;
}

export function FilterChips({
  keyword,
  categoryId,
  status,
  minPrice,
  maxPrice,
  categories,
  onRemoveKeyword,
  onRemoveCategory,
  onRemoveStatus,
  onRemovePrice,
  onClearAll,
}: FilterChipsProps) {
  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];

  if (keyword) {
    chips.push({ key: "keyword", label: `Từ khóa: ${keyword}`, onRemove: onRemoveKeyword });
  }
  if (categoryId !== undefined) {
    const cat = categories.find((c) => c.id === categoryId);
    chips.push({
      key: "category",
      label: `Danh mục: ${cat?.name ?? `#${categoryId}`}`,
      onRemove: onRemoveCategory,
    });
  }
  if (status) {
    const meta = AUCTION_STATUS_META[status as AuctionStatus];
    chips.push({
      key: "status",
      label: `Trạng thái: ${meta?.label ?? status}`,
      onRemove: onRemoveStatus,
    });
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    chips.push({
      key: "price",
      label: `Giá: ${minPrice ? formatMoney(minPrice) : "0 ₫"} – ${maxPrice ? formatMoney(maxPrice) : "Không giới hạn"}`,
      onRemove: onRemovePrice,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-sm bg-surface-muted px-2.5 py-1 text-caption font-medium text-text"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Bỏ lọc ${chip.label}`}
            className="text-text-tertiary hover:text-text"
          >
            <CloseIcon className="size-3.5" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-caption font-medium text-primary-600 hover:underline"
      >
        Xóa tất cả
      </button>
    </div>
  );
}
