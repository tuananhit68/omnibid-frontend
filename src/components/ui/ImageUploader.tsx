"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { CloseIcon, UploadIcon } from "../icons";

export interface UploadImageItem {
  id: string;
  previewUrl: string;
  file?: File;
  isPrimary?: boolean;
}

export interface ImageUploaderProps {
  items: UploadImageItem[];
  onChange: (next: UploadImageItem[]) => void;
  maxFiles?: number;
  allowSetPrimary?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function ImageUploader({
  items,
  onChange,
  maxFiles = 5,
  allowSetPrimary = false,
  disabled = false,
  error,
  label = "Hình ảnh sản phẩm",
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setLocalError(null);

    const remaining = maxFiles - items.length;
    if (remaining <= 0) {
      setLocalError(`Chỉ được tải lên tối đa ${maxFiles} ảnh.`);
      return;
    }

    const incoming = Array.from(fileList).slice(0, remaining);
    const nextItems: UploadImageItem[] = [];

    for (const file of incoming) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setLocalError("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setLocalError("Mỗi ảnh tối đa 5 MB.");
        continue;
      }
      nextItems.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        previewUrl: URL.createObjectURL(file),
        file,
      });
    }

    if (nextItems.length > 0) {
      const merged = [...items, ...nextItems].map((item, idx) => ({
        ...item,
        isPrimary: idx === 0,
      }));
      onChange(merged);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (id: string) => {
    const filtered = items
      .filter((item) => item.id !== id)
      .map((item, idx) => ({ ...item, isPrimary: idx === 0 }));
    onChange(filtered);
  };

  const handleSetPrimary = (index: number) => {
    if (!allowSetPrimary || index <= 0 || index >= items.length) return;
    const copy = [...items];
    const [picked] = copy.splice(index, 1);
    const reordered = [picked, ...copy].map((item, idx) => ({
      ...item,
      isPrimary: idx === 0,
    }));
    onChange(reordered);
  };

  const displayError = error || localError;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="label">{label}</span>
        <span className="text-caption text-text-tertiary tabular">
          {items.length} / {maxFiles}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border-brand bg-surface-subtle"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.previewUrl}
              alt={`Ảnh sản phẩm ${index + 1}`}
              className="size-full object-cover"
            />
            {index === 0 ? (
              <span className="absolute left-1.5 top-1.5 rounded-sm bg-primary-600 px-2 py-0.5 text-caption font-medium text-text-inverse">
                Ảnh chính
              </span>
            ) : (
              allowSetPrimary &&
              !disabled && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  className="absolute bottom-1.5 left-1.5 right-1.5 rounded-sm bg-surface/95 px-2 py-1 text-caption font-medium text-text hover:bg-primary-50 hover:text-primary-600"
                >
                  Đặt làm ảnh chính
                </button>
              )
            )}
            {!disabled && (
              <button
                type="button"
                aria-label={`Xóa ảnh ${index + 1}`}
                onClick={() => handleRemove(item.id)}
                className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-surface/90 text-text hover:bg-danger-bg hover:text-danger"
              >
                <CloseIcon className="size-4" />
              </button>
            )}
          </div>
        ))}

        {items.length < maxFiles && !disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong bg-surface-subtle p-3 text-text-secondary transition-colors hover:border-primary-600 hover:bg-primary-50 hover:text-primary-600"
          >
            <UploadIcon className="size-5" />
            <span className="text-caption font-medium text-center">Thêm ảnh</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={disabled}
        className="sr-only"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      <p className="text-caption text-text-tertiary">
        Hỗ trợ JPG, PNG, WEBP tối đa 5 MB mỗi ảnh. Tối thiểu 1 ảnh, tối đa {maxFiles} ảnh.
      </p>

      {displayError && (
        <p role="alert" className="text-caption text-danger">
          {displayError}
        </p>
      )}
    </div>
  );
}
