import type { Metadata } from "next";
import { ProfilePageClient } from "@/features/account/components";

export const metadata: Metadata = {
  title: "Hồ sơ quản trị viên | OmniBid",
  description: "Quản lý thông tin tài khoản quản trị viên, ảnh đại diện và mật khẩu.",
};

export default function AdminProfilePage() {
  return (
    <div className="max-w-240">
      <ProfilePageClient />
    </div>
  );
}
