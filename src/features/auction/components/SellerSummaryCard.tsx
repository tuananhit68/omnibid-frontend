import { cn } from "@/lib/cn";

export interface SellerSummaryCardProps {
  sellerName: string;
  className?: string;
}

/**
 * Thẻ người bán gọn theo gaps.md G2:
 * Chỉ hiển thị tên + avatar chữ cái đầu; ẩn chip uy tín, số năm, sao và nút Xem gian hàng.
 */
export function SellerSummaryCard({
  sellerName,
  className,
}: SellerSummaryCardProps) {
  const initial = sellerName ? sellerName.trim().charAt(0).toUpperCase() : "N";

  return (
    <div
      className={cn(
        "bg-surface border border-border-brand rounded-xl p-4 flex items-center gap-3.5",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="size-11 rounded-full bg-primary-50 text-primary-700 font-bold text-h4 flex items-center justify-center shrink-0"
      >
        {initial}
      </div>
      <div className="min-w-0">
        <p className="text-body font-semibold text-text truncate">
          {sellerName}
        </p>
        <p className="text-caption text-text-tertiary">Người bán</p>
      </div>
    </div>
  );
}

