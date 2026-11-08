import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { InfoIcon } from "../icons";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-xl border border-dashed border-border-strong bg-surface-subtle/40",
        className
      )}
    >
      <div className="size-12 rounded-full bg-surface-muted flex items-center justify-center text-text-tertiary mb-3.5 [&>svg]:size-6">
        {icon || <InfoIcon />}
      </div>
      <h4 className="text-h4 font-semibold text-text">{title}</h4>
      {description && (
        <p className="mt-1 text-small text-text-tertiary max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
