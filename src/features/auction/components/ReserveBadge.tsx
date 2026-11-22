import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";
import { ReserveStatus } from "@/types/enums";

export interface ReserveBadgeProps {
  status: ReserveStatus;
  compact?: boolean;
  className?: string;
}

const RESERVE_TOOLTIP: Partial<Record<ReserveStatus, string>> = {
  [ReserveStatus.NOT_MET]:
    "Chưa đạt mức giá sàn của người bán. Phiên chỉ có người thắng khi đạt mức giá này.",
  [ReserveStatus.MET]: "Đã đạt mức giá sàn của người bán.",
};

export function ReserveBadge({
  status,
  compact = false,
  className,
}: ReserveBadgeProps) {
  return (
    <span title={RESERVE_TOOLTIP[status]} className="inline-flex">
      <StatusBadge
        statusType="reserve"
        value={status}
        withDot={false}
        className={cn(compact && "h-5.5 px-2 text-caption", className)}
      />
    </span>
  );
}
