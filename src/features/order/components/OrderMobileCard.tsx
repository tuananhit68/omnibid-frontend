"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatDisplayCode, formatMoney } from "@/lib/format";
import { getButtonClassName } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OrderRole, OrderSummary } from "../types";
import { isOrderActionNeeded, OrderDeadlineCell } from "./OrderDeadlineCell";

export function OrderMobileCard({
  order,
  role,
  serverOffsetMs,
}: {
  order: OrderSummary;
  role: OrderRole;
  serverOffsetMs: number;
}) {
  const needsAction = isOrderActionNeeded(order, role);
  const counterparty = role === "BUYER" ? order.seller : order.buyer;
  const counterpartyLabel = role === "BUYER" ? "Người bán" : "Người mua";

  return (
    <div
      className={cn(
        "p-4 border-b border-border-subtle last:border-b-0 space-y-3",
        needsAction && "bg-warning-subtle-bg"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border-brand bg-surface-subtle">
            {order.primaryImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={order.primaryImageUrl}
                alt={order.title}
                className="size-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-caption font-semibold text-text-tertiary tabular">
                {formatDisplayCode("ORD", order.id)}
              </span>
              {needsAction && (
                <span className="inline-flex items-center rounded-full bg-warning-bg px-2 py-0.5 text-caption font-medium text-warning-strong">
                  Cần bạn xử lý
                </span>
              )}
            </div>
            <Link
              href={`/orders/${order.id}`}
              className="text-small font-semibold text-text hover:text-primary-600 line-clamp-1"
            >
              {order.title}
            </Link>
          </div>
        </div>
        <StatusBadge statusType="order" value={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface p-3 border border-border-subtle text-small">
        <div>
          <span className="label block">{counterpartyLabel}</span>
          <span className="font-medium text-text line-clamp-1">
            {counterparty.fullName}
          </span>
        </div>
        <div>
          <span className="label block">Giá chốt</span>
          <span className="font-bold text-primary-700 tabular">
            {formatMoney(order.finalPrice)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <OrderDeadlineCell order={order} serverOffsetMs={serverOffsetMs} />
        <Link
          href={`/orders/${order.id}`}
          className={getButtonClassName({
            variant: needsAction ? "primary" : "outline",
            size: "md",
          })}
        >
          Xem
        </Link>
      </div>
    </div>
  );
}
