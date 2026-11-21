import type { Metadata } from "next";
import { Suspense } from "react";
import { NotificationsClient } from "@/features/notification/components";
import NotificationsLoading from "./loading";

export const metadata: Metadata = {
  title: "Thông báo | OmniBid",
  description:
    "Theo dõi thông báo bị vượt giá, kết quả phiên đấu giá, cập nhật đơn hàng và kết quả báo cáo trên OmniBid.",
};

export default function NotificationsPage() {
  return (
    <Suspense fallback={<NotificationsLoading />}>
      <NotificationsClient />
    </Suspense>
  );
}
