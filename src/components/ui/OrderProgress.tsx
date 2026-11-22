import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { OrderStatus } from "@/types/enums";
import { AlertCircleIcon, CheckCircleIcon } from "../icons";

export interface OrderProgressProps {
  status: OrderStatus;
  createdAt?: string | null;
  paidAt?: string | null;
  shippedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  className?: string;
}

const STEPS = [
  { key: OrderStatus.PENDING_PAYMENT, label: "Chờ thanh toán" },
  { key: OrderStatus.PAID, label: "Đã thanh toán" },
  { key: OrderStatus.SHIPPING, label: "Đang giao" },
  { key: OrderStatus.COMPLETED, label: "Hoàn tất" },
] as const;

const STEP_INDEX: Partial<Record<OrderStatus, number>> = {
  [OrderStatus.PENDING_PAYMENT]: 0,
  [OrderStatus.PAID]: 1,
  [OrderStatus.SHIPPING]: 2,
  [OrderStatus.COMPLETED]: 3,
};

export function OrderProgress({
  status,
  createdAt,
  paidAt,
  shippedAt,
  completedAt,
  cancelledAt,
  cancelReason,
  className,
}: OrderProgressProps) {
  if (status === OrderStatus.CANCELLED || status === OrderStatus.EXPIRED) {
    const isCancelled = status === OrderStatus.CANCELLED;
    return (
      <div
        role="status"
        className={cn(
          "flex items-start gap-3 rounded-xl border p-4",
          isCancelled
            ? "border-danger-border bg-danger-bg text-danger-strong"
            : "border-border bg-neutral-bg text-neutral",
          className
        )}
      >
        <AlertCircleIcon className="size-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-body font-semibold">
            {isCancelled ? "Đơn hàng đã bị hủy" : "Đơn hàng đã hết hạn thanh toán"}
          </p>
          {isCancelled && cancelReason && (
            <p className="text-small">Lý do: {cancelReason}</p>
          )}
          {cancelledAt && (
            <p className="text-caption opacity-85">
              Thời điểm: {formatDateTime(cancelledAt)}
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentIdx = STEP_INDEX[status] ?? 0;
  const timestamps = [createdAt, paidAt, shippedAt, completedAt];

  return (
    <ol
      aria-label="Tiến trình đơn hàng"
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-4 rounded-xl border border-border-brand bg-surface p-4 md:p-5",
        className
      )}
    >
      {STEPS.map((step, index) => {
        const isDone = index < currentIdx || status === OrderStatus.COMPLETED;
        const isCurrent = index === currentIdx && status !== OrderStatus.COMPLETED;
        const time = timestamps[index];

        return (
          <li key={step.key} className="flex sm:flex-col items-start gap-3 sm:gap-2">
            <div className="flex items-center gap-2 sm:w-full">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-label font-semibold",
                  isDone
                    ? "bg-success-bg text-success-strong"
                    : isCurrent
                      ? "bg-primary-600 text-text-inverse"
                      : "bg-surface-muted text-text-tertiary"
                )}
              >
                {isDone ? (
                  <CheckCircleIcon className="size-4" />
                ) : (
                  index + 1
                )}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "hidden sm:block h-0.5 flex-1 rounded-full",
                    index < currentIdx ? "bg-success-strong" : "bg-border-brand"
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-small font-semibold",
                  isDone || isCurrent ? "text-text" : "text-text-tertiary"
                )}
              >
                {step.label}
              </p>
              <p className="text-caption text-text-tertiary tabular">
                {time ? formatDateTime(time) : "—"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
