import type { UserRole, UserStatus } from "@/types/enums";

export interface AdminUsersParams {
  keyword?: string;
  status?: UserStatus | "";
  role?: UserRole | "";
  page?: number;
  size?: number;
  sort?: string;
}

export interface BanUserPayload {
  userId: number;
  reason?: string;
}

export interface UnbanUserPayload {
  userId: number;
  reason?: string;
}
