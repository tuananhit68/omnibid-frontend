"use client";

import { useState, type ReactNode } from "react";
import { Modal } from "./Modal";
import { Button, type ButtonVariant } from "./Button";
import { Textarea } from "./Textarea";
import { AlertCircleIcon } from "../icons";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  loading?: boolean;
  tone?: "danger" | "warning" | "info";
  reasonMode?: "none" | "optional" | "required";
  reasonLabel?: string;
  reasonPlaceholder?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  confirmVariant = "primary",
  loading = false,
  tone = "danger",
  reasonMode = "none",
  reasonLabel = "Lý do",
  reasonPlaceholder = "Nhập lý do thực hiện…",
}: ConfirmDialogProps) {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  const isDanger = tone === "danger";
  const showReason = reasonMode !== "none";

  const handleClose = () => {
    setReason("");
    setReasonError(null);
    onClose();
  };

  const handleConfirm = () => {
    const trimmed = reason.trim();
    if (reasonMode === "required" && trimmed.length === 0) {
      setReasonError("Vui lòng nhập lý do trước khi xác nhận.");
      return;
    }
    setReasonError(null);
    onConfirm(showReason ? trimmed || undefined : undefined);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      maxWidth="sm"
      icon={
        <div
          className={
            isDanger
              ? "text-danger bg-danger-bg p-2 rounded-lg"
              : tone === "info"
                ? "text-info bg-info-bg p-2 rounded-lg"
                : "text-warning-strong bg-warning-bg p-2 rounded-lg"
          }
        >
          <AlertCircleIcon className="size-5" />
        </div>
      }
      footer={
        <>
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            size="md"
            loading={loading}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="text-body text-text-secondary">{description}</div>
        {showReason && (
          <Textarea
            label={reasonMode === "required" ? `${reasonLabel} *` : `${reasonLabel} (tùy chọn)`}
            placeholder={reasonPlaceholder}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (reasonError) setReasonError(null);
            }}
            error={reasonError ?? undefined}
            rows={3}
          />
        )}
      </div>
    </Modal>
  );
}
