"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  DateTimeInput,
  MoneyInput,
} from "@/components/ui";
import { AlertCircleIcon, InfoIcon } from "@/components/icons";
import { ApiError } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";
import { auctionFormSchema, type AuctionFormValues } from "../schemas";

function formatDurationPreview(startTime?: string, endTime?: string): string {
  if (!startTime || !endTime) return "Chưa chọn đủ mốc thời gian";
  const startMs = Date.parse(startTime);
  const endMs = Date.parse(endTime);
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs <= startMs) {
    return "Thời gian kết thúc phải sau thời gian bắt đầu";
  }
  const totalMinutes = Math.floor((endMs - startMs) / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} ngày ${hours} giờ${minutes > 0 ? ` ${minutes} phút` : ""}`;
  }
  if (hours > 0) {
    return `${hours} giờ${minutes > 0 ? ` ${minutes} phút` : ""}`;
  }
  return `${minutes} phút`;
}

export interface AuctionScheduleFormProps {
  defaultValues: {
    startPrice: number;
    bidIncrement: number;
    reservePrice: number | null;
    startTime: string;
    endTime: string;
  };
  submitLabel: string;
  cancelAction?: React.ReactNode;
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmitValues: (values: {
    startPrice: number;
    bidIncrement: number;
    reservePrice: number | null;
    startTime: string;
    endTime: string;
  }) => Promise<void>;
}

export function AuctionScheduleForm({
  defaultValues,
  submitLabel,
  cancelAction,
  disabled = false,
  isSubmitting = false,
  onSubmitValues,
}: AuctionScheduleFormProps) {
  const [hasReserve, setHasReserve] = useState(
    defaultValues.reservePrice !== null && defaultValues.reservePrice > 0
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AuctionFormValues>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      startPrice: defaultValues.startPrice,
      bidIncrement: defaultValues.bidIncrement,
      reservePrice: defaultValues.reservePrice,
      startTime: defaultValues.startTime,
      endTime: defaultValues.endTime,
    },
  });

  const watchedStartPrice = useWatch({ control, name: "startPrice" });
  const watchedStartTime = useWatch({ control, name: "startTime" });
  const watchedEndTime = useWatch({ control, name: "endTime" });

  const onSubmit = async (values: AuctionFormValues) => {
    setSubmitError(null);
    try {
      await onSubmitValues({
        startPrice: values.startPrice,
        bidIncrement: values.bidIncrement,
        reservePrice:
          hasReserve && values.reservePrice ? values.reservePrice : null,
        startTime: values.startTime,
        endTime: values.endTime,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          for (const [field, msg] of Object.entries(err.fieldErrors)) {
            if (
              field === "startPrice" ||
              field === "bidIncrement" ||
              field === "reservePrice" ||
              field === "startTime" ||
              field === "endTime"
            ) {
              setError(field, { message: msg });
            }
          }
        }
        setSubmitError(err.message);
      } else {
        setSubmitError("Không thể lưu cấu hình phiên đấu giá. Vui lòng thử lại.");
      }
    }
  };

  const formDisabled = disabled || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Thiết lập giá và thời gian</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-small text-danger"
            >
              <AlertCircleIcon className="mt-0.5 size-4.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Controller
              control={control}
              name="startPrice"
              render={({ field }) => (
                <MoneyInput
                  label="Giá khởi điểm"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  disabled={formDisabled}
                  error={errors.startPrice?.message}
                  hint="Số tiền nguyên tính bằng VND."
                />
              )}
            />

            <Controller
              control={control}
              name="bidIncrement"
              render={({ field }) => (
                <MoneyInput
                  label="Bước giá"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  disabled={formDisabled}
                  error={errors.bidIncrement?.message}
                  hint="Mức tăng tối thiểu cho mỗi lượt đặt giá tiếp theo."
                />
              )}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-border-subtle bg-surface-subtle p-4">
            <Checkbox
              label="Đặt giá sàn (tùy chọn, không công khai)"
              checked={hasReserve}
              disabled={formDisabled}
              onChange={(e) => {
                const checked = e.target.checked;
                setHasReserve(checked);
                if (!checked) {
                  setValue("reservePrice", null, { shouldValidate: true });
                } else {
                  setValue("reservePrice", watchedStartPrice || 1000000, {
                    shouldValidate: false,
                  });
                }
              }}
            />
            {hasReserve && (
              <Controller
                control={control}
                name="reservePrice"
                render={({ field }) => (
                  <MoneyInput
                    label="Giá sàn"
                    value={field.value ?? 0}
                    onChange={(val) => field.onChange(val > 0 ? val : null)}
                    disabled={formDisabled}
                    error={errors.reservePrice?.message}
                    hint="Người mua chỉ thấy trạng thái Đã đạt / Chưa đạt giá sàn, không thấy con số cụ thể. Phải lớn hơn hoặc bằng giá khởi điểm."
                  />
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Controller
              control={control}
              name="startTime"
              render={({ field }) => (
                <DateTimeInput
                  label="Thời gian bắt đầu"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  disabled={formDisabled}
                  error={errors.startTime?.message}
                  helperText="Phải nằm ở tương lai."
                />
              )}
            />

            <Controller
              control={control}
              name="endTime"
              render={({ field }) => (
                <DateTimeInput
                  label="Thời gian kết thúc"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  disabled={formDisabled}
                  min={watchedStartTime || undefined}
                  error={errors.endTime?.message}
                  helperText="Phải sau thời gian bắt đầu."
                />
              )}
            />
          </div>

          {/* Ô xem trước */}
          <div className="grid grid-cols-1 gap-3 rounded-lg border border-border-brand bg-surface-subtle p-4 sm:grid-cols-2">
            <div>
              <p className="text-caption text-text-tertiary">
                Mức tối thiểu đầu tiên = giá khởi điểm
              </p>
              <p className="mt-1 text-h4 font-bold text-primary-700 tabular">
                {formatMoney(watchedStartPrice || 0)}
              </p>
            </div>
            <div>
              <p className="text-caption text-text-tertiary">Thời lượng dự kiến</p>
              <p className="mt-1 text-h4 font-semibold text-text tabular">
                {formatDurationPreview(watchedStartTime, watchedEndTime)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-warning-bg px-3.5 py-2.5 text-caption text-warning-strong">
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            <span>Sau khi phiên bắt đầu, không sửa được giá và thời gian.</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {cancelAction}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={formDisabled}
          loading={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
