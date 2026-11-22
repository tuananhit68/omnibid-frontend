import type { NotificationType } from "@/types/enums";

export interface NotificationListParams {
  isRead?: boolean;
  type?: NotificationType;
  page?: number;
  size?: number;
  sort?: "createdAt,desc" | "createdAt,asc";
}

export type NotificationReadTab = "all" | "unread";
