import { z } from "zod";
import { ProductCondition } from "@/types/enums";

export const productFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự.")
    .max(200, "Tiêu đề tối đa 200 ký tự."),
  categoryId: z
    .number({ message: "Vui lòng chọn danh mục." })
    .int("Danh mục không hợp lệ.")
    .positive("Vui lòng chọn danh mục."),
  condition: z.enum(
    [
      ProductCondition.NEW,
      ProductCondition.LIKE_NEW,
      ProductCondition.GOOD,
      ProductCondition.FAIR,
      ProductCondition.POOR,
    ],
    { message: "Vui lòng chọn tình trạng sản phẩm." }
  ),
  description: z
    .string()
    .trim()
    .min(10, "Mô tả sản phẩm cần ít nhất 10 ký tự.")
    .max(5000, "Mô tả sản phẩm tối đa 5000 ký tự."),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
