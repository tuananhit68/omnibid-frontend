import type { CreateReportResponse } from "@/lib/api/contract";
import { ProductStatus, ReportStatus, UserRole } from "@/types/enums";
import { requireMockAuth } from "../auth";
import { getMockDb, mockNowIso, persistMockDb } from "../db";
import { mockError } from "../errors";

export function handleCreateReport(
  authHeader: string | undefined,
  body: Record<string, unknown>
): CreateReportResponse {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const reportedProductId =
    typeof body.reportedProductId === "number" && Number.isInteger(body.reportedProductId)
      ? body.reportedProductId
      : null;
  const reportedUserId =
    typeof body.reportedUserId === "number" && Number.isInteger(body.reportedUserId)
      ? body.reportedUserId
      : null;
  const reportedOrderId =
    typeof body.reportedOrderId === "number" && Number.isInteger(body.reportedOrderId)
      ? body.reportedOrderId
      : null;
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  const fields: Record<string, string> = {};
  if (!reportedProductId && !reportedUserId && !reportedOrderId) {
    fields.targets = "Vui lòng chọn ít nhất một đối tượng báo cáo.";
  }
  if (!reason) {
    fields.reason = "Vui lòng nhập lý do báo cáo.";
  } else if (reason.length < 10) {
    fields.reason = "Lý do báo cáo cần ít nhất 10 ký tự.";
  } else if (reason.length > 1000) {
    fields.reason = "Lý do báo cáo tối đa 1.000 ký tự.";
  }

  if (Object.keys(fields).length > 0) {
    throw mockError("VALIDATION_ERROR", "Dữ liệu báo cáo không hợp lệ.", { fields });
  }

  if (reportedProductId !== null) {
    const product = db.products.find((p) => p.id === reportedProductId);
    if (!product || product.status === ProductStatus.HIDDEN) {
      throw mockError("NOT_FOUND", "Không tìm thấy sản phẩm cần báo cáo.");
    }
    if (product.sellerId === user.id) {
      throw mockError("FORBIDDEN", "Bạn không thể tự báo cáo sản phẩm của chính mình.");
    }
  }

  if (reportedUserId !== null) {
    const targetUser = db.users.find((u) => u.id === reportedUserId);
    if (!targetUser) {
      throw mockError("NOT_FOUND", "Không tìm thấy người dùng cần báo cáo.");
    }
    if (targetUser.id === user.id) {
      throw mockError("FORBIDDEN", "Bạn không thể tự báo cáo chính mình.");
    }
  }

  if (reportedOrderId !== null) {
    const order = db.orders.find((o) => o.id === reportedOrderId);
    if (!order) {
      throw mockError("NOT_FOUND", "Không tìm thấy đơn hàng cần báo cáo.");
    }
    if (order.buyerId !== user.id && order.sellerId !== user.id) {
      throw mockError("FORBIDDEN", "Bạn không có quyền báo cáo đơn hàng này.");
    }
  }

  const nowIso = mockNowIso();
  const id = db.nextIds.report++;

  db.reports.push({
    id,
    reporterId: user.id,
    reportedProductId,
    reportedUserId,
    reportedOrderId,
    reason,
    status: ReportStatus.PENDING,
    adminNote: null,
    resolvedById: null,
    resolvedAt: null,
    createdAt: nowIso,
  });

  persistMockDb();

  return {
    id,
    status: "PENDING",
    createdAt: nowIso,
  };
}
