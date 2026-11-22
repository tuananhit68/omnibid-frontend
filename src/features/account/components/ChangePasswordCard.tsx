"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { Card } from "@/components/ui/Card";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { AlertCircleIcon, InfoIcon, LockIcon } from "@/components/icons";
import { PasswordStrengthMeter } from "@/features/auth/components";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas";
import { useChangePassword } from "../hooks";

const PASSWORD_FIELDS = [
  "currentPassword",
  "newPassword",
  "confirmPassword",
] as const;

export function ChangePasswordCard() {
  const toast = useToast();
  const changePasswordMutation = useChangePassword();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pendingValues, setPendingValues] =
    useState<ChangePasswordFormValues | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    control,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = useWatch({ control, name: "newPassword" });

  const handleRequestSubmit = (values: ChangePasswordFormValues) => {
    setServerError(null);
    setPendingValues(values);
  };

  const handleConfirmChangePassword = () => {
    if (!pendingValues) return;

    changePasswordMutation.mutate(
      {
        currentPassword: pendingValues.currentPassword,
        newPassword: pendingValues.newPassword,
        confirmPassword: pendingValues.confirmPassword,
      },
      {
        onSuccess: () => {
          setPendingValues(null);
          toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
        },
        onError: (err) => {
          setPendingValues(null);
          if (err instanceof ApiError) {
            if (err.code === "VALIDATION_ERROR" && err.fieldErrors) {
              let firstFocused = false;
              const unmapped: string[] = [];

              Object.entries(err.fieldErrors).forEach(([field, msg]) => {
                if ((PASSWORD_FIELDS as readonly string[]).includes(field)) {
                  const key = field as keyof ChangePasswordFormValues;
                  setError(key, { type: "server", message: msg });
                  if (!firstFocused) {
                    setFocus(key);
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

  return (
    <>
      <Card>
        <div className="mb-5 space-y-1">
          <h2 className="text-h3 text-text">Đổi mật khẩu</h2>
          <p className="text-small text-text-secondary">
            Cập nhật mật khẩu định kỳ để bảo vệ tài khoản của bạn.
          </p>
        </div>

        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-info-border bg-info-bg p-3 text-small text-info">
          <InfoIcon className="size-5 shrink-0 mt-0.5" />
          <span>
            Sau khi đổi, mọi phiên đăng nhập trên các thiết bị đều kết thúc.
          </span>
        </div>

        {serverError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg p-3 text-small text-danger"
          >
            <AlertCircleIcon className="size-5 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleRequestSubmit)}
          noValidate
          className="space-y-4"
        >
          <PasswordInput
            label="Mật khẩu hiện tại"
            required
            autoComplete="current-password"
            placeholder="Nhập mật khẩu hiện tại"
            leftIcon={<LockIcon />}
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          <div>
            <PasswordInput
              label="Mật khẩu mới"
              required
              autoComplete="new-password"
              placeholder="Nhập mật khẩu mới"
              hint="Tối thiểu 8 ký tự, có chữ hoa, chữ thường và chữ số"
              leftIcon={<LockIcon />}
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <PasswordStrengthMeter password={newPasswordValue ?? ""} />
          </div>

          <PasswordInput
            label="Nhập lại mật khẩu mới"
            required
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu mới"
            leftIcon={<LockIcon />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={changePasswordMutation.isPending}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </form>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingValues)}
        onClose={() => setPendingValues(null)}
        onConfirm={handleConfirmChangePassword}
        title="Xác nhận đổi mật khẩu"
        description="Sau khi đổi mật khẩu, mọi phiên đăng nhập trên tất cả thiết bị sẽ bị kết thúc ngay lập tức và bạn cần đăng nhập lại bằng mật khẩu mới."
        confirmLabel="Xác nhận đổi mật khẩu"
        cancelLabel="Hủy"
        confirmVariant="primary"
        tone="warning"
        loading={changePasswordMutation.isPending}
      />
    </>
  );
}
