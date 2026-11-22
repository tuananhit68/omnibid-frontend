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
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const localVal = toLocalInputValue(value);
  const localMin = min ? toLocalInputValue(min) : undefined;
  const describedBy = [
    error ? errorId : null,
    helperText && !error ? helperId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-small font-semibold text-text select-none"
        >
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
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
        aria-describedby={describedBy}
        className={cn(
          "h-11 w-full rounded-md border bg-surface-subtle px-3.5 text-body-lg md:text-body text-text tabular transition-colors",
          "focus-visible:border-primary-600 focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed disabled:text-text-disabled disabled:opacity-70",
          error ? "border-danger focus-visible:border-danger focus-visible:outline-danger" : "border-border-brand"
        )}
      />
      {value && !error && (
        <p className="text-caption text-text-tertiary tabular">
          Giờ Việt Nam: {formatDateTime(value)} (GMT+7)
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="text-caption text-text-tertiary">{helperText}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
