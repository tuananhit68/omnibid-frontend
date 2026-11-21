import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import {
  HomeClient,
  fetchAuctionsServer,
  fetchCategoriesServer,
} from "@/features/auction";
import { AuctionStatus } from "@/types/enums";

export const metadata: Metadata = {
  title: "Trang chủ | OmniBid",
  description:
    "Sàn đấu giá trực tuyến minh bạch — đặt giá theo thời gian thực, thanh toán và giao nhận rõ ràng.",
};

export default async function HomePage() {
  const [initialCategories, initialEndingSoon, initialUpcoming] =
    await Promise.all([
      fetchCategoriesServer(100),
      fetchAuctionsServer({
        status: AuctionStatus.ACTIVE,
        sort: "endTime,asc",
        page: 0,
        size: 4,
      }),
      fetchAuctionsServer({
        status: AuctionStatus.SCHEDULED,
        sort: "endTime,asc",
        page: 0,
        size: 4,
      }),
    ]);

  return (
    <PublicLayout>
      <HomeClient
        initialCategories={initialCategories}
        initialEndingSoon={initialEndingSoon}
        initialUpcoming={initialUpcoming}
      />
    </PublicLayout>
  );
}
