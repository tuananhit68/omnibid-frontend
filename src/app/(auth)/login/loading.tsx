import { AuthLayout } from "@/components/layout/AuthLayout";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoginLoading() {
  return (
    <AuthLayout
      maxWidth="md"
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay lại với sàn đấu giá trực tuyến OmniBid"
    >
      <div className="space-y-4 animate-pulse">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-13 w-full rounded-lg" />
      </div>
    </AuthLayout>
  );
}

