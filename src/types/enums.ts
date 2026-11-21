/**
 * OmniBid v4 — Enums, nhãn tiếng Việt và tông màu (DESIGN_SYSTEM.md §8, RESPONSE_DTO_v4.md §1)
 */

export type StatusTone =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "tertiary";

export interface StatusMeta {
  label: string;
  tone: StatusTone;
  showDot?: boolean;
}

// --------------------------------------------------
// 1. UserRole & UserStatus
// --------------------------------------------------
export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.USER]: "Người dùng",
  [UserRole.ADMIN]: "Quản trị viên",
};

export const UserStatus = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const USER_STATUS_META: Record<UserStatus, StatusMeta> = {
  [UserStatus.ACTIVE]: { label: "Hoạt động", tone: "success" },
  [UserStatus.BANNED]: { label: "Bị khóa", tone: "danger" },
};

// --------------------------------------------------
// 2. ProductCondition & ProductStatus
// --------------------------------------------------
export const ProductCondition = {
  NEW: "NEW",
  LIKE_NEW: "LIKE_NEW",
  GOOD: "GOOD",
  FAIR: "FAIR",
  POOR: "POOR",
} as const;
export type ProductCondition = (typeof ProductCondition)[keyof typeof ProductCondition];

export const PRODUCT_CONDITION_LABEL: Record<ProductCondition, string> = {
  [ProductCondition.NEW]: "Mới",
  [ProductCondition.LIKE_NEW]: "Như mới",
  [ProductCondition.GOOD]: "Tốt",
  [ProductCondition.FAIR]: "Khá",
  [ProductCondition.POOR]: "Kém",
};

export const ProductStatus = {
  AVAILABLE: "AVAILABLE",
  IN_AUCTION: "IN_AUCTION",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
  HIDDEN: "HIDDEN",
} as const;
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

export const PRODUCT_STATUS_META: Record<ProductStatus, StatusMeta> = {
  [ProductStatus.AVAILABLE]: { label: "Sẵn sàng", tone: "success" },
  [ProductStatus.IN_AUCTION]: { label: "Đang đấu giá", tone: "info" },
  [ProductStatus.RESERVED]: { label: "Đang giao dịch", tone: "warning" },
  [ProductStatus.SOLD]: { label: "Đã bán", tone: "neutral" },
  [ProductStatus.HIDDEN]: { label: "Bị ẩn", tone: "danger" },
};

// --------------------------------------------------
// 3. AuctionStatus & ReserveStatus
// --------------------------------------------------
export const AuctionStatus = {
  SCHEDULED: "SCHEDULED",
  ACTIVE: "ACTIVE",
  ENDED: "ENDED",
  UNSOLD: "UNSOLD",
  CANCELLED: "CANCELLED",
} as const;
export type AuctionStatus = (typeof AuctionStatus)[keyof typeof AuctionStatus];

export const AUCTION_STATUS_META: Record<AuctionStatus, StatusMeta> = {
  [AuctionStatus.SCHEDULED]: { label: "Sắp diễn ra", tone: "warning", showDot: true },
  [AuctionStatus.ACTIVE]: { label: "Đang diễn ra", tone: "info", showDot: true },
  [AuctionStatus.ENDED]: { label: "Đã kết thúc", tone: "success", showDot: true },
  [AuctionStatus.UNSOLD]: { label: "Không bán được", tone: "neutral", showDot: true },
  [AuctionStatus.CANCELLED]: { label: "Đã hủy", tone: "danger", showDot: true },
};

export const ReserveStatus = {
  MET: "MET",
  NOT_MET: "NOT_MET",
  NO_RESERVE: "NO_RESERVE",
} as const;
export type ReserveStatus = (typeof ReserveStatus)[keyof typeof ReserveStatus];

export const RESERVE_STATUS_META: Record<ReserveStatus, StatusMeta> = {
  [ReserveStatus.MET]: { label: "Đã đạt giá sàn", tone: "success" },
  [ReserveStatus.NOT_MET]: { label: "Chưa đạt giá sàn", tone: "warning" },
  [ReserveStatus.NO_RESERVE]: { label: "Không có giá sàn", tone: "neutral" },
};

// --------------------------------------------------
// 4. OrderStatus & PaymentStatus
// --------------------------------------------------
export const OrderStatus = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAID: "PAID",
  SHIPPING: "SHIPPING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  [OrderStatus.PENDING_PAYMENT]: { label: "Chờ thanh toán", tone: "warning" },
  [OrderStatus.PAID]: { label: "Đã thanh toán", tone: "info" },
  [OrderStatus.SHIPPING]: { label: "Đang giao", tone: "info" },
  [OrderStatus.COMPLETED]: { label: "Hoàn tất", tone: "success" },
  [OrderStatus.CANCELLED]: { label: "Đã hủy", tone: "danger" },
  [OrderStatus.EXPIRED]: { label: "Hết hạn", tone: "neutral" },
};

export const PaymentStatus = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PAYMENT_STATUS_META: Record<PaymentStatus, StatusMeta> = {
  [PaymentStatus.SUCCESS]: { label: "Thành công", tone: "success" },
  [PaymentStatus.FAILED]: { label: "Thất bại", tone: "danger" },
};

export const PaymentMethod = {
  MOCK_CARD: "MOCK_CARD",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  [PaymentMethod.MOCK_CARD]: "Thẻ thanh toán (Thử nghiệm)",
};

// --------------------------------------------------
// 5. NotificationType & ReportStatus
// --------------------------------------------------
export const NotificationType = {
  OUTBID: "OUTBID",
  AUCTION_RESULT: "AUCTION_RESULT",
  AUCTION_CANCELLED: "AUCTION_CANCELLED",
  ORDER_UPDATE: "ORDER_UPDATE",
  REPORT_RESOLVED: "REPORT_RESOLVED",
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const NOTIFICATION_TYPE_META: Record<NotificationType, StatusMeta> = {
  [NotificationType.OUTBID]: { label: "Bị vượt giá", tone: "tertiary" },
  [NotificationType.AUCTION_RESULT]: { label: "Kết quả phiên", tone: "info" },
  [NotificationType.AUCTION_CANCELLED]: { label: "Phiên bị hủy", tone: "danger" },
  [NotificationType.ORDER_UPDATE]: { label: "Cập nhật đơn hàng", tone: "info" },
  [NotificationType.REPORT_RESOLVED]: { label: "Kết quả báo cáo", tone: "neutral" },
};

export const ReportStatus = {
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
} as const;
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const REPORT_STATUS_META: Record<ReportStatus, StatusMeta> = {
  [ReportStatus.PENDING]: { label: "Chờ xử lý", tone: "warning" },
  [ReportStatus.RESOLVED]: { label: "Đã xử lý", tone: "success" },
  [ReportStatus.REJECTED]: { label: "Bác bỏ", tone: "neutral" },
};

// --------------------------------------------------
// 6. BidPosition (dẫn xuất phía UI từ MyBidItem)
// --------------------------------------------------
export const BidPosition = {
  LEADING: "leading",
  OUTBID: "outbid",
  WON: "won",
  LOST: "lost",
} as const;
export type BidPosition = (typeof BidPosition)[keyof typeof BidPosition];

export const BID_POSITION_META: Record<BidPosition, StatusMeta> = {
  [BidPosition.LEADING]: { label: "Đang dẫn đầu", tone: "success" },
  [BidPosition.OUTBID]: { label: "Bị vượt", tone: "tertiary" },
  [BidPosition.WON]: { label: "Đã thắng", tone: "info" },
  [BidPosition.LOST]: { label: "Không thắng", tone: "neutral" },
};

export function deriveBidPosition(item: {
  auctionStatus: AuctionStatus;
  leading: boolean;
  orderId: number | null;
}): BidPosition {
  if (item.auctionStatus === AuctionStatus.ACTIVE) {
    return item.leading ? BidPosition.LEADING : BidPosition.OUTBID;
  }
  if (item.auctionStatus === AuctionStatus.ENDED && (item.orderId !== null || item.leading)) {
    return BidPosition.WON;
  }
  return BidPosition.LOST;
}
