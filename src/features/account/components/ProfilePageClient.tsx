"use client";

import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMe } from "../hooks";
import { ProfileInfoCard } from "./ProfileInfoCard";
import { ChangePasswordCard } from "./ChangePasswordCard";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-4 border-b border-border-subtle pb-6">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
      </Card>
    </div>
  );
}

export function ProfilePageClient() {
  const { data: profile, isLoading, isError, error, refetch } = useMe();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    const message =
      error instanceof ApiError
        ? error.message
        : getErrorMessage("INTERNAL_ERROR");
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-h1 text-text">Hồ sơ cá nhân</h1>
        </div>
        <ErrorState
          title="Không thể tải hồ sơ cá nhân"
          message={message}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-h1 text-text">Hồ sơ cá nhân</h1>
        <p className="text-small text-text-secondary">
          Quản lý thông tin tài khoản, ảnh đại diện và bảo mật đăng nhập.
        </p>
      </div>

      <ProfileInfoCard profile={profile} />
      <ChangePasswordCard />
    </div>
  );
}
