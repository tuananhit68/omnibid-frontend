import { cn } from "@/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

export interface PaginationProps {
  page: number; // 0-indexed theo backend
  totalPages: number;
  totalElements?: number;
  pageSize?: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize = 20,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1 && !totalElements) return null;

  const currentPage = page + 1; // 1-indexed hiển thị
  const startItem = totalElements ? page * pageSize + 1 : 0;
  const endItem = totalElements
    ? Math.min((page + 1) * pageSize, totalElements)
    : 0;

  // Tính dải số trang hiển thị
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      aria-label="Phân trang"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-3 select-none",
        className
      )}
    >
      {totalElements !== undefined ? (
        <p className="text-small text-text-tertiary">
          Hiển thị{" "}
          <span className="font-semibold text-text tabular">{startItem}</span> -{" "}
          <span className="font-semibold text-text tabular">{endItem}</span> trong tổng số{" "}
          <span className="font-semibold text-text tabular">{totalElements}</span>
        </p>
      ) : (
        <div />
      )}

      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            "min-h-11 md:min-h-9 px-3 inline-flex items-center gap-1 text-small font-medium rounded-md border border-border transition-colors",
            "focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
            page <= 0
              ? "opacity-40 cursor-not-allowed bg-surface"
              : "bg-surface text-text hover:bg-surface-subtle"
          )}
        >
          <ChevronLeftIcon className="size-4" />
          <span>Trước</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="size-11 md:size-9 flex items-center justify-center text-text-tertiary"
                >
                  …
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => onPageChange(p - 1)}
                className={cn(
                  "size-11 md:size-9 inline-flex items-center justify-center text-small font-medium rounded-md transition-colors tabular",
                  "focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
                  isCurrent
                    ? "bg-primary-600 text-text-inverse font-semibold"
                    : "bg-surface border border-border text-text hover:bg-surface-subtle"
                )}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            "min-h-11 md:min-h-9 px-3 inline-flex items-center gap-1 text-small font-medium rounded-md border border-border transition-colors",
            "focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
            page >= totalPages - 1
              ? "opacity-40 cursor-not-allowed bg-surface"
              : "bg-surface text-text hover:bg-surface-subtle"
          )}
        >
          <span>Sau</span>
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </nav>
  );
}

