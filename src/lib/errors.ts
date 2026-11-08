/**
 * OmniBid - Bản đồ mã lỗi backend sang câu tiếng Việt
 * Nguồn: design/backend-contract.md và các spec
 */

export const ERROR_MESSAGES: Record<string, string> = {
  // Lỗi chung & xác thực
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác.",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này.",
  ACCOUNT_BANNED: "Tài khoản của bạn đã bị khoá. Vui lòng liên hệ quản trị viên.",
  NOT_FOUND: "Không tìm thấy dữ liệu yêu cầu.",
  USER_NOT_FOUND: "Không tìm thấy thông tin người dùng.",
  INTERNAL_ERROR: "Lỗi hệ thống. Vui lòng thử lại sau ít phút.",
  VALIDATION_ERROR: "Dữ liệu nhập vào chưa hợp lệ. Vui lòng kiểm tra lại các trường.",
  NETWORK_ERROR: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng.",

  // Đăng ký & tài khoản
  EMAIL_ALREADY_EXISTS: "Email này đã được sử dụng bởi một tài khoản khác.",

  // Đấu giá & Đặt giá
  BID_TOO_LOW: "Mức giá đặt phải bằng hoặc cao hơn mức giá tối thiểu yêu cầu.",
  ALREADY_LEADING: "Bạn đang là người dẫn đầu mức giá của phiên này.",
  SELF_BID_NOT_ALLOWED: "Bạn không thể tự đặt giá cho sản phẩm của chính mình.",
  AUCTION_NOT_ACTIVE: "Phiên đấu giá chưa bắt đầu hoặc đã kết thúc.",
  CANNOT_CANCEL: "Không thể huỷ phiên đấu giá khi đã có người đặt giá.",
  PRODUCT_NOT_AVAILABLE: "Sản phẩm hiện không khả dụng để đưa vào đấu giá.",
  AUCTION_NOT_EDITABLE: "Không thể chỉnh sửa phiên đấu giá ở trạng thái hiện tại.",

  // Đơn hàng & Thanh toán & Vận chuyển
  PAYMENT_IN_PROGRESS: "Giao dịch thanh toán đang được xử lý, vui lòng chờ trong giây lát.",
  PAYMENT_RATE_LIMITED: "Bạn thao tác thanh toán quá nhanh. Vui lòng chờ ít giây rồi thử lại.",
  ORDER_EXPIRED: "Đơn hàng đã hết hạn thanh toán và tự động bị huỷ.",
  ORDER_CANCELLED: "Đơn hàng đã bị huỷ trước đó.",
  INVALID_STATUS_TRANSITION: "Trạng thái hiện tại không cho phép thực hiện thao tác này.",
  COMPLAINT_PENDING: "Đơn hàng đang có khiếu nại chờ xử lý, không thể thực hiện thao tác khác.",
  COMPLAINT_WINDOW_CLOSED: "Đã quá thời hạn cho phép gửi khiếu nại đối với đơn hàng này.",
  DUPLICATE_PENDING_REPORT: "Bạn đã có một báo cáo hoặc khiếu nại đang chờ xử lý.",

  // Quản trị viên
  CANNOT_BAN_ADMIN: "Hệ thống không cho phép khoá tài khoản của quản trị viên.",
  CATEGORY_IN_USE: "Danh mục này đang có sản phẩm liên kết, không thể xoá.",
};

/**
 * Trả về câu thông báo lỗi tiếng Việt dựa theo errorCode.
 * Nếu không có mã hoặc mã chưa biết, sử dụng fallbackMessage hoặc câu mặc định.
 */
export function getErrorMessage(
  errorCode?: string | null,
  fallbackMessage?: string
): string {
  if (errorCode && ERROR_MESSAGES[errorCode]) {
    return ERROR_MESSAGES[errorCode];
  }
  if (fallbackMessage && fallbackMessage.trim().length > 0) {
    return fallbackMessage;
  }
  return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
}

/**
 * Cấu trúc lỗi API chuẩn từ backend
 */
export interface ApiErrorPayload {
  success?: boolean;
  errorCode?: string;
  message?: string;
  data?: Record<string, unknown> | null;
  timestamp?: string;
}

/**
 * Trích xuất mã lỗi, thông báo tiếng Việt và lỗi theo trường (nếu có) từ axios error hoặc error object
 */
export function extractApiError(error: unknown): {
  errorCode: string;
  message: string;
  fieldErrors?: Record<string, string>;
  data?: unknown;
} {
  if (typeof error === "object" && error !== null) {
    const errObj = error as {
      response?: {
        data?: ApiErrorPayload;
        status?: number;
      };
      message?: string;
    };

    if (errObj.response?.data) {
      const responseData = errObj.response.data;
      const errorCode = responseData.errorCode || "INTERNAL_ERROR";
      const message = getErrorMessage(errorCode, responseData.message);

      let fieldErrors: Record<string, string> | undefined;
      if (
        errorCode === "VALIDATION_ERROR" &&
        responseData.data &&
        typeof responseData.data === "object"
      ) {
        fieldErrors = responseData.data as Record<string, string>;
      }

      return {
        errorCode,
        message,
        fieldErrors,
        data: responseData.data,
      };
    }

    if (errObj.message === "Network Error") {
      return {
        errorCode: "NETWORK_ERROR",
        message: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  return {
    errorCode: "INTERNAL_ERROR",
    message: getErrorMessage("INTERNAL_ERROR"),
  };
}

