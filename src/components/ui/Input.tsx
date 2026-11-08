import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { AlertCircleIcon } from "../icons";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: "default" | "filter";
  controlSize?: "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: customId,
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      variant = "default",
      controlSize = "lg",
      required,
      disabled,
      className,
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
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-text-tertiary [&>svg]:size-4">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            required={required}
            disabled={disabled}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={describedBy}
            className={cn(
              "w-full text-body text-text placeholder:text-text-placeholder transition-colors rounded-md",
              "border outline-none",
              "focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-focus/20",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-muted",
              // Variant & height
              controlSize === "lg" ? "h-11 px-3.5" : "h-10 px-3 text-small",
              variant === "default"
                ? "bg-surface-subtle border-border-brand"
                : "bg-bg border-border-strong",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              hasError && "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 flex items-center text-text-tertiary [&>svg]:size-4">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";

