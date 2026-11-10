"use client";

import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CategoryCard,
  FeaturedAuctionHeroCard,
  AuctionCard,
  UpcomingAuctionCard,
} from "@/features/auction/components";
import { useAuctions, useCategories } from "@/features/auction/hooks";
import { AuctionStatus } from "@/types/enums";
import { getStoredUser } from "@/lib/api/auth-storage";

export default function HomePage() {
  const currentUser = typeof window !== "undefined" ? getStoredUser() : null;
  const isAuthenticated = Boolean(currentUser);

  // 1. Lấy danh sách phiên ACTIVE kết thúc sớm nhất
  const {
    data: activeData,
    isLoading: activeLoading,
    isError: activeError,
    refetch: refetchActive,
  } = useAuctions({
    status: AuctionStatus.ACTIVE,
    sort: "endTime,asc",
    size: 4,
  });

  // 2. Lấy danh sách phiên SCHEDULED sắp diễn ra
  const {
    data: scheduledData,
    isLoading: scheduledLoading,
    isError: scheduledError,
    refetch: refetchScheduled,
  } = useAuctions({
    status: AuctionStatus.SCHEDULED,
    sort: "startTime,asc",
    size: 3,
  });

  // 3. Lấy danh mục nổi bật (mock B2)
  const { data: categories = [] } = useCategories();

  const activeAuctions = activeData?.content || [];
  const scheduledAuctions = scheduledData?.content || [];
  const featuredAuction = activeAuctions[0];

  const totalActive = activeData?.totalElements ?? activeAuctions.length;
  const totalScheduled = scheduledData?.totalElements ?? scheduledAuctions.length;

  return (
    <PublicLayout>
      <div className="space-y-16 md:space-y-24 py-4 md:py-8">
        {/* ======================================================== */}
        {/* 1. HERO SECTION & LIVE PREVIEW                           */}
        {/* ======================================================== */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50/50 via-bg to-bg p-6 sm:p-8 md:p-12 border border-border-brand">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Cột trái: Tiêu đề, mô tả, CTA & Số liệu (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="label font-medium text-primary-700">
                  Sàn đấu giá trực tuyến OmniBid
                </span>
                <h1 className="text-display text-text font-bold tracking-tight">
                  Sàn đấu giá trực tuyến <br />
                  <span className="text-primary-600">minh bạch &amp; hiện đại</span>
                </h1>
                <p className="text-body-lg text-text-secondary max-w-xl">
                  Khám phá hàng trăm tài sản công nghệ, đồng hồ, đồ gia dụng cao cấp với công nghệ đấu giá thời gian thực chuẩn xác và bảo mật.
                </p>
              </div>

              {/* Nút hành động chính */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link href="/auctions">
                  <Button variant="primary" size="xl">
                    Khám phá phiên đấu giá
                  </Button>
                </Link>
                <Link href="/rules">
                  <Button variant="outline" size="xl">
                    Tìm hiểu quy chế
                  </Button>
                </Link>
              </div>

              {/* 3 Thẻ số liệu tin cậy (Trust Badges) */}
              <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg select-none">
                <div className="p-3.5 bg-surface border border-border-brand rounded-lg shadow-xs">
                  <span className="label block text-text-tertiary">Đang diễn ra</span>
                  <span className="text-h3 font-bold text-text tabular block mt-1">
                    {activeLoading ? "--" : totalActive}
                  </span>
                </div>

                <div className="p-3.5 bg-surface border border-border-brand rounded-lg shadow-xs">
                  <span className="label block text-text-tertiary">Sắp diễn ra</span>
                  <span className="text-h3 font-bold text-text tabular block mt-1">
                    {scheduledLoading ? "--" : totalScheduled}
                  </span>
                </div>

                <div className="p-3.5 bg-surface border border-border-brand rounded-lg shadow-xs">
                  <span className="label block text-text-tertiary">Lượt đặt hôm nay</span>
                  <span className="text-h3 font-bold text-primary-700 tabular block mt-1">
                    1.428
                  </span>
                </div>
              </div>
            </div>

            {/* Cột phải: Thẻ phiên nổi bật (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              {activeLoading ? (
                <div className="w-full max-w-[492px] h-[540px] bg-surface border border-border-brand rounded-xl p-6 animate-pulse space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-[220px] w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              ) : featuredAuction ? (
                <FeaturedAuctionHeroCard auction={featuredAuction} />
              ) : (
                <div className="w-full max-w-[492px] p-8 bg-surface border border-border-brand rounded-xl text-center">
                  <p className="text-body text-text-secondary">
                    Hiện chưa có phiên đấu giá nào đang diễn ra trực tiếp.
                  </p>
                  <Link href="/auctions" className="mt-4 inline-block">
                    <Button variant="outline" size="md">
                      Xem lịch trình các phiên
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. SECTION: DANH MỤC TÀI SẢN NỔI BẬT                    */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border-brand pb-4">
            <div>
              <span className="label font-medium text-text-tertiary">
                Phân loại tài sản
              </span>
              <h2 className="text-h1 font-semibold text-text mt-0.5">
                Danh mục tài sản nổi bật
              </h2>
            </div>
            <Link
              href="/auctions"
              className="text-small font-semibold text-text-link hover:underline inline-flex items-center gap-1"
            >
              <span>Xem toàn bộ danh mục</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. SECTION: PHIÊN SẮP KẾT THÚC (LIVE AUCTIONS)           */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border-brand pb-4">
            <div>
              <span className="label font-medium text-primary-700">
                Đang diễn ra trực tiếp
              </span>
              <h2 className="text-h1 font-semibold text-text mt-0.5">
                Phiên sắp kết thúc
              </h2>
            </div>
            <Link
              href="/auctions?status=ACTIVE"
              className="text-small font-semibold text-text-link hover:underline inline-flex items-center gap-1"
            >
              <span>Xem tất cả ({totalActive})</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {activeLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-surface border border-border-brand rounded-xl p-4 space-y-3 animate-pulse"
                >
                  <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : activeError ? (
            <div className="py-12 text-center bg-surface border border-border-brand rounded-xl">
              <p className="text-body text-danger font-medium">
                Không thể tải danh sách phiên đang diễn ra.
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={() => refetchActive()}
                className="mt-3"
              >
                Thử lại
              </Button>
            </div>
          ) : activeAuctions.length === 0 ? (
            <EmptyState
              title="Chưa có phiên nào đang diễn ra"
              description="Hiện tại các phiên đấu giá đã kết thúc hoặc đang chờ mở. Hãy xem các phiên sắp diễn ra bên dưới."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* 4. SECTION: PHIÊN SẮP DIỄN RA (UPCOMING)                 */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border-brand pb-4">
            <div>
              <span className="label font-medium text-text-tertiary">
                Lịch trình đấu giá
              </span>
              <h2 className="text-h1 font-semibold text-text mt-0.5">
                Phiên sắp diễn ra
              </h2>
            </div>
            <Link
              href="/auctions?status=SCHEDULED"
              className="text-small font-semibold text-text-link hover:underline inline-flex items-center gap-1"
            >
              <span>Xem lịch trình ({totalScheduled})</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {scheduledLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 bg-surface border border-border-brand rounded-xl space-y-3 animate-pulse"
                >
                  <div className="flex gap-4">
                    <Skeleton className="size-24 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : scheduledError ? (
            <div className="py-12 text-center bg-surface border border-border-brand rounded-xl">
              <p className="text-body text-danger font-medium">
                Không thể tải lịch trình phiên sắp diễn ra.
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={() => refetchScheduled()}
                className="mt-3"
              >
                Thử lại
              </Button>
            </div>
          ) : scheduledAuctions.length === 0 ? (
            <EmptyState
              title="Chưa có phiên sắp diễn ra"
              description="Hiện chưa có lịch mở phiên mới. Vui lòng quay lại sau."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scheduledAuctions.map((auction) => (
                <UpcomingAuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* 5. SECTION: QUY TRÌNH THAM GIA ĐẤU GIÁ 4 BƯỚC            */}
        {/* ======================================================== */}
        <section className="space-y-8 py-8 border-t border-border-brand">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="label font-medium text-primary-700">
              Minh bạch &amp; Chuẩn xác
            </span>
            <h2 className="text-h1 font-semibold text-text">
              Quy trình tham gia đấu giá 4 bước
            </h2>
            <p className="text-body text-text-secondary">
              Trải nghiệm sàn đấu giá trực tuyến chuyên nghiệp với quy trình khép kín, an toàn từ đặt giá đến nhận hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 space-y-4">
              <div className="size-12 rounded-lg bg-primary-50 text-primary-700 font-bold text-h3 flex items-center justify-center">
                01
              </div>
              <div>
                <h4 className="text-h4 font-semibold text-text">
                  Đăng ký tài khoản
                </h4>
                <p className="mt-1.5 text-small text-text-secondary">
                  Đăng ký một tài khoản để vừa mua vừa bán trên sàn đấu giá OmniBid.
                </p>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="size-12 rounded-lg bg-primary-50 text-primary-700 font-bold text-h3 flex items-center justify-center">
                02
              </div>
              <div>
                <h4 className="text-h4 font-semibold text-text">
                  Khám phá &amp; Theo dõi
                </h4>
                <p className="mt-1.5 text-small text-text-secondary">
                  Tìm kiếm sản phẩm yêu thích và theo dõi thời gian mở phiên đấu giá.
                </p>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="size-12 rounded-lg bg-primary-50 text-primary-700 font-bold text-h3 flex items-center justify-center">
                03
              </div>
              <div>
                <h4 className="text-h4 font-semibold text-text">
                  Đặt giá trực tuyến
                </h4>
                <p className="mt-1.5 text-small text-text-secondary">
                  Tham gia trả giá thời gian thực minh bạch với các bước giá được quy định rõ ràng.
                </p>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="size-12 rounded-lg bg-primary-50 text-primary-700 font-bold text-h3 flex items-center justify-center">
                04
              </div>
              <div>
                <h4 className="text-h4 font-semibold text-text">
                  Thanh toán &amp; Nhận hàng
                </h4>
                <p className="mt-1.5 text-small text-text-secondary">
                  Nhận hàng tận nơi an toàn, xác nhận giao dịch hoặc gửi khiếu nại bảo vệ quyền lợi.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. BANNER DÀNH CHO NGƯỜI BÁN                             */}
        {/* ======================================================== */}
        <section className="bg-surface border border-border-brand rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="label font-medium text-text-tertiary">
              Dành cho đối tác
            </span>
            <h2 className="text-h2 font-semibold text-text">
              Bạn có tài sản giá trị muốn bán đấu giá?
            </h2>
            <p className="text-body text-text-secondary">
              Đăng sản phẩm lên OmniBid để tiếp cận hàng nghìn người mua tiềm năng với tỷ lệ chốt phiên thành công cao và quy trình thanh toán đảm bảo.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link href={isAuthenticated ? "/seller" : "/register"}>
              <Button variant="primary-strong" size="xl" className="w-full md:w-auto">
                {isAuthenticated ? "Vào Kênh Người Bán" : "Đăng ký bán ngay"}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
