import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getButtonClassName } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Quản trị | OmniBid",
  description: "Khu vực quản trị hệ thống đấu giá trực tuyến OmniBid.",
};

// TODO fe-v4 admin-dashboard
export default function AdminDashboardPlaceholderPage() {
  return (
    <div className="max-w-240 space-y-6">
      <div className="space-y-1">
        <h1 className="text-h1 text-text">Tổng quan quản trị</h1>
        <p className="text-small text-text-secondary">
          Bảng điều khiển thống kê và các màn hình quản trị sẽ được hoàn thiện ở Phase 7.
        </p>
      </div>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-h3 text-text">Tài khoản quản trị viên</h2>
            <p className="text-small text-text-secondary">
              Bạn có thể cập nhật thông tin cá nhân, ảnh đại diện hoặc đổi mật khẩu ngay bây giờ.
            </p>
          </div>
          <Link
            href="/admin/profile"
            className={getButtonClassName({ variant: "primary", size: "md" })}
          >
            Đi tới hồ sơ cá nhân
          </Link>
        </div>
      </Card>
    </div>
  );
}
