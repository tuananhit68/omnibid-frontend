"use client";

import type { KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    );
    const activeIndex = tabs.findIndex(
      (t) => t.getAttribute("aria-selected") === "true"
    );
    if (activeIndex === -1) return;

    let nextIndex = activeIndex;
    if (e.key === "ArrowRight") {
      nextIndex = (activeIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-lg bg-surface-subtle p-1",
        className
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex min-h-11 md:min-h-9 items-center gap-1.5 rounded-md px-3.5 text-small font-medium transition-all",
              "focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
              selected
                ? "bg-surface text-text shadow-xs"
                : "text-text-secondary hover:text-text"
            )}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-caption tabular",
                  selected
                    ? "bg-primary-50 text-primary-600"
                    : "bg-surface-muted text-text-tertiary"
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
