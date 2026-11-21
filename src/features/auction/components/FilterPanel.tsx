// TODO fe-v4 auction-list
"use client";

import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AUCTION_STATUS_META, AuctionStatus } from "@/types/enums";
import type { Category } from "../types";

export interface FilterPanelProps {
  categories: Category[];
  categoryId?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  onCategoryChange: (id?: number) => void;
  onStatusChange: (status?: string) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onReset: () => void;
}

export function FilterPanel({
  categories,
  categoryId,
  status,
  minPrice,
  maxPrice,
  onCategoryChange,
  onStatusChange,
  onPriceChange,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border-brand bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-h4 text-text">Bộ lọc</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Đặt lại
        </Button>
      </div>

      <Select
        label="Danh mục"
        value={categoryId ? String(categoryId) : ""}
        onChange={(e) =>
          onCategoryChange(e.target.value ? Number(e.target.value) : undefined)
        }
        options={[
          { value: "", label: "Tất cả danh mục" },
          ...categories.map((c) => ({ value: String(c.id), label: c.name })),
        ]}
      />

      <Select
        label="Trạng thái"
        value={status ?? ""}
        onChange={(e) => onStatusChange(e.target.value || undefined)}
        options={[
          { value: "", label: "Tất cả trạng thái" },
          ...Object.values(AuctionStatus).map((s) => ({
            value: s,
            label: AUCTION_STATUS_META[s].label,
          })),
        ]}
      />

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Giá từ (₫)"
          type="number"
          min={0}
          value={minPrice ?? ""}
          onChange={(e) =>
            onPriceChange(
              e.target.value ? Number(e.target.value) : undefined,
              maxPrice
            )
          }
        />
        <Input
          label="Đến (₫)"
          type="number"
          min={0}
          value={maxPrice ?? ""}
          onChange={(e) =>
            onPriceChange(
              minPrice,
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />
      </div>
    </div>
  );
}
