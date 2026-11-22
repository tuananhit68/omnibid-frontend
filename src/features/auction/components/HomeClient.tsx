"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ArrowRightIcon,
  AwardIcon,
  ClockIcon,
  GavelIcon,
  SearchIcon,
} from "@/components/icons";
import { isApiError } from "@/lib/api/types";
import { AuctionStatus } from "@/types/enums";
import { useAuctions, useCategories } from "../hooks";
import type { AuctionSummary, Category, Page } from "../types";
import { AuctionCard } from "./AuctionCard";
import { CategoryCard } from "./CategoryCard";

export interface HomeClientProps {
  initialCategories?: Category[] | null;
  initialEndingSoon?: Page<AuctionSummary> | null;
  initialUpcoming?: Page<AuctionSummary> | null;
}

const HOW_IT_WORKS_STEPS = [
  {
    step: "Bước 1",
    title: "Đặt giá",
    description:
      "Tìm sản phẩm yêu thích, xem rõ giá khởi điểm, bước giá và đặt giá trực tiếp theo thời gian thực.",
    icon: GavelIcon,
  },
  {
    step: "Bước 2",
    title: "Thắng phiên",
    description:
      "Phiên kết thúc đúng giờ, không gia hạn. Người đặt cao nhất đạt giá sàn sẽ thắng phiên và nhận đơn hàng.",
    icon: AwardIcon,
  },
  {
    step: "Bước 3",
    title: "Thanh toán trong 48 giờ",
    description:
      "Cập nhật địa chỉ nhận hàng, thanh toán trong thời hạn quy định và xác nhận khi nhận đủ sản phẩm.",
    icon: ClockIcon,
  },
];

export function HomeClient({
  initialCategories,
  initialEndingSoon,
  initialUpcoming,
}: HomeClientProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const {
    data: categories = [],
    isLoading: catLoading,
    isError: catError,
    error: catErrObj,
    refetch: refetchCategories,
  } = useCategories(initialCategories);

  const {
    data: endingSoonPage,
    isLoading: activeLoading,
    isError: activeError,
    error: activeErrObj,
    refetch: refetchActive,
  } = useAuctions(
    {
      status: AuctionStatus.ACTIVE,
      sort: "endTime,asc",
      page: 0,
      size: 4,
    },
    initialEndingSoon
  );

  const {
    data: upcomingPage,
    isLoading: upcomingLoading,
    isError: upcomingError,
    error: upcomingErrObj,
    refetch: refetchUpcoming,
  } = useAuctions(
    {
      status: AuctionStatus.SCHEDULED,
      sort: "endTime,asc",
      page: 0,
      size: 4,
    },
    initialUpcoming
  );

  const endingSoonList = endingSoonPage?.content ?? [];
  const upcomingList = upcomingPage?.content ?? [];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    router.push(
      trimmed ? `/auctions?keyword=${encodeURIComponent(trimmed)}` : "/auctions"
    );
  };

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-xl border border-border-brand bg-surface p-6 md:p-10">
        <div className="mx-auto max-w-2xl space-y-5 text-center">
          <div className="space-y-2">
            <h1 className="text-display text-text">
              Đấu giá trực tuyến minh bạch
            </h1>
            <p className="text-body text-text-secondary">
              Khám phá các phiên đấu giá đang diễn ra, đặt giá theo thời gian thực
              với quy trình thanh toán và giao nhận rõ ràng.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            role="search"
            className="flex flex-col gap-2.5 sm:flex-row"
          >
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-text-placeholder" />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm đồng hồ, máy ảnh, điện thoại…"
                aria-label="Tìm kiếm phiên đấu giá"
                className="h-12 w-full rounded-lg border border-border-brand bg-surface-subtle pl-11 pr-4 text-body-lg md:text-body text-text placeholder:text-text-placeholder transition-colors focus-visible:border-primary-600 focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="sm:h-12 sm:px-6">
              Tìm kiếm
            </Button>
          </form>
        </div>
      </section>

      {/* Danh mục */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-h2 text-text">Danh mục</h2>
          <Link
            href="/auctions"
            className="inline-flex items-center gap-1 text-small font-medium text-primary-600 hover:underline"
          >
            <span>Tất cả phiên</span>
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {catLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : catError ? (
          <ErrorState
            message={isApiError(catErrObj) ? catErrObj.message : undefined}
            onRetry={() => refetchCategories()}
          />
        ) : categories.length === 0 ? (
          <EmptyState
            title="Chưa có danh mục nào"
            description="Danh mục sản phẩm sẽ sớm được cập nhật."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* Sắp kết thúc */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-h2 text-text">Sắp kết thúc</h2>
          <Link
            href="/auctions?status=ACTIVE&sort=endTime,asc"
            className="inline-flex items-center gap-1 text-small font-medium text-primary-600 hover:underline"
          >
            <span>Xem tất cả</span>
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {activeLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        ) : activeError ? (
          <ErrorState
            message={isApiError(activeErrObj) ? activeErrObj.message : undefined}
            onRetry={() => refetchActive()}
          />
        ) : endingSoonList.length === 0 ? (
          <EmptyState
            title="Chưa có phiên nào đang diễn ra"
            description="Bạn có thể xem danh sách tất cả phiên đấu giá để theo dõi lịch mở phiên."
            action={
              <Link
                href="/auctions"
                className={getButtonClassName({ variant: "outline", size: "md" })}
              >
                Xem tất cả phiên
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {endingSoonList.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>

      {/* Sắp diễn ra */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-h2 text-text">Sắp diễn ra</h2>
          <Link
            href="/auctions?status=SCHEDULED&sort=endTime,asc"
            className="inline-flex items-center gap-1 text-small font-medium text-primary-600 hover:underline"
          >
            <span>Xem tất cả</span>
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {upcomingLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        ) : upcomingError ? (
          <ErrorState
            message={
              isApiError(upcomingErrObj) ? upcomingErrObj.message : undefined
            }
            onRetry={() => refetchUpcoming()}
          />
        ) : upcomingList.length === 0 ? (
          <EmptyState
            title="Chưa có phiên nào sắp diễn ra"
            description="Các phiên đấu giá mới lên lịch sẽ xuất hiện tại đây."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {upcomingList.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>

      {/* Cách đấu giá hoạt động */}
      <section className="space-y-4">
        <h2 className="text-h2 text-text">Cách đấu giá hoạt động</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map(({ step, title, description, icon: Icon }) => (
            <div
              key={step}
              className="rounded-xl border border-border-brand bg-surface p-6 space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 shrink-0">
                  <Icon className="size-5" />
                </span>
                <div>
                  <span className="label block">{step}</span>
                  <h3 className="text-h3 text-text">{title}</h3>
                </div>
              </div>
              <p className="text-small text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
