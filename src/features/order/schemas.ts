import { z } from "zod";

export const SHIPPING_ADDRESS_MAX = 300;
export const TRACKING_CODE_MAX = 50;

const PHONE_REGEX = /^(0|\+84)[0-9]{8,10}$/;

export const shippingInfoSchema = z.object({
  shippingAddress: z
    .string()
    .trim()
    .min(5, "Địa chỉ nhận hàng phải có ít nhất 5 ký tự")
    .max(
      SHIPPING_ADDRESS_MAX,
      `Địa chỉ nhận hàng tối đa ${SHIPPING_ADDRESS_MAX} ký tự`
    ),
  phoneNumber: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Số điện thoại không hợp lệ (ví dụ: 0901234567)"),
});

export type ShippingInfoFormValues = z.infer<typeof shippingInfoSchema>;

export const shipOrderSchema = z.object({
  trackingCode: z
    .string()
    .trim()
    .max(TRACKING_CODE_MAX, `Mã vận đơn tối đa ${TRACKING_CODE_MAX} ký tự`)
    .optional(),
});

export type ShipOrderFormValues = z.infer<typeof shipOrderSchema>;
