import type { Category, Page } from "@/lib/api/contract";
import { getMockDb } from "../db";

export function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const safePage = Number.isFinite(page) && page >= 0 ? page : 0;
  const safeSize = Number.isFinite(size) && size > 0 ? Math.min(size, 100) : 10;
  const start = safePage * safeSize;
  const content = items.slice(start, start + safeSize);
  return {
    content,
    page: safePage,
    size: safeSize,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / safeSize)),
  };
}

export function handleGetCategories(params: URLSearchParams): Page<Category> {
  const db = getMockDb();
  const keyword = (params.get("keyword") ?? "").trim().toLowerCase();
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "20");

  let items = [...db.categories];
  if (keyword) {
    items = items.filter(
      (c) =>
        c.name.toLowerCase().includes(keyword) ||
        c.slug.toLowerCase().includes(keyword)
    );
  }

  items.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  return paginate(items, page, size);
}
