import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { LoginForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Đăng nhập | OmniBid",
  description:
    "Đăng nhập tài khoản OmniBid để tham gia đặt giá, quản lý sản phẩm và theo dõi đơn hàng.",
};

function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
      <Skeleton className="h-11 w-full rounded-md" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout
      maxWidth="md"
      title="Đăng nhập"
      subtitle="Đăng nhập để tham gia đấu giá và quản lý giao dịch của bạn"
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
