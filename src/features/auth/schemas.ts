import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(100, "Họ và tên tối đa 100 ký tự"),
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập địa chỉ email")
      .email("Địa chỉ email không hợp lệ"),
    phoneNumber: z
      .string()
      .trim()
      .refine(
        (val) => val === "" || /^[0-9+\-\s]{8,20}$/.test(val),
        "Số điện thoại phải gồm 8–20 ký tự số, dấu +, - hoặc khoảng trắng"
      ),
    password: z
      .string()
      .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
    confirmPassword: z
      .string()
      .min(1, "Vui lòng nhập lại mật khẩu"),
    agreeTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "Bạn cần đồng ý với điều khoản sử dụng để tiếp tục"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

