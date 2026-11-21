// TODO fe-v4 auction-detail
"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { ProductImage } from "../types";

export interface ImageGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = images[selectedIndex] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border-brand bg-surface-subtle">
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
          <span className="absolute bottom-3 right-3 rounded-full bg-surface/90 px-2.5 py-0.5 text-caption font-medium text-text tabular">
            {selectedIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-surface-subtle transition-colors",
                idx === selectedIndex
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
