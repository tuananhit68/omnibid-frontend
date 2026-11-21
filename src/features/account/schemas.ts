import { z } from "zod";
import {
  PASSWORD_POLICY_MESSAGE,
  PASSWORD_REGEX,
  PHONE_REGEX,
} from "@/features/auth/schemas";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự"),
  phoneNumber: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || PHONE_REGEX.test(val),
      "Số điện thoại phải gồm 9–20 ký tự số, dấu +, - hoặc khoảng trắng"
    ),
  address: z
    .string()
    .trim()
    .max(255, "Địa chỉ tối đa 255 ký tự"),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(8, PASSWORD_POLICY_MESSAGE)
      .regex(PASSWORD_REGEX, PASSWORD_POLICY_MESSAGE),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
