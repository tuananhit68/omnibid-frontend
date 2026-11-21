// TODO fe-v4 report-modal
"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/types";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useCreateReport } from "../hooks";

export interface ReportViolationModalProps {
  open: boolean;
  onClose: () => void;
  reportedProductId?: number;
  reportedUserId?: number;
  reportedOrderId?: number;
  targetTitle?: string;
}

export function ReportViolationModal({
  open,
  onClose,
  reportedProductId,
  reportedUserId,
  reportedOrderId,
  targetTitle,
}: ReportViolationModalProps) {
  const toast = useToast();
  const createReportMutation = useCreateReport();
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length < 10) {
      setErrorMsg("Vui lòng nhập lý do tối thiểu 10 ký tự.");
      return;
    }
    setErrorMsg(null);

    createReportMutation.mutate(
      {
        reportedProductId,
        reportedUserId,
        reportedOrderId,
        reason: trimmed,
      },
      {
        onSuccess: () => {
          toast.success("Đã gửi báo cáo vi phạm tới quản trị viên.");
          setReason("");
          onClose();
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            setErrorMsg(err.message);
            return;
          }
          setErrorMsg("Không thể gửi báo cáo. Vui lòng thử lại.");
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Báo cáo vi phạm" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {targetTitle && (
          <p className="text-small text-text-secondary">
            Đối tượng báo cáo: <strong className="text-text">{targetTitle}</strong>
          </p>
        )}
        <Textarea
          label="Lý do báo cáo *"
          placeholder="Mô tả chi tiết dấu hiệu vi phạm…"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (errorMsg) setErrorMsg(null);
          }}
          error={errorMsg ?? undefined}
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
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
