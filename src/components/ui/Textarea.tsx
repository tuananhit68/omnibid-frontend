import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";
import { AlertCircleIcon } from "../icons";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id: customId,
      label,
      hint,
      error,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      required,
      disabled,
      className,
      rows = 4,
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

    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
        ? defaultValue.length
        : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={id}
              className="block text-small font-semibold text-text select-none"
            >
              {label}
              {required && <span className="ml-1 text-danger">*</span>}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-caption text-text-tertiary">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full p-3.5 text-body-lg md:text-body text-text placeholder:text-text-placeholder transition-colors rounded-md",
            "bg-surface-subtle border border-border-brand resize-y",
            "focus-visible:border-primary-600 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-muted",
            hasError && "border-danger focus-visible:border-danger focus-visible:outline-danger",
            className
          )}
          {...props}
        />

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

Textarea.displayName = "Textarea";

