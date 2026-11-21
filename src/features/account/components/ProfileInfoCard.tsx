"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { formatDateTime, formatDisplayCode } from "@/lib/format";
import { USER_ROLE_LABEL } from "@/types/enums";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import {
  AlertCircleIcon,
  MailIcon,
  PhoneIcon,
  UploadIcon,
  UserIcon,
} from "@/components/icons";
import {
  ALLOWED_AVATAR_TYPES,
  MAX_AVATAR_SIZE_BYTES,
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "../schemas";
import { useUpdateMe, useUploadAvatar } from "../hooks";
import type { UserProfile } from "../types";

interface ProfileInfoCardProps {
  profile: UserProfile;
}

const EDITABLE_FIELDS = ["fullName", "phoneNumber", "address"] as const;

export function ProfileInfoCard({ profile }: ProfileInfoCardProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const updateMutation = useUpdateMe();
  const uploadAvatarMutation = useUploadAvatar();

  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber ?? "",
      address: profile.address ?? "",
    },
  });

  useEffect(() => {
    reset({
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber ?? "",
      address: profile.address ?? "",
    });
  }, [profile.fullName, profile.phoneNumber, profile.address, reset]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input để có thể chọn lại cùng tệp nếu muốn thử lại
    e.target.value = "";
    if (!file) return;

    setAvatarError(null);

    if (!(ALLOWED_AVATAR_TYPES as readonly string[]).includes(file.type)) {
      setAvatarError(
        "Chỉ hỗ trợ định dạng ảnh JPG, PNG hoặc WEBP."
      );
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setAvatarError("Dung lượng ảnh tối đa 5 MB.");
      return;
    }

    uploadAvatarMutation.mutate(file, {
      onSuccess: () => {
        toast.success("Cập nhật ảnh đại diện thành công.");
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          if (
            err.code === "INVALID_IMAGE" ||
            err.code === "IMAGE_UPLOAD_FAILED" ||
            err.code === "PAYLOAD_TOO_LARGE"
          ) {
            setAvatarError(err.message);
            return;
          }
          setAvatarError(err.message);
          return;
        }
        setAvatarError(getErrorMessage("IMAGE_UPLOAD_FAILED"));
      },
    });
  };

  const onSubmit = (values: UpdateProfileFormValues) => {
    setServerError(null);

    updateMutation.mutate(
      {
        fullName: values.fullName.trim(),
        phoneNumber: values.phoneNumber.trim() || null,
        address: values.address.trim() || null,
      },
      {
        onSuccess: (updated) => {
          reset({
            fullName: updated.fullName,
            phoneNumber: updated.phoneNumber ?? "",
            address: updated.address ?? "",
          });
          toast.success("Đã lưu thay đổi thông tin cá nhân.");
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.code === "VALIDATION_ERROR" && err.fieldErrors) {
              let firstFocused = false;
              const unmapped: string[] = [];

              Object.entries(err.fieldErrors).forEach(([field, msg]) => {
                if ((EDITABLE_FIELDS as readonly string[]).includes(field)) {
                  const key = field as keyof UpdateProfileFormValues;
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
    <Card>
      <div className="mb-6 flex flex-col gap-4 border-b border-border-subtle pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar src={profile.avatarUrl} name={profile.fullName} size="xl" />
          <div className="min-w-0 space-y-1">
            <h2 className="text-h3 text-text">Thông tin cá nhân</h2>
            <p className="text-small text-text-secondary">
              Ảnh định dạng JPG, PNG hoặc WEBP, tối đa 5 MB.
            </p>
            <div className="pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-label="Chọn ảnh đại diện mới"
                onChange={handleAvatarChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={uploadAvatarMutation.isPending}
                leftIcon={<UploadIcon className="size-4" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Đổi ảnh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {avatarError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg p-3 text-small text-danger"
        >
          <AlertCircleIcon className="size-5 shrink-0 mt-0.5" />
          <span>{avatarError}</span>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg p-3 text-small text-danger"
        >
          <AlertCircleIcon className="size-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Họ tên"
            required
            autoComplete="name"
            placeholder="Nhập họ và tên"
            leftIcon={<UserIcon />}
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <Input
            label="Email"
            type="email"
            value={profile.email}
            readOnly
            disabled
            leftIcon={<MailIcon />}
            hint="Email dùng để đăng nhập và không thể thay đổi"
          />

          <Input
            label="Số điện thoại"
            type="tel"
            autoComplete="tel"
            placeholder="Ví dụ: 0912345678"
            leftIcon={<PhoneIcon />}
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />

          <Input
            label="Địa chỉ"
            autoComplete="street-address"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            error={errors.address?.message}
            {...register("address")}
          />
        </div>

        {/* Thông tin chỉ đọc */}
        <div className="grid grid-cols-1 gap-3 rounded-lg bg-surface-subtle p-4 sm:grid-cols-3">
          <div>
            <p className="label">Mã tài khoản</p>
            <p className="mt-1 text-small font-medium text-text tabular">
              {formatDisplayCode("USR", profile.id)}
            </p>
          </div>
          <div>
            <p className="label">Vai trò &amp; trạng thái</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-small font-medium text-text">
                {USER_ROLE_LABEL[profile.role]}
              </span>
              <StatusBadge statusType="user" value={profile.status} />
            </div>
          </div>
          <div>
            <p className="label">Ngày tham gia</p>
            <p className="mt-1 text-small font-medium text-text tabular">
              {formatDateTime(profile.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={updateMutation.isPending}
            disabled={!isDirty}
          >
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Card>
  );
}
