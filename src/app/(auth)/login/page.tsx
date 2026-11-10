import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { LoginForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Đăng nhập | OmniBid",
  description:
    "Đăng nhập vào tài khoản OmniBid để theo dõi phiên, đặt giá trực tuyến và quản lý đơn hàng.",
};

function LoginFormFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
      <Skeleton className="h-13 w-full rounded-lg" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout
      maxWidth="md"
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay lại với sàn đấu giá trực tuyến OmniBid"
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}

