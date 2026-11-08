import Link from "next/link";
import { cn } from "@/lib/cn";
import type { CategoryItem } from "../types";

export interface CategoryCardProps {
  category: CategoryItem;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/auctions?category=${category.slug}`}
      className={cn(
        "group flex flex-col justify-between p-6 bg-surface border border-border-brand rounded-xl transition-all select-none",
        "w-full sm:w-[224px] min-h-[160px]",
        "hover:border-primary-600 hover:shadow-xs focus-visible:outline-2 focus-visible:outline-focus",
        className
      )}
    >
      <div className="size-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-h4 group-hover:bg-primary-600 group-hover:text-text-inverse transition-colors">
        {category.name.charAt(0)}
      </div>

      <div className="mt-4">
        <h3 className="text-small font-semibold text-text group-hover:text-primary-700 transition-colors line-clamp-2">
          {category.name}
        </h3>
        {category.auctionCount !== undefined && (
          <p className="mt-1 text-caption text-text-tertiary tabular">
            {category.auctionCount} phiên đang mở
          </p>
        )}
      </div>
    </Link>
  );
}

