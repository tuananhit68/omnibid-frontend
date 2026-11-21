import { dayjs, formatDateTime, VIETNAM_TIMEZONE } from "@/lib/format";
import {
  AuctionStatus,
  NotificationType,
  OrderStatus,
  ProductStatus,
  UserStatus,
} from "@/types/enums";
import { getMockDb, maskBidderName, mockNowIso, mockNowMs, persistMockDb } from "./db";
import { computeMinNextBid, computeReserveStatus } from "./seed";
import { publishAuctionEvent } from "./ws-bus";

let schedulerTimer: number | null = null;

/**
 * Chạy các tác vụ nền theo thời gian giả lập:
 * - SCHEDULED -> ACTIVE khi đến startTime
 * - ACTIVE -> ENDED/UNSOLD khi quá endTime (BR-09)
 * - PENDING_PAYMENT -> EXPIRED khi quá paymentDeadline
 * - SHIPPING -> COMPLETED khi quá confirmDeadline
 */
export function tickMockScheduler(): boolean {
  const db = getMockDb();
  const now = mockNowMs();
  const nowIso = mockNowIso();
  let changed = false;

  // 1. Mở phiên SCHEDULED đã đến giờ
  for (const auction of db.auctions) {
    if (
      auction.status === AuctionStatus.SCHEDULED &&
      Date.parse(auction.startTime) <= now
    ) {
      auction.status = AuctionStatus.ACTIVE;
      changed = true;
      const highestUser = auction.highestBidderId
        ? db.users.find((u) => u.id === auction.highestBidderId)
        : null;
      publishAuctionEvent({
        type: "AUCTION_STARTED",
        auctionId: auction.id,
        status: auction.status,
        currentPrice: auction.currentPrice,
        minNextBid: computeMinNextBid(auction),
        bidCount: auction.bidCount,
        highestBidderName: highestUser ? maskBidderName(highestUser.fullName) : null,
        reserveStatus: computeReserveStatus(
          auction.reservePrice,
          auction.currentPrice,
          auction.bidCount
        ),
        startTime: auction.startTime,
        endTime: auction.endTime,
        createdAt: nowIso,
      });
    }
  }

  // 2. Chốt phiên ACTIVE đã hết giờ (BR-09)
  for (const auction of db.auctions) {
    if (
      auction.status === AuctionStatus.ACTIVE &&
      Date.parse(auction.endTime) <= now
    ) {
      const product = db.products.find((p) => p.id === auction.productId);
      const reserveStatus = computeReserveStatus(
        auction.reservePrice,
        auction.currentPrice,
        auction.bidCount
      );
      const highestUserForClose = auction.highestBidderId
        ? db.users.find((u) => u.id === auction.highestBidderId)
        : null;
      const hasWinner =
        auction.bidCount > 0 &&
        auction.highestBidderId !== null &&
        highestUserForClose?.status === UserStatus.ACTIVE &&
        reserveStatus !== "NOT_MET";

      auction.closedAt = nowIso;

      if (hasWinner && auction.highestBidderId !== null) {
        auction.status = AuctionStatus.ENDED;
        auction.winnerId = auction.highestBidderId;
        auction.finalPrice = auction.currentPrice;

        if (product && product.status !== ProductStatus.HIDDEN) {
          product.status = ProductStatus.RESERVED;
          product.updatedAt = nowIso;
        }

        const orderId = db.nextIds.order++;
        const paymentDeadline = dayjs(now + 48 * 3600_000)
          .tz(VIETNAM_TIMEZONE)
          .format();

        db.orders.push({
          id: orderId,
          auctionId: auction.id,
          productId: auction.productId,
          buyerId: auction.winnerId,
          sellerId: auction.sellerId,
          finalPrice: auction.currentPrice,
          status: OrderStatus.PENDING_PAYMENT,
          shippingAddress: null,
          phoneNumber: null,
          trackingCode: null,
          paymentDeadline,
          confirmDeadline: null,
          paidAt: null,
          shippedAt: null,
          completedAt: null,
          cancelledAt: null,
          cancelReason: null,
          createdAt: nowIso,
        });

        // Thông báo AUCTION_RESULT cho người thắng (kèm hạn thanh toán) và người bán — BR §7
        db.notifications.push({
          id: db.nextIds.notification++,
          userId: auction.winnerId,
          type: NotificationType.AUCTION_RESULT,
          title: "Chúc mừng bạn đã thắng phiên đấu giá",
          content: `Bạn đã thắng phiên ${product?.title ?? `AUC-${auction.id}`} (đơn ORD-${orderId}). Vui lòng thanh toán trước ${formatDateTime(paymentDeadline)}.`,
          refType: "AUCTION",
          refId: auction.id,
          isRead: false,
          createdAt: nowIso,
        });
        db.notifications.push({
          id: db.nextIds.notification++,
          userId: auction.sellerId,
          type: NotificationType.AUCTION_RESULT,
          title: "Phiên đấu giá đã có người thắng",
          content: `Phiên AUC-${auction.id} kết thúc thành công và đã tạo đơn hàng ORD-${orderId}.`,
          refType: "AUCTION",
          refId: auction.id,
          isRead: false,
          createdAt: nowIso,
        });
      } else {
        auction.status = AuctionStatus.UNSOLD;
        auction.winnerId = null;
        auction.finalPrice = null;
        if (product && product.status !== ProductStatus.HIDDEN) {
          product.status = ProductStatus.AVAILABLE;
          product.updatedAt = nowIso;
        }
        db.notifications.push({
          id: db.nextIds.notification++,
          userId: auction.sellerId,
          type: NotificationType.AUCTION_RESULT,
          title: "Phiên đấu giá kết thúc không có người thắng",
          content: `Phiên AUC-${auction.id} không có lượt đặt đạt giá sàn.`,
          refType: "AUCTION",
          refId: auction.id,
          isRead: false,
          createdAt: nowIso,
        });
      }

      changed = true;
      const highestUser = auction.highestBidderId
        ? db.users.find((u) => u.id === auction.highestBidderId)
        : null;
      publishAuctionEvent({
        type: "AUCTION_ENDED",
        auctionId: auction.id,
        status: auction.status,
        currentPrice: auction.currentPrice,
        minNextBid: computeMinNextBid(auction),
        bidCount: auction.bidCount,
        highestBidderName: highestUser ? maskBidderName(highestUser.fullName) : null,
        reserveStatus,
        startTime: auction.startTime,
        endTime: auction.endTime,
        createdAt: nowIso,
      });
    }
  }

  // 3. Hết hạn đơn PENDING_PAYMENT
  for (const order of db.orders) {
    if (
      order.status === OrderStatus.PENDING_PAYMENT &&
      Date.parse(order.paymentDeadline) <= now
    ) {
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
      changed = true;
    }
  }

  // 4. Tự hoàn tất đơn SHIPPING quá hạn xác nhận
  for (const order of db.orders) {
    if (
      order.status === OrderStatus.SHIPPING &&
      order.confirmDeadline &&
      Date.parse(order.confirmDeadline) <= now
    ) {
      order.status = OrderStatus.COMPLETED;
      order.completedAt = nowIso;
      const product = db.products.find((p) => p.id === order.productId);
      if (product && product.status !== ProductStatus.HIDDEN) {
        product.status = ProductStatus.SOLD;
        product.updatedAt = nowIso;
      }
      db.notifications.push({
        id: db.nextIds.notification++,
        userId: order.buyerId,
        type: NotificationType.ORDER_UPDATE,
        title: `Đơn hàng ORD-${order.id} đã tự động hoàn tất`,
        content: `Đơn hàng ORD-${order.id} đã hết thời hạn xác nhận nhận hàng và chuyển sang Hoàn tất.`,
        refType: "ORDER",
        refId: order.id,
        isRead: false,
        createdAt: nowIso,
      });
      db.notifications.push({
        id: db.nextIds.notification++,
        userId: order.sellerId,
        type: NotificationType.ORDER_UPDATE,
        title: `Đơn hàng ORD-${order.id} đã hoàn tất`,
        content: `Đơn hàng ORD-${order.id} đã tự động chuyển sang trạng thái Hoàn tất.`,
        refType: "ORDER",
        refId: order.id,
        isRead: false,
        createdAt: nowIso,
      });
      changed = true;
    }
  }

  if (changed) {
    persistMockDb();
  }
  return changed;
}

export function ensureMockSchedulerStarted(): void {
  if (typeof window === "undefined") return;
  if (schedulerTimer !== null) return;
  schedulerTimer = window.setInterval(() => {
    tickMockScheduler();
  }, 5000);
}
