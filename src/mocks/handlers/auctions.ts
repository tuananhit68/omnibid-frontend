import type {
  AuctionDetail,
  AuctionSummary,
  BidHistoryItem,
  MyAuctionItem,
  MyBidItem,
  Page,
  PlaceBidResponse,
} from "@/lib/api/contract";
import {
  AuctionStatus,
  NotificationType,
  ProductStatus,
  UserRole,
} from "@/types/enums";
import { requireMockAuth, resolveOptionalUser } from "../auth";
import { getMockDb, maskBidderName, mockNowIso, mockNowMs, persistMockDb } from "../db";
import { mockError } from "../errors";
import { computeMinNextBid, computeReserveStatus, type MockAuction } from "../seed";
import { publishAuctionEvent } from "../ws-bus";
import { paginate } from "./categories";

const ALLOWED_AUCTION_SORTS = new Set([
  "endTime,asc",
  "createdAt,desc",
  "currentPrice,asc",
  "currentPrice,desc",
]);

function toAuctionSummary(auction: MockAuction): AuctionSummary {
  const db = getMockDb();
  const product = db.products.find((p) => p.id === auction.productId);
  const category = db.categories.find((c) => c.id === product?.categoryId);
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
  };
}

export function handleGetAuctions(params: URLSearchParams): Page<AuctionSummary> {
  const db = getMockDb();
  const keyword = (params.get("keyword") ?? "").trim().toLowerCase();
  const categoryIdParam = params.get("categoryId");
  const minPriceParam = params.get("minPrice");
  const maxPriceParam = params.get("maxPrice");
  const statusParam = params.get("status");
  const endBeforeParam = params.get("endBefore");
  const sort = params.get("sort") || "endTime,asc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "12");

  if (!ALLOWED_AUCTION_SORTS.has(sort)) {
    throw mockError("VALIDATION_ERROR", "Tham số sắp xếp không hợp lệ", {
      fields: { sort: "Giá trị sort không nằm trong danh sách cho phép" },
    });
  }

  let list = db.auctions.filter((a) => {
    const product = db.products.find((p) => p.id === a.productId);
    if (!product || product.status === ProductStatus.HIDDEN) return false;

    if (keyword && !product.title.toLowerCase().includes(keyword)) {
      return false;
    }
    if (categoryIdParam && product.categoryId !== Number(categoryIdParam)) {
      return false;
    }
    if (minPriceParam && a.currentPrice < Number(minPriceParam)) {
      return false;
    }
    if (maxPriceParam && a.currentPrice > Number(maxPriceParam)) {
      return false;
    }
    if (statusParam && a.status !== statusParam) {
      return false;
    }
    if (endBeforeParam) {
      const endBeforeMs = Date.parse(endBeforeParam);
      if (!Number.isNaN(endBeforeMs) && Date.parse(a.endTime) > endBeforeMs) {
        return false;
      }
    }
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "createdAt,desc":
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      case "currentPrice,asc":
        return a.currentPrice - b.currentPrice;
      case "currentPrice,desc":
        return b.currentPrice - a.currentPrice;
      case "endTime,asc":
      default:
        return Date.parse(a.endTime) - Date.parse(b.endTime);
    }
  });

  return paginate(list.map(toAuctionSummary), page, size);
}

export function handleGetAuctionDetail(
  auctionId: number,
  authHeader?: string
): AuctionDetail {
  const db = getMockDb();
  const viewer = resolveOptionalUser(authHeader);
  const auction = db.auctions.find((a) => a.id === auctionId);
  if (!auction) throw mockError("NOT_FOUND");

  const product = db.products.find((p) => p.id === auction.productId);
  if (
    !product ||
    (product.status === ProductStatus.HIDDEN && viewer?.role !== UserRole.ADMIN)
  ) {
    throw mockError("NOT_FOUND");
  }

  const seller = db.users.find((u) => u.id === auction.sellerId);
  const highestUser = auction.highestBidderId
    ? db.users.find((u) => u.id === auction.highestBidderId)
    : null;
  const winner = auction.winnerId
    ? db.users.find((u) => u.id === auction.winnerId)
    : null;

  const viewerIsSeller = viewer?.id === auction.sellerId;
  const viewerIsLeading = viewer !== null && viewer.id === auction.highestBidderId;
  const order = db.orders.find((o) => o.auctionId === auction.id);
  const canSeeOrder =
    auction.status === AuctionStatus.ENDED &&
    viewer !== null &&
    (viewer.id === auction.sellerId || viewer.id === auction.winnerId);

  const summary = toAuctionSummary(auction);

  const detail: AuctionDetail = {
    ...summary,
    description: product.description,
    condition: product.condition,
    images: product.images,
    bidIncrement: auction.bidIncrement,
    seller: {
      id: seller?.id ?? auction.sellerId,
      fullName: seller?.fullName ?? "Người bán",
    },
    highestBidderName: highestUser ? maskBidderName(highestUser.fullName) : null,
    viewerIsSeller,
    viewerIsLeading,
    winnerName: winner ? maskBidderName(winner.fullName) : null,
    finalPrice: auction.finalPrice,
    closedAt: auction.closedAt,
    cancelReason: auction.cancelReason,
  };

  if (viewerIsSeller) {
    detail.reservePrice = auction.reservePrice;
  }
  if (canSeeOrder) {
    detail.orderId = order?.id ?? null;
  }

  return detail;
}

export function handleGetAuctionBids(
  auctionId: number,
  params: URLSearchParams,
  authHeader?: string
): Page<BidHistoryItem> {
  const db = getMockDb();
  const viewer = resolveOptionalUser(authHeader);
  const auction = db.auctions.find((a) => a.id === auctionId);
  if (!auction) throw mockError("NOT_FOUND");

  const product = db.products.find((p) => p.id === auction.productId);
  if (
    !product ||
    (product.status === ProductStatus.HIDDEN && viewer?.role !== UserRole.ADMIN)
  ) {
    throw mockError("NOT_FOUND");
  }

  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "10");

  const bids = db.bids
    .filter((b) => b.auctionId === auctionId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map<BidHistoryItem>((b) => {
      const bidder = db.users.find((u) => u.id === b.bidderId);
      return {
        id: b.id,
        amount: b.amount,
        bidderName: maskBidderName(bidder?.fullName ?? "Người dùng"),
        createdAt: b.createdAt,
      };
    });

  return paginate(bids, page, size);
}

/**
 * Đặt giá với một userId cụ thể (dùng cho cả POST /auctions/{id}/bids và /dev/mock).
 */
export function placeMockBidAsUser(
  auctionId: number,
  bidderId: number,
  amount: number
): PlaceBidResponse {
  const db = getMockDb();
  const auction = db.auctions.find((a) => a.id === auctionId);
  if (!auction) throw mockError("NOT_FOUND");

  const product = db.products.find((p) => p.id === auction.productId);
  if (!product || product.status === ProductStatus.HIDDEN) {
    throw mockError("NOT_FOUND");
  }

  const now = mockNowMs();
  if (
    auction.status !== AuctionStatus.ACTIVE ||
    Date.parse(auction.endTime) <= now
  ) {
    throw mockError("AUCTION_NOT_ACTIVE");
  }

  if (auction.sellerId === bidderId) {
    throw mockError("SELF_BID_NOT_ALLOWED");
  }

  if (auction.highestBidderId === bidderId) {
    throw mockError("ALREADY_LEADING");
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    throw mockError("VALIDATION_ERROR", "Số tiền đặt giá phải là số nguyên dương", {
      fields: { amount: "Mức giá không hợp lệ" },
    });
  }

  const minNextBid = computeMinNextBid(auction);
  if (amount < minNextBid) {
    throw mockError("BID_TOO_LOW", "Mức giá đặt thấp hơn mức tối thiểu", {
      minNextBid,
    });
  }

  const previousHighestId = auction.highestBidderId;
  const nowIso = mockNowIso();
  const bidId = db.nextIds.bid++;

  db.bids.push({
    id: bidId,
    auctionId,
    bidderId,
    amount,
    createdAt: nowIso,
  });

  auction.currentPrice = amount;
  auction.bidCount += 1;
  auction.highestBidderId = bidderId;

  const newMinNextBid = computeMinNextBid(auction);
  const bidder = db.users.find((u) => u.id === bidderId);
  const maskedBidder = maskBidderName(bidder?.fullName ?? "Người dùng");

  // Sinh thông báo OUTBID cho người dẫn đầu cũ
  if (previousHighestId && previousHighestId !== bidderId) {
    db.notifications.push({
      id: db.nextIds.notification++,
      userId: previousHighestId,
      type: NotificationType.OUTBID,
      title: "Bạn vừa bị vượt giá",
      content: `Phiên ${product.title} vừa có mức giá mới ${amount.toLocaleString("vi-VN")} ₫.`,
      refType: "AUCTION",
      refId: auction.id,
      isRead: false,
      createdAt: nowIso,
    });
  }

  persistMockDb();

  // Phát sự kiện realtime trên mock bus
  publishAuctionEvent({
    type: "BID_PLACED",
    auctionId: auction.id,
    status: auction.status,
    currentPrice: auction.currentPrice,
    minNextBid: newMinNextBid,
    bidCount: auction.bidCount,
    highestBidderName: maskedBidder,
    reserveStatus: computeReserveStatus(
      auction.reservePrice,
      auction.currentPrice,
      auction.bidCount
    ),
    startTime: auction.startTime,
    endTime: auction.endTime,
    bid: {
      id: bidId,
      amount,
      bidderName: maskedBidder,
      createdAt: nowIso,
    },
    createdAt: nowIso,
  });

  return {
    bidId,
    auctionId: auction.id,
    amount,
    currentPrice: auction.currentPrice,
    bidCount: auction.bidCount,
    minNextBid: newMinNextBid,
  };
}

export function handlePlaceBid(
  auctionId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): PlaceBidResponse {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const amount = Number(body.amount);
  return placeMockBidAsUser(auctionId, user.id, amount);
}

export function handleGetMyBids(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<MyBidItem> {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();
  const auctionIdParam = params.get("auctionId");
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "10");

  const myBids = db.bids
    .filter(
      (b) =>
        b.bidderId === user.id &&
        (!auctionIdParam || b.auctionId === Number(auctionIdParam))
    )
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map<MyBidItem>((b) => {
      const auction = db.auctions.find((a) => a.id === b.auctionId);
      const product = auction
        ? db.products.find((p) => p.id === auction.productId)
        : null;
      const primaryImage =
        product?.images.find((i) => i.isPrimary)?.imageUrl ??
        product?.images[0]?.imageUrl ??
        null;
      const order =
        auction?.status === AuctionStatus.ENDED && auction.winnerId === user.id
          ? db.orders.find((o) => o.auctionId === auction.id)
          : null;

      return {
        id: b.id,
        auctionId: b.auctionId,
        title: product?.title ?? `Phiên #${b.auctionId}`,
        primaryImageUrl: primaryImage,
        amount: b.amount,
        createdAt: b.createdAt,
        auctionStatus: auction?.status ?? AuctionStatus.ENDED,
        currentPrice: auction?.currentPrice ?? b.amount,
        endTime: auction?.endTime ?? b.createdAt,
        leading: auction?.highestBidderId === user.id,
        orderId: order?.id ?? null,
      };
    });

  return paginate(myBids, page, size);
}

const MIN_AUCTION_DURATION_MS = 60 * 60 * 1000;
const MAX_AUCTION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function validateAuctionParams(body: Record<string, unknown>): {
  startPrice: number;
  bidIncrement: number;
  reservePrice: number | null;
  startTime: string;
  endTime: string;
} {
  const fields: Record<string, string> = {};
  const startPrice = Number(body.startPrice);
  const bidIncrement = Number(body.bidIncrement);
  const rawReserve = body.reservePrice;
  const reservePrice =
    rawReserve === undefined || rawReserve === null || rawReserve === ""
      ? null
      : Number(rawReserve);
  const startTime = typeof body.startTime === "string" ? body.startTime.trim() : "";
  const endTime = typeof body.endTime === "string" ? body.endTime.trim() : "";

  if (!Number.isInteger(startPrice) || startPrice <= 0) {
    fields.startPrice = "Giá khởi điểm phải là số nguyên lớn hơn 0";
  }
  if (!Number.isInteger(bidIncrement) || bidIncrement <= 0) {
    fields.bidIncrement = "Bước giá phải là số nguyên lớn hơn 0";
  }
  if (reservePrice !== null) {
    if (!Number.isInteger(reservePrice) || reservePrice <= 0) {
      fields.reservePrice = "Giá sàn phải là số nguyên dương";
    } else if (Number.isInteger(startPrice) && reservePrice < startPrice) {
      fields.reservePrice = "Giá sàn phải lớn hơn hoặc bằng giá khởi điểm";
    }
  }

  const now = mockNowMs();
  const startMs = Date.parse(startTime);
  const endMs = Date.parse(endTime);

  if (!startTime || Number.isNaN(startMs)) {
    fields.startTime = "Thời gian bắt đầu không hợp lệ";
  } else if (startMs <= now) {
    fields.startTime = "Thời gian bắt đầu phải ở tương lai";
  }

  if (!endTime || Number.isNaN(endMs)) {
    fields.endTime = "Thời gian kết thúc không hợp lệ";
  } else if (!Number.isNaN(startMs)) {
    if (endMs <= startMs) {
      fields.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
    } else {
      const duration = endMs - startMs;
      if (duration < MIN_AUCTION_DURATION_MS) {
        fields.endTime = "Thời lượng phiên tối thiểu là 1 giờ";
      } else if (duration > MAX_AUCTION_DURATION_MS) {
        fields.endTime = "Thời lượng phiên tối đa là 30 ngày";
      }
    }
  }

  if (Object.keys(fields).length > 0) {
    throw mockError("VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ", { fields });
  }

  return { startPrice, bidIncrement, reservePrice, startTime, endTime };
}

export function handleGetMyAuctions(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<MyAuctionItem> {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const statusParam = params.get("status");
  const keyword = (params.get("keyword") ?? "").trim().toLowerCase();
  const sort = params.get("sort") || "createdAt,desc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "10");

  let list = db.auctions.filter((a) => {
    if (a.sellerId !== user.id) return false;
    if (statusParam && a.status !== statusParam) return false;
    if (keyword) {
      const product = db.products.find((p) => p.id === a.productId);
      if (!product || !product.title.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "endTime,asc":
        return Date.parse(a.endTime) - Date.parse(b.endTime);
      case "currentPrice,desc":
        return b.currentPrice - a.currentPrice;
      case "currentPrice,asc":
        return a.currentPrice - b.currentPrice;
      case "createdAt,desc":
      default:
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }
  });

  const mapped: MyAuctionItem[] = list.map((auction) => {
    const summary = toAuctionSummary(auction);
    const order =
      auction.status === AuctionStatus.ENDED
        ? db.orders.find((o) => o.auctionId === auction.id)
        : null;
    return {
      ...summary,
      reservePrice: auction.reservePrice,
      orderId: order?.id ?? null,
    };
  });

  return paginate(mapped, page, size);
}

export function handleCreateAuction(
  authHeader: string | undefined,
  body: Record<string, unknown>
): AuctionDetail {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const productId = Number(body.productId);
  if (!Number.isInteger(productId) || productId <= 0) {
    throw mockError("VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ", {
      fields: { productId: "Sản phẩm không hợp lệ" },
    });
  }

  const product = db.products.find((p) => p.id === productId);
  if (!product) throw mockError("NOT_FOUND");
  if (product.sellerId !== user.id) throw mockError("FORBIDDEN");

  const hasActiveAuction = db.auctions.some(
    (a) =>
      a.productId === productId &&
      (a.status === AuctionStatus.SCHEDULED || a.status === AuctionStatus.ACTIVE)
  );
  if (hasActiveAuction) {
    throw mockError("CONFLICT", "Sản phẩm đang có phiên đấu giá hoạt động");
  }
  if (product.status !== ProductStatus.AVAILABLE) {
    throw mockError("PRODUCT_NOT_AVAILABLE");
  }

  const validated = validateAuctionParams(body);
  const nowIso = mockNowIso();
  const auctionId = db.nextIds.auction++;

  const created: MockAuction = {
    id: auctionId,
    productId: product.id,
    sellerId: user.id,
    status: AuctionStatus.SCHEDULED,
    startPrice: validated.startPrice,
    bidIncrement: validated.bidIncrement,
    reservePrice: validated.reservePrice,
    currentPrice: validated.startPrice,
    bidCount: 0,
    highestBidderId: null,
    winnerId: null,
    finalPrice: null,
    startTime: validated.startTime,
    endTime: validated.endTime,
    closedAt: null,
    cancelReason: null,
    createdAt: nowIso,
  };

  db.auctions.unshift(created);
  product.status = ProductStatus.IN_AUCTION;
  product.everAuctioned = true;
  product.updatedAt = nowIso;

  persistMockDb();
  return handleGetAuctionDetail(auctionId, authHeader);
}

export function handleUpdateAuction(
  auctionId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): AuctionDetail {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const auction = db.auctions.find((a) => a.id === auctionId);
  if (!auction) throw mockError("NOT_FOUND");
  if (auction.sellerId !== user.id) throw mockError("FORBIDDEN");
  if (auction.status !== AuctionStatus.SCHEDULED) {
    throw mockError("AUCTION_NOT_EDITABLE");
  }

  const validated = validateAuctionParams(body);
  auction.startPrice = validated.startPrice;
  auction.currentPrice = validated.startPrice;
  auction.bidIncrement = validated.bidIncrement;
  auction.reservePrice = validated.reservePrice;
  auction.startTime = validated.startTime;
  auction.endTime = validated.endTime;

  persistMockDb();

  publishAuctionEvent({
    type: "AUCTION_UPDATED",
    auctionId: auction.id,
    status: auction.status,
    currentPrice: auction.currentPrice,
    minNextBid: computeMinNextBid(auction),
    bidCount: auction.bidCount,
    highestBidderName: null,
    reserveStatus: computeReserveStatus(
      auction.reservePrice,
      auction.currentPrice,
      auction.bidCount
    ),
    startTime: auction.startTime,
    endTime: auction.endTime,
    createdAt: mockNowIso(),
  });

  return handleGetAuctionDetail(auction.id, authHeader);
}

export function handleCancelAuction(
  auctionId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): AuctionDetail {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const auction = db.auctions.find((a) => a.id === auctionId);
  if (!auction) throw mockError("NOT_FOUND");
  if (auction.sellerId !== user.id) throw mockError("FORBIDDEN");

  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  if (reason.length < 3) {
    throw mockError("VALIDATION_ERROR", "Vui lòng nhập lý do hủy phiên", {
      fields: { reason: "Lý do hủy phiên tối thiểu 3 ký tự" },
    });
  }

  if (auction.status === AuctionStatus.ACTIVE && auction.bidCount > 0) {
    throw mockError("CANNOT_CANCEL");
  }

  if (
    auction.status !== AuctionStatus.SCHEDULED &&
    auction.status !== AuctionStatus.ACTIVE
  ) {
    throw mockError(
      "INVALID_STATUS_TRANSITION",
      "Chỉ có thể hủy phiên ở trạng thái Sắp diễn ra hoặc Đang diễn ra chưa có lượt đặt giá"
    );
  }

  const nowIso = mockNowIso();
  auction.status = AuctionStatus.CANCELLED;
  auction.cancelReason = reason;
  auction.closedAt = nowIso;

  const product = db.products.find((p) => p.id === auction.productId);
  if (product && product.status === ProductStatus.IN_AUCTION) {
    product.status = ProductStatus.AVAILABLE;
    product.updatedAt = nowIso;
  }

  persistMockDb();

  publishAuctionEvent({
    type: "AUCTION_CANCELLED",
    auctionId: auction.id,
    status: auction.status,
    currentPrice: auction.currentPrice,
    minNextBid: computeMinNextBid(auction),
    bidCount: auction.bidCount,
    highestBidderName: null,
    reserveStatus: computeReserveStatus(
      auction.reservePrice,
      auction.currentPrice,
      auction.bidCount
    ),
    startTime: auction.startTime,
    endTime: auction.endTime,
    createdAt: nowIso,
  });

  return handleGetAuctionDetail(auction.id, authHeader);
}
