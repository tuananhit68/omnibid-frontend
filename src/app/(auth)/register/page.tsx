import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { RegisterForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Tạo tài khoản | OmniBid",
  description:
    "Tạo tài khoản trên sàn đấu giá trực tuyến OmniBid để tham gia đặt giá và bán sản phẩm.",
};

function RegisterFormFallback() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="h-11 w-full rounded-md" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthLayout
      maxWidth="lg"
      title="Tạo tài khoản"
      subtitle="Đăng ký tài khoản OmniBid để tham gia đấu giá và đăng bán sản phẩm"
    >
      <Suspense fallback={<RegisterFormFallback />}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
