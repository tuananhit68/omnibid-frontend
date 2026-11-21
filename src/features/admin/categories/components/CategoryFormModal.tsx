"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AdminCategory } from "@/lib/api/contract";
import { isApiError } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import {
  ALLOWED_CATEGORY_ICONS,
  CategoryIcon,
} from "@/components/ui/CategoryIcon";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useCreateAdminCategory, useUpdateAdminCategory } from "../hooks";
import {
  adminCategorySchema,
  slugifyVietnamese,
  type AdminCategoryFormValues,
} from "../schemas";

export interface CategoryFormModalProps {
  open: boolean;
  category: AdminCategory | null;
  onClose: () => void;
}

export function CategoryFormModal({
  open,
  category,
  onClose,
}: CategoryFormModalProps) {
  const toast = useToast();
  const isEdit = category !== null;
  const [slugTouched, setSlugTouched] = useState(isEdit);

  const createMutation = useCreateAdminCategory();
  const updateMutation = useUpdateAdminCategory();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<AdminCategoryFormValues>({
    resolver: zodResolver(adminCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      icon: category?.icon ?? "tag",
    },
  });

  const selectedIcon = useWatch({ control, name: "icon" });

  useEffect(() => {
    if (!open) return;
    reset({
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      icon: category?.icon ?? "tag",
    });
  }, [open, category, reset]);

  const handleClose = () => {
    setSlugTouched(false);
    onClose();
  };

  const onSubmit = (values: AdminCategoryFormValues) => {
    const payload = {
      name: values.name.trim(),
      slug: values.slug.trim().toLowerCase(),
      icon: values.icon || null,
    };

    const handleApiError = (err: unknown) => {
      if (isApiError(err)) {
        if (err.fieldErrors) {
          for (const [field, message] of Object.entries(err.fieldErrors)) {
            if (field === "name" || field === "slug" || field === "icon") {
              setError(field, { message });
            }
          }
          return;
        }
        toast.error(err.message);
        return;
      }
      toast.error("Không thể lưu danh mục. Vui lòng thử lại.");
    };

    if (isEdit && category) {
      updateMutation.mutate(
        { id: category.id, payload },
        {
          onSuccess: () => {
            toast.success("Đã cập nhật danh mục.");
            handleClose();
          },
          onError: handleApiError,
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Đã thêm danh mục mới.");
          handleClose();
        },
        onError: handleApiError,
      });
    }
  };

  const nameReg = register("name");
  const slugReg = register("slug");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
      maxWidth="md"
      footer={
        <>
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            form="admin-category-form"
            loading={isSubmitting}
          >
            {isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
          </Button>
        </>
      }
    >
      <form
        id="admin-category-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <Input
          label="Tên danh mục *"
          placeholder="Ví dụ: Đồng hồ cơ"
          error={errors.name?.message}
          {...nameReg}
          onChange={(e) => {
            nameReg.onChange(e);
            if (!isEdit && !slugTouched) {
              setValue("slug", slugifyVietnamese(e.target.value), {
                shouldValidate: false,
              });
            }
          }}
        />

        <Input
          label="Slug *"
          placeholder="vi-du-dong-ho-co"
          hint="Tự động gợi ý từ tên; chỉ gồm chữ thường không dấu, số và dấu gạch ngang."
          error={errors.slug?.message}
          {...slugReg}
          onChange={(e) => {
            setSlugTouched(true);
            slugReg.onChange(e);
          }}
        />

        <div>
          <span className="mb-2 block text-label font-medium text-text">
            Biểu tượng danh mục
          </span>
          <div
            className="grid grid-cols-4 gap-2 sm:grid-cols-8"
            role="radiogroup"
            aria-label="Chọn biểu tượng danh mục"
          >
            {ALLOWED_CATEGORY_ICONS.map((iconName) => {
              const active = selectedIcon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={iconName}
                  title={iconName}
                  onClick={() => setValue("icon", iconName)}
                  className={cn(
                    "flex h-11 items-center justify-center rounded-lg border transition-colors",
                    active
                      ? "border-primary-600 bg-primary-50 text-primary-600"
                      : "border-border-brand bg-surface text-text-secondary hover:bg-surface-subtle hover:text-text"
                  )}
                >
                  <CategoryIcon name={iconName} className="size-5" />
                </button>
              );
            })}
          </div>
          {errors.icon?.message && (
            <p className="mt-1 text-caption text-danger">{errors.icon.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
