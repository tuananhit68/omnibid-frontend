"use client";

import type { ReactNode } from "react";
import { Modal } from "./Modal";
import { Button, type ButtonVariant } from "./Button";
import { AlertCircleIcon } from "../icons";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  loading?: boolean;
  tone?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Huỷ",
  confirmVariant = "primary",
  loading = false,
  tone = "danger",
}: ConfirmDialogProps) {
  const isDanger = tone === "danger";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      icon={
        <div
          className={
            isDanger
              ? "text-danger bg-danger-bg p-2 rounded-lg"
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
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            size="md"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-body text-text-secondary">{description}</div>
    </Modal>
  );
}

