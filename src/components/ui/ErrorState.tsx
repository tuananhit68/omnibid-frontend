import { cn } from "@/lib/cn";
import { AlertCircleIcon } from "../icons";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Không tải được dữ liệu",
  message = "Đã có lỗi xảy ra khi tải nội dung. Vui lòng thử lại.",
  onRetry,
  retryLabel = "Thử lại",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-border-brand bg-surface px-6 py-10 text-center",
        className
      )}
    >
      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-danger-bg text-danger">
        <AlertCircleIcon className="size-6" />
      </div>
      <h3 className="text-h3 text-text">{title}</h3>
      <p className="mt-1 max-w-md text-small text-text-secondary">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="md"
          onClick={onRetry}
          className="mt-4"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
