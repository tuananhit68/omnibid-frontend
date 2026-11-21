/**
 * OmniBid v4 — ErrorCode (24 mã từ API_SPEC_v4 §5 + NETWORK_ERROR nội bộ)
 */

export const ERROR_CODES = [
  "VALIDATION_ERROR",
  "INVALID_IMAGE",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "ACCOUNT_BANNED",
  "NOT_FOUND",
  "AUCTION_NOT_ACTIVE",
  "BID_TOO_LOW",
  "ALREADY_LEADING",
  "SELF_BID_NOT_ALLOWED",
  "AUCTION_NOT_EDITABLE",
  "CANNOT_CANCEL",
  "PRODUCT_NOT_AVAILABLE",
  "PRODUCT_NOT_EDITABLE",
  "INVALID_STATUS_TRANSITION",
  "CANNOT_BAN_ADMIN",
  "CATEGORY_IN_USE",
  "ORDER_EXPIRED",
  "ORDER_CANCELLED",
  "CONFLICT",
  "PAYLOAD_TOO_LARGE",
  "TOO_MANY_REQUESTS",
  "INTERNAL_ERROR",
  "IMAGE_UPLOAD_FAILED",
  "NETWORK_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  VALIDATION_ERROR: "Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại.",
  INVALID_IMAGE: "Ảnh không hợp lệ. Chỉ hỗ trợ JPG, PNG, WEBP tối đa 5 MB và 1–5 ảnh.",
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  FORBIDDEN: "Bạn không có quyền truy cập hoặc thực hiện thao tác này.",
  ACCOUNT_BANNED: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
  NOT_FOUND: "Không tìm thấy dữ liệu yêu cầu.",
  AUCTION_NOT_ACTIVE: "Phiên đấu giá chưa bắt đầu hoặc đã kết thúc.",
  BID_TOO_LOW: "Mức giá đặt thấp hơn mức tối thiểu yêu cầu.",
  ALREADY_LEADING: "Bạn đang là người dẫn đầu phiên đấu giá này.",
  SELF_BID_NOT_ALLOWED: "Bạn không thể tự đặt giá cho phiên đấu giá của chính mình.",
  AUCTION_NOT_EDITABLE: "Chỉ có thể chỉnh sửa phiên khi đang ở trạng thái Sắp diễn ra.",
  CANNOT_CANCEL: "Không thể hủy phiên đấu giá khi đã có lượt đặt giá.",
  PRODUCT_NOT_AVAILABLE: "Sản phẩm hiện không sẵn sàng để tạo phiên đấu giá.",
  PRODUCT_NOT_EDITABLE: "Chỉ có thể chỉnh sửa sản phẩm khi ở trạng thái Sẵn sàng.",
  INVALID_STATUS_TRANSITION: "Trạng thái hiện tại không cho phép thực hiện thao tác này.",
  CANNOT_BAN_ADMIN: "Không thể khóa tài khoản quản trị viên.",
  CATEGORY_IN_USE: "Danh mục đang có sản phẩm sử dụng, không thể xóa.",
  ORDER_EXPIRED: "Đơn hàng đã quá hạn thanh toán.",
  ORDER_CANCELLED: "Đơn hàng đã bị hủy.",
  CONFLICT: "Dữ liệu vừa thay đổi, vui lòng thử lại.",
  PAYLOAD_TOO_LARGE: "Dung lượng tải lên vượt quá giới hạn cho phép (tối đa 25 MB).",
  TOO_MANY_REQUESTS: "Bạn đã đăng nhập sai quá nhiều lần, vui lòng thử lại sau 15 phút.",
  INTERNAL_ERROR: "Lỗi hệ thống. Vui lòng thử lại sau ít phút.",
  IMAGE_UPLOAD_FAILED: "Tải ảnh lên thất bại. Vui lòng thử lại.",
  NETWORK_ERROR: "Không kết nối được máy chủ. Kiểm tra mạng và thử lại.",
};

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && (ERROR_CODES as readonly string[]).includes(value);
}

export function getErrorMessage(code?: string | null, backendMessage?: string): string {
  if (code && isErrorCode(code)) {
    if (
      (code === "VALIDATION_ERROR" || code === "INVALID_STATUS_TRANSITION") &&
      backendMessage &&
      backendMessage.trim().length > 0
    ) {
      return backendMessage;
    }
    return ERROR_MESSAGES[code];
  }
  if (backendMessage && backendMessage.trim().length > 0) {
    return backendMessage;
  }
  return ERROR_MESSAGES.INTERNAL_ERROR;
}
