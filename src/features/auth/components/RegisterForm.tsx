"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "@/components/icons";
import { registerSchema, type RegisterFormValues } from "../schemas";
import { useRegister } from "../hooks";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

const FORM_FIELDS = [
  "fullName",
  "email",
  "password",
  "confirmPassword",
  "phoneNumber",
] as const;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const registerMutation = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const redirectParam = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });

  const passwordValue = useWatch({ control, name: "password" });

  const onSubmit = (values: RegisterFormValues) => {
    setServerError(null);

    registerMutation.mutate(
      {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        phoneNumber: values.phoneNumber.trim(),
      },
      {
        onSuccess: (profile) => {
          toast.success("Đăng ký tài khoản thành công. Vui lòng đăng nhập.");
          const nextParams = new URLSearchParams({
            registered: "1",
            email: profile.email,
          });
          if (redirectParam) {
            nextParams.set("redirect", redirectParam);
          }
          router.push(`/login?${nextParams.toString()}`);
          router.refresh();
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.code === "VALIDATION_ERROR" && err.fieldErrors) {
              let firstFocused = false;
              const unmappedMessages: string[] = [];

              Object.entries(err.fieldErrors).forEach(([field, msg]) => {
                if ((FORM_FIELDS as readonly string[]).includes(field)) {
                  const key = field as keyof RegisterFormValues;
                  setError(key, { type: "server", message: msg });
                  if (!firstFocused) {
                    setFocus(key);
                    firstFocused = true;
                  }
                } else if (msg) {
                  unmappedMessages.push(msg);
                }
              });

              if (unmappedMessages.length > 0) {
                setServerError(unmappedMessages.join(". "));
              } else if (!firstFocused) {
                setServerError(err.message);
              }
              return;
            }

            setServerError(err.message);
            return;
          }

          setServerError(getErrorMessage("INTERNAL_ERROR"));
        },
      }
    );
  };

  const loginHref = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : "/login";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg p-3.5 text-small text-danger"
        >
          <AlertCircleIcon className="size-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Họ tên"
          required
          autoComplete="name"
          placeholder="Nhập họ và tên đầy đủ"
          leftIcon={<UserIcon />}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="example@gmail.com"
          hint="Dùng để đăng nhập, không đổi được"
          leftIcon={<MailIcon />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <PasswordInput
            label="Mật khẩu"
            required
            autoComplete="new-password"
            placeholder="Nhập mật khẩu"
            hint="Tối thiểu 8 ký tự, có chữ hoa, chữ thường và chữ số"
            leftIcon={<LockIcon />}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrengthMeter password={passwordValue ?? ""} />
        </div>

        <PasswordInput
          label="Nhập lại mật khẩu"
          required
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          leftIcon={<LockIcon />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Input
          label="Số điện thoại"
          type="tel"
          required
          autoComplete="tel"
          placeholder="Ví dụ: 0912345678"
          leftIcon={<PhoneIcon />}
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={registerMutation.isPending}
        rightIcon={<ArrowRightIcon className="size-4" />}
        className="w-full"
      >
        Tạo tài khoản
      </Button>

      <p className="pt-1 text-center text-small text-text-secondary">
        Đã có tài khoản?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-primary-600 hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
