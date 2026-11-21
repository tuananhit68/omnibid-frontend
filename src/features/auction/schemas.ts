import { z } from "zod";

export const auctionFormSchema = z
  .object({
    startPrice: z
      .number({ message: "Vui lòng nhập giá khởi điểm." })
      .int("Giá khởi điểm phải là số nguyên.")
      .positive("Giá khởi điểm phải lớn hơn 0."),
    bidIncrement: z
      .number({ message: "Vui lòng nhập bước giá." })
      .int("Bước giá phải là số nguyên.")
      .positive("Bước giá phải lớn hơn 0."),
    reservePrice: z
      .number()
      .int("Giá sàn phải là số nguyên.")
      .positive("Giá sàn phải lớn hơn 0.")
      .nullable()
      .optional(),
    startTime: z.string().min(1, "Vui lòng chọn thời gian bắt đầu."),
    endTime: z.string().min(1, "Vui lòng chọn thời gian kết thúc."),
  })
  .superRefine((data, ctx) => {
    if (
      data.reservePrice !== null &&
      data.reservePrice !== undefined &&
      data.reservePrice < data.startPrice
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reservePrice"],
        message: "Giá sàn phải lớn hơn hoặc bằng giá khởi điểm.",
      });
    }

    const startMs = Date.parse(data.startTime);
    const endMs = Date.parse(data.endTime);

    if (Number.isNaN(startMs)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Thời gian bắt đầu không hợp lệ.",
      });
    } else if (startMs <= Date.now()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Thời gian bắt đầu phải ở tương lai.",
      });
    }

    if (Number.isNaN(endMs)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "Thời gian kết thúc không hợp lệ.",
      });
    } else if (!Number.isNaN(startMs) && endMs <= startMs) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "Thời gian kết thúc phải sau thời gian bắt đầu.",
      });
    }
  });

export type AuctionFormValues = z.infer<typeof auctionFormSchema>;
