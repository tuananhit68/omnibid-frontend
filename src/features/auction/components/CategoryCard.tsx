import Link from "next/link";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { Category } from "../types";

export interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/auctions?categoryId=${category.id}`}
      className="group flex flex-col items-center justify-center gap-2.5 rounded-xl border border-border-brand bg-surface p-4 text-center transition-colors hover:border-primary-600 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-focus"
    >
      <span className="flex size-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-surface">
        <CategoryIcon name={category.icon} className="size-5" />
      </span>
      <span className="text-small font-medium text-text line-clamp-1">
        {category.name}
      </span>
    </Link>
  );
}
