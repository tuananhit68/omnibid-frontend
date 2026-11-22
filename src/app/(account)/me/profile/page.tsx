import type { Metadata } from "next";
import { ProfilePageClient } from "@/features/account/components";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân | OmniBid",
  description: "Quản lý thông tin tài khoản, ảnh đại diện và đổi mật khẩu.",
};

export default function UserProfilePage() {
  return <ProfilePageClient />;
}
