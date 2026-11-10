import { AuthLayout } from "@/components/layout/AuthLayout";
import { Skeleton } from "@/components/ui/Skeleton";

export default function RegisterLoading() {
  return (
    <AuthLayout
      maxWidth="lg"
      title="Đăng ký tài khoản"
      subtitle="Tham gia sàn đấu giá trực tuyến OmniBid để khám phá và tạo phiên đấu giá uy tín"
    >
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-13 w-full rounded-lg" />
      </div>
    </AuthLayout>
  );
}

