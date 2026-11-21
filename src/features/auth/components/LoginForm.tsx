"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
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
} from "@/components/icons";
import { UserRole } from "@/types/enums";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useLogin } from "../hooks";

// TODO fe-v4 login
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const loginMutation = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  const redirectParam = searchParams.get("redirect");
  const prefilledEmail = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: prefilledEmail,
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setServerError(null);

    loginMutation.mutate(
      {
        credentials: {
          email: values.email.trim(),
          password: values.password,
        },
        rememberMe: values.rememberMe,
      },
      {
        onSuccess: (auth) => {
          toast.success("Đăng nhập thành công!");
          const hasSafeRedirect =
            redirectParam &&
            redirectParam.startsWith("/") &&
            !redirectParam.startsWith("//");

          const target = hasSafeRedirect
            ? redirectParam
            : auth.role === UserRole.ADMIN
            ? "/admin"
            : "/";

          router.push(target);
          router.refresh();
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.code === "UNAUTHORIZED") {
              setServerError("Email hoặc mật khẩu không đúng");
              return;
            }

            if (err.code === "ACCOUNT_BANNED") {
              setServerError(
                "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ."
              );
              return;
            }

            if (err.code === "VALIDATION_ERROR" && err.fieldErrors) {
              let firstFocused = false;
              const unmapped: string[] = [];

              Object.entries(err.fieldErrors).forEach(([field, msg]) => {
                if (field === "email" || field === "password") {
                  setError(field, { type: "server", message: msg });
                  if (!firstFocused) {
                    setFocus(field);
                    firstFocused = true;
                  }
                } else if (msg) {
                  unmapped.push(msg);
                }
              });

              if (unmapped.length > 0) {
                setServerError(unmapped.join(". "));
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

  const registerHref = redirectParam
    ? `/register?redirect=${encodeURIComponent(redirectParam)}`
    : "/register";

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
          label="Địa chỉ Email"
          type="email"
          required
          autoComplete="email"
          placeholder="Nhập địa chỉ email của bạn"
          leftIcon={<MailIcon />}
          error={errors.email?.message}
          className="text-body-lg md:text-body"
          {...register("email")}
        />

        <div className="relative">
          <span className="absolute right-0 top-0 text-caption text-text-tertiary pointer-events-none">
            Tối thiểu 6 ký tự
          </span>
          <PasswordInput
            label="Mật khẩu"
            required
            autoComplete="current-password"
            placeholder="Nhập mật khẩu tài khoản của bạn"
            leftIcon={<LockIcon />}
            error={errors.password?.message}
            className="text-body-lg md:text-body"
            {...register("password")}
          />
        </div>
      </div>

      <Checkbox
        label={
          <span className="font-normal text-text-secondary">
            Ghi nhớ đăng nhập trên thiết bị này
          </span>
        }
        {...register("rememberMe")}
      />

      <Button
        type="submit"
        variant="primary"
        size="xl"
        loading={loginMutation.isPending}
        rightIcon={<ArrowRightIcon className="size-4" />}
        className="w-full"
      >
        Đăng nhập
      </Button>

      <p className="text-center text-small text-text-secondary pt-1">
        Chưa có tài khoản?{" "}
        <Link
          href={registerHref}
          className="font-semibold text-primary-600 hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}

