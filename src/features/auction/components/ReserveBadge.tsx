import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";
import type { ReserveStatus } from "@/types/enums";

export interface ReserveBadgeProps {
  status: ReserveStatus;
  compact?: boolean;
  className?: string;
}

export function ReserveBadge({
  status,
  compact = false,
  className,
}: ReserveBadgeProps) {
  return (
    <StatusBadge
      statusType="reserve"
      value={status}
      withDot={false}
      className={cn(
        compact && "h-5.5 px-2 text-caption",
        className
      )}
    />
  );
}
