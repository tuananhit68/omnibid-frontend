import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { StatusTone } from "@/types/enums";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: StatusTone;
  subText?: ReactNode;
  highlight?: boolean;
}

const iconToneStyles: Record<StatusTone, string> = {
  info: "bg-info-bg text-info",
  success: "bg-success-bg text-success-strong",
  warning: "bg-warning-bg text-warning-strong",
  danger: "bg-danger-bg text-danger-strong",
  neutral: "bg-surface-subtle text-text-tertiary",
  tertiary: "bg-tertiary-100 text-tertiary-800",
};

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      icon,
      tone = "neutral",
      subText,
      highlight = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface border border-border-brand rounded-xl p-5 flex flex-col justify-between transition-colors",
          highlight && tone === "warning" && "bg-warning-subtle-bg border-warning-border",
          highlight && tone === "danger" && "bg-danger-bg border-danger-border",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="label font-medium text-text-tertiary">{label}</span>
          {icon && (
            <div
              className={cn(
                "size-10 rounded-[10px] flex items-center justify-center shrink-0 [&>svg]:size-5",
                iconToneStyles[tone]
              )}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="text-[28px] leading-[36px] font-bold tabular text-text">
            {value}
          </div>
          {subText && (
            <div className="mt-1 text-caption text-text-tertiary">{subText}</div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";
