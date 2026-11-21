import { z } from "zod";

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const PASSWORD_POLICY_MESSAGE =
  "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và chữ số";

export const PHONE_REGEX = /^[0-9+\-\s]{9,20}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Họ tên phải có ít nhất 2 ký tự")
      .max(100, "Họ tên tối đa 100 ký tự"),
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập địa chỉ email")
      .email("Địa chỉ email không hợp lệ"),
    password: z
      .string()
      .min(8, PASSWORD_POLICY_MESSAGE)
      .regex(PASSWORD_REGEX, PASSWORD_POLICY_MESSAGE),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
    phoneNumber: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập số điện thoại")
      .regex(
        PHONE_REGEX,
        "Số điện thoại phải gồm 9–20 ký tự số, dấu +, - hoặc khoảng trắng"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  tone: "danger" | "warning" | "info" | "success";
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "", tone: "danger" };
  }
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;

  if (score <= 1) {
    return { score: 1, label: "Yếu", tone: "danger" };
  }
  if (score === 2) {
    return { score: 2, label: "Trung bình", tone: "warning" };
  }
  if (score === 3) {
    return { score: 3, label: "Khá", tone: "info" };
  }
  return { score: 4, label: "Mạnh", tone: "success" };
}
