import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { AlertCircleIcon, ChevronDownIcon } from "../icons";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  options?: SelectOption[];
  controlSize?: "md" | "lg";
  children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id: customId,
      label,
      hint,
      error,
      options,
      controlSize = "lg",
      required,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

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
          <select
            ref={ref}
            id={id}
            required={required}
            disabled={disabled}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={describedBy}
            className={cn(
              "w-full text-body text-text appearance-none transition-colors rounded-md",
              "bg-surface-subtle border border-border-brand outline-none pr-10",
              "focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-focus/20",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-muted",
              controlSize === "lg" ? "h-11 px-3.5" : "h-10 px-3 text-small",
              hasError && "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3.5 pointer-events-none text-text-tertiary">
            <ChevronDownIcon className="size-4" />
          </div>
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

Select.displayName = "Select";

