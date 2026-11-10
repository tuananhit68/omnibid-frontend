import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { RegisterForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | OmniBid",
  description:
    "Tạo tài khoản miễn phí trên sàn đấu giá trực tuyến OmniBid để tham gia đặt giá và bán sản phẩm uy tín.",
};

function RegisterFormFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="h-13 w-full rounded-lg" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthLayout
      maxWidth="lg"
      title="Đăng ký tài khoản"
      subtitle="Tham gia sàn đấu giá trực tuyến OmniBid để khám phá và tạo phiên đấu giá uy tín"
    >
      <Suspense fallback={<RegisterFormFallback />}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}

