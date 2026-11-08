import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Skeleton } from "./Skeleton";
import { Button } from "./Button";

export interface Column<T> {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
  render?: (row: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data?: T[];
  keyExtractor: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyText?: string;
  emptyAction?: ReactNode;
  error?: string;
  onRetry?: () => void;
  highlightRow?: (row: T) => boolean;
  selectedRow?: (row: T) => boolean;
  className?: string;
}

export function DataTable<T>({
  columns,
  data = [],
  keyExtractor,
  loading = false,
  emptyText = "Chưa có dữ liệu nào.",
  emptyAction,
  error,
  onRetry,
  highlightRow,
  selectedRow,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-xl border border-border-brand bg-surface",
        className
      )}
    >
      <table className="w-full border-collapse text-left text-body">
        <thead>
          <tr className="h-11 bg-surface-subtle border-b border-border-brand">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-4 text-label font-medium text-text-tertiary whitespace-nowrap",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {error ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 px-4 text-center text-text-secondary"
              >
                <p className="text-body text-danger font-medium">{error}</p>
                {onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="mt-3"
                  >
                    Thử lại
                  </Button>
                )}
              </td>
            </tr>
          ) : loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="h-[52px]">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <Skeleton className="h-4 w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 px-4 text-center text-text-secondary"
              >
                <p className="text-body text-text-tertiary">{emptyText}</p>
                {emptyAction && <div className="mt-3">{emptyAction}</div>}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const isHighlighted = highlightRow?.(row);
              const isSelected = selectedRow?.(row);

              return (
                <tr
                  key={keyExtractor(row, index)}
                  className={cn(
                    "h-[52px] transition-colors hover:bg-surface-subtle/70",
                    isHighlighted && "bg-surface-info",
                    isSelected && "bg-primary-50 font-semibold"
                  )}
                >
                  {columns.map((col) => {
                    const content = col.render
                      ? col.render(row, index)
                      : (row as Record<string, unknown>)[col.key] != null
                      ? String((row as Record<string, unknown>)[col.key])
                      : "--";

                    return (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 whitespace-nowrap text-text",
                          col.align === "right" && "text-right tabular font-medium",
                          col.align === "center" && "text-center",
                          col.className
                        )}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

