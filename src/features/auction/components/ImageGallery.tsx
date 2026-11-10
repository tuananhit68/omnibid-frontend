"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { formatDisplayCode } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ZoomInIcon,
} from "@/components/icons";
import type { AuctionStatus } from "@/types/enums";
import type { AuctionImage } from "../types";

export interface ImageGalleryProps {
  images?: AuctionImage[];
  primaryImageUrl?: string | null;
  productTitle: string;
  auctionId: number;
  status: AuctionStatus;
  className?: string;
}

export function ImageGallery({
  images,
  primaryImageUrl,
  productTitle,
  auctionId,
  status,
  className,
}: ImageGalleryProps) {
  const galleryImages =
    images && images.length > 0
      ? images
      : primaryImageUrl
      ? [{ id: 0, url: primaryImageUrl, isPrimary: true }]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeIndex =
    galleryImages.length > 0 ? Math.min(activeIndex, galleryImages.length - 1) : 0;
  const activeImage = galleryImages[safeIndex];

  const handlePrev = () => {
    if (galleryImages.length <= 1) return;
    setActiveIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const handleNext = () => {
    if (galleryImages.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Ảnh chính 4:3 */}
      <div className="relative w-full aspect-4/3 bg-surface-subtle border border-border-brand rounded-xl overflow-hidden">
        {activeImage ? (
          <Image
            src={activeImage.url}
            alt={productTitle}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 696px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary text-display font-bold select-none">
            {productTitle.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Badge trạng thái + Mã phiên góc trên trái */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
          <StatusBadge
            statusType="auction"
            value={status}
            className="bg-surface/95 shadow-xs"
          />
          <StatusBadge
            label={formatDisplayCode("AUC", auctionId)}
            tone="neutral"
            withDot={false}
            className="bg-surface/95 text-text font-semibold tabular shadow-xs"
          />
        </div>

        {/* Nút điều hướng ảnh trên mobile + chỉ số */}
        {galleryImages.length > 1 && (
          <div className="md:hidden absolute bottom-3 left-3 flex items-center gap-1.5">
            <IconButton
              label="Ảnh trước"
              icon={<ChevronLeftIcon />}
              size="lg"
              variant="outline"
              onClick={handlePrev}
              className="bg-surface/90 border-border-brand shadow-xs"
            />
            <span className="px-2.5 py-1 rounded-full bg-surface/90 border border-border-brand text-caption font-semibold text-text tabular">
              {safeIndex + 1} / {galleryImages.length}
            </span>
            <IconButton
              label="Ảnh tiếp theo"
              icon={<ChevronRightIcon />}
              size="lg"
              variant="outline"
              onClick={handleNext}
              className="bg-surface/90 border-border-brand shadow-xs"
            />
          </div>
        )}

        {/* Nút phóng to góc dưới phải */}
        {activeImage && (
          <div className="absolute bottom-3 right-3">
            <IconButton
              label="Phóng to ảnh sản phẩm"
              icon={<ZoomInIcon />}
              size="lg"
              variant="outline"
              onClick={() => setLightboxOpen(true)}
              className="bg-surface/90 border-border-brand shadow-xs"
            />
          </div>
        )}
      </div>

      {/* Hàng thumbnail (hiện khi có từ 2 ảnh trở lên hoặc giữ khung đồng đều) */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {galleryImages.map((img, idx) => {
            const isSelected = idx === safeIndex;
            return (
              <button
                key={img.id ?? idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-pressed={isSelected}
                aria-label={`Xem ảnh ${idx + 1} của ${productTitle}`}
                className={cn(
                  "relative size-20 md:size-24 rounded-lg overflow-hidden shrink-0 bg-surface-subtle border-2 transition-all",
                  "focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2",
                  isSelected
                    ? "border-primary-600"
                    : "border-border-brand hover:border-border-strong opacity-80 hover:opacity-100"
                )}
              >
                <Image
                  src={img.url}
                  alt={`${productTitle} - ảnh ${idx + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal xem ảnh lớn */}
      <Modal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={productTitle}
        description={
          galleryImages.length > 1
            ? `Ảnh ${safeIndex + 1} / ${galleryImages.length}`
            : undefined
        }
        maxWidth="xl"
      >
        <div className="space-y-4">
          <div className="relative w-full aspect-4/3 bg-surface-subtle rounded-xl overflow-hidden border border-border-subtle">
            {activeImage && (
              <Image
                src={activeImage.url}
                alt={productTitle}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-contain"
              />
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex items-center justify-between">
              <IconButton
                label="Ảnh trước"
                icon={<ChevronLeftIcon />}
                variant="outline"
                size="lg"
                onClick={handlePrev}
              />
              <span className="text-small font-medium text-text-secondary tabular">
                {safeIndex + 1} / {galleryImages.length}
              </span>
              <IconButton
                label="Ảnh tiếp theo"
                icon={<ChevronRightIcon />}
                variant="outline"
                size="lg"
                onClick={handleNext}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
