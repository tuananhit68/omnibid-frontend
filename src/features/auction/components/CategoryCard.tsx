// TODO fe-v4 home
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
      className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-border-brand bg-surface p-4 text-center transition-colors hover:border-primary-400 hover:bg-primary-50/40"
    >
      <div className="flex size-11 items-center justify-center rounded-lg bg-surface-subtle text-primary-600">
        <CategoryIcon name={category.icon} className="size-5" />
      </div>
      <span className="text-small font-semibold text-text line-clamp-1">
        {category.name}
      </span>
    </Link>
  );
}
