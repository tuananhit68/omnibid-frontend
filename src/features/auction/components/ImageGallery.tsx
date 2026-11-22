"use client";

import { useRef, useState, type TouchEvent } from "react";
import { cn } from "@/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import type { ProductImage } from "../types";

export interface ImageGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const safeIndex =
    images.length > 0 ? Math.min(selectedIndex, images.length - 1) : 0;
  const current = images[safeIndex];

  const handlePrev = () => {
    if (images.length <= 1) return;
    setSelectedIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (images.length <= 1) return;
    setSelectedIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || images.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (delta > 40) handlePrev();
    else if (delta < -40) handleNext();
  };

  return (
    <div className="space-y-3">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border-brand bg-surface-subtle select-none"
      >
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.imageUrl}
            alt={title}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-small text-text-tertiary">
            Chưa có hình ảnh
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Ảnh trước"
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border-brand bg-surface/90 text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-focus"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Ảnh tiếp theo"
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border-brand bg-surface/90 text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-focus"
            >
              <ChevronRightIcon className="size-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-surface/90 px-2.5 py-0.5 text-caption font-medium text-text tabular">
              {safeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2.5 overflow-x-auto pb-1"
          role="listbox"
          aria-label="Danh sách hình ảnh sản phẩm"
        >
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              role="option"
              aria-selected={idx === safeIndex}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              className={cn(
                "size-16 sm:size-20 shrink-0 overflow-hidden rounded-lg border-2 bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-focus",
                idx === safeIndex
                  ? "border-primary-600"
                  : "border-transparent hover:border-border-strong"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.imageUrl}
                alt={`${title} - ảnh ${idx + 1}`}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
