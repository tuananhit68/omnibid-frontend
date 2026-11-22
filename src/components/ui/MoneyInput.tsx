"use client";

import {
  forwardRef,
  useId,
  useState,
  useEffect,
  type ChangeEvent,
} from "react";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { AlertCircleIcon } from "../icons";

export interface MoneyInputProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    {
      id: customId,
      label,
      hint,
      error,
      value,
      defaultValue,
      onChange,
      placeholder = "0",
      disabled,
      required,
      className,
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    const [displayVal, setDisplayVal] = useState<string>(() => {
      const init = value !== undefined ? value : defaultValue;
      return init !== undefined ? formatNumber(init) : "";
    });

    useEffect(() => {
      if (value !== undefined) {
        setDisplayVal(formatNumber(value));
      }
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      if (raw === "") {
        setDisplayVal("");
        onChange?.(0);
        return;
      }
      const num = parseInt(raw, 10);
      setDisplayVal(formatNumber(num));
      onChange?.(num);
    };

    const hasError = Boolean(error);
    const describedBy = [
      hasError ? errorId : null,
      hint && !hasError ? hintId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-small font-semibold text-text select-none"
          >
            {label}
            {required && <span className="ml-1 text-danger">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="numeric"
            value={displayVal}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={describedBy}
            className={cn(
              "w-full h-[52px] pl-4 pr-10 text-right tabular text-[20px] font-bold text-primary-700 bg-surface rounded-lg",
              "border border-border-brand outline-none transition-colors",
              "focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-focus/20",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-muted",
              hasError && "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
              className
            )}
          />
          <span className="absolute right-4 text-body font-semibold text-text-subtle pointer-events-none select-none">
            ₫
          </span>
        </div>

        {hasError ? (
          <p
            id={errorId}
            className="flex items-center gap-1.5 text-caption text-danger"
          >
            <AlertCircleIcon className="size-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={hintId} className="text-caption text-text-tertiary">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

MoneyInput.displayName = "MoneyInput";

