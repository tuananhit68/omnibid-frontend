import { z } from "zod";

export const adminCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên danh mục.")
    .max(100, "Tên danh mục tối đa 100 ký tự."),
  slug: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập slug danh mục.")
    .max(100, "Slug tối đa 100 ký tự.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang."
    ),
  icon: z.string().nullable(),
});

export type AdminCategoryFormValues = z.infer<typeof adminCategorySchema>;

/**
 * Chuyển tên tiếng Việt sang slug kebab-case không dấu.
 */
export function slugifyVietnamese(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
