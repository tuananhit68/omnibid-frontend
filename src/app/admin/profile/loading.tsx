import { ProfileSkeleton } from "@/features/account/components";

export default function AdminProfileLoading() {
  return (
    <div className="max-w-240">
      <ProfileSkeleton />
    </div>
  );
}
