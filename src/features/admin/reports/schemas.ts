import { z } from "zod";

export const resolveReportSchema = z.object({
  decision: z.enum(["RESOLVED", "REJECTED"], {
    message: "Vui lòng chọn kết luận xử lý.",
  }),
  note: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập ghi chú xử lý.")
    .max(1000, "Ghi chú tối đa 1.000 ký tự."),
});

export type ResolveReportFormValues = z.infer<typeof resolveReportSchema>;
