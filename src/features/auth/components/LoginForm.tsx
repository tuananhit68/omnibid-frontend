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
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
} from "@/components/icons";
import { UserRole } from "@/types/enums";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useLogin } from "../hooks";

interface NoticeBanner {
  tone: "success" | "warning" | "danger" | "info";
  message: string;
}

function resolveQueryNotice(
  registered: string | null,
  reason: string | null
): NoticeBanner | null {
  if (registered === "1") {
    return {
      tone: "success",
      message: "Đăng ký tài khoản thành công. Vui lòng đăng nhập để tiếp tục.",
    };
  }
  switch (reason) {
    case "banned":
      return {
        tone: "danger",
        message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
      };
    case "expired":
      return {
        tone: "warning",
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      };
    case "password-changed":
      return {
        tone: "info",
        message:
          "Đổi mật khẩu thành công. Mọi phiên đăng nhập trước đó đã kết thúc, vui lòng đăng nhập lại.",
      };
    default:
      return null;
  }
}

function resolvePostLoginTarget(
  redirectParam: string | null,
  role: UserRole
): string {
  const defaultTarget = role === UserRole.ADMIN ? "/admin" : "/";
  if (!redirectParam) return defaultTarget;

  const trimmed = redirectParam.trim();
  const isInternalPath =
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/login") &&
    !trimmed.startsWith("/register");

  if (!isInternalPath) return defaultTarget;

  // Không chuyển hướng chéo vai trò
  if (role === UserRole.ADMIN && (trimmed.startsWith("/me") || trimmed.startsWith("/orders"))) {
    return defaultTarget;
  }
  if (role === UserRole.USER && trimmed.startsWith("/admin")) {
    return defaultTarget;
  }

  return trimmed;
}

const NOTICE_STYLE: Record<NoticeBanner["tone"], string> = {
  success: "bg-success-bg border-success-border text-success-strong",
  warning: "bg-warning-bg border-warning-border text-warning-strong",
  danger: "bg-danger-bg border-danger-border text-danger",
  info: "bg-info-bg border-info-border text-info",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const loginMutation = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  const redirectParam = searchParams.get("redirect");
  const prefilledEmail = searchParams.get("email") ?? "";
  const registeredParam = searchParams.get("registered");
  const reasonParam = searchParams.get("reason");

  const notice = resolveQueryNotice(registeredParam, reasonParam);

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
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setServerError(null);

    loginMutation.mutate(
      {
        email: values.email.trim(),
        password: values.password,
      },
      {
        onSuccess: (auth) => {
          toast.success("Đăng nhập thành công.");
          const target = resolvePostLoginTarget(redirectParam, auth.role);
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
              setServerError(getErrorMessage("ACCOUNT_BANNED"));
              return;
            }

            if (err.code === "TOO_MANY_REQUESTS") {
              setServerError(getErrorMessage("TOO_MANY_REQUESTS"));
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

  const renderNoticeIcon = (tone: NoticeBanner["tone"]) => {
    if (tone === "success") return <CheckCircleIcon className="size-5 shrink-0 mt-0.5" />;
    if (tone === "warning") return <AlertTriangleIcon className="size-5 shrink-0 mt-0.5" />;
    if (tone === "danger") return <AlertCircleIcon className="size-5 shrink-0 mt-0.5" />;
    return <InfoIcon className="size-5 shrink-0 mt-0.5" />;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {notice && !serverError && (
        <div
          role={notice.tone === "danger" ? "alert" : "status"}
          className={`flex items-start gap-2.5 rounded-lg border p-3.5 text-small ${NOTICE_STYLE[notice.tone]}`}
        >
          {renderNoticeIcon(notice.tone)}
          <span>{notice.message}</span>
        </div>
      )}

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
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="Nhập địa chỉ email của bạn"
          leftIcon={<MailIcon />}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Mật khẩu"
          required
          autoComplete="current-password"
          placeholder="Nhập mật khẩu của bạn"
          leftIcon={<LockIcon />}
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loginMutation.isPending}
        rightIcon={<ArrowRightIcon className="size-4" />}
        className="w-full"
      >
        Đăng nhập
      </Button>

      <p className="pt-1 text-center text-small text-text-secondary">
        Chưa có tài khoản?{" "}
        <Link
          href={registerHref}
          className="font-semibold text-primary-600 hover:underline"
        >
          Tạo tài khoản
        </Link>
      </p>
    </form>
  );
}
