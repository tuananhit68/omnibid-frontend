"use client";

import { useState, type FormEvent } from "react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Radio } from "@/components/ui/Radio";
import { Button } from "@/components/ui/Button";
import { AUCTION_STATUS_META, AuctionStatus } from "@/types/enums";
import type { Category } from "../types";

export type EndingInOption = "" | "1h" | "24h" | "7d";

export const ENDING_IN_OPTIONS: Array<{ value: EndingInOption; label: string }> = [
  { value: "", label: "Bất kỳ" },
  { value: "1h", label: "Trong 1 giờ" },
  { value: "24h", label: "Trong 24 giờ" },
  { value: "7d", label: "Trong 7 ngày" },
];

export const LIST_STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "Tất cả" },
  { value: AuctionStatus.ACTIVE, label: AUCTION_STATUS_META[AuctionStatus.ACTIVE].label },
  {
    value: AuctionStatus.SCHEDULED,
    label: AUCTION_STATUS_META[AuctionStatus.SCHEDULED].label,
  },
  { value: AuctionStatus.ENDED, label: AUCTION_STATUS_META[AuctionStatus.ENDED].label },
  { value: AuctionStatus.UNSOLD, label: AUCTION_STATUS_META[AuctionStatus.UNSOLD].label },
];

export interface FilterPanelProps {
  categories: Category[];
  categoryId?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  endingIn?: EndingInOption;
  onCategoryChange: (id?: number) => void;
  onStatusChange: (status?: string) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onEndingInChange: (value: EndingInOption) => void;
  onReset: () => void;
  inSheet?: boolean;
}

export function FilterPanel({
  categories,
  categoryId,
  status,
  minPrice,
  maxPrice,
  endingIn = "",
  onCategoryChange,
  onStatusChange,
  onPriceChange,
  onEndingInChange,
  onReset,
  inSheet = false,
}: FilterPanelProps) {
  const [minDraft, setMinDraft] = useState(minPrice ? String(minPrice) : "");
  const [maxDraft, setMaxDraft] = useState(maxPrice ? String(maxPrice) : "");
  const [priceError, setPriceError] = useState<string | null>(null);
  const [syncedPriceKey, setSyncedPriceKey] = useState(
    `${minPrice ?? ""}-${maxPrice ?? ""}`
  );

  const currentPriceKey = `${minPrice ?? ""}-${maxPrice ?? ""}`;
  if (currentPriceKey !== syncedPriceKey) {
    setSyncedPriceKey(currentPriceKey);
    setMinDraft(minPrice ? String(minPrice) : "");
    setMaxDraft(maxPrice ? String(maxPrice) : "");
    setPriceError(null);
  }

  const handleApplyPrice = (e: FormEvent) => {
    e.preventDefault();
    const parsedMin = minDraft.trim() ? Number(minDraft.trim()) : undefined;
    const parsedMax = maxDraft.trim() ? Number(maxDraft.trim()) : undefined;
    const validMin =
      parsedMin && !Number.isNaN(parsedMin) && parsedMin > 0
        ? Math.floor(parsedMin)
        : undefined;
    const validMax =
      parsedMax && !Number.isNaN(parsedMax) && parsedMax > 0
        ? Math.floor(parsedMax)
        : undefined;

    if (validMin !== undefined && validMax !== undefined && validMin > validMax) {
      setPriceError("Giá tối thiểu không được lớn hơn giá tối đa.");
      return;
    }

    setPriceError(null);
    onPriceChange(validMin, validMax);
  };

  return (
    <div
      className={
        inSheet
          ? "space-y-5"
          : "space-y-5 rounded-xl border border-border-brand bg-surface p-5"
      }
    >
      {!inSheet && (
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <h2 className="text-h4 text-text">Bộ lọc</h2>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Xóa bộ lọc
          </Button>
        </div>
      )}

      {/* Danh mục */}
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

      {/* Trạng thái */}
      <fieldset className="space-y-1 border-t border-border-subtle pt-4">
        <legend className="block text-small font-semibold text-text mb-1">
          Trạng thái
        </legend>
        <div className="flex flex-col">
          {LIST_STATUS_OPTIONS.map((opt) => (
            <Radio
              key={opt.value || "all"}
              name={inSheet ? "status-sheet" : "status-desktop"}
              label={opt.label}
              checked={(status ?? "") === opt.value}
              onChange={() => onStatusChange(opt.value || undefined)}
            />
          ))}
        </div>
      </fieldset>

      {/* Kết thúc trong */}
      <fieldset className="space-y-1 border-t border-border-subtle pt-4">
        <legend className="block text-small font-semibold text-text mb-1">
          Kết thúc trong
        </legend>
        <div className="flex flex-col">
          {ENDING_IN_OPTIONS.map((opt) => (
            <Radio
              key={opt.value || "any"}
              name={inSheet ? "ending-sheet" : "ending-desktop"}
              label={opt.label}
              checked={endingIn === opt.value}
              onChange={() => onEndingInChange(opt.value)}
            />
          ))}
        </div>
      </fieldset>

      {/* Khoảng giá hiện tại */}
      <form
        onSubmit={handleApplyPrice}
        className="space-y-3 border-t border-border-subtle pt-4"
      >
        <p className="text-small font-semibold text-text">Khoảng giá hiện tại (₫)</p>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Từ"
            type="number"
            min={0}
            step={100000}
            placeholder="0"
            value={minDraft}
            onChange={(e) => {
              setMinDraft(e.target.value);
              if (priceError) setPriceError(null);
            }}
          />
          <Input
            label="Đến"
            type="number"
            min={0}
            step={100000}
            placeholder="Tối đa"
            value={maxDraft}
            onChange={(e) => {
              setMaxDraft(e.target.value);
              if (priceError) setPriceError(null);
            }}
          />
        </div>
        {priceError && (
          <p role="alert" className="text-caption text-danger">
            {priceError}
          </p>
        )}
        <Button type="submit" variant="secondary" size="md" className="w-full min-h-11 md:min-h-9">
          Áp dụng khoảng giá
        </Button>
      </form>
    </div>
  );
}
