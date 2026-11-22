"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IS_DEMO_MODE } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";
import { calculateCountdown, formatDateTime, formatMoney } from "@/lib/format";
import { PaymentMethod, PaymentStatus } from "@/types/enums";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useSharedNowMs } from "@/components/ui/CountdownTimer";
import { Input } from "@/components/ui/Input";
import { Radio } from "@/components/ui/Radio";
import { useToast } from "@/components/ui/Toast";
import { AlertCircleIcon, ClockIcon, CreditCardIcon, InfoIcon } from "@/components/icons";
import { useCreateOrderPayment, useUpdateShippingInfo } from "../hooks";
import {
  SHIPPING_ADDRESS_MAX,
  shippingInfoSchema,
  type ShippingInfoFormValues,
} from "../schemas";
import type { OrderDetail } from "../types";

export interface OrderBuyerPendingCardProps {
  order: OrderDetail;
  serverOffsetMs: number;
  onRefreshOrder: () => void;
}

export function OrderBuyerPendingCard({
  order,
  serverOffsetMs,
  onRefreshOrder,
}: OrderBuyerPendingCardProps) {
  const toast = useToast();
  const nowMs = useSharedNowMs();
  const updateShippingMutation = useUpdateShippingInfo(order.id);
  const paymentMutation = useCreateOrderPayment(order.id);

  const [simulateResult, setSimulateResult] = useState<PaymentStatus>(
    PaymentStatus.SUCCESS
  );
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isNetworkRetry, setIsNetworkRetry] = useState(false);

  // Giữ Idempotency-Key khi lỗi mạng để lần thử lại dùng đúng khóa cũ
  const pendingIdempotencyKeyRef = useRef<string | null>(null);

  const countdown =
    nowMs > 0
      ? calculateCountdown(order.paymentDeadline, serverOffsetMs, nowMs)
      : null;
  const isDeadlinePassed = countdown ? countdown.isZero : false;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isDirty },
  } = useForm<ShippingInfoFormValues>({
    resolver: zodResolver(shippingInfoSchema),
    defaultValues: {
      shippingAddress: order.shippingAddress ?? "",
      phoneNumber: order.phoneNumber ?? "",
    },
  });

  useEffect(() => {
    reset({
      shippingAddress: order.shippingAddress ?? "",
      phoneNumber: order.phoneNumber ?? "",
    });
  }, [order.shippingAddress, order.phoneNumber, reset]);

  const onSaveShipping = (values: ShippingInfoFormValues) => {
    setShippingError(null);
    updateShippingMutation.mutate(
      {
        shippingAddress: values.shippingAddress.trim(),
        phoneNumber: values.phoneNumber.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Đã lưu thông tin nhận hàng");
          setPaymentError(null);
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.code === "VALIDATION_ERROR" && err.fieldErrors) {
              if (err.fieldErrors.shippingAddress) {
                setError("shippingAddress", {
                  message: err.fieldErrors.shippingAddress,
                });
              }
              if (err.fieldErrors.phoneNumber) {
                setError("phoneNumber", {
                  message: err.fieldErrors.phoneNumber,
                });
              }
              return;
            }
            setShippingError(err.message);
            if (
              err.code === "ORDER_EXPIRED" ||
              err.code === "ORDER_CANCELLED" ||
              err.code === "INVALID_STATUS_TRANSITION"
            ) {
              onRefreshOrder();
            }
            return;
          }
          setShippingError("Không thể lưu thông tin nhận hàng. Vui lòng thử lại.");
        },
      }
    );
  };

function formatPaymentFailureReason(reason?: string | null): string {
  switch (reason) {
    case "MOCK_DECLINED":
    case "CARD_DECLINED":
      return "thẻ bị từ chối";
    case "INSUFFICIENT_FUNDS":
      return "số dư không đủ";
    case "EXPIRED_CARD":
      return "thẻ đã hết hạn";
    default:
      return "giao dịch không được chấp nhận";
  }
}

  const handlePay = () => {
    if (paymentMutation.isPending || isDeadlinePassed || isDirty) return;

    setPaymentError(null);
    setIsNetworkRetry(false);

    if (!pendingIdempotencyKeyRef.current) {
      pendingIdempotencyKeyRef.current = crypto.randomUUID();
    }
    const idempotencyKey = pendingIdempotencyKeyRef.current;

    paymentMutation.mutate(
      {
        payload: {
          method: PaymentMethod.MOCK_CARD,
          ...(IS_DEMO_MODE ? { simulateResult } : {}),
        },
        idempotencyKey,
      },
      {
        onSuccess: (res) => {
          pendingIdempotencyKeyRef.current = null;
          if (res.status === PaymentStatus.SUCCESS) {
            toast.success("Thanh toán thành công!");
            setPaymentError(null);
          } else {
            const reasonText = formatPaymentFailureReason(res.failureReason);
            setPaymentError(
              `Thanh toán thất bại (${reasonText}), bạn có thể thử lại trước hạn.`
            );
          }
        },
        onError: (err) => {
          if (err instanceof ApiError && err.code === "NETWORK_ERROR") {
            // Giữ nguyên khóa Idempotency-Key để thử lại an toàn
            setIsNetworkRetry(true);
            setPaymentError(
              `${err.message} Lần bấm thử lại sẽ sử dụng cùng mã giao dịch để tránh trừ tiền hai lần.`
            );
            return;
          }

          pendingIdempotencyKeyRef.current = null;

          if (err instanceof ApiError) {
            if (err.code === "VALIDATION_ERROR") {
              if (err.fieldErrors?.shippingAddress) {
                setError("shippingAddress", {
                  message: err.fieldErrors.shippingAddress,
                });
                setFocus("shippingAddress");
              } else if (err.fieldErrors?.phoneNumber) {
                setError("phoneNumber", {
                  message: err.fieldErrors.phoneNumber,
                });
                setFocus("phoneNumber");
              } else {
                setFocus("shippingAddress");
              }
              setPaymentError(err.message);
              return;
            }

            setPaymentError(err.message);
            if (
              err.code === "ORDER_EXPIRED" ||
              err.code === "ORDER_CANCELLED" ||
              err.code === "INVALID_STATUS_TRANSITION" ||
              err.code === "CONFLICT"
            ) {
              onRefreshOrder();
            }
            return;
          }

          setPaymentError("Không thể xử lý thanh toán. Vui lòng thử lại.");
        },
      }
    );
  };

  return (
    <Card className="p-5 md:p-6 space-y-6">
      {/* Hạn thanh toán + đồng hồ */}
      <div
        className={
          isDeadlinePassed || countdown?.isLessThanFiveMinutes
            ? "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-danger-border bg-danger-bg p-4"
            : "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg p-4"
        }
      >
        <div className="flex items-start gap-2.5">
          <ClockIcon
            className={
              isDeadlinePassed || countdown?.isLessThanFiveMinutes
                ? "size-5 shrink-0 text-danger-strong mt-0.5"
                : "size-5 shrink-0 text-warning-strong mt-0.5"
            }
          />
          <div className="space-y-0.5">
            <p
              className={
                isDeadlinePassed || countdown?.isLessThanFiveMinutes
                  ? "text-small font-semibold text-danger-strong"
                  : "text-small font-semibold text-warning-strong"
              }
            >
              Hạn thanh toán: {formatDateTime(order.paymentDeadline)} (GMT+7)
            </p>
            <p className="text-caption text-text-secondary">
              {isDeadlinePassed
                ? "Đã quá hạn, hệ thống sẽ chuyển đơn sang hết hạn."
                : "Hoàn tất thanh toán trước hạn để giữ sản phẩm."}
            </p>
          </div>
        </div>
        {countdown && (
          <span
            className={
              isDeadlinePassed || countdown.isLessThanFiveMinutes
                ? "text-h3 font-bold text-danger-strong tabular shrink-0"
                : "text-h3 font-bold text-warning-strong tabular shrink-0"
            }
          >
            {isDeadlinePassed ? "00:00:00" : countdown.formatted}
          </span>
        )}
      </div>

      {/* Form thông tin nhận hàng */}
      <form
        onSubmit={handleSubmit(onSaveShipping)}
        className="space-y-4 border-b border-border-subtle pb-6"
        noValidate
      >
        <div>
          <h2 className="text-h3 text-text">Thông tin nhận hàng</h2>
          <p className="text-small text-text-secondary mt-0.5">
            Cần cung cấp địa chỉ và số điện thoại trước khi thanh toán.
          </p>
        </div>

        {shippingError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-small text-danger-strong"
          >
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
            <span>{shippingError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Địa chỉ nhận hàng"
              required
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              maxLength={SHIPPING_ADDRESS_MAX}
              disabled={isDeadlinePassed || updateShippingMutation.isPending}
              error={errors.shippingAddress?.message}
              {...register("shippingAddress")}
            />
          </div>
          <Input
            label="Số điện thoại nhận hàng"
            required
            type="tel"
            placeholder="0901234567"
            disabled={isDeadlinePassed || updateShippingMutation.isPending}
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {isDirty ? (
            <span className="text-caption text-warning-strong">
              Bạn có thay đổi chưa lưu.
            </span>
          ) : (
            <span className="text-caption text-text-tertiary">
              {order.shippingAddress && order.phoneNumber
                ? "Thông tin nhận hàng đã sẵn sàng."
                : "Chưa lưu thông tin nhận hàng."}
            </span>
          )}
          <Button
            type="submit"
            variant="secondary"
            size="md"
            loading={updateShippingMutation.isPending}
            disabled={isDeadlinePassed}
          >
            Lưu thông tin nhận hàng
          </Button>
        </div>
      </form>

      {/* Khối thanh toán */}
      <div className="space-y-4">
        <div>
          <h2 className="text-h3 text-text">Thanh toán đơn hàng</h2>
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-surface-subtle px-3.5 py-2.5 text-small text-text-secondary">
            <CreditCardIcon className="size-4 shrink-0 text-primary-600" />
            <span>
              Phương thức: Thẻ mô phỏng (không phát sinh tiền thật)
            </span>
          </div>
        </div>

        {IS_DEMO_MODE && (
          <fieldset className="rounded-lg border border-border-brand bg-surface-subtle/60 p-4 space-y-2.5">
            <legend className="text-small font-semibold text-text px-1">
              Kết quả mô phỏng (chế độ demo)
            </legend>
            <div className="flex flex-wrap gap-6">
              <Radio
                name="simulateResult"
                label="Thành công"
                checked={simulateResult === PaymentStatus.SUCCESS}
                onChange={() => setSimulateResult(PaymentStatus.SUCCESS)}
                disabled={paymentMutation.isPending || isDeadlinePassed}
              />
              <Radio
                name="simulateResult"
                label="Thất bại"
                checked={simulateResult === PaymentStatus.FAILED}
                onChange={() => setSimulateResult(PaymentStatus.FAILED)}
                disabled={paymentMutation.isPending || isDeadlinePassed}
              />
            </div>
          </fieldset>
        )}

        {paymentError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-3 text-small text-danger-strong"
          >
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-1">
              <p>{paymentError}</p>
              {isNetworkRetry && (
                <p className="text-caption opacity-90">
                  Bấm lại nút Thanh toán bên dưới để thử gửi lại yêu cầu trước đó.
                </p>
              )}
            </div>
          </div>
        )}

        {isDeadlinePassed && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-lg border border-border bg-neutral-bg px-3.5 py-3 text-small text-neutral"
          >
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            <span>Đã quá hạn, hệ thống sẽ chuyển đơn sang hết hạn.</span>
          </div>
        )}

        {isDirty && !isDeadlinePassed && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-lg border border-warning-border bg-warning-subtle-bg px-3.5 py-3 text-small text-warning-strong"
          >
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            <span>
              Bạn có thay đổi thông tin nhận hàng chưa lưu. Vui lòng bấm &ldquo;Lưu thông tin nhận hàng&rdquo; trước khi thanh toán.
            </span>
          </div>
        )}

        <Button
          type="button"
          variant="money"
          size="xl"
          className="w-full"
          loading={paymentMutation.isPending}
          disabled={isDeadlinePassed || isDirty}
          onClick={handlePay}
        >
          Thanh toán {formatMoney(order.finalPrice)}
        </Button>
      </div>
    </Card>
  );
}
