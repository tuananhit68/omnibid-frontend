"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CategoryIcon,
  ConfirmDialog,
  ErrorState,
  ImageUploader,
  Input,
  Select,
  Skeleton,
  StatusBadge,
  Textarea,
  type UploadImageItem,
  useToast,
} from "@/components/ui";
import {
  AlertCircleIcon,
  CloseIcon,
  InfoIcon,
  UploadIcon,
} from "@/components/icons";
import { ApiError } from "@/lib/api/types";
import type { Category, Product, ProductImage } from "@/lib/api/contract";
import { useCategories } from "@/features/auction/hooks";
import { formatDisplayCode } from "@/lib/format";
import {
  PRODUCT_CONDITION_LABEL,
  PRODUCT_STATUS_META,
  ProductCondition,
  ProductStatus,
} from "@/types/enums";
import {
  useAddProductImages,
  useCreateProduct,
  useDeleteProductImage,
  useProductDetail,
  useUpdateProduct,
} from "../hooks";
import { productFormSchema, type ProductFormValues } from "../schemas";

const CONDITION_OPTIONS = Object.values(ProductCondition).map((cond) => ({
  value: cond,
  label: PRODUCT_CONDITION_LABEL[cond],
}));

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_IMAGES = 5;

function UploadProgressBar({ percent }: { percent: number }) {
  return (
    <div className="space-y-1.5" role="status" aria-live="polite">
      <div className="flex items-center justify-between text-caption text-text-secondary">
        <span>Đang tải ảnh lên máy chủ…</span>
        <span className="tabular font-medium">{percent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-primary-600 transition-all duration-200"
          style={{ width: `${Math.max(5, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}

interface ProductCreateFormProps {
  categories: Category[];
}

function ProductCreateForm({ categories }: ProductCreateFormProps) {
  const router = useRouter();
  const toast = useToast();
  const createMutation = useCreateProduct();

  const [images, setImages] = useState<UploadImageItem[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      categoryId: categories[0]?.id ?? 0,
      condition: ProductCondition.LIKE_NEW,
      description: "",
    },
  });

  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const selectedCategory = categories.find(
    (c) => c.id === Number(selectedCategoryId)
  );

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitError(null);
    setImageError(null);

    const files = images
      .map((item) => item.file)
      .filter((f): f is File => Boolean(f));

    if (files.length < 1 || files.length > MAX_TOTAL_IMAGES) {
      setImageError("Vui lòng chọn từ 1 đến 5 ảnh sản phẩm.");
      return;
    }

    try {
      setUploadPercent(10);
      const created = await createMutation.mutateAsync({
        product: {
          title: values.title,
          description: values.description,
          categoryId: values.categoryId,
          condition: values.condition,
        },
        files,
        onUploadProgress: (pct) => setUploadPercent(pct),
      });
      toast.success(
        `Sản phẩm "${created.title}" đã sẵn sàng để tạo phiên đấu giá.`,
        "Đã thêm sản phẩm"
      );
      router.push("/me/products");
    } catch (err) {
      setUploadPercent(null);
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          for (const [field, msg] of Object.entries(err.fieldErrors)) {
            if (
              field === "title" ||
              field === "categoryId" ||
              field === "condition" ||
              field === "description"
            ) {
              setError(field, { message: msg });
            }
          }
        }
        if (
          err.code === "INVALID_IMAGE" ||
          err.code === "IMAGE_UPLOAD_FAILED" ||
          err.code === "PAYLOAD_TOO_LARGE"
        ) {
          setImageError(err.message);
        } else {
          setSubmitError(err.message);
        }
      } else {
        setSubmitError("Không thể tạo sản phẩm. Vui lòng thử lại.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-small text-danger"
            >
              <AlertCircleIcon className="mt-0.5 size-4.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Tiêu đề sản phẩm"
                required
                placeholder="Ví dụ: Đồng hồ cơ Seiko Presage Cocktail Time…"
                error={errors.title?.message}
                disabled={createMutation.isPending}
                {...register("title")}
              />
            </div>

            <div className="space-y-1.5">
              <Select
                label="Danh mục"
                required
                error={errors.categoryId?.message}
                disabled={createMutation.isPending || categories.length === 0}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                {...register("categoryId", { valueAsNumber: true })}
              />
              {selectedCategory && (
                <div className="flex items-center gap-2 text-caption text-text-secondary">
                  <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                    <CategoryIcon name={selectedCategory.icon} className="size-3.5" />
                  </span>
                  <span>Biểu tượng danh mục: {selectedCategory.name}</span>
                </div>
              )}
            </div>

            <Select
              label="Tình trạng"
              required
              error={errors.condition?.message}
              disabled={createMutation.isPending}
              options={CONDITION_OPTIONS}
              {...register("condition")}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Mô tả chi tiết"
                required
                rows={5}
                placeholder="Mô tả rõ nguồn gốc, phụ kiện đi kèm, tình trạng ngoại hình và lỗi nếu có…"
                error={errors.description?.message}
                disabled={createMutation.isPending}
                {...register("description")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hình ảnh sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploader
            items={images}
            onChange={(next) => {
              setImages(next);
              if (imageError) setImageError(null);
            }}
            maxFiles={MAX_TOTAL_IMAGES}
            allowSetPrimary
            disabled={createMutation.isPending}
            error={imageError ?? undefined}
            label="Chọn 1–5 ảnh (ảnh đầu tiên sẽ là ảnh chính)"
          />

          <div className="flex items-start gap-2 rounded-lg bg-surface-subtle px-3.5 py-2.5 text-caption text-text-secondary">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary-600" />
            <span>
              Ảnh được kiểm tra theo nội dung thật; nếu tải ảnh thất bại thì sản phẩm không được lưu.
            </span>
          </div>

          {uploadPercent !== null && <UploadProgressBar percent={uploadPercent} />}
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/me/products"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-border-strong bg-surface px-5 text-small font-semibold text-text hover:bg-surface-subtle transition-colors"
        >
          Hủy
        </Link>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={createMutation.isPending}
        >
          Tạo sản phẩm
        </Button>
      </div>
    </form>
  );
}

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
  onRefresh: () => void;
}

function ProductEditForm({ product, categories, onRefresh }: ProductEditFormProps) {
  const toast = useToast();
  const updateMutation = useUpdateProduct();
  const addImagesMutation = useAddProductImages();
  const deleteImageMutation = useDeleteProductImage();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const [deleteImageTarget, setDeleteImageTarget] = useState<ProductImage | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product.title,
      categoryId: product.categoryId,
      condition: product.condition,
      description: product.description,
    },
  });

  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const selectedCategory = categories.find(
    (c) => c.id === Number(selectedCategoryId)
  );

  const onSubmitInfo = async (values: ProductFormValues) => {
    setSubmitError(null);
    try {
      await updateMutation.mutateAsync({
        id: product.id,
        payload: values,
      });
      toast.success("Đã lưu thay đổi thông tin sản phẩm.", "Cập nhật thành công");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          for (const [field, msg] of Object.entries(err.fieldErrors)) {
            if (
              field === "title" ||
              field === "categoryId" ||
              field === "condition" ||
              field === "description"
            ) {
              setError(field, { message: msg });
            }
          }
        }
        setSubmitError(err.message);
        if (err.code === "PRODUCT_NOT_EDITABLE") {
          onRefresh();
        }
      } else {
        setSubmitError("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
      }
    }
  };

  const handleAddFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setImageError(null);

    const remaining = MAX_TOTAL_IMAGES - product.images.length;
    if (remaining <= 0) {
      setImageError("Sản phẩm đã đạt tối đa 5 ảnh.");
      return;
    }

    const picked = Array.from(fileList);
    if (picked.length > remaining) {
      setImageError(`Bạn chỉ có thể thêm tối đa ${remaining} ảnh nữa.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    for (const file of picked) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setImageError("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setImageError("Mỗi ảnh tối đa 5 MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    try {
      setUploadPercent(15);
      await addImagesMutation.mutateAsync({
        id: product.id,
        files: picked,
        onUploadProgress: (pct) => setUploadPercent(pct),
      });
      toast.success(`Đã thêm ${picked.length} ảnh mới.`, "Tải ảnh thành công");
    } catch (err) {
      if (err instanceof ApiError) {
        setImageError(err.message);
        if (err.code === "PRODUCT_NOT_EDITABLE") {
          onRefresh();
        }
      } else {
        setImageError("Không thể tải ảnh lên. Vui lòng thử lại.");
      }
    } finally {
      setUploadPercent(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirmDeleteImage = async () => {
    if (!deleteImageTarget) return;
    setImageError(null);
    try {
      await deleteImageMutation.mutateAsync({
        productId: product.id,
        imageId: deleteImageTarget.id,
      });
      toast.success("Đã xóa ảnh khỏi sản phẩm.", "Xóa ảnh thành công");
      setDeleteImageTarget(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setImageError(err.message);
        if (err.code === "PRODUCT_NOT_EDITABLE") {
          onRefresh();
        }
      } else {
        setImageError("Không thể xóa ảnh. Vui lòng thử lại.");
      }
      setDeleteImageTarget(null);
    }
  };

  const isLocked = product.status !== ProductStatus.AVAILABLE;
  const statusMeta = PRODUCT_STATUS_META[product.status];

  if (isLocked) {
    return (
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
            <span className="text-caption text-text-tertiary tabular">
              {formatDisplayCode("PRD", product.id)}
            </span>
          </div>
          <h2 className="text-h3 text-text">Không thể chỉnh sửa sản phẩm này</h2>
          <p className="text-body text-text-secondary">
            {product.status === ProductStatus.HIDDEN
              ? "Sản phẩm đã bị quản trị viên ẩn vĩnh viễn và không thể chỉnh sửa."
              : "Chỉ có thể chỉnh sửa thông tin và hình ảnh khi sản phẩm ở trạng thái Sẵn sàng."}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/me/products"
              className="inline-flex h-10 items-center rounded-lg border border-border-strong bg-surface px-4 text-small font-semibold text-text hover:bg-surface-subtle transition-colors"
            >
              Quay lại danh sách
            </Link>
            {product.activeAuctionId !== null && (
              <Link
                href={`/me/auctions/${product.activeAuctionId}`}
                className="inline-flex h-10 items-center rounded-lg bg-primary-600 px-4 text-small font-semibold text-text-inverse hover:bg-primary-700 transition-colors"
              >
                Xem phiên đang diễn ra
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmitInfo)} className="space-y-6" noValidate>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Thông tin sản phẩm</CardTitle>
            <span className="text-caption text-text-tertiary tabular">
              {formatDisplayCode("PRD", product.id)}
            </span>
          </CardHeader>
          <CardContent className="space-y-5">
            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-small text-danger"
              >
                <AlertCircleIcon className="mt-0.5 size-4.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Tiêu đề sản phẩm"
                  required
                  error={errors.title?.message}
                  disabled={updateMutation.isPending}
                  {...register("title")}
                />
              </div>

              <div className="space-y-1.5">
                <Select
                  label="Danh mục"
                  required
                  error={errors.categoryId?.message}
                  disabled={updateMutation.isPending || categories.length === 0}
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  {...register("categoryId", { valueAsNumber: true })}
                />
                {selectedCategory && (
                  <div className="flex items-center gap-2 text-caption text-text-secondary">
                    <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                      <CategoryIcon name={selectedCategory.icon} className="size-3.5" />
                    </span>
                    <span>Biểu tượng danh mục: {selectedCategory.name}</span>
                  </div>
                )}
              </div>

              <Select
                label="Tình trạng"
                required
                error={errors.condition?.message}
                disabled={updateMutation.isPending}
                options={CONDITION_OPTIONS}
                {...register("condition")}
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Mô tả chi tiết"
                  required
                  rows={5}
                  error={errors.description?.message}
                  disabled={updateMutation.isPending}
                  {...register("description")}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:justify-end">
              <Link
                href="/me/products"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border-strong bg-surface px-4 text-small font-semibold text-text hover:bg-surface-subtle transition-colors"
              >
                Quay lại
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={updateMutation.isPending}
                disabled={!isDirty}
              >
                Lưu thông tin
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Hình ảnh sản phẩm</CardTitle>
          <span className="text-caption text-text-tertiary tabular">
            {product.images.length} / {MAX_TOTAL_IMAGES} ảnh
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {product.images.map((img, idx) => {
              const canDelete = product.images.length > 1;
              return (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border-brand bg-surface-subtle"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageUrl}
                    alt={`Ảnh sản phẩm ${idx + 1}`}
                    className="size-full object-cover"
                  />
                  {img.isPrimary && (
                    <span className="absolute left-1.5 top-1.5 rounded-sm bg-primary-600 px-2 py-0.5 text-caption font-medium text-text-inverse">
                      Ảnh chính
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Xóa ảnh ${idx + 1}`}
                    disabled={!canDelete || deleteImageMutation.isPending}
                    title={
                      canDelete
                        ? "Xóa ảnh này"
                        : "Sản phẩm phải giữ lại ít nhất 1 ảnh"
                    }
                    onClick={() => setDeleteImageTarget(img)}
                    className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-surface/90 text-text hover:bg-danger-bg hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </div>
              );
            })}

            {product.images.length < MAX_TOTAL_IMAGES && (
              <button
                type="button"
                disabled={addImagesMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong bg-surface-subtle p-3 text-text-secondary transition-colors hover:border-primary-600 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UploadIcon className="size-5" />
                <span className="text-caption font-medium text-center">Thêm ảnh</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={addImagesMutation.isPending}
            className="sr-only"
            onChange={(e) => handleAddFiles(e.target.files)}
          />

          <div className="flex items-start gap-2 rounded-lg bg-surface-subtle px-3.5 py-2.5 text-caption text-text-secondary">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary-600" />
            <span>
              Hỗ trợ JPG, PNG, WEBP tối đa 5 MB mỗi ảnh (tối đa 5 ảnh). Ảnh được kiểm tra theo nội dung thật; không thể xóa ảnh cuối cùng hoặc đổi ảnh chính khi sửa.
            </span>
          </div>

          {uploadPercent !== null && <UploadProgressBar percent={uploadPercent} />}

          {imageError && (
            <p role="alert" className="text-caption text-danger">
              {imageError}
            </p>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(deleteImageTarget)}
        onClose={() => setDeleteImageTarget(null)}
        onConfirm={handleConfirmDeleteImage}
        title="Xóa ảnh sản phẩm"
        description="Bạn có chắc muốn xóa ảnh này khỏi sản phẩm? Hành động không thể hoàn tác."
        confirmLabel="Xóa ảnh"
        confirmVariant="danger-soft"
        tone="danger"
        loading={deleteImageMutation.isPending}
      />
    </div>
  );
}

export interface ProductFormClientProps {
  mode: "create" | "edit";
  productId?: number;
}

export function ProductFormClient({ mode, productId }: ProductFormClientProps) {
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const productQuery = useProductDetail(mode === "edit" && productId ? productId : 0);

  if (categoriesLoading || (mode === "edit" && productQuery.isLoading)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (categoriesError || !categories) {
    return (
      <ErrorState
        title="Không thể tải danh mục sản phẩm"
        message="Vui lòng thử tải lại để tiếp tục."
        onRetry={() => refetchCategories()}
      />
    );
  }

  if (mode === "edit") {
    if (productQuery.isError || !productQuery.data) {
      const apiErr = productQuery.error instanceof ApiError ? productQuery.error : null;
      return (
        <ErrorState
          title="Không thể tải thông tin sản phẩm"
          message={apiErr?.message || "Sản phẩm không tồn tại hoặc bạn không có quyền chỉnh sửa."}
          onRetry={() => productQuery.refetch()}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-h2 text-text">Chỉnh sửa sản phẩm</h1>
          <p className="mt-1 text-small text-text-secondary">
            Cập nhật mô tả, tình trạng và bộ ảnh cho sản phẩm khi còn ở trạng thái Sẵn sàng.
          </p>
        </div>
        <ProductEditForm
          key={productQuery.data.id}
          product={productQuery.data}
          categories={categories}
          onRefresh={() => productQuery.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 text-text">Thêm sản phẩm mới</h1>
        <p className="mt-1 text-small text-text-secondary">
          Điền đầy đủ thông tin và tải 1–5 ảnh thật để sẵn sàng mở phiên đấu giá.
        </p>
      </div>
      <ProductCreateForm categories={categories} />
    </div>
  );
}
