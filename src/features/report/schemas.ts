import { z } from "zod";

export const REPORT_REASON_MIN = 10;
export const REPORT_REASON_MAX = 1000;

export const createReportFormSchema = z
  .object({
    includePrimaryTarget: z.boolean(),
    includeUserTarget: z.boolean(),
    reason: z
      .string()
      .trim()
      .min(REPORT_REASON_MIN, `Lý do báo cáo cần tối thiểu ${REPORT_REASON_MIN} ký tự.`)
      .max(REPORT_REASON_MAX, `Lý do báo cáo tối đa ${REPORT_REASON_MAX} ký tự.`),
  })
  .refine((val) => val.includePrimaryTarget || val.includeUserTarget, {
    message: "Vui lòng chọn ít nhất một đối tượng báo cáo.",
    path: ["includePrimaryTarget"],
  });

export type CreateReportFormValues = z.infer<typeof createReportFormSchema>;
