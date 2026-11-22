"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  CloseIcon,
} from "../icons";
import { IconButton } from "./IconButton";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: ReactNode;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, "id">) => string;
  success: (message: ReactNode, title?: string) => string;
  error: (message: ReactNode, title?: string) => string;
  info: (message: ReactNode, title?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).slice(2, 9);
      const autoDismissDuration =
        duration !== undefined
          ? duration
          : type === "error"
          ? 0 // Lỗi không tự ẩn theo quy định
          : 5000; // Thành công tự ẩn sau 5s

      setToasts((prev) => [...prev, { id, type, title, message }]);

      if (autoDismissDuration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, autoDismissDuration);
      }
      return id;
    },
    [dismiss]
  );

  const success = useCallback(
    (message: ReactNode, title?: string) =>
      showToast({ type: "success", title, message }),
    [showToast]
  );

  const error = useCallback(
    (message: ReactNode, title?: string) =>
      showToast({ type: "error", title, message }),
    [showToast]
  );

  const info = useCallback(
    (message: ReactNode, title?: string) =>
      showToast({ type: "info", title, message }),
    [showToast]
  );

  const contextValue = useMemo(
    () => ({ showToast, success, error, info, dismiss }),
    [showToast, success, error, info, dismiss]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast viewport: bottom-right on desktop, top on mobile */}
      <div
        aria-live="polite"
        className="fixed z-50 pointer-events-none top-4 inset-x-4 md:inset-x-auto md:top-auto md:bottom-6 md:right-6 flex flex-col gap-2.5 md:max-w-sm md:w-full"
      >
        {toasts.map((toast) => {
          const isError = toast.type === "error";
          const isSuccess = toast.type === "success";

          return (
            <div
              key={toast.id}
              role={isError ? "alert" : "status"}
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-md bg-surface transition-all",
                isError && "border-danger-border bg-danger-bg text-text",
                isSuccess && "border-success-border bg-success-bg text-text",
                toast.type === "info" && "border-info-border bg-info-bg text-text"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {isError ? (
                  <AlertCircleIcon className="size-5 text-danger" />
                ) : isSuccess ? (
                  <CheckCircleIcon className="size-5 text-success-strong" />
                ) : (
                  <InfoIcon className="size-5 text-info" />
                )}
              </div>

              <div className="flex-1 text-small">
                {toast.title && (
                  <h4 className="font-semibold text-text mb-0.5">
                    {toast.title}
                  </h4>
                )}
                <div className="text-text-secondary">{toast.message}</div>
              </div>

              <IconButton
                label="Đóng thông báo"
                size="sm"
                icon={<CloseIcon className="size-4" />}
                onClick={() => dismiss(toast.id)}
                className="-mr-1.5 -mt-1.5 min-h-11 min-w-11 md:min-h-8 md:min-w-8"
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

