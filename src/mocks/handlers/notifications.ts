import type { Notification, Page } from "@/lib/api/contract";
import { NotificationType, UserRole } from "@/types/enums";
import { requireMockAuth } from "../auth";
import { getMockDb, persistMockDb } from "../db";
import { mockError } from "../errors";
import type { MockNotification } from "../seed";

const NOTIFICATION_SORT_WHITELIST = new Set([
  "createdAt,desc",
  "createdAt,asc",
]);

const VALID_NOTIFICATION_TYPES = new Set<string>(Object.values(NotificationType));

function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const safePage = Number.isFinite(page) && page >= 0 ? Math.floor(page) : 0;
  const safeSize =
    Number.isFinite(size) && size > 0 ? Math.min(Math.floor(size), 100) : 10;
  const start = safePage * safeSize;
  const content = items.slice(start, start + safeSize);
  const totalElements = items.length;
  const totalPages = Math.ceil(totalElements / safeSize);
  return { content, page: safePage, size: safeSize, totalElements, totalPages };
}

function toNotificationDto(item: MockNotification): Notification {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    content: item.content,
    refType: item.refType,
    refId: item.refId,
    isRead: item.isRead,
    createdAt: item.createdAt,
  };
}

export function handleGetNotifications(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<Notification> {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const isReadParam = params.get("isRead");
  const typeParam = params.get("type");
  const sort = params.get("sort") || "createdAt,desc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "10");

  if (!NOTIFICATION_SORT_WHITELIST.has(sort)) {
    throw mockError("VALIDATION_ERROR", "Tham số sắp xếp không hợp lệ", {
      fields: { sort: "Giá trị sắp xếp không được hỗ trợ" },
    });
  }

  if (
    isReadParam !== null &&
    isReadParam !== "" &&
    isReadParam !== "true" &&
    isReadParam !== "false"
  ) {
    throw mockError("VALIDATION_ERROR", "Tham số trạng thái đọc không hợp lệ", {
      fields: { isRead: "Giá trị isRead phải là true hoặc false" },
    });
  }

  if (typeParam && !VALID_NOTIFICATION_TYPES.has(typeParam)) {
    throw mockError("VALIDATION_ERROR", "Loại thông báo không hợp lệ", {
      fields: { type: "Loại thông báo không được hỗ trợ" },
    });
  }

  let list = db.notifications.filter((n) => {
    if (n.userId !== user.id) return false;
    if (isReadParam === "true" && !n.isRead) return false;
    if (isReadParam === "false" && n.isRead) return false;
    if (typeParam && n.type !== typeParam) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    const diff = Date.parse(a.createdAt) - Date.parse(b.createdAt);
    if (sort === "createdAt,asc") {
      return diff !== 0 ? diff : a.id - b.id;
    }
    return diff !== 0 ? -diff : b.id - a.id;
  });

  return paginate(list.map(toNotificationDto), page, size);
}

export function handleMarkNotificationRead(
  notificationId: number,
  authHeader: string | undefined
): Notification {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const item = db.notifications.find((n) => n.id === notificationId);
  if (!item) {
    throw mockError("NOT_FOUND", "Không tìm thấy thông báo");
  }
  if (item.userId !== user.id) {
    throw mockError("FORBIDDEN", "Bạn không có quyền thao tác trên thông báo này");
  }

  if (!item.isRead) {
    item.isRead = true;
    persistMockDb();
  }

  return toNotificationDto(item);
}
