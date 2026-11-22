import { apiRequest } from "@/lib/api/client";
import type {
  AdminBanUserResponse,
  AdminUnbanUserResponse,
  AdminUser,
  Page,
} from "@/lib/api/contract";
import type { AdminUsersParams, BanUserPayload, UnbanUserPayload } from "./types";

export function getAdminUsers(params: AdminUsersParams): Promise<Page<AdminUser>> {
  return apiRequest<Page<AdminUser>>({
    url: "/admin/users",
    method: "GET",
    params: {
      keyword: params.keyword || undefined,
      status: params.status || undefined,
      role: params.role || undefined,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "createdAt,desc",
    },
  });
}

export function banAdminUser({
  userId,
  reason,
}: BanUserPayload): Promise<AdminBanUserResponse> {
  return apiRequest<AdminBanUserResponse>({
    url: `/admin/users/${userId}/ban`,
    method: "POST",
    data: reason ? { reason } : {},
  });
}

export function unbanAdminUser({
  userId,
  reason,
}: UnbanUserPayload): Promise<AdminUnbanUserResponse> {
  return apiRequest<AdminUnbanUserResponse>({
    url: `/admin/users/${userId}/unban`,
    method: "POST",
    data: reason ? { reason } : {},
  });
}
