import type {
  AdminAuctionDetail,
  AdminAuctionItem,
  AdminBanUserResponse,
  AdminCategory,
  AdminHideProductResponse,
  AdminOrderDetail,
  AdminProductDetail,
  AdminProductItem,
  AdminReportDetail,
  AdminReportItem,
  AdminStatistics,
  AdminUnbanUserResponse,
  AdminUser,
  OrderSummary,
  Page,
  PaymentHistoryItem,
  ReportTargetSummary,
  UserRef,
  UserSummary,
} from "@/lib/api/contract";
import {
  AuctionStatus,
  NotificationType,
  OrderStatus,
  ProductStatus,
  ReportStatus,
  UserRole,
  UserStatus,
} from "@/types/enums";
import { requireMockAuth } from "../auth";
import { getMockDb, maskBidderName, mockNowIso, persistMockDb } from "../db";
import { mockError } from "../errors";
import {
  computeMinNextBid,
  computeReserveStatus,
  type MockAuction,
  type MockOrder,
  type MockProduct,
  type MockReport,
  type MockUser,
} from "../seed";
import { publishAuctionEvent } from "../ws-bus";

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const safePage = Number.isFinite(page) && page >= 0 ? Math.floor(page) : 0;
  const safeSize =
    Number.isFinite(size) && size > 0 ? Math.min(Math.floor(size), 100) : 20;
  const start = safePage * safeSize;
  const content = items.slice(start, start + safeSize);
  const totalElements = items.length;
  const totalPages = Math.ceil(totalElements / safeSize);
  return { content, page: safePage, size: safeSize, totalElements, totalPages };
}

function toUserRef(user: MockUser | undefined, fallbackId: number): UserRef {
  return {
    id: user?.id ?? fallbackId,
    fullName: user?.fullName ?? `Người dùng #${fallbackId}`,
  };
}

function toUserSummary(user: MockUser | undefined, fallbackId: number): UserSummary {
  return {
    id: user?.id ?? fallbackId,
    fullName: user?.fullName ?? `Người dùng #${fallbackId}`,
    email: user?.email ?? `user${fallbackId}@omnibid.local`,
    role: user?.role ?? UserRole.USER,
    status: user?.status ?? UserStatus.ACTIVE,
    avatarUrl: user?.avatarUrl ?? null,
  };
}

function pushNotification(
  userId: number,
  type: NotificationType,
  title: string,
  content: string,
  refType: "AUCTION" | "ORDER" | "REPORT" | null,
  refId: number | null
): void {
  const db = getMockDb();
  const recipient = db.users.find((u) => u.id === userId);
  if (!recipient || recipient.role === UserRole.ADMIN) return;
  db.notifications.push({
    id: db.nextIds.notification++,
    userId,
    type,
    title,
    content,
    refType,
    refId,
    isRead: false,
    createdAt: mockNowIso(),
  });
}

function releaseProductIfNotHidden(productId: number): void {
  const db = getMockDb();
  const product = db.products.find((p) => p.id === productId);
  if (!product) return;
  if (product.status === ProductStatus.HIDDEN) return;
  product.status = ProductStatus.AVAILABLE;
  product.updatedAt = mockNowIso();
}

function cancelAuctionInternal(auction: MockAuction, reason: string): void {
  const db = getMockDb();
  const nowIso = mockNowIso();
  const product = db.products.find((p) => p.id === auction.productId);

  auction.status = AuctionStatus.CANCELLED;
  auction.closedAt = nowIso;
  auction.cancelReason = reason;

  releaseProductIfNotHidden(auction.productId);

  const highestBidder =
    auction.highestBidderId != null
      ? db.users.find((u) => u.id === auction.highestBidderId)
      : undefined;

  publishAuctionEvent({
    type: "AUCTION_CANCELLED",
    auctionId: auction.id,
    status: AuctionStatus.CANCELLED,
    currentPrice: auction.currentPrice,
    minNextBid: computeMinNextBid(auction),
    bidCount: auction.bidCount,
    highestBidderName: highestBidder ? maskBidderName(highestBidder.fullName) : null,
    reserveStatus: computeReserveStatus(
      auction.reservePrice,
      auction.currentPrice,
      auction.bidCount
    ),
    startTime: auction.startTime,
    endTime: auction.endTime,
    createdAt: nowIso,
  });

  const title = product?.title ?? `Phiên AUC-${auction.id}`;
  pushNotification(
    auction.sellerId,
    NotificationType.AUCTION_CANCELLED,
    `Phiên đấu giá AUC-${auction.id} đã bị hủy`,
    `Phiên ${title} đã bị hủy bởi quản trị viên. Lý do: ${reason}`,
    "AUCTION",
    auction.id
  );

  if (auction.highestBidderId != null && auction.highestBidderId !== auction.sellerId) {
    pushNotification(
      auction.highestBidderId,
      NotificationType.AUCTION_CANCELLED,
      `Phiên đấu giá AUC-${auction.id} đã bị hủy`,
      `Phiên ${title} mà bạn đang dẫn đầu đã bị hủy bởi quản trị viên. Lý do: ${reason}`,
      "AUCTION",
      auction.id
    );
  }
}

function getActiveAuctionIdForProduct(productId: number): number | null {
  const db = getMockDb();
  const found = db.auctions.find(
    (a) =>
      a.productId === productId &&
      (a.status === AuctionStatus.SCHEDULED || a.status === AuctionStatus.ACTIVE)
  );
  return found ? found.id : null;
}

function toAdminProductItem(product: MockProduct): AdminProductItem {
  const db = getMockDb();
  const category = db.categories.find((c) => c.id === product.categoryId);
  const seller = db.users.find((u) => u.id === product.sellerId);
  const primaryImage =
    product.images.find((i) => i.isPrimary)?.imageUrl ??
    product.images[0]?.imageUrl ??
    null;

  return {
    id: product.id,
    title: product.title,
    categoryId: product.categoryId,
    categoryName: category?.name ?? "Khác",
    condition: product.condition,
    status: product.status,
    primaryImageUrl: primaryImage,
    imageCount: product.images.length,
    activeAuctionId: getActiveAuctionIdForProduct(product.id),
    everAuctioned: product.everAuctioned,
    createdAt: product.createdAt,
    seller: toUserRef(seller, product.sellerId),
  };
}

function toAdminProductDetail(product: MockProduct): AdminProductDetail {
  const db = getMockDb();
  const category = db.categories.find((c) => c.id === product.categoryId);
  const seller = db.users.find((u) => u.id === product.sellerId);
  const primaryImage =
    product.images.find((i) => i.isPrimary)?.imageUrl ??
    product.images[0]?.imageUrl ??
    null;

  return {
    id: product.id,
    categoryId: product.categoryId,
    categoryName: category?.name ?? "Khác",
    title: product.title,
    description: product.description,
    condition: product.condition,
    status: product.status,
    primaryImageUrl: primaryImage,
    imageCount: product.images.length,
    images: product.images,
    activeAuctionId: getActiveAuctionIdForProduct(product.id),
    everAuctioned: product.everAuctioned,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    seller: toUserSummary(seller, product.sellerId),
  };
}

function toAdminAuctionItem(auction: MockAuction): AdminAuctionItem {
  const db = getMockDb();
  const product = db.products.find((p) => p.id === auction.productId);
  const category = db.categories.find((c) => c.id === product?.categoryId);
  const seller = db.users.find((u) => u.id === auction.sellerId);
  const primaryImage =
    product?.images.find((i) => i.isPrimary)?.imageUrl ??
    product?.images[0]?.imageUrl ??
    null;

  return {
    id: auction.id,
    productId: auction.productId,
    title: product?.title ?? `Phiên #${auction.id}`,
    primaryImageUrl: primaryImage,
    categoryId: category?.id ?? product?.categoryId ?? 0,
    categoryName: category?.name ?? "Khác",
    status: auction.status,
    startPrice: auction.startPrice,
    currentPrice: auction.currentPrice,
    minNextBid: computeMinNextBid(auction),
    bidCount: auction.bidCount,
    reserveStatus: computeReserveStatus(
      auction.reservePrice,
      auction.currentPrice,
      auction.bidCount
    ),
    startTime: auction.startTime,
    endTime: auction.endTime,
    createdAt: auction.createdAt,
    seller: toUserRef(seller, auction.sellerId),
    reservePrice: auction.reservePrice,
  };
}

function toAdminAuctionDetail(auction: MockAuction): AdminAuctionDetail {
  const db = getMockDb();
  const product = db.products.find((p) => p.id === auction.productId);
  const category = db.categories.find((c) => c.id === product?.categoryId);
  const seller = db.users.find((u) => u.id === auction.sellerId);
  const highestBidder =
    auction.highestBidderId != null
      ? db.users.find((u) => u.id === auction.highestBidderId)
      : undefined;
  const winner =
    auction.winnerId != null
      ? db.users.find((u) => u.id === auction.winnerId)
      : undefined;
  const order = db.orders.find((o) => o.auctionId === auction.id);
  const primaryImage =
    product?.images.find((i) => i.isPrimary)?.imageUrl ??
    product?.images[0]?.imageUrl ??
    null;

  return {
    id: auction.id,
    productId: auction.productId,
    title: product?.title ?? `Phiên #${auction.id}`,
    primaryImageUrl: primaryImage,
    categoryId: category?.id ?? product?.categoryId ?? 0,
    categoryName: category?.name ?? "Khác",
    status: auction.status,
    startPrice: auction.startPrice,
    currentPrice: auction.currentPrice,
    minNextBid: computeMinNextBid(auction),
    bidCount: auction.bidCount,
    reserveStatus: computeReserveStatus(
      auction.reservePrice,
      auction.currentPrice,
      auction.bidCount
    ),
    startTime: auction.startTime,
    endTime: auction.endTime,
    createdAt: auction.createdAt,
    description: product?.description ?? "",
    condition: product?.condition ?? "GOOD",
    images: product?.images ?? [],
    bidIncrement: auction.bidIncrement,
    reservePrice: auction.reservePrice,
    seller: toUserSummary(seller, auction.sellerId),
    highestBidder:
      auction.highestBidderId != null
        ? toUserSummary(highestBidder, auction.highestBidderId)
        : null,
    winner:
      auction.winnerId != null ? toUserSummary(winner, auction.winnerId) : null,
    finalPrice: auction.finalPrice,
    closedAt: auction.closedAt,
    cancelReason: auction.cancelReason,
    productStatus: product?.status ?? ProductStatus.AVAILABLE,
    orderId: order?.id ?? null,
  };
}

function toOrderSummary(order: MockOrder): OrderSummary {
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
    title: product?.title ?? `Đơn hàng #${order.id}`,
    primaryImageUrl: primaryImage,
    finalPrice: order.finalPrice,
    status: order.status,
    buyer: toUserRef(buyer, order.buyerId),
    seller: toUserRef(seller, order.sellerId),
    paymentDeadline: order.paymentDeadline,
    confirmDeadline: order.confirmDeadline,
    createdAt: order.createdAt,
  };
}

function toAdminOrderDetail(order: MockOrder): AdminOrderDetail {
  const db = getMockDb();
  const product = db.products.find((p) => p.id === order.productId);
  const buyer = db.users.find((u) => u.id === order.buyerId);
  const seller = db.users.find((u) => u.id === order.sellerId);
  const primaryImage =
    product?.images.find((i) => i.isPrimary)?.imageUrl ??
    product?.images[0]?.imageUrl ??
    null;

  const payments: PaymentHistoryItem[] = db.payments
    .filter((p) => p.orderId === order.id)
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

  return {
    id: order.id,
    auctionId: order.auctionId,
    productId: order.productId,
    title: product?.title ?? `Đơn hàng #${order.id}`,
    primaryImageUrl: primaryImage,
    finalPrice: order.finalPrice,
    status: order.status,
    buyer: toUserSummary(buyer, order.buyerId),
    seller: toUserSummary(seller, order.sellerId),
    paymentDeadline: order.paymentDeadline,
    confirmDeadline: order.confirmDeadline,
    createdAt: order.createdAt,
    shippingAddress: order.shippingAddress,
    phoneNumber: order.phoneNumber,
    trackingCode: order.trackingCode,
    paidAt: order.paidAt,
    shippedAt: order.shippedAt,
    completedAt: order.completedAt,
    cancelledAt: order.cancelledAt,
    cancelReason: order.cancelReason,
    productStatus: product?.status ?? ProductStatus.RESERVED,
    payments,
  };
}

function buildReportTargets(report: MockReport): ReportTargetSummary {
  const db = getMockDb();
  const targets: ReportTargetSummary = {};

  if (report.reportedProductId != null) {
    const product = db.products.find((p) => p.id === report.reportedProductId);
    if (product) {
      const activeAuction = db.auctions.find(
        (a) =>
          a.productId === product.id &&
          (a.status === AuctionStatus.SCHEDULED || a.status === AuctionStatus.ACTIVE)
      );
      targets.product = {
        id: product.id,
        title: product.title,
        status: product.status,
        sellerId: product.sellerId,
        activeAuction: activeAuction
          ? {
              id: activeAuction.id,
              status: activeAuction.status,
              bidCount: activeAuction.bidCount,
            }
          : null,
      };
    }
  }

  if (report.reportedUserId != null) {
    const targetUser = db.users.find((u) => u.id === report.reportedUserId);
    if (targetUser) {
      targets.user = {
        id: targetUser.id,
        fullName: targetUser.fullName,
        email: targetUser.email,
        role: targetUser.role,
        status: targetUser.status,
      };
    }
  }

  if (report.reportedOrderId != null) {
    const order = db.orders.find((o) => o.id === report.reportedOrderId);
    if (order) {
      targets.order = {
        id: order.id,
        status: order.status,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        auctionId: order.auctionId,
      };
    }
  }

  return targets;
}

function toAdminReportItem(report: MockReport): AdminReportItem {
  const db = getMockDb();
  const reporter = db.users.find((u) => u.id === report.reporterId);
  return {
    id: report.id,
    reporter: toUserRef(reporter, report.reporterId),
    targets: buildReportTargets(report),
    reason: report.reason,
    status: report.status,
    createdAt: report.createdAt,
  };
}

function toAdminReportDetail(report: MockReport): AdminReportDetail {
  const db = getMockDb();
  const resolvedBy =
    report.resolvedById != null
      ? db.users.find((u) => u.id === report.resolvedById)
      : undefined;
  return {
    ...toAdminReportItem(report),
    adminNote: report.adminNote,
    resolvedBy:
      report.resolvedById != null
        ? toUserRef(resolvedBy, report.resolvedById)
        : null,
    resolvedAt: report.resolvedAt,
  };
}

function toAdminCategory(category: {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}): AdminCategory {
  const db = getMockDb();
  const productCount = db.products.filter((p) => p.categoryId === category.id).length;
  return {
    ...category,
    productCount,
  };
}

// --------------------------------------------------
// 35–37. Admin Users
// --------------------------------------------------
const USER_SORT_WHITELIST = new Set([
  "createdAt,desc",
  "createdAt,asc",
  "fullName,asc",
  "fullName,desc",
]);

export function handleAdminGetUsers(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<AdminUser> {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const keyword = (params.get("keyword") ?? "").trim().toLowerCase();
  const status = params.get("status");
  const role = params.get("role");
  const sort = params.get("sort") || "createdAt,desc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "20");

  if (!USER_SORT_WHITELIST.has(sort)) {
    throw mockError("VALIDATION_ERROR", "Tham số sắp xếp không hợp lệ.", {
      fields: { sort: "Giá trị sort không nằm trong danh sách cho phép." },
    });
  }

  let list = db.users.filter((u) => {
    if (
      keyword &&
      !u.fullName.toLowerCase().includes(keyword) &&
      !u.email.toLowerCase().includes(keyword)
    ) {
      return false;
    }
    if (status && u.status !== status) return false;
    if (role && u.role !== role) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    if (sort === "createdAt,asc") return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    if (sort === "fullName,asc") return a.fullName.localeCompare(b.fullName, "vi");
    if (sort === "fullName,desc") return b.fullName.localeCompare(a.fullName, "vi");
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });

  const items: AdminUser[] = list.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    status: u.status,
    avatarUrl: u.avatarUrl,
    phoneNumber: u.phoneNumber,
    createdAt: u.createdAt,
  }));

  return paginate(items, page, size);
}

export function handleAdminBanUser(
  userId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): AdminBanUserResponse {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const target = db.users.find((u) => u.id === userId);
  if (!target) {
    throw mockError("NOT_FOUND", "Không tìm thấy người dùng.");
  }
  if (target.role === UserRole.ADMIN) {
    throw mockError("CANNOT_BAN_ADMIN", "Không thể khóa tài khoản quản trị viên.");
  }
  if (target.status === UserStatus.BANNED) {
    throw mockError("INVALID_STATUS_TRANSITION", "Tài khoản này đã bị khóa trước đó.");
  }

  const reason =
    typeof body.reason === "string" && body.reason.trim().length > 0
      ? body.reason.trim()
      : "Tài khoản người dùng đã bị khóa bởi quản trị viên.";

  target.status = UserStatus.BANNED;
  target.tokenVersion += 1;

  // Vòng 1: hủy các phiên SCHEDULED/ACTIVE do user bán (giữ nguyên lượt đặt giá)
  let cancelledAuctions = 0;
  for (const auction of db.auctions) {
    if (
      auction.sellerId === target.id &&
      (auction.status === AuctionStatus.SCHEDULED ||
        auction.status === AuctionStatus.ACTIVE)
    ) {
      cancelAuctionInternal(auction, reason);
      cancelledAuctions += 1;
    }
  }

  // Vòng 2: hủy các đơn PENDING_PAYMENT user là người mua hoặc người bán; thông báo bên còn lại
  let cancelledOrders = 0;
  const nowIso = mockNowIso();
  for (const order of db.orders) {
    if (
      order.status === OrderStatus.PENDING_PAYMENT &&
      (order.buyerId === target.id || order.sellerId === target.id)
    ) {
      order.status = OrderStatus.CANCELLED;
      order.cancelledAt = nowIso;
      order.cancelReason = reason;
      releaseProductIfNotHidden(order.productId);
      cancelledOrders += 1;

      const otherUserId =
        order.buyerId === target.id ? order.sellerId : order.buyerId;
      pushNotification(
        otherUserId,
        NotificationType.ORDER_UPDATE,
        `Đơn hàng ORD-${order.id} đã bị hủy`,
        `Đơn hàng ORD-${order.id} đã bị hủy do tài khoản đối tác bị khóa.`,
        "ORDER",
        order.id
      );
    }
  }

  persistMockDb();

  return {
    id: target.id,
    status: "BANNED",
    cancelledAuctions,
    cancelledOrders,
  };
}

export function handleAdminUnbanUser(
  userId: number,
  authHeader: string | undefined
): AdminUnbanUserResponse {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const target = db.users.find((u) => u.id === userId);
  if (!target) {
    throw mockError("NOT_FOUND", "Không tìm thấy người dùng.");
  }
  if (target.status !== UserStatus.BANNED) {
    throw mockError("INVALID_STATUS_TRANSITION", "Tài khoản này không ở trạng thái bị khóa.");
  }

  target.status = UserStatus.ACTIVE;
  persistMockDb();

  return {
    id: target.id,
    status: "ACTIVE",
  };
}

// --------------------------------------------------
// 38–40. Admin Products
// --------------------------------------------------
const PRODUCT_SORT_WHITELIST = new Set([
  "createdAt,desc",
  "createdAt,asc",
  "title,asc",
  "title,desc",
]);

export function handleAdminGetProducts(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<AdminProductItem> {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const keyword = (params.get("keyword") ?? "").trim().toLowerCase();
  const categoryIdParam = params.get("categoryId");
  const status = params.get("status");
  const sort = params.get("sort") || "createdAt,desc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "20");

  if (!PRODUCT_SORT_WHITELIST.has(sort)) {
    throw mockError("VALIDATION_ERROR", "Tham số sắp xếp không hợp lệ.", {
      fields: { sort: "Giá trị sort không nằm trong danh sách cho phép." },
    });
  }

  let list = db.products.filter((p) => {
    if (keyword) {
      const seller = db.users.find((u) => u.id === p.sellerId);
      const matchTitle = p.title.toLowerCase().includes(keyword);
      const matchSeller = seller?.fullName.toLowerCase().includes(keyword) ?? false;
      if (!matchTitle && !matchSeller) return false;
    }
    if (categoryIdParam && p.categoryId !== Number(categoryIdParam)) return false;
    if (status && p.status !== status) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    if (sort === "createdAt,asc") return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    if (sort === "title,asc") return a.title.localeCompare(b.title, "vi");
    if (sort === "title,desc") return b.title.localeCompare(a.title, "vi");
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });

  return paginate(list.map(toAdminProductItem), page, size);
}

export function handleAdminGetProductDetail(
  productId: number,
  authHeader: string | undefined
): AdminProductDetail {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();
  const product = db.products.find((p) => p.id === productId);
  if (!product) {
    throw mockError("NOT_FOUND", "Không tìm thấy sản phẩm.");
  }
  return toAdminProductDetail(product);
}

export function handleAdminHideProduct(
  productId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): AdminHideProductResponse {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const product = db.products.find((p) => p.id === productId);
  if (!product) {
    throw mockError("NOT_FOUND", "Không tìm thấy sản phẩm.");
  }
  if (product.status === ProductStatus.HIDDEN) {
    throw mockError("INVALID_STATUS_TRANSITION", "Sản phẩm này đã bị ẩn trước đó.");
  }

  const reason =
    typeof body.reason === "string" && body.reason.trim().length > 0
      ? body.reason.trim()
      : "Sản phẩm đã bị ẩn vĩnh viễn do vi phạm quy định sàn.";

  const nowIso = mockNowIso();
  product.status = ProductStatus.HIDDEN;
  product.updatedAt = nowIso;

  // Hủy phiên đang SCHEDULED / ACTIVE của sản phẩm
  let cancelledAuctions = 0;
  for (const auction of db.auctions) {
    if (
      auction.productId === product.id &&
      (auction.status === AuctionStatus.SCHEDULED ||
        auction.status === AuctionStatus.ACTIVE)
    ) {
      cancelAuctionInternal(auction, reason);
      cancelledAuctions += 1;
    }
  }

  // Hủy đơn PENDING_PAYMENT của sản phẩm (đơn PAID/SHIPPING/COMPLETED giữ nguyên)
  let cancelledOrders = 0;
  for (const order of db.orders) {
    if (
      order.productId === product.id &&
      order.status === OrderStatus.PENDING_PAYMENT
    ) {
      order.status = OrderStatus.CANCELLED;
      order.cancelledAt = nowIso;
      order.cancelReason = reason;
      cancelledOrders += 1;

      pushNotification(
        order.buyerId,
        NotificationType.ORDER_UPDATE,
        `Đơn hàng ORD-${order.id} đã bị hủy`,
        `Đơn hàng ORD-${order.id} đã bị hủy do sản phẩm bị ẩn bởi quản trị viên. Lý do: ${reason}`,
        "ORDER",
        order.id
      );
      pushNotification(
        order.sellerId,
        NotificationType.ORDER_UPDATE,
        `Đơn hàng ORD-${order.id} đã bị hủy`,
        `Đơn hàng ORD-${order.id} đã bị hủy do sản phẩm bị ẩn bởi quản trị viên. Lý do: ${reason}`,
        "ORDER",
        order.id
      );
    }
  }

  persistMockDb();

  return {
    id: product.id,
    status: "HIDDEN",
    cancelledAuctions,
    cancelledOrders,
  };
}

// --------------------------------------------------
// 41–43. Admin Auctions
// --------------------------------------------------
const AUCTION_SORT_WHITELIST = new Set([
  "createdAt,desc",
  "createdAt,asc",
  "endTime,asc",
  "endTime,desc",
  "currentPrice,desc",
  "currentPrice,asc",
]);

export function handleAdminGetAuctions(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<AdminAuctionItem> {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const keyword = (params.get("keyword") ?? "").trim().toLowerCase();
  const status = params.get("status");
  const sellerIdParam = params.get("sellerId");
  const sort = params.get("sort") || "createdAt,desc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "20");

  if (!AUCTION_SORT_WHITELIST.has(sort)) {
    throw mockError("VALIDATION_ERROR", "Tham số sắp xếp không hợp lệ.", {
      fields: { sort: "Giá trị sort không nằm trong danh sách cho phép." },
    });
  }

  let list = db.auctions.filter((a) => {
    const product = db.products.find((p) => p.id === a.productId);
    const seller = db.users.find((u) => u.id === a.sellerId);
    if (keyword) {
      const matchTitle = product?.title.toLowerCase().includes(keyword) ?? false;
      const matchSeller = seller?.fullName.toLowerCase().includes(keyword) ?? false;
      const matchCode = `auc-${a.id}`.includes(keyword);
      if (!matchTitle && !matchSeller && !matchCode) return false;
    }
    if (status && a.status !== status) return false;
    if (sellerIdParam && a.sellerId !== Number(sellerIdParam)) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    if (sort === "createdAt,asc") return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    if (sort === "endTime,asc") return Date.parse(a.endTime) - Date.parse(b.endTime);
    if (sort === "endTime,desc") return Date.parse(b.endTime) - Date.parse(a.endTime);
    if (sort === "currentPrice,asc") return a.currentPrice - b.currentPrice;
    if (sort === "currentPrice,desc") return b.currentPrice - a.currentPrice;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });

  return paginate(list.map(toAdminAuctionItem), page, size);
}

export function handleAdminGetAuctionDetail(
  auctionId: number,
  authHeader: string | undefined
): AdminAuctionDetail {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();
  const auction = db.auctions.find((a) => a.id === auctionId);
  if (!auction) {
    throw mockError("NOT_FOUND", "Không tìm thấy phiên đấu giá.");
  }
  return toAdminAuctionDetail(auction);
}

export function handleAdminCancelAuction(
  auctionId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): AdminAuctionDetail {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const auction = db.auctions.find((a) => a.id === auctionId);
  if (!auction) {
    throw mockError("NOT_FOUND", "Không tìm thấy phiên đấu giá.");
  }

  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  if (!reason) {
    throw mockError("VALIDATION_ERROR", "Vui lòng nhập lý do hủy phiên.", {
      fields: { reason: "Lý do hủy phiên là bắt buộc." },
    });
  }

  if (
    auction.status !== AuctionStatus.SCHEDULED &&
    auction.status !== AuctionStatus.ACTIVE
  ) {
    throw mockError(
      "INVALID_STATUS_TRANSITION",
      "Chỉ có thể hủy phiên ở trạng thái Sắp diễn ra hoặc Đang diễn ra."
    );
  }

  cancelAuctionInternal(auction, reason);
  persistMockDb();

  return toAdminAuctionDetail(auction);
}

// --------------------------------------------------
// 44–46. Admin Orders
// --------------------------------------------------
const ORDER_SORT_WHITELIST = new Set([
  "createdAt,desc",
  "createdAt,asc",
  "finalPrice,desc",
  "finalPrice,asc",
]);

export function handleAdminGetOrders(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<OrderSummary> {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const status = params.get("status");
  const buyerIdParam = params.get("buyerId");
  const sellerIdParam = params.get("sellerId");
  const fromDateParam = params.get("fromDate");
  const toDateParam = params.get("toDate");
  const sort = params.get("sort") || "createdAt,desc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "20");

  if (!ORDER_SORT_WHITELIST.has(sort)) {
    throw mockError("VALIDATION_ERROR", "Tham số sắp xếp không hợp lệ.", {
      fields: { sort: "Giá trị sort không nằm trong danh sách cho phép." },
    });
  }

  const fromMs = fromDateParam ? Date.parse(fromDateParam) : NaN;
  const toMs = toDateParam ? Date.parse(toDateParam) : NaN;

  let list = db.orders.filter((o) => {
    if (status && o.status !== status) return false;
    if (buyerIdParam && o.buyerId !== Number(buyerIdParam)) return false;
    if (sellerIdParam && o.sellerId !== Number(sellerIdParam)) return false;
    const createdMs = Date.parse(o.createdAt);
    if (!Number.isNaN(fromMs) && createdMs < fromMs) return false;
    if (!Number.isNaN(toMs) && createdMs > toMs) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    if (sort === "createdAt,asc") return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    if (sort === "finalPrice,asc") return a.finalPrice - b.finalPrice;
    if (sort === "finalPrice,desc") return b.finalPrice - a.finalPrice;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });

  return paginate(list.map(toOrderSummary), page, size);
}

export function handleAdminGetOrderDetail(
  orderId: number,
  authHeader: string | undefined
): AdminOrderDetail {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) {
    throw mockError("NOT_FOUND", "Không tìm thấy đơn hàng.");
  }
  return toAdminOrderDetail(order);
}

export function handleAdminCancelOrder(
  orderId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): AdminOrderDetail {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const order = db.orders.find((o) => o.id === orderId);
  if (!order) {
    throw mockError("NOT_FOUND", "Không tìm thấy đơn hàng.");
  }

  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  if (!reason) {
    throw mockError("VALIDATION_ERROR", "Vui lòng nhập lý do hủy đơn.", {
      fields: { reason: "Lý do hủy đơn là bắt buộc." },
    });
  }

  if (order.status !== OrderStatus.PENDING_PAYMENT) {
    throw mockError(
      "INVALID_STATUS_TRANSITION",
      "Chỉ có thể hủy đơn hàng ở trạng thái Chờ thanh toán."
    );
  }

  const nowIso = mockNowIso();
  order.status = OrderStatus.CANCELLED;
  order.cancelledAt = nowIso;
  order.cancelReason = reason;
  releaseProductIfNotHidden(order.productId);

  pushNotification(
    order.buyerId,
    NotificationType.ORDER_UPDATE,
    `Đơn hàng ORD-${order.id} đã bị hủy`,
    `Đơn hàng ORD-${order.id} đã bị quản trị viên hủy. Lý do: ${reason}`,
    "ORDER",
    order.id
  );
  pushNotification(
    order.sellerId,
    NotificationType.ORDER_UPDATE,
    `Đơn hàng ORD-${order.id} đã bị hủy`,
    `Đơn hàng ORD-${order.id} đã bị quản trị viên hủy. Lý do: ${reason}`,
    "ORDER",
    order.id
  );

  persistMockDb();

  return toAdminOrderDetail(order);
}

// --------------------------------------------------
// 47–49. Admin Reports
// --------------------------------------------------
const REPORT_SORT_WHITELIST = new Set([
  "createdAt,desc",
  "createdAt,asc",
]);

export function handleAdminGetReports(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<AdminReportItem> {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const status = params.get("status");
  const targetType = params.get("targetType");
  const sort = params.get("sort") || "createdAt,desc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "20");

  if (!REPORT_SORT_WHITELIST.has(sort)) {
    throw mockError("VALIDATION_ERROR", "Tham số sắp xếp không hợp lệ.", {
      fields: { sort: "Giá trị sort không nằm trong danh sách cho phép." },
    });
  }

  let list = db.reports.filter((r) => {
    if (status && r.status !== status) return false;
    if (targetType === "PRODUCT" && r.reportedProductId == null) return false;
    if (targetType === "USER" && r.reportedUserId == null) return false;
    if (targetType === "ORDER" && r.reportedOrderId == null) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    const diff = Date.parse(a.createdAt) - Date.parse(b.createdAt);
    return sort === "createdAt,asc" ? diff : -diff;
  });

  return paginate(list.map(toAdminReportItem), page, size);
}

export function handleAdminGetReportDetail(
  reportId: number,
  authHeader: string | undefined
): AdminReportDetail {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();
  const report = db.reports.find((r) => r.id === reportId);
  if (!report) {
    throw mockError("NOT_FOUND", "Không tìm thấy báo cáo vi phạm.");
  }
  return toAdminReportDetail(report);
}

export function handleAdminResolveReport(
  reportId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): AdminReportDetail {
  const admin = requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const report = db.reports.find((r) => r.id === reportId);
  if (!report) {
    throw mockError("NOT_FOUND", "Không tìm thấy báo cáo vi phạm.");
  }
  if (report.status !== ReportStatus.PENDING) {
    throw mockError("INVALID_STATUS_TRANSITION", "Báo cáo này đã được xử lý trước đó.");
  }

  const decision = typeof body.decision === "string" ? body.decision.trim() : "";
  const note = typeof body.note === "string" ? body.note.trim() : "";

  const fields: Record<string, string> = {};
  if (decision !== ReportStatus.RESOLVED && decision !== ReportStatus.REJECTED) {
    fields.decision = "Kết luận phải là Đã xử lý hoặc Bác bỏ.";
  }
  if (!note) {
    fields.note = "Vui lòng nhập ghi chú xử lý.";
  } else if (note.length > 1000) {
    fields.note = "Ghi chú tối đa 1.000 ký tự.";
  }
  if (Object.keys(fields).length > 0) {
    throw mockError("VALIDATION_ERROR", "Dữ liệu xử lý báo cáo không hợp lệ.", {
      fields,
    });
  }

  const nowIso = mockNowIso();
  report.status = decision as ReportStatus;
  report.adminNote = note;
  report.resolvedById = admin.id;
  report.resolvedAt = nowIso;

  const outcomeLabel =
    decision === ReportStatus.RESOLVED ? "đã được xác nhận xử lý" : "đã bị bác bỏ";
  pushNotification(
    report.reporterId,
    NotificationType.REPORT_RESOLVED,
    `Báo cáo vi phạm REP-${report.id} ${outcomeLabel}`,
    `Quản trị viên đã hoàn tất xem xét báo cáo REP-${report.id}. Ghi chú: ${note}`,
    "REPORT",
    report.id
  );

  persistMockDb();

  return toAdminReportDetail(report);
}

// --------------------------------------------------
// 50–53. Admin Categories
// --------------------------------------------------
const CATEGORY_SORT_WHITELIST = new Set([
  "name,asc",
  "name,desc",
  "id,asc",
  "id,desc",
]);

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function handleAdminGetCategories(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<AdminCategory> {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const keyword = (params.get("keyword") ?? "").trim().toLowerCase();
  const sort = params.get("sort") || "name,asc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "20");

  if (!CATEGORY_SORT_WHITELIST.has(sort)) {
    throw mockError("VALIDATION_ERROR", "Tham số sắp xếp không hợp lệ.", {
      fields: { sort: "Giá trị sort không nằm trong danh sách cho phép." },
    });
  }

  let list = db.categories.filter((c) => {
    if (!keyword) return true;
    return (
      c.name.toLowerCase().includes(keyword) ||
      c.slug.toLowerCase().includes(keyword)
    );
  });

  list = [...list].sort((a, b) => {
    if (sort === "name,desc") return b.name.localeCompare(a.name, "vi");
    if (sort === "id,asc") return a.id - b.id;
    if (sort === "id,desc") return b.id - a.id;
    return a.name.localeCompare(b.name, "vi");
  });

  return paginate(list.map(toAdminCategory), page, size);
}

export function handleAdminCreateCategory(
  authHeader: string | undefined,
  body: Record<string, unknown>
): AdminCategory {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const icon =
    typeof body.icon === "string" && body.icon.trim().length > 0
      ? body.icon.trim().toLowerCase()
      : null;

  const fields: Record<string, string> = {};
  if (!name) fields.name = "Vui lòng nhập tên danh mục.";
  else if (name.length > 100) fields.name = "Tên danh mục tối đa 100 ký tự.";

  if (!slug) fields.slug = "Vui lòng nhập slug danh mục.";
  else if (!SLUG_REGEX.test(slug)) {
    fields.slug = "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.";
  } else if (db.categories.some((c) => c.slug.toLowerCase() === slug)) {
    fields.slug = "Slug này đã tồn tại.";
  }

  if (Object.keys(fields).length > 0) {
    throw mockError("VALIDATION_ERROR", "Dữ liệu danh mục không hợp lệ.", { fields });
  }

  const created = {
    id: db.nextIds.category++,
    name,
    slug,
    icon,
  };
  db.categories.push(created);
  persistMockDb();

  return toAdminCategory(created);
}

export function handleAdminUpdateCategory(
  categoryId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): AdminCategory {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const category = db.categories.find((c) => c.id === categoryId);
  if (!category) {
    throw mockError("NOT_FOUND", "Không tìm thấy danh mục.");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const icon =
    typeof body.icon === "string" && body.icon.trim().length > 0
      ? body.icon.trim().toLowerCase()
      : null;

  const fields: Record<string, string> = {};
  if (!name) fields.name = "Vui lòng nhập tên danh mục.";
  else if (name.length > 100) fields.name = "Tên danh mục tối đa 100 ký tự.";

  if (!slug) fields.slug = "Vui lòng nhập slug danh mục.";
  else if (!SLUG_REGEX.test(slug)) {
    fields.slug = "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.";
  } else if (
    db.categories.some(
      (c) => c.id !== categoryId && c.slug.toLowerCase() === slug
    )
  ) {
    fields.slug = "Slug này đã tồn tại.";
  }

  if (Object.keys(fields).length > 0) {
    throw mockError("VALIDATION_ERROR", "Dữ liệu danh mục không hợp lệ.", { fields });
  }

  category.name = name;
  category.slug = slug;
  category.icon = icon;
  persistMockDb();

  return toAdminCategory(category);
}

export function handleAdminDeleteCategory(
  categoryId: number,
  authHeader: string | undefined
): null {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const idx = db.categories.findIndex((c) => c.id === categoryId);
  if (idx === -1) {
    throw mockError("NOT_FOUND", "Không tìm thấy danh mục.");
  }

  const inUse = db.products.some((p) => p.categoryId === categoryId);
  if (inUse) {
    throw mockError(
      "CATEGORY_IN_USE",
      "Không thể xóa danh mục đang có sản phẩm sử dụng."
    );
  }

  db.categories.splice(idx, 1);
  persistMockDb();
  return null;
}

// --------------------------------------------------
// 54. Admin Statistics
// --------------------------------------------------
export function handleAdminGetStatistics(
  authHeader: string | undefined
): AdminStatistics {
  requireMockAuth(authHeader, [UserRole.ADMIN]);
  const db = getMockDb();

  const auctionsByStatus: Record<AuctionStatus, number> = {
    [AuctionStatus.SCHEDULED]: 0,
    [AuctionStatus.ACTIVE]: 0,
    [AuctionStatus.ENDED]: 0,
    [AuctionStatus.UNSOLD]: 0,
    [AuctionStatus.CANCELLED]: 0,
  };
  for (const auction of db.auctions) {
    auctionsByStatus[auction.status] += 1;
  }

  const ordersByStatus: Record<OrderStatus, number> = {
    [OrderStatus.PENDING_PAYMENT]: 0,
    [OrderStatus.PAID]: 0,
    [OrderStatus.SHIPPING]: 0,
    [OrderStatus.COMPLETED]: 0,
    [OrderStatus.CANCELLED]: 0,
    [OrderStatus.EXPIRED]: 0,
  };
  let completedOrderValue = 0;
  for (const order of db.orders) {
    ordersByStatus[order.status] += 1;
    if (order.status === OrderStatus.COMPLETED) {
      completedOrderValue += order.finalPrice;
    }
  }

  const totalUsers = db.users.length;
  const bannedUsers = db.users.filter((u) => u.status === UserStatus.BANNED).length;
  const pendingReports = db.reports.filter(
    (r) => r.status === ReportStatus.PENDING
  ).length;

  return {
    totalUsers,
    bannedUsers,
    auctionsByStatus,
    ordersByStatus,
    completedOrderValue,
    pendingReports,
  };
}
