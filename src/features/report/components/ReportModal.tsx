"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/lib/api/types";
import { formatDisplayCode } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { AlertCircleIcon, FlagIcon, InfoIcon } from "@/components/icons";
import { useCreateReport } from "../hooks";
import {
  createReportFormSchema,
  REPORT_REASON_MAX,
  type CreateReportFormValues,
} from "../schemas";
import type { CreateReportRequest } from "../types";

export interface ReportProductTarget {
  id: number;
  title: string;
}

export interface ReportOrderTarget {
  id: number;
  title?: string;
}

export interface ReportUserTarget {
  id: number;
  fullName: string;
  roleLabel?: string;
}

export interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  productTarget?: ReportProductTarget;
  orderTarget?: ReportOrderTarget;
  userTarget?: ReportUserTarget;
}

export function ReportModal({
  open,
  onClose,
  productTarget,
  orderTarget,
  userTarget,
}: ReportModalProps) {
  const toast = useToast();
  const createReportMutation = useCreateReport();
  const [formError, setFormError] = useState<string | null>(null);

  const hasPrimaryTarget = Boolean(productTarget || orderTarget);
  const hasUserTarget = Boolean(userTarget);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateReportFormValues>({
    resolver: zodResolver(createReportFormSchema),
    defaultValues: {
      includePrimaryTarget: hasPrimaryTarget,
      includeUserTarget: !hasPrimaryTarget && hasUserTarget,
      reason: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        includePrimaryTarget: hasPrimaryTarget,
        includeUserTarget: !hasPrimaryTarget && hasUserTarget,
        reason: "",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormError(null);
    }
  }, [open, hasPrimaryTarget, hasUserTarget, reset]);

  const reasonValue = useWatch({ control, name: "reason" }) ?? "";

  const handleClose = () => {
    if (createReportMutation.isPending) return;
    onClose();
  };

  const onSubmit = (values: CreateReportFormValues) => {
    setFormError(null);

    const payload: CreateReportRequest = {
      reason: values.reason.trim(),
    };

    if (values.includePrimaryTarget) {
      if (productTarget) payload.reportedProductId = productTarget.id;
      if (orderTarget) payload.reportedOrderId = orderTarget.id;
    }
    if (values.includeUserTarget && userTarget) {
      payload.reportedUserId = userTarget.id;
    }

    createReportMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Đã gửi báo cáo");
        reset();
        onClose();
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          if (err.code === "VALIDATION_ERROR" && err.fieldErrors) {
            if (err.fieldErrors.reason) {
              setError("reason", { message: err.fieldErrors.reason });
            }
            if (err.fieldErrors.targets) {
              setError("includePrimaryTarget", {
                message: err.fieldErrors.targets,
              });
            }
            if (!err.fieldErrors.reason && !err.fieldErrors.targets) {
              setFormError(err.message);
            }
            return;
          }
          setFormError(err.message);
          return;
        }
        setFormError("Không thể gửi báo cáo. Vui lòng thử lại.");
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Báo cáo vi phạm"
      description="Chọn ít nhất một đối tượng và mô tả chi tiết dấu hiệu vi phạm để quản trị viên xem xét."
      icon={<FlagIcon className="text-danger" />}
      maxWidth="md"
    >
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

        <fieldset className="space-y-1">
          <legend className="block text-small font-semibold text-text mb-1">
            Đối tượng báo cáo <span className="text-danger">*</span>
          </legend>

          <div className="rounded-lg border border-border-brand bg-surface-subtle px-3.5 py-1.5 divide-y divide-border-subtle">
            {productTarget && (
              <Checkbox
                label="Sản phẩm này"
                hint={`${productTarget.title} (${formatDisplayCode("PRD", productTarget.id)})`}
                disabled={createReportMutation.isPending}
                {...register("includePrimaryTarget")}
              />
            )}

            {orderTarget && (
              <Checkbox
                label="Đơn hàng này"
                hint={
                  orderTarget.title
                    ? `${formatDisplayCode("ORD", orderTarget.id)} — ${orderTarget.title}`
                    : formatDisplayCode("ORD", orderTarget.id)
                }
                disabled={createReportMutation.isPending}
                {...register("includePrimaryTarget")}
              />
            )}

            {userTarget && (
              <Checkbox
                label={userTarget.roleLabel ?? "Người bán"}
                hint={userTarget.fullName}
                disabled={createReportMutation.isPending}
                {...register("includeUserTarget")}
              />
            )}
          </div>

          {errors.includePrimaryTarget?.message && (
            <p className="flex items-center gap-1.5 pt-1 text-caption text-danger">
              <AlertCircleIcon className="size-3.5 shrink-0" />
              <span>{errors.includePrimaryTarget.message}</span>
            </p>
          )}
        </fieldset>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <label
              htmlFor="report-reason"
              className="block text-small font-semibold text-text"
            >
              Lý do <span className="text-danger">*</span>
            </label>
            <span className="text-caption text-text-tertiary tabular">
              {reasonValue.length} / {REPORT_REASON_MAX}
            </span>
          </div>
          <Textarea
            id="report-reason"
            placeholder="Mô tả cụ thể dấu hiệu vi phạm (tối thiểu 10 ký tự)…"
            rows={4}
            maxLength={REPORT_REASON_MAX}
            disabled={createReportMutation.isPending}
            error={errors.reason?.message}
            {...register("reason")}
          />
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-surface-subtle px-3.5 py-2.5 text-caption text-text-secondary">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-text-tertiary" />
          <span>Báo cáo không làm thay đổi trạng thái đơn hàng.</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={createReportMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="danger-soft"
            size="md"
            loading={createReportMutation.isPending}
          >
            Gửi báo cáo
          </Button>
        </div>
      </form>
    </Modal>
  );
}
