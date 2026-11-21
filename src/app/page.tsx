// TODO fe-v4 home
"use client";

import Link from "next/link";
import { PublicLayout } from "@/components/layout";
import { getButtonClassName } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { AuctionStatus } from "@/types/enums";
import {
  AuctionCard,
  CategoryCard,
  FeaturedAuctionHeroCard,
  UpcomingAuctionCard,
  useAuctions,
  useCategories,
} from "@/features/auction";

export default function HomePage() {
  const { data: categories = [], isLoading: catLoading } = useCategories();
  const {
    data: activePage,
    isLoading: activeLoading,
    isError: activeError,
    refetch: refetchActive,
  } = useAuctions({
    status: AuctionStatus.ACTIVE,
    sort: "endTime,asc",
    page: 0,
    size: 8,
  });
  const { data: upcomingPage, isLoading: upcomingLoading } = useAuctions({
    status: AuctionStatus.SCHEDULED,
    sort: "endTime,asc",
    page: 0,
    size: 4,
  });

  const activeList = activePage?.content ?? [];
  const featured = activeList[0];
  const restActive = activeList.slice(1);
  const upcomingList = upcomingPage?.content ?? [];

  return (
    <PublicLayout>
      <div className="space-y-10">
        {/* Hero */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-display text-text">Đấu giá trực tuyến minh bạch</h1>
              <p className="text-body text-text-secondary">
                Đặt giá theo thời gian thực, quy trình thanh toán và giao nhận rõ ràng.
              </p>
            </div>
            <Link
              href="/auctions"
              className={getButtonClassName({ variant: "primary", size: "lg" })}
            >
              Xem tất cả phiên
            </Link>
          </div>

          {activeLoading ? (
            <Skeleton className="h-80 rounded-xl" />
          ) : activeError ? (
            <ErrorState onRetry={() => refetchActive()} />
          ) : featured ? (
            <FeaturedAuctionHeroCard auction={featured} />
          ) : null}
        </section>

        {/* Danh mục */}
        <section className="space-y-4">
          <h2 className="text-h2 text-text">Danh mục nổi bật</h2>
          {catLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </section>

        {/* Đang diễn ra */}
        {restActive.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 text-text">Đang diễn ra</h2>
              <Link
                href="/auctions?status=ACTIVE"
                className="text-small font-medium text-primary-600 hover:underline"
              >
                Xem thêm
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {restActive.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </section>
        )}

        {/* Sắp diễn ra */}
        {!upcomingLoading && upcomingList.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 text-text">Sắp diễn ra</h2>
              <Link
                href="/auctions?status=SCHEDULED"
                className="text-small font-medium text-primary-600 hover:underline"
              >
                Xem thêm
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {upcomingList.map((auction) => (
                <UpcomingAuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}
