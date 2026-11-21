import type {
  ConfirmReceiptResult,
  OrderDetail,
  OrderSummary,
  Page,
  ShipResult,
} from "@/lib/api/contract";
import { dayjs, VIETNAM_TIMEZONE } from "@/lib/format";
import {
  NotificationType,
  OrderStatus,
  ProductStatus,
  UserRole,
} from "@/types/enums";
import { requireMockAuth } from "../auth";
import { getMockDb, mockNowIso, mockNowMs, persistMockDb } from "../db";
import { mockError } from "../errors";
import type { MockOrder } from "../seed";

const ORDER_SORT_WHITELIST = new Set([
  "createdAt,desc",
  "createdAt,asc",
  "finalPrice,desc",
  "finalPrice,asc",
  "paymentDeadline,asc",
]);

const PHONE_REGEX = /^(0|\+84)[0-9]{8,10}$/;
const CONFIRM_WINDOW_DAYS = 7;

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

export function toOrderSummary(order: MockOrder): OrderSummary {
  const db = getMockDb();
  const product = db.products.find((p) => p.id === order.productId);
  const buyer = db.users.find((u) => u.id === order.buyerId);
  const seller = db.users.find((u) => u.id === order.sellerId);
  const primaryImage =
    product?.images.find((i) => i.isPrimary)?.imageUrl ??
    product?.images[0]?.imageUrl ??
    null;

  return {
    id: order.id,
    auctionId: order.auctionId,
    productId: order.productId,
    title: product?.title ?? `Sản phẩm #${order.productId}`,
    primaryImageUrl: primaryImage,
    finalPrice: order.finalPrice,
    status: order.status,
    buyer: {
      id: order.buyerId,
      fullName: buyer?.fullName ?? `Người dùng #${order.buyerId}`,
    },
    seller: {
      id: order.sellerId,
      fullName: seller?.fullName ?? `Người dùng #${order.sellerId}`,
    },
    paymentDeadline: order.paymentDeadline,
    confirmDeadline: order.confirmDeadline,
    createdAt: order.createdAt,
  };
}

export function toOrderDetail(order: MockOrder, viewerId: number): OrderDetail {
  const db = getMockDb();
  const product = db.products.find((p) => p.id === order.productId);
  const summary = toOrderSummary(order);

  return {
    ...summary,
    shippingAddress: order.shippingAddress,
    phoneNumber: order.phoneNumber,
    trackingCode: order.trackingCode,
    paidAt: order.paidAt,
    shippedAt: order.shippedAt,
    completedAt: order.completedAt,
    cancelledAt: order.cancelledAt,
    cancelReason: order.cancelReason,
    productStatus: product?.status ?? ProductStatus.RESERVED,
    viewerRole: order.buyerId === viewerId ? "BUYER" : "SELLER",
  };
}

export function handleGetOrders(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<OrderSummary> {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const roleParam = params.get("role");
  const statusParam = params.get("status");
  const sort = params.get("sort") || "createdAt,desc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "10");

  if (!ORDER_SORT_WHITELIST.has(sort)) {
    throw mockError("VALIDATION_ERROR", "Tham số sắp xếp không hợp lệ", {
      fields: { sort: "Giá trị sắp xếp không được hỗ trợ" },
    });
  }

  let list = db.orders.filter((o) => {
    if (roleParam === "BUYER") {
      if (o.buyerId !== user.id) return false;
    } else if (roleParam === "SELLER") {
      if (o.sellerId !== user.id) return false;
    } else {
      if (o.buyerId !== user.id && o.sellerId !== user.id) return false;
    }
    if (statusParam && o.status !== statusParam) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "createdAt,asc":
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
      case "finalPrice,desc":
        return b.finalPrice - a.finalPrice;
      case "finalPrice,asc":
        return a.finalPrice - b.finalPrice;
      case "paymentDeadline,asc":
        return Date.parse(a.paymentDeadline) - Date.parse(b.paymentDeadline);
      case "createdAt,desc":
      default:
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }
  });

  return paginate(list.map(toOrderSummary), page, size);
}

export function handleGetOrderDetail(
  orderId: number,
  authHeader: string | undefined
): OrderDetail {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw mockError("NOT_FOUND", "Không tìm thấy đơn hàng");
  if (order.buyerId !== user.id && order.sellerId !== user.id) {
    throw mockError("FORBIDDEN", "Bạn không có quyền xem đơn hàng này");
  }

  return toOrderDetail(order, user.id);
}

export function handleUpdateShippingInfo(
  orderId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): OrderDetail {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw mockError("NOT_FOUND", "Không tìm thấy đơn hàng");
  if (order.buyerId !== user.id) {
    throw mockError("FORBIDDEN", "Chỉ người mua mới có thể cập nhật thông tin nhận hàng");
  }

  if (
    order.status === OrderStatus.EXPIRED ||
    (order.status === OrderStatus.PENDING_PAYMENT &&
      Date.parse(order.paymentDeadline) <= mockNowMs())
  ) {
    throw mockError("ORDER_EXPIRED");
  }
  if (order.status === OrderStatus.CANCELLED) {
    throw mockError("ORDER_CANCELLED");
  }
  if (order.status !== OrderStatus.PENDING_PAYMENT) {
    throw mockError(
      "INVALID_STATUS_TRANSITION",
      "Chỉ có thể cập nhật thông tin nhận hàng khi đơn đang chờ thanh toán"
    );
  }

  const shippingAddress =
    typeof body.shippingAddress === "string" ? body.shippingAddress.trim() : "";
  const phoneNumber =
    typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";

  const fields: Record<string, string> = {};
  if (shippingAddress.length < 5 || shippingAddress.length > 300) {
    fields.shippingAddress = "Địa chỉ nhận hàng phải từ 5 đến 300 ký tự";
  }
  if (!PHONE_REGEX.test(phoneNumber)) {
    fields.phoneNumber = "Số điện thoại không hợp lệ (ví dụ: 0901234567)";
  }

  if (Object.keys(fields).length > 0) {
    throw mockError("VALIDATION_ERROR", "Vui lòng kiểm tra lại thông tin nhận hàng", {
      fields,
    });
  }

  order.shippingAddress = shippingAddress;
  order.phoneNumber = phoneNumber;
  persistMockDb();

  return toOrderDetail(order, user.id);
}

export function handleShipOrder(
  orderId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): ShipResult {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw mockError("NOT_FOUND", "Không tìm thấy đơn hàng");
  if (order.sellerId !== user.id) {
    throw mockError("FORBIDDEN", "Chỉ người bán mới có thể xác nhận gửi hàng");
  }

  if (order.status !== OrderStatus.PAID) {
    throw mockError(
      "INVALID_STATUS_TRANSITION",
      "Chỉ có thể gửi hàng khi đơn đã được thanh toán"
    );
  }

  const rawTracking =
    typeof body.trackingCode === "string" ? body.trackingCode.trim() : "";
  if (rawTracking.length > 50) {
    throw mockError("VALIDATION_ERROR", "Mã vận đơn không hợp lệ", {
      fields: { trackingCode: "Mã vận đơn tối đa 50 ký tự" },
    });
  }

  const now = mockNowMs();
  const nowIso = mockNowIso();
  const confirmDeadline = dayjs(now + CONFIRM_WINDOW_DAYS * 24 * 3600_000)
    .tz(VIETNAM_TIMEZONE)
    .format();

  order.status = OrderStatus.SHIPPING;
  order.shippedAt = nowIso;
  order.confirmDeadline = confirmDeadline;
  order.trackingCode = rawTracking || null;

  db.notifications.push({
    id: db.nextIds.notification++,
    userId: order.buyerId,
    type: NotificationType.ORDER_UPDATE,
    title: `Đơn hàng ORD-${order.id} đang được giao`,
    content: order.trackingCode
      ? `Người bán đã gửi hàng (mã vận đơn: ${order.trackingCode}). Vui lòng xác nhận khi nhận được hàng.`
      : `Người bán đã xác nhận gửi hàng cho đơn ORD-${order.id}. Vui lòng xác nhận khi nhận được hàng.`,
    refType: "ORDER",
    refId: order.id,
    isRead: false,
    createdAt: nowIso,
  });

  persistMockDb();

  return {
    id: order.id,
    orderStatus: order.status,
    shippedAt: nowIso,
    confirmDeadline,
    trackingCode: order.trackingCode,
  };
}

export function handleConfirmReceipt(
  orderId: number,
  authHeader: string | undefined
): ConfirmReceiptResult {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw mockError("NOT_FOUND", "Không tìm thấy đơn hàng");
  if (order.buyerId !== user.id) {
    throw mockError("FORBIDDEN", "Chỉ người mua mới có thể xác nhận nhận hàng");
  }

  if (order.status !== OrderStatus.SHIPPING) {
    throw mockError(
      "INVALID_STATUS_TRANSITION",
      "Chỉ có thể xác nhận nhận hàng khi đơn đang giao"
    );
  }

  const nowIso = mockNowIso();
  order.status = OrderStatus.COMPLETED;
  order.completedAt = nowIso;

  const product = db.products.find((p) => p.id === order.productId);
  let productStatus: ProductStatus = product?.status ?? ProductStatus.SOLD;
  if (product && product.status !== ProductStatus.HIDDEN) {
    product.status = ProductStatus.SOLD;
    product.updatedAt = nowIso;
    productStatus = ProductStatus.SOLD;
  }

  db.notifications.push({
    id: db.nextIds.notification++,
    userId: order.sellerId,
    type: NotificationType.ORDER_UPDATE,
    title: `Đơn hàng ORD-${order.id} đã hoàn tất`,
    content: `Người mua đã xác nhận nhận được hàng cho đơn ORD-${order.id}.`,
    refType: "ORDER",
    refId: order.id,
    isRead: false,
    createdAt: nowIso,
  });

  persistMockDb();

  return {
    id: order.id,
    orderStatus: order.status,
    productStatus,
  };
}
