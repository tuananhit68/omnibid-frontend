"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { AlertCircleIcon, PackageIcon } from "@/components/icons";
import { useShipOrder } from "../hooks";
import {
  shipOrderSchema,
  TRACKING_CODE_MAX,
  type ShipOrderFormValues,
} from "../schemas";
import type { OrderDetail } from "../types";

export interface OrderSellerPaidCardProps {
  order: OrderDetail;
  onRefreshOrder: () => void;
}

export function OrderSellerPaidCard({
  order,
  onRefreshOrder,
}: OrderSellerPaidCardProps) {
  const toast = useToast();
  const shipMutation = useShipOrder(order.id);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ShipOrderFormValues>({
    resolver: zodResolver(shipOrderSchema),
    defaultValues: {
      trackingCode: "",
    },
  });

  const onSubmit = (values: ShipOrderFormValues) => {
    setFormError(null);
    const trackingCode = values.trackingCode?.trim();
    shipMutation.mutate(
      trackingCode ? { trackingCode } : {},
      {
        onSuccess: () => {
          toast.success("Đã xác nhận gửi hàng cho người mua");
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.code === "VALIDATION_ERROR" && err.fieldErrors?.trackingCode) {
              setError("trackingCode", {
                message: err.fieldErrors.trackingCode,
              });
              return;
            }
            setFormError(err.message);
            if (err.code === "INVALID_STATUS_TRANSITION") {
              onRefreshOrder();
            }
            return;
          }
          setFormError("Không thể cập nhật trạng thái gửi hàng. Vui lòng thử lại.");
        },
      }
    );
  };

  return (
    <Card className="p-5 md:p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-info-bg text-info">
          <PackageIcon className="size-5" />
        </div>
        <div>
          <h2 className="text-h3 text-text">Gửi hàng cho người mua</h2>
          <p className="text-small text-text-secondary mt-0.5">
            Đơn hàng đã được thanh toán. Vui lòng đóng gói và gửi tới địa chỉ bên dưới.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border-brand bg-surface-subtle p-4 space-y-2 text-small">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
          <span className="label">Người nhận</span>
          <span className="font-medium text-text">{order.buyer.fullName}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
          <span className="label">Số điện thoại</span>
          <span className="font-medium text-text tabular">
            {order.phoneNumber ?? "—"}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
          <span className="label shrink-0">Địa chỉ nhận hàng</span>
          <span className="font-medium text-text sm:text-right">
            {order.shippingAddress ?? "—"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-small text-danger-strong"
          >
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <Input
          label="Mã vận đơn (tùy chọn)"
          placeholder="Ví dụ: VNPOST-8841290 hoặc GHN-9921045"
          hint={`Tối đa ${TRACKING_CODE_MAX} ký tự. Có thể để trống nếu giao trực tiếp.`}
          maxLength={TRACKING_CODE_MAX}
          disabled={shipMutation.isPending}
          error={errors.trackingCode?.message}
          {...register("trackingCode")}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={shipMutation.isPending}
        >
          Xác nhận đã gửi hàng
        </Button>
      </form>
    </Card>
  );
}
