"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import {
  formatDateTime,
  parseBackendDateTime,
  toBackendDateTimeString,
} from "@/lib/format";

export interface DateTimeInputProps {
  label?: string;
  value?: string;
  onChange: (isoWithOffset: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  min?: string;
  className?: string;
}

function toLocalInputValue(isoValue?: string): string {
  if (!isoValue) return "";
  const parsed = parseBackendDateTime(isoValue);
  if (!parsed) return "";
  return parsed.format("YYYY-MM-DDTHH:mm");
}

export function DateTimeInput({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  id,
  name,
  min,
  className,
}: DateTimeInputProps) {
  const autoId = useId();
  const inputId = id || autoId;
  const localVal = toLocalInputValue(value);
  const localMin = min ? toLocalInputValue(min) : undefined;

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="label block">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type="datetime-local"
        disabled={disabled}
        required={required}
        min={localMin}
        value={localVal}
        onChange={(e) => {
          const raw = e.target.value;
          if (!raw) {
            onChange("");
            return;
          }
          onChange(toBackendDateTimeString(raw));
        }}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "h-11 w-full rounded-md border bg-surface-subtle px-3.5 text-body text-text tabular transition-colors",
          "focus:bg-surface focus:outline-2 focus:outline-focus focus:outline-offset-0",
          "disabled:cursor-not-allowed disabled:text-text-disabled disabled:opacity-70",
          error ? "border-danger" : "border-border-brand"
        )}
      />
      {value && !error && (
        <p className="text-caption text-text-tertiary tabular">
          Giờ Việt Nam: {formatDateTime(value)} (GMT+7)
        </p>
      )}
      {helperText && !error && (
        <p className="text-caption text-text-tertiary">{helperText}</p>
      )}
      {error && (
        <p role="alert" className="text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
