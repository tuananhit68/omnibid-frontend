"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { formatDisplayCode } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { AlertCircleIcon, FlagIcon } from "@/components/icons";
import { ReportType } from "@/types/enums";
import { useCreateReport } from "../hooks";

export interface ReportViolationModalProps {
  open: boolean;
  onClose: () => void;
  auctionId: number;
  productId: number;
  productTitle: string;
}

const VIOLATION_REASONS = [
  { value: "Hàng giả/nhái", label: "Hàng giả / hàng nhái thương hiệu" },
  { value: "Thông tin sai lệch", label: "Thông tin, hình ảnh sai sự thật" },
  { value: "Gian lận đấu giá", label: "Dấu hiệu thông đồng, gian lận đấu giá" },
  { value: "Sản phẩm bị cấm", label: "Sản phẩm vi phạm quy định pháp luật" },
  { value: "Khác", label: "Lý do khác" },
];

export function ReportViolationModal({
  open,
  onClose,
  auctionId,
  productId,
  productTitle,
}: ReportViolationModalProps) {
  const toast = useToast();
  const createReportMutation = useCreateReport();

  const [reasonCategory, setReasonCategory] = useState(
    VIOLATION_REASONS[0].value
  );
  const [detail, setDetail] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const combined = `${reasonCategory}: ${detail.trim()}`;

    if (detail.trim().length < 5 || combined.length < 10) {
      setError("Vui lòng mô tả chi tiết vấn đề (tối thiểu 10 ký tự).");
      return;
    }

    setError(undefined);

    createReportMutation.mutate(
      {
        reportType: ReportType.VIOLATION,
        reportedProductId: productId,
        reason: combined,
      },
      {
        onSuccess: () => {
          toast.success("Đã gửi báo cáo vi phạm, quản trị viên sẽ xử lý.");
          setDetail("");
          onClose();
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.errorCode === "VALIDATION_ERROR" && err.fieldErrors?.reason) {
              setError(err.fieldErrors.reason);
              return;
            }
            setError(err.message);
            return;
          }
          setError(getErrorMessage("INTERNAL_ERROR"));
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Báo cáo vi phạm phiên đấu giá"
      description={`${formatDisplayCode("AUC", auctionId)} · ${productTitle}`}
      icon={
        <div className="bg-tertiary-50 text-tertiary-600 p-2 rounded-lg">
          <FlagIcon className="size-5" />
        </div>
      }
      footer={
        <>
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={createReportMutation.isPending}
          >
            Huỷ
          </Button>
          <Button
            type="submit"
            form="report-violation-form"
            variant="primary"
            size="md"
            loading={createReportMutation.isPending}
          >
            Gửi báo cáo
          </Button>
        </>
      }
    >
      <form
        id="report-violation-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 p-3 rounded-lg bg-danger-bg border border-danger-border text-small text-danger"
          >
            <AlertCircleIcon className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Select
          label="Lý do báo cáo"
          required
          value={reasonCategory}
          onChange={(e) => setReasonCategory(e.target.value)}
          options={VIOLATION_REASONS}
        />

        <Textarea
          label="Mô tả chi tiết vấn đề"
          required
          rows={4}
          maxLength={1900}
          showCount
          value={detail}
          onChange={(e) => {
            setDetail(e.target.value);
            if (error) setError(undefined);
          }}
          placeholder="Mô tả rõ dấu hiệu vi phạm của sản phẩm hoặc phiên đấu giá này..."
          hint="Tổng nội dung tối thiểu 10 ký tự."
        />
      </form>
    </Modal>
  );
}

