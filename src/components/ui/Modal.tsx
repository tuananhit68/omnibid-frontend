"use client";

import {
  useEffect,
  useRef,
  useId,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { CloseIcon } from "../icons";
import { IconButton } from "./IconButton";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const maxWidthStyles = {
  sm: "max-w-sm",
  md: "max-w-md", // 448px
  lg: "max-w-xl",
  xl: "max-w-2xl",
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  maxWidth = "md",
  className,
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Lưu phần tử kích hoạt trước khi mở modal để trả focus khi đóng
  useEffect(() => {
    if (open) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    } else if (triggerElementRef.current) {
      triggerElementRef.current.focus();
    }
  }, [open]);

  // Khoá cuộn body và bẫy phím Escape
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusables =
          modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Focus vào phần tử đầu tiên trong modal
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstFocusable =
          modalRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        firstFocusable?.focus();
      }
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={cn(
          "w-full bg-surface border border-border-brand rounded-2xl shadow-lg flex flex-col max-h-full overflow-hidden",
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-border-subtle">
          <div className="flex items-start gap-3.5 pr-2">
            {icon && (
              <div className="size-10 rounded-lg flex items-center justify-center shrink-0 [&>svg]:size-5">
                {icon}
              </div>
            )}
            <div>
              <h3 id={titleId} className="text-h3 font-semibold text-text">
                {title}
              </h3>
              {description && (
                <p id={descId} className="mt-1 text-small text-text-secondary">
                  {description}
                </p>
              )}
            </div>
          </div>
          <IconButton
            label="Đóng cửa sổ"
            icon={<CloseIcon />}
            size="sm"
            onClick={onClose}
            className="-mr-2 -mt-1 min-h-11 min-w-11 md:min-h-8 md:min-w-8"
          />
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 px-6 border-t border-border-brand bg-surface-subtle/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

