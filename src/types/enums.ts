/**
 * OmniBid - Enums và metadata trạng thái
 * Nguồn: design/backend-contract.md và design/components.md mục 3
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
  description?: string;
}

// --------------------------------------------------
// 1. AuctionStatus
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
  [AuctionStatus.SCHEDULED]: {
    label: "Sắp diễn ra",
    tone: "neutral",
  },
  [AuctionStatus.ACTIVE]: {
    label: "Đang diễn ra",
    tone: "info",
  },
  [AuctionStatus.ENDED]: {
    label: "Đã kết thúc",
    tone: "success",
    description: "Có người thắng",
  },
  [AuctionStatus.UNSOLD]: {
    label: "Không thành công",
    tone: "warning",
    description: "Không đạt giá sàn / Không có người thắng",
  },
  [AuctionStatus.CANCELLED]: {
    label: "Đã huỷ",
    tone: "danger",
  },
};

// --------------------------------------------------
// 2. BidStatus
// --------------------------------------------------
export const BidStatus = {
  LEADING: "LEADING",
  OUTBID: "OUTBID",
  WON: "WON",
  NOT_WON: "NOT_WON",
  INVALIDATED: "INVALIDATED",
} as const;
export type BidStatus = (typeof BidStatus)[keyof typeof BidStatus];

export const BID_STATUS_META: Record<BidStatus, StatusMeta> = {
  [BidStatus.LEADING]: {
    label: "Dẫn đầu",
    tone: "success",
  },
  [BidStatus.OUTBID]: {
    label: "Bị vượt",
    tone: "tertiary", // Bị vượt dùng tertiary-100 + tertiary-800
  },
  [BidStatus.WON]: {
    label: "Đã thắng",
    tone: "info",
  },
  [BidStatus.NOT_WON]: {
    label: "Không thắng",
    tone: "neutral",
  },
  [BidStatus.INVALIDATED]: {
    label: "Bị vô hiệu",
    tone: "danger",
  },
};

// --------------------------------------------------
// 3. OrderStatus
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
  [OrderStatus.PENDING_PAYMENT]: {
    label: "Chờ thanh toán",
    tone: "warning",
  },
  [OrderStatus.PAID]: {
    label: "Đã thanh toán",
    tone: "info",
  },
  [OrderStatus.SHIPPING]: {
    label: "Đang giao",
    tone: "info",
  },
  [OrderStatus.COMPLETED]: {
    label: "Hoàn tất",
    tone: "success",
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã huỷ",
    tone: "danger",
  },
  [OrderStatus.EXPIRED]: {
    label: "Hết hạn",
    tone: "neutral",
  },
};

// --------------------------------------------------
// 4. PaymentStatus & PaymentMethod
// --------------------------------------------------
export const PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PAYMENT_STATUS_META: Record<PaymentStatus, StatusMeta> = {
  [PaymentStatus.PENDING]: {
    label: "Đang xử lý",
    tone: "info",
  },
  [PaymentStatus.SUCCESS]: {
    label: "Thành công",
    tone: "success",
  },
  [PaymentStatus.FAILED]: {
    label: "Thất bại",
    tone: "danger",
  },
};

export const PaymentMethod = {
  MOCK_CARD: "MOCK_CARD",
  MOCK_BANK: "MOCK_BANK",
  MOCK_WALLET: "MOCK_WALLET",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  [PaymentMethod.MOCK_CARD]: "Thẻ tín dụng / Ghi nợ (Thử nghiệm)",
  [PaymentMethod.MOCK_BANK]: "Chuyển khoản ngân hàng (Thử nghiệm)",
  [PaymentMethod.MOCK_WALLET]: "Ví điện tử (Thử nghiệm)",
};

// --------------------------------------------------
// 5. ShipmentStatus
// --------------------------------------------------
export const ShipmentStatus = {
  CREATED: "CREATED",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
} as const;
export type ShipmentStatus =
  (typeof ShipmentStatus)[keyof typeof ShipmentStatus];

export const SHIPMENT_STATUS_META: Record<ShipmentStatus, StatusMeta> = {
  [ShipmentStatus.CREATED]: {
    label: "Đã tạo",
    tone: "neutral",
  },
  [ShipmentStatus.PICKED_UP]: {
    label: "Đã lấy hàng",
    tone: "info",
  },
  [ShipmentStatus.IN_TRANSIT]: {
    label: "Đang vận chuyển",
    tone: "info",
  },
  [ShipmentStatus.DELIVERED]: {
    label: "Đã giao",
    tone: "success",
  },
};

// --------------------------------------------------
// 6. ProductStatus
// --------------------------------------------------
export const ProductStatus = {
  AVAILABLE: "AVAILABLE",
  IN_AUCTION: "IN_AUCTION",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
  HIDDEN: "HIDDEN",
  REMOVED: "REMOVED",
} as const;
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

export const PRODUCT_STATUS_META: Record<ProductStatus, StatusMeta> = {
  [ProductStatus.AVAILABLE]: {
    label: "Có thể đấu giá",
    tone: "success",
  },
  [ProductStatus.IN_AUCTION]: {
    label: "Đang đấu giá",
    tone: "info",
  },
  [ProductStatus.RESERVED]: {
    label: "Đang giữ chỗ",
    tone: "warning",
  },
  [ProductStatus.SOLD]: {
    label: "Đã bán",
    tone: "neutral",
  },
  [ProductStatus.HIDDEN]: {
    label: "Đã ẩn",
    tone: "danger",
  },
  [ProductStatus.REMOVED]: {
    label: "Đã gỡ",
    tone: "neutral",
  },
};

// --------------------------------------------------
// 7. ReportStatus, ReportType & ReportAction
// --------------------------------------------------
export const ReportStatus = {
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
} as const;
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const REPORT_STATUS_META: Record<ReportStatus, StatusMeta> = {
  [ReportStatus.PENDING]: {
    label: "Chờ xử lý",
    tone: "warning",
  },
  [ReportStatus.RESOLVED]: {
    label: "Đã giải quyết",
    tone: "success",
  },
  [ReportStatus.REJECTED]: {
    label: "Đã bác bỏ",
    tone: "neutral",
  },
};

export const ReportType = {
  VIOLATION: "VIOLATION",
  COMPLAINT: "COMPLAINT",
} as const;
export type ReportType = (typeof ReportType)[keyof typeof ReportType];

export const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  [ReportType.VIOLATION]: "Báo cáo vi phạm",
  [ReportType.COMPLAINT]: "Khiếu nại đơn hàng",
};

export const ReportAction = {
  BAN_USER: "BAN_USER",
  HIDE_PRODUCT: "HIDE_PRODUCT",
  CANCEL_AUCTION: "CANCEL_AUCTION",
  COMPLETE_ORDER: "COMPLETE_ORDER",
  CANCEL_ORDER: "CANCEL_ORDER",
  NONE: "NONE",
} as const;
export type ReportAction = (typeof ReportAction)[keyof typeof ReportAction];

// --------------------------------------------------
// 8. UserStatus & UserRole
// --------------------------------------------------
export const UserStatus = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const USER_STATUS_META: Record<UserStatus, StatusMeta> = {
  [UserStatus.ACTIVE]: {
    label: "Hoạt động",
    tone: "success",
  },
  [UserStatus.BANNED]: {
    label: "Bị khoá",
    tone: "danger",
  },
};

export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// --------------------------------------------------
// 9. OrderAction (Allowed actions trả về từ GET /orders/{id})
// --------------------------------------------------
export const OrderAction = {
  PAY: "PAY",
  UPDATE_SHIPPING_INFO: "UPDATE_SHIPPING_INFO",
  CONFIRM_RECEIPT: "CONFIRM_RECEIPT",
  COMPLAIN: "COMPLAIN",
  UPDATE_SHIPMENT: "UPDATE_SHIPMENT",
} as const;
export type OrderAction = (typeof OrderAction)[keyof typeof OrderAction];

export const ORDER_ACTION_LABEL: Record<OrderAction, string> = {
  [OrderAction.PAY]: "Thanh toán",
  [OrderAction.UPDATE_SHIPPING_INFO]: "Lưu thông tin giao hàng",
  [OrderAction.CONFIRM_RECEIPT]: "Xác nhận đã nhận hàng",
  [OrderAction.COMPLAIN]: "Gửi khiếu nại",
  [OrderAction.UPDATE_SHIPMENT]: "Cập nhật vận chuyển",
};

// --------------------------------------------------
// 10. ReservePriceStatus (Trạng thái giá sàn dẫn xuất)
// --------------------------------------------------
export const ReservePriceStatus = {
  MET: "MET",
  NOT_MET: "NOT_MET",
  NONE: "NONE",
} as const;
export type ReservePriceStatus =
  (typeof ReservePriceStatus)[keyof typeof ReservePriceStatus];

export const RESERVE_PRICE_STATUS_META: Record<ReservePriceStatus, StatusMeta> =
  {
    [ReservePriceStatus.MET]: {
      label: "Đã đạt giá sàn",
      tone: "success",
    },
    [ReservePriceStatus.NOT_MET]: {
      label: "Chưa đạt giá sàn",
      tone: "warning",
    },
    [ReservePriceStatus.NONE]: {
      label: "Không có giá sàn",
      tone: "neutral",
    },
  };

// --------------------------------------------------
// 11. NotificationType
// --------------------------------------------------
export const NotificationType = {
  OUTBID: "OUTBID",
  AUCTION_WON: "AUCTION_WON",
  AUCTION_ENDED: "AUCTION_ENDED",
  ORDER_CREATED: "ORDER_CREATED",
  PAYMENT_REMINDER: "PAYMENT_REMINDER",
  PAYMENT_RESULT: "PAYMENT_RESULT",
  SHIPMENT_UPDATE: "SHIPMENT_UPDATE",
  ORDER_UPDATE: "ORDER_UPDATE",
  REPORT_RESOLVED: "REPORT_RESOLVED",
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NOTIFICATION_TYPE_META: Record<NotificationType, StatusMeta> = {
  [NotificationType.OUTBID]: {
    label: "Bị vượt giá",
    tone: "warning",
  },
  [NotificationType.AUCTION_WON]: {
    label: "Thắng đấu giá",
    tone: "success",
  },
  [NotificationType.AUCTION_ENDED]: {
    label: "Phiên kết thúc",
    tone: "neutral",
  },
  [NotificationType.ORDER_CREATED]: {
    label: "Đơn hàng mới",
    tone: "info",
  },
  [NotificationType.PAYMENT_REMINDER]: {
    label: "Nhắc nhở thanh toán",
    tone: "danger",
  },
  [NotificationType.PAYMENT_RESULT]: {
    label: "Kết quả thanh toán",
    tone: "info",
  },
  [NotificationType.SHIPMENT_UPDATE]: {
    label: "Cập nhật vận chuyển",
    tone: "info",
  },
  [NotificationType.ORDER_UPDATE]: {
    label: "Cập nhật đơn hàng",
    tone: "info",
  },
  [NotificationType.REPORT_RESOLVED]: {
    label: "Phản hồi báo cáo",
    tone: "success",
  },
};

// --------------------------------------------------
// 12. ProductCondition
// --------------------------------------------------
export const ProductCondition = {
  NEW: "NEW",
  LIKE_NEW: "LIKE_NEW",
  GOOD: "GOOD",
  FAIR: "FAIR",
  POOR: "POOR",
} as const;
export type ProductCondition =
  (typeof ProductCondition)[keyof typeof ProductCondition];

export const PRODUCT_CONDITION_LABEL: Record<ProductCondition, string> = {
  [ProductCondition.NEW]: "Mới",
  [ProductCondition.LIKE_NEW]: "Như mới",
  [ProductCondition.GOOD]: "Tốt",
  [ProductCondition.FAIR]: "Khá",
  [ProductCondition.POOR]: "Cũ",
};

