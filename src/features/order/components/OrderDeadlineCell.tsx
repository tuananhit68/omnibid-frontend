"use client";

import { useSharedNowMs } from "@/components/ui/CountdownTimer";
import { calculateCountdown, formatDateTime } from "@/lib/format";
import { OrderStatus } from "@/types/enums";
import type { OrderSummary } from "../types";

export function isOrderActionNeeded(
  order: Pick<OrderSummary, "status">,
  role: "BUYER" | "SELLER"
): boolean {
  if (role === "BUYER") {
    return (
      order.status === OrderStatus.PENDING_PAYMENT ||
      order.status === OrderStatus.SHIPPING
    );
  }
  return order.status === OrderStatus.PAID;
}

export function OrderDeadlineCell({
  order,
  serverOffsetMs = 0,
}: {
  order: Pick<OrderSummary, "status" | "paymentDeadline" | "confirmDeadline">;
  serverOffsetMs?: number;
}) {
  const nowMs = useSharedNowMs();

  const deadline =
    order.status === OrderStatus.PENDING_PAYMENT
      ? order.paymentDeadline
      : order.status === OrderStatus.SHIPPING
        ? order.confirmDeadline
        : null;

  if (!deadline) {
    return <span className="text-small text-text-tertiary">—</span>;
  }

  const countdown =
    nowMs > 0 ? calculateCountdown(deadline, serverOffsetMs, nowMs) : null;

  const isUrgent = countdown ? countdown.isLessThanFiveMinutes : false;

  return (
    <div className="space-y-0.5 tabular">
      <p className="text-small text-text">{formatDateTime(deadline)}</p>
      {countdown && (
        <p
          className={
            countdown.isZero
              ? "text-caption font-medium text-danger"
              : isUrgent
                ? "text-caption font-medium text-danger"
                : "text-caption text-warning-strong"
          }
        >
          {countdown.isZero ? "Đã quá hạn" : `còn ${countdown.formatted}`}
        </p>
      )}
    </div>
  );
}
