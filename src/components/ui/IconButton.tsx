import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SpinnerIcon } from "../icons";

export type IconButtonVariant =
  | "ghost"
  | "outline"
  | "tertiary"
  | "secondary"
  | "primary";

export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string; // Bắt buộc cho accessibility
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
}

const variantStyles: Record<IconButtonVariant, string> = {
  ghost:
    "bg-transparent text-text-tertiary hover:bg-surface-subtle hover:text-text active:bg-surface-muted",
  outline:
    "bg-surface text-text border border-border-strong hover:bg-surface-subtle active:bg-surface-muted",
  tertiary:
    "bg-surface-subtle text-text-secondary hover:bg-surface-muted active:bg-surface-strong",
  secondary:
    "bg-surface-muted text-text hover:bg-surface-strong active:bg-primary-100",
  primary:
    "bg-primary-600 text-text-inverse hover:bg-primary-700 active:bg-primary-800",
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "size-8 p-1.5 text-label rounded-md",
  md: "size-10 p-2 text-small rounded-md",
  lg: "size-11 p-2.5 text-body rounded-md", // 44x44px tiêu chuẩn vùng bấm
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      label,
      icon,
      type = "button",
      variant = "ghost",
      size = "lg",
      loading = false,
      disabled = false,
      className,
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
        aria-label={label}
        aria-busy={loading ? "true" : undefined}
        title={label}
        className={cn(
          "inline-flex items-center justify-center transition-colors shrink-0 select-none",
          "focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <SpinnerIcon className="size-4.5 animate-spin" />
        ) : (
          <span className="shrink-0 flex items-center justify-center [&>svg]:size-5">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

