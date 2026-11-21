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
import { Checkbox } from "@/components/ui/Checkbox";
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

const FORM_FIELDS = [
  "fullName",
  "email",
  "phoneNumber",
  "password",
  "confirmPassword",
  "agreeTerms",
] as const;

// TODO fe-v4 register
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
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const agreeTerms = useWatch({ control, name: "agreeTerms" });

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
          toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
          router.push(
            `/login?registered=1&email=${encodeURIComponent(profile.email)}`
          );
          router.refresh();
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.code === "VALIDATION_ERROR" && err.fieldErrors) {
              let firstFocused = false;
              const unmappedMessages: string[] = [];

              Object.entries(err.fieldErrors).forEach(([field, msg]) => {
                if (
                  (FORM_FIELDS as readonly string[]).includes(field)
                ) {
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
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-danger-bg border border-danger-border text-small text-danger"
        >
          <AlertCircleIcon className="size-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Họ và tên"
          required
          autoComplete="name"
          placeholder="Nhập họ và tên"
          hint="Nhập họ và tên đầy đủ theo giấy tờ tùy thân"
          leftIcon={<UserIcon />}
          error={errors.fullName?.message}
          className="text-body-lg md:text-body"
          {...register("fullName")}
        />

        <Input
          label="Địa chỉ Email"
          type="email"
          required
          autoComplete="email"
          placeholder="example@gmail.com"
          leftIcon={<MailIcon />}
          error={errors.email?.message}
          className="text-body-lg md:text-body"
          {...register("email")}
        />

        <Input
          label="Số điện thoại (Không bắt buộc)"
          type="tel"
          autoComplete="tel"
          placeholder="Ví dụ: 0912 345 678"
          leftIcon={<PhoneIcon />}
          error={errors.phoneNumber?.message}
          className="text-body-lg md:text-body"
          {...register("phoneNumber")}
        />

        <PasswordInput
          label="Mật khẩu"
          required
          autoComplete="new-password"
          placeholder="Nhập mật khẩu"
          hint="Mật khẩu phải chứa ít nhất 6 ký tự"
          leftIcon={<LockIcon />}
          error={errors.password?.message}
          className="text-body-lg md:text-body"
          {...register("password")}
        />

        <PasswordInput
          label="Nhập lại mật khẩu"
          required
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          leftIcon={<LockIcon />}
          error={errors.confirmPassword?.message}
          className="text-body-lg md:text-body"
          {...register("confirmPassword")}
        />
      </div>

      <Checkbox
        error={errors.agreeTerms?.message}
        label={
          <span className="font-normal text-text-secondary">
            Tôi đồng ý với{" "}
            <Link
              href="/terms"
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-primary-600 hover:underline"
            >
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link
              href="/rules"
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-primary-600 hover:underline"
            >
              Chính sách hoạt động
            </Link>{" "}
            của sàn đấu giá OmniBid.
          </span>
        }
        {...register("agreeTerms")}
      />

      <Button
        type="submit"
        variant="primary"
        size="xl"
        loading={registerMutation.isPending}
        disabled={!agreeTerms}
        rightIcon={<ArrowRightIcon className="size-4" />}
        className="w-full"
      >
        Đăng ký tài khoản
      </Button>

      <p className="text-center text-small text-text-secondary pt-1">
        Đã có tài khoản?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-primary-600 hover:underline"
        >
          Đăng nhập ngay
        </Link>
      </p>
    </form>
  );
}

