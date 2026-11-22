import { apiRequest } from "@/lib/api/client";
import type { Notification, Page } from "@/lib/api/contract";
import type { NotificationListParams } from "./types";

/**
 * GET /notifications — Danh sách thông báo phân trang (chỉ USER)
 */
export async function getNotifications(
  params?: NotificationListParams
): Promise<Page<Notification>> {
  const query: Record<string, string | number | boolean> = {
    page: params?.page ?? 0,
    size: params?.size ?? 20,
    sort: params?.sort ?? "createdAt,desc",
  };
  if (params?.isRead !== undefined) {
    query.isRead = params.isRead;
  }
  if (params?.type) {
    query.type = params.type;
  }
  return apiRequest<Page<Notification>>({
    method: "GET",
    url: "/notifications",
    params: query,
  });
}

/**
 * Số thông báo chưa đọc = totalElements của GET /notifications?isRead=false&size=1
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const page = await apiRequest<Page<Notification>>({
    method: "GET",
    url: "/notifications",
    params: { isRead: false, page: 0, size: 1 },
  });
  return page.totalElements;
}

/**
 * POST /notifications/{id}/read — Đánh dấu một thông báo đã đọc
 */
export async function markNotificationRead(id: number): Promise<Notification> {
  return apiRequest<Notification>({
    method: "POST",
    url: `/notifications/${id}/read`,
  });
}
