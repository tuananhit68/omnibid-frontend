import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SpinnerIcon } from "../icons";

export type ButtonVariant =
  | "primary"
  | "money"
  | "primary-strong"
  | "secondary"
  | "tertiary"
  | "outline"
  | "danger-soft"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-text-inverse hover:bg-primary-700 active:bg-primary-800 border border-transparent",
  money:
    "bg-primary-700 text-text-inverse hover:bg-primary-800 active:bg-primary-900 border border-transparent",
  "primary-strong":
    "bg-primary-700 text-text-inverse hover:bg-primary-800 active:bg-primary-900 border border-transparent",
  secondary:
    "bg-surface-muted text-text hover:bg-surface-strong active:bg-primary-100 border border-transparent",
  tertiary:
    "bg-surface-subtle text-text-secondary hover:bg-surface-muted active:bg-surface-strong border border-transparent",
  outline:
    "bg-surface text-text border border-border-strong hover:bg-surface-subtle active:bg-surface-muted",
  "danger-soft":
    "bg-danger-bg text-danger hover:bg-danger-border active:bg-danger-strong active:text-text-inverse border border-transparent",
  ghost:
    "bg-transparent text-text-link hover:bg-surface-subtle active:bg-surface-muted border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-label rounded-md gap-1.5",
  md: "h-10 px-4 text-small rounded-md gap-2",
  lg: "h-11 px-5 text-body rounded-md gap-2",
  xl: "h-13 px-7 text-body-lg font-semibold rounded-lg gap-2.5",
};

export function getButtonClassName({
  variant = "primary",
  size = "lg",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex items-center justify-center font-semibold transition-colors select-none whitespace-nowrap",
    "focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "button",
      variant = "primary",
      size = "lg",
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading ? "true" : undefined}
        className={getButtonClassName({ variant, size, className })}
        {...props}
      >
        {loading ? (
          <SpinnerIcon className="size-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
