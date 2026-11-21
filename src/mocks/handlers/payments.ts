import type {
  Page,
  PaymentHistoryItem,
  PaymentResult,
} from "@/lib/api/contract";
import {
  NotificationType,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  UserRole,
} from "@/types/enums";
import { requireMockAuth } from "../auth";
import { getMockDb, mockNowIso, mockNowMs, persistMockDb } from "../db";
import { mockError } from "../errors";

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

export function handleCreatePayment(
  orderId: number,
  authHeader: string | undefined,
  idempotencyKey: string | undefined,
  body: Record<string, unknown>
): PaymentResult {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw mockError("NOT_FOUND", "Không tìm thấy đơn hàng");
  if (order.buyerId !== user.id) {
    throw mockError("FORBIDDEN", "Chỉ người mua mới có thể thanh toán đơn hàng này");
  }

  const cleanKey = idempotencyKey?.trim();
  if (!cleanKey) {
    throw mockError(
      "VALIDATION_ERROR",
      "Thiếu khóa chống trùng lặp (Idempotency-Key)"
    );
  }

  // Idempotency: gửi lặp cùng khóa → trả lại đúng kết quả cũ, không tạo bản ghi mới
  const existing = db.payments.find(
    (p) => p.orderId === orderId && p.idempotencyKey === cleanKey
  );
  if (existing) {
    return {
      paymentId: existing.id,
      attemptNo: existing.attemptNo,
      status: existing.status,
      orderStatus:
        existing.status === PaymentStatus.SUCCESS
          ? OrderStatus.PAID
          : order.status,
      ...(existing.failureReason ? { failureReason: existing.failureReason } : {}),
    };
  }

  const now = mockNowMs();
  const nowIso = mockNowIso();

  if (
    order.status === OrderStatus.EXPIRED ||
    (order.status === OrderStatus.PENDING_PAYMENT &&
      Date.parse(order.paymentDeadline) <= now)
  ) {
    if (order.status === OrderStatus.PENDING_PAYMENT) {
      order.status = OrderStatus.EXPIRED;
      const product = db.products.find((p) => p.id === order.productId);
      if (product && product.status !== ProductStatus.HIDDEN) {
        product.status = ProductStatus.AVAILABLE;
        product.updatedAt = nowIso;
      }
      db.notifications.push({
        id: db.nextIds.notification++,
        userId: order.buyerId,
        type: NotificationType.ORDER_UPDATE,
        title: `Đơn hàng ORD-${order.id} đã hết hạn thanh toán`,
        content: `Đơn hàng ORD-${order.id} đã quá hạn thanh toán và chuyển sang trạng thái Hết hạn.`,
        refType: "ORDER",
        refId: order.id,
        isRead: false,
        createdAt: nowIso,
      });
      db.notifications.push({
        id: db.nextIds.notification++,
        userId: order.sellerId,
        type: NotificationType.ORDER_UPDATE,
        title: `Đơn hàng ORD-${order.id} đã hết hạn thanh toán`,
        content: `Người mua không thanh toán đúng hạn cho đơn ORD-${order.id}. Sản phẩm đã trở về trạng thái Sẵn sàng.`,
        refType: "ORDER",
        refId: order.id,
        isRead: false,
        createdAt: nowIso,
      });
      persistMockDb();
    }
    throw mockError("ORDER_EXPIRED");
  }

  if (order.status === OrderStatus.CANCELLED) {
    throw mockError("ORDER_CANCELLED");
  }

  if (order.status !== OrderStatus.PENDING_PAYMENT) {
    throw mockError(
      "INVALID_STATUS_TRANSITION",
      "Đơn hàng không ở trạng thái chờ thanh toán"
    );
  }

  const missingFields: Record<string, string> = {};
  if (!order.shippingAddress?.trim()) {
    missingFields.shippingAddress = "Vui lòng nhập địa chỉ nhận hàng trước khi thanh toán";
  }
  if (!order.phoneNumber?.trim()) {
    missingFields.phoneNumber = "Vui lòng nhập số điện thoại nhận hàng trước khi thanh toán";
  }
  if (Object.keys(missingFields).length > 0) {
    throw mockError(
      "VALIDATION_ERROR",
      "Vui lòng cập nhật đầy đủ địa chỉ và số điện thoại nhận hàng trước khi thanh toán",
      { fields: missingFields }
    );
  }

  const method =
    typeof body.method === "string" && body.method.trim()
      ? body.method.trim()
      : "MOCK_CARD";
  if (method !== "MOCK_CARD") {
    throw mockError("VALIDATION_ERROR", "Phương thức thanh toán không hợp lệ", {
      fields: { method: "Chỉ hỗ trợ phương thức MOCK_CARD" },
    });
  }

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const rawSimulate = body.simulateResult;
  let outcome: PaymentStatus = db.defaultPaymentOutcome;
  if (
    isDemoMode &&
    (rawSimulate === PaymentStatus.SUCCESS || rawSimulate === PaymentStatus.FAILED)
  ) {
    outcome = rawSimulate;
  }

  const priorAttempts = db.payments.filter((p) => p.orderId === orderId);
  const attemptNo = priorAttempts.length + 1;
  const paymentId = db.nextIds.payment++;
  const failureReason =
    outcome === PaymentStatus.FAILED ? "MOCK_DECLINED" : null;

  db.payments.push({
    id: paymentId,
    orderId,
    attemptNo,
    amount: order.finalPrice,
    method: "MOCK_CARD",
    status: outcome,
    failureReason,
    idempotencyKey: cleanKey,
    createdAt: nowIso,
    paidAt: outcome === PaymentStatus.SUCCESS ? nowIso : null,
  });

  if (outcome === PaymentStatus.SUCCESS) {
    order.status = OrderStatus.PAID;
    order.paidAt = nowIso;

    db.notifications.push({
      id: db.nextIds.notification++,
      userId: order.sellerId,
      type: NotificationType.ORDER_UPDATE,
      title: `Đơn hàng ORD-${order.id} đã được thanh toán`,
      content: `Người mua đã thanh toán đơn hàng ORD-${order.id}. Vui lòng chuẩn bị và gửi hàng.`,
      refType: "ORDER",
      refId: order.id,
      isRead: false,
      createdAt: nowIso,
    });
    db.notifications.push({
      id: db.nextIds.notification++,
      userId: order.buyerId,
      type: NotificationType.ORDER_UPDATE,
      title: `Thanh toán đơn hàng ORD-${order.id} thành công`,
      content: `Đơn hàng ORD-${order.id} đã được thanh toán. Người bán sẽ sớm gửi hàng.`,
      refType: "ORDER",
      refId: order.id,
      isRead: false,
      createdAt: nowIso,
    });
  }

  persistMockDb();

  return {
    paymentId,
    attemptNo,
    status: outcome,
    orderStatus: order.status,
    ...(failureReason ? { failureReason } : {}),
  };
}

export function handleGetOrderPayments(
  orderId: number,
  authHeader: string | undefined,
  params: URLSearchParams
): Page<PaymentHistoryItem> {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw mockError("NOT_FOUND", "Không tìm thấy đơn hàng");
  if (order.buyerId !== user.id) {
    throw mockError("FORBIDDEN", "Chỉ người mua mới có thể xem lịch sử thanh toán");
  }

  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "10");

  const items: PaymentHistoryItem[] = db.payments
    .filter((p) => p.orderId === orderId)
    .sort((a, b) => b.attemptNo - a.attemptNo)
    .map((p) => ({
      id: p.id,
      attemptNo: p.attemptNo,
      amount: p.amount,
      method: p.method,
      status: p.status,
      failureReason: p.failureReason,
      createdAt: p.createdAt,
      paidAt: p.paidAt,
    }));

  return paginate(items, page, size);
}
