import { dayjs, VIETNAM_TIMEZONE } from "@/lib/format";
import {
  AuctionStatus,
  NotificationType,
  OrderStatus,
  PaymentStatus,
  ProductCondition,
  ProductStatus,
  ReportStatus,
  ReserveStatus,
  UserRole,
  UserStatus,
} from "@/types/enums";
import type { Category, ProductImage } from "@/lib/api/contract";

export interface MockUser {
  id: number;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  address: string | null;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string | null;
  tokenVersion: number;
  createdAt: string;
}

export interface MockProduct {
  id: number;
  sellerId: number;
  categoryId: number;
  title: string;
  description: string;
  condition: ProductCondition;
  status: ProductStatus;
  images: ProductImage[];
  everAuctioned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockAuction {
  id: number;
  productId: number;
  sellerId: number;
  status: AuctionStatus;
  startPrice: number;
  bidIncrement: number;
  reservePrice: number | null;
  currentPrice: number;
  bidCount: number;
  highestBidderId: number | null;
  winnerId: number | null;
  finalPrice: number | null;
  startTime: string;
  endTime: string;
  closedAt: string | null;
  cancelReason: string | null;
  createdAt: string;
}

export interface MockBid {
  id: number;
  auctionId: number;
  bidderId: number;
  amount: number;
  createdAt: string;
}

export interface MockOrder {
  id: number;
  auctionId: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  finalPrice: number;
  status: OrderStatus;
  shippingAddress: string | null;
  phoneNumber: string | null;
  trackingCode: string | null;
  paymentDeadline: string;
  confirmDeadline: string | null;
  paidAt: string | null;
  shippedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
}

export interface MockPayment {
  id: number;
  orderId: number;
  attemptNo: number;
  amount: number;
  method: "MOCK_CARD";
  status: PaymentStatus;
  failureReason: string | null;
  idempotencyKey: string;
  createdAt: string;
  paidAt: string | null;
}

export interface MockNotification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  content: string;
  refType: "AUCTION" | "ORDER" | "REPORT" | null;
  refId: number | null;
  isRead: boolean;
  createdAt: string;
}

export interface MockReport {
  id: number;
  reporterId: number;
  reportedProductId: number | null;
  reportedUserId: number | null;
  reportedOrderId: number | null;
  reason: string;
  status: ReportStatus;
  adminNote: string | null;
  resolvedById: number | null;
  resolvedAt: string | null;
  createdAt: string;
}

export interface MockDatabase {
  clockOffsetMs: number;
  defaultPaymentOutcome: PaymentStatus;
  nextIds: {
    user: number;
    category: number;
    product: number;
    productImage: number;
    auction: number;
    bid: number;
    order: number;
    payment: number;
    notification: number;
    report: number;
  };
  users: MockUser[];
  categories: Category[];
  products: MockProduct[];
  auctions: MockAuction[];
  bids: MockBid[];
  orders: MockOrder[];
  payments: MockPayment[];
  notifications: MockNotification[];
  reports: MockReport[];
}

/**
 * Tạo ảnh minh họa trung tính bằng SVG data URL (không ảnh thương hiệu, không ảnh người thật).
 */
export function makeNeutralSvgDataUrl(
  title: string,
  subtitle: string,
  accentHex = "#1d4ed8",
  bgHex = "#e9edff"
): string {
  const safeTitle = title.replace(/[<>&"']/g, "");
  const safeSub = subtitle.replace(/[<>&"']/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="${bgHex}"/>
  <rect x="64" y="64" width="672" height="472" rx="24" fill="#ffffff" stroke="#e2e7ff" stroke-width="4"/>
  <circle cx="400" cy="240" r="76" fill="${bgHex}"/>
  <rect x="364" y="204" width="72" height="72" rx="16" fill="${accentHex}"/>
  <text x="400" y="368" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="700" fill="#131b2e">${safeTitle}</text>
  <text x="400" y="410" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#515f74">${safeSub}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function isoAtOffset(baseMs: number, offsetMinutes: number): string {
  return dayjs(baseMs + offsetMinutes * 60_000)
    .tz(VIETNAM_TIMEZONE)
    .format();
}

export function computeReserveStatus(
  reservePrice: number | null,
  currentPrice: number,
  bidCount: number
): ReserveStatus {
  if (reservePrice === null || reservePrice <= 0) {
    return ReserveStatus.NO_RESERVE;
  }
  if (bidCount > 0 && currentPrice >= reservePrice) {
    return ReserveStatus.MET;
  }
  return ReserveStatus.NOT_MET;
}

export function computeMinNextBid(auction: MockAuction): number {
  if (auction.bidCount === 0) return auction.startPrice;
  return auction.currentPrice + auction.bidIncrement;
}

export function createSeedDatabase(baseMs = Date.now()): MockDatabase {
  const t = (mins: number) => isoAtOffset(baseMs, mins);

  const users: MockUser[] = [
    {
      id: 1,
      fullName: "Quản trị OmniBid",
      email: "admin@omnibid.local",
      password: "Admin@123456",
      phoneNumber: "0901000001",
      address: "Quận 1, TP. Hồ Chí Minh",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      avatarUrl: null,
      tokenVersion: 1,
      createdAt: t(-60 * 24 * 60),
    },
    {
      id: 2,
      fullName: "Trần Minh Quân",
      email: "seller@omnibid.local",
      password: "Demo@1234",
      phoneNumber: "0902000002",
      address: "123 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      avatarUrl: null,
      tokenVersion: 1,
      createdAt: t(-45 * 24 * 60),
    },
    {
      id: 3,
      fullName: "Nguyễn Thị Lan Anh",
      email: "buyer1@omnibid.local",
      password: "Demo@1234",
      phoneNumber: "0903000003",
      address: "45 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      avatarUrl: null,
      tokenVersion: 1,
      createdAt: t(-30 * 24 * 60),
    },
    {
      id: 4,
      fullName: "Lê Hoàng Nam",
      email: "buyer2@omnibid.local",
      password: "Demo@1234",
      phoneNumber: "0904000004",
      address: "88 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh",
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      avatarUrl: null,
      tokenVersion: 1,
      createdAt: t(-20 * 24 * 60),
    },
    {
      id: 5,
      fullName: "Phạm Văn Khóa",
      email: "banned@omnibid.local",
      password: "Demo@1234",
      phoneNumber: "0905000005",
      address: "12 Pasteur, Quận 1, TP. Hồ Chí Minh",
      role: UserRole.USER,
      status: UserStatus.BANNED,
      avatarUrl: null,
      tokenVersion: 2,
      createdAt: t(-15 * 24 * 60),
    },
  ];

  const categories: Category[] = [
    { id: 1, name: "Đồng hồ", slug: "dong-ho", icon: "watch" },
    { id: 2, name: "Máy ảnh", slug: "may-anh", icon: "camera" },
    { id: 3, name: "Điện thoại", slug: "dien-thoai", icon: "smartphone" },
    { id: 4, name: "Sách", slug: "sach", icon: "book-open" },
    { id: 5, name: "Đồ sưu tầm", slug: "do-suu-tam", icon: "gem" },
    { id: 6, name: "Thời trang", slug: "thoi-trang", icon: "shirt" },
  ];

  const products: MockProduct[] = [
    {
      id: 1,
      sellerId: 2,
      categoryId: 1,
      title: "Đồng hồ cơ lộ máy dây da cổ điển",
      description:
        "Đồng hồ cơ tự động mặt kính sapphire, đường kính 40mm, dây da bò màu nâu. Bảo dưỡng định kỳ, hoạt động chuẩn xác, kèm hộp gỗ.",
      condition: ProductCondition.LIKE_NEW,
      status: ProductStatus.IN_AUCTION,
      images: [
        {
          id: 1,
          imageUrl: makeNeutralSvgDataUrl("Đồng hồ cơ 40mm", "Ảnh chính • Mặt trước"),
          isPrimary: true,
        },
        {
          id: 2,
          imageUrl: makeNeutralSvgDataUrl("Đồng hồ cơ 40mm", "Mặt sau lộ máy", "#0037b0", "#f2f3ff"),
          isPrimary: false,
        },
      ],
      everAuctioned: true,
      createdAt: t(-7 * 24 * 60),
      updatedAt: t(-1 * 24 * 60),
    },
    {
      id: 2,
      sellerId: 2,
      categoryId: 2,
      title: "Máy ảnh film 35mm kèm ống kính 50mm f/1.8",
      description:
        "Thân máy hợp kim nguyên khối, đo sáng hoạt động tốt, màn trập chính xác ở mọi tốc độ. Ống kính sạch, không mốc rễ.",
      condition: ProductCondition.GOOD,
      status: ProductStatus.IN_AUCTION,
      images: [
        {
          id: 3,
          imageUrl: makeNeutralSvgDataUrl("Máy ảnh film 35mm", "Ống kính 50mm f/1.8"),
          isPrimary: true,
        },
      ],
      everAuctioned: true,
      createdAt: t(-6 * 24 * 60),
      updatedAt: t(-2 * 24 * 60),
    },
    {
      id: 3,
      sellerId: 2,
      categoryId: 3,
      title: "Điện thoại thông minh 256GB bản quốc tế",
      description:
        "Máy nguyên bản chưa qua sửa chữa, pin 94%, màn hình không trầy xước. Tặng kèm ốp lưng và cáp sạc nhanh.",
      condition: ProductCondition.LIKE_NEW,
      status: ProductStatus.IN_AUCTION,
      images: [
        {
          id: 4,
          imageUrl: makeNeutralSvgDataUrl("Điện thoại 256GB", "Bản quốc tế • Pin 94%"),
          isPrimary: true,
        },
      ],
      everAuctioned: true,
      createdAt: t(-5 * 24 * 60),
      updatedAt: t(-1 * 24 * 60),
    },
    {
      id: 4,
      sellerId: 2,
      categoryId: 4,
      title: "Bộ sách văn học bìa cứng in giới hạn 3 tập",
      description:
        "Ấn bản đánh số thứ tự 142/500, giấy kem chống lóa, còn nguyên hộp cứng bảo vệ và dấu triện nhà xuất bản.",
      condition: ProductCondition.NEW,
      status: ProductStatus.IN_AUCTION,
      images: [
        {
          id: 5,
          imageUrl: makeNeutralSvgDataUrl("Bộ sách bìa cứng", "Ấn bản giới hạn 3 tập"),
          isPrimary: true,
        },
      ],
      everAuctioned: true,
      createdAt: t(-4 * 24 * 60),
      updatedAt: t(-12 * 60),
    },
    {
      id: 5,
      sellerId: 2,
      categoryId: 5,
      title: "Bộ tem bưu chính kỷ niệm thập niên 1980",
      description:
        "Gồm 24 mẫu tem nguyên bộ chưa qua sử dụng, bảo quản trong sổ kẹp chuyên dụng không ố vàng.",
      condition: ProductCondition.GOOD,
      status: ProductStatus.IN_AUCTION,
      images: [
        {
          id: 6,
          imageUrl: makeNeutralSvgDataUrl("Bộ tem kỷ niệm 1980", "24 mẫu nguyên bộ"),
          isPrimary: true,
        },
      ],
      everAuctioned: true,
      createdAt: t(-3 * 24 * 60),
      updatedAt: t(-6 * 60),
    },
    {
      id: 6,
      sellerId: 2,
      categoryId: 6,
      title: "Áo khoác dạ dáng dài thủ công cỡ M",
      description:
        "Chất liệu len dạ dày dặn giữ ấm tốt, đường may tỉ mỉ, màu xanh navy trung tính dễ phối đồ.",
      condition: ProductCondition.NEW,
      status: ProductStatus.RESERVED,
      images: [
        {
          id: 7,
          imageUrl: makeNeutralSvgDataUrl("Áo khoác dạ cỡ M", "Len dạ thủ công"),
          isPrimary: true,
        },
      ],
      everAuctioned: true,
      createdAt: t(-10 * 24 * 60),
      updatedAt: t(-2 * 24 * 60),
    },
    {
      id: 7,
      sellerId: 2,
      categoryId: 1,
      title: "Đồng hồ bấm giờ thể thao chống nước 100m",
      description:
        "Vỏ thép không gỉ 42mm, mặt số dạ quang rõ nét, chức năng bấm giờ thể thao chính xác.",
      condition: ProductCondition.GOOD,
      status: ProductStatus.RESERVED,
      images: [
        {
          id: 8,
          imageUrl: makeNeutralSvgDataUrl("Đồng hồ thể thao", "Chống nước 100m"),
          isPrimary: true,
        },
      ],
      everAuctioned: true,
      createdAt: t(-12 * 24 * 60),
      updatedAt: t(-3 * 24 * 60),
    },
    {
      id: 8,
      sellerId: 2,
      categoryId: 2,
      title: "Ống kính góc rộng 24mm f/2.8 ngàm phổ thông",
      description:
        "Ống kính gọn nhẹ chuyên chụp phong cảnh và đường phố, kèm nắp trước sau và loa che nắng.",
      condition: ProductCondition.LIKE_NEW,
      status: ProductStatus.RESERVED,
      images: [
        {
          id: 9,
          imageUrl: makeNeutralSvgDataUrl("Ống kính 24mm f/2.8", "Góc rộng phong cảnh"),
          isPrimary: true,
        },
      ],
      everAuctioned: true,
      createdAt: t(-14 * 24 * 60),
      updatedAt: t(-4 * 24 * 60),
    },
    {
      id: 9,
      sellerId: 2,
      categoryId: 5,
      title: "Bút máy ngòi vàng 14K phiên bản kỷ niệm",
      description:
        "Thân nhựa resin đen bóng, ngòi cỡ M viết êm trơn, kèm hộp trưng bày và lọ mực chính hãng.",
      condition: ProductCondition.NEW,
      status: ProductStatus.SOLD,
      images: [
        {
          id: 10,
          imageUrl: makeNeutralSvgDataUrl("Bút máy ngòi 14K", "Phiên bản kỷ niệm"),
          isPrimary: true,
        },
      ],
      everAuctioned: true,
      createdAt: t(-20 * 24 * 60),
      updatedAt: t(-8 * 24 * 60),
    },
    {
      id: 10,
      sellerId: 2,
      categoryId: 4,
      title: "Tuyển tập bản đồ cổ Đông Dương in khổ lớn",
      description:
        "In trên giấy mỹ thuật dày 250gsm, đóng khung gỗ sồi chắc chắn, phù hợp trưng bày phòng làm việc.",
      condition: ProductCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      images: [
        {
          id: 11,
          imageUrl: makeNeutralSvgDataUrl("Tuyển tập bản đồ cổ", "Khổ lớn • Sẵn sàng"),
          isPrimary: true,
        },
      ],
      everAuctioned: false,
      createdAt: t(-2 * 24 * 60),
      updatedAt: t(-2 * 24 * 60),
    },
    {
      id: 11,
      sellerId: 2,
      categoryId: 6,
      title: "Túi xách da thật thủ công màu nâu cognac",
      description:
        "Da bò nguyên tấm khâu tay hoàn toàn, nhiều ngăn tiện dụng, đựng vừa máy tính xách tay 14 inch.",
      condition: ProductCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      images: [
        {
          id: 12,
          imageUrl: makeNeutralSvgDataUrl("Túi xách da thủ công", "Nâu cognac • 14 inch"),
          isPrimary: true,
        },
      ],
      everAuctioned: true,
      createdAt: t(-9 * 24 * 60),
      updatedAt: t(-3 * 24 * 60),
    },
    {
      id: 12,
      sellerId: 5,
      categoryId: 3,
      title: "Thiết bị điện tử vi phạm mô tả (đã bị ẩn)",
      description: "Sản phẩm không đáp ứng quy định kiểm duyệt của sàn và đã bị quản trị viên ẩn.",
      condition: ProductCondition.POOR,
      status: ProductStatus.HIDDEN,
      images: [
        {
          id: 13,
          imageUrl: makeNeutralSvgDataUrl("Sản phẩm bị ẩn", "Đã ẩn bởi quản trị", "#ba1a1a", "#fef2f2"),
          isPrimary: true,
        },
      ],
      everAuctioned: true,
      createdAt: t(-15 * 24 * 60),
      updatedAt: t(-10 * 24 * 60),
    },
  ];

  // Phiên phủ đủ 5 trạng thái: ACTIVE kết thúc sau 3 phút, ACTIVE chưa đạt giá sàn,
  // ACTIVE đạt giá sàn, ACTIVE không giá sàn, SCHEDULED bắt đầu sau 2 phút, ENDED, UNSOLD, CANCELLED
  const auctions: MockAuction[] = [
    {
      id: 1,
      productId: 1,
      sellerId: 2,
      status: AuctionStatus.ACTIVE,
      startPrice: 4_000_000,
      bidIncrement: 200_000,
      reservePrice: 5_000_000,
      currentPrice: 5_400_000,
      bidCount: 4,
      highestBidderId: 3,
      winnerId: null,
      finalPrice: null,
      startTime: t(-120),
      endTime: t(3), // Kết thúc sau 3 phút để demo chốt phiên
      closedAt: null,
      cancelReason: null,
      createdAt: t(-180),
    },
    {
      id: 2,
      productId: 2,
      sellerId: 2,
      status: AuctionStatus.ACTIVE,
      startPrice: 2_500_000,
      bidIncrement: 100_000,
      reservePrice: 4_000_000, // Chưa đạt giá sàn
      currentPrice: 2_900_000,
      bidCount: 3,
      highestBidderId: 4,
      winnerId: null,
      finalPrice: null,
      startTime: t(-90),
      endTime: t(180),
      closedAt: null,
      cancelReason: null,
      createdAt: t(-150),
    },
    {
      id: 3,
      productId: 3,
      sellerId: 2,
      status: AuctionStatus.ACTIVE,
      startPrice: 8_000_000,
      bidIncrement: 250_000,
      reservePrice: null, // Không có giá sàn
      currentPrice: 8_500_000,
      bidCount: 2,
      highestBidderId: 3,
      winnerId: null,
      finalPrice: null,
      startTime: t(-60),
      endTime: t(26 * 60),
      closedAt: null,
      cancelReason: null,
      createdAt: t(-120),
    },
    {
      id: 4,
      productId: 4,
      sellerId: 2,
      status: AuctionStatus.SCHEDULED,
      startPrice: 1_200_000,
      bidIncrement: 50_000,
      reservePrice: 1_800_000,
      currentPrice: 1_200_000,
      bidCount: 0,
      highestBidderId: null,
      winnerId: null,
      finalPrice: null,
      startTime: t(2), // Bắt đầu sau 2 phút
      endTime: t(24 * 60),
      closedAt: null,
      cancelReason: null,
      createdAt: t(-60),
    },
    {
      id: 5,
      productId: 5,
      sellerId: 2,
      status: AuctionStatus.SCHEDULED,
      startPrice: 900_000,
      bidIncrement: 50_000,
      reservePrice: null,
      currentPrice: 900_000,
      bidCount: 0,
      highestBidderId: null,
      winnerId: null,
      finalPrice: null,
      startTime: t(6 * 60),
      endTime: t(30 * 60),
      closedAt: null,
      cancelReason: null,
      createdAt: t(-30),
    },
    {
      id: 6,
      productId: 6,
      sellerId: 2,
      status: AuctionStatus.ENDED,
      startPrice: 1_500_000,
      bidIncrement: 100_000,
      reservePrice: 2_000_000,
      currentPrice: 2_400_000,
      bidCount: 3,
      highestBidderId: 3,
      winnerId: 3,
      finalPrice: 2_400_000,
      startTime: t(-48 * 60),
      endTime: t(-6 * 60),
      closedAt: t(-6 * 60),
      cancelReason: null,
      createdAt: t(-50 * 60),
    },
    {
      id: 7,
      productId: 11,
      sellerId: 2,
      status: AuctionStatus.UNSOLD,
      startPrice: 3_000_000,
      bidIncrement: 100_000,
      reservePrice: 4_500_000,
      currentPrice: 3_400_000,
      bidCount: 2,
      highestBidderId: 4,
      winnerId: null,
      finalPrice: null,
      startTime: t(-72 * 60),
      endTime: t(-24 * 60),
      closedAt: t(-24 * 60),
      cancelReason: null,
      createdAt: t(-75 * 60),
    },
    {
      id: 8,
      productId: 11,
      sellerId: 2,
      status: AuctionStatus.CANCELLED,
      startPrice: 2_800_000,
      bidIncrement: 100_000,
      reservePrice: null,
      currentPrice: 2_800_000,
      bidCount: 0,
      highestBidderId: null,
      winnerId: null,
      finalPrice: null,
      startTime: t(-100 * 60),
      endTime: t(-80 * 60),
      closedAt: t(-95 * 60),
      cancelReason: "Người bán cần cập nhật lại ảnh chi tiết sản phẩm trước khi mở bán.",
      createdAt: t(-110 * 60),
    },
    {
      id: 9,
      productId: 7,
      sellerId: 2,
      status: AuctionStatus.ENDED,
      startPrice: 3_200_000,
      bidIncrement: 100_000,
      reservePrice: null,
      currentPrice: 3_800_000,
      bidCount: 2,
      highestBidderId: 3,
      winnerId: 3,
      finalPrice: 3_800_000,
      startTime: t(-96 * 60),
      endTime: t(-36 * 60),
      closedAt: t(-36 * 60),
      cancelReason: null,
      createdAt: t(-100 * 60),
    },
    {
      id: 10,
      productId: 8,
      sellerId: 2,
      status: AuctionStatus.ENDED,
      startPrice: 4_000_000,
      bidIncrement: 200_000,
      reservePrice: null,
      currentPrice: 4_600_000,
      bidCount: 2,
      highestBidderId: 4,
      winnerId: 4,
      finalPrice: 4_600_000,
      startTime: t(-120 * 60),
      endTime: t(-60 * 60),
      closedAt: t(-60 * 60),
      cancelReason: null,
      createdAt: t(-125 * 60),
    },
    {
      id: 11,
      productId: 9,
      sellerId: 2,
      status: AuctionStatus.ENDED,
      startPrice: 5_000_000,
      bidIncrement: 250_000,
      reservePrice: 5_500_000,
      currentPrice: 6_250_000,
      bidCount: 3,
      highestBidderId: 3,
      winnerId: 3,
      finalPrice: 6_250_000,
      startTime: t(-240 * 60),
      endTime: t(-180 * 60),
      closedAt: t(-180 * 60),
      cancelReason: null,
      createdAt: t(-250 * 60),
    },
  ];

  const bids: MockBid[] = [
    // Auction 1 (ACTIVE, ending in 3m)
    { id: 1, auctionId: 1, bidderId: 3, amount: 4_200_000, createdAt: t(-90) },
    { id: 2, auctionId: 1, bidderId: 4, amount: 4_600_000, createdAt: t(-60) },
    { id: 3, auctionId: 1, bidderId: 3, amount: 5_000_000, createdAt: t(-30) },
    { id: 4, auctionId: 1, bidderId: 3, amount: 5_400_000, createdAt: t(-10) },
    // Auction 2 (ACTIVE, reserve NOT_MET)
    { id: 5, auctionId: 2, bidderId: 3, amount: 2_600_000, createdAt: t(-70) },
    { id: 6, auctionId: 2, bidderId: 4, amount: 2_800_000, createdAt: t(-40) },
    { id: 7, auctionId: 2, bidderId: 4, amount: 2_900_000, createdAt: t(-15) },
    // Auction 3 (ACTIVE, NO_RESERVE)
    { id: 8, auctionId: 3, bidderId: 4, amount: 8_250_000, createdAt: t(-45) },
    { id: 9, auctionId: 3, bidderId: 3, amount: 8_500_000, createdAt: t(-20) },
    // Auction 6 (ENDED)
    { id: 10, auctionId: 6, bidderId: 4, amount: 1_800_000, createdAt: t(-24 * 60) },
    { id: 11, auctionId: 6, bidderId: 3, amount: 2_400_000, createdAt: t(-10 * 60) },
    // Auction 7 (UNSOLD)
    { id: 12, auctionId: 7, bidderId: 3, amount: 3_100_000, createdAt: t(-48 * 60) },
    { id: 13, auctionId: 7, bidderId: 4, amount: 3_400_000, createdAt: t(-30 * 60) },
  ];

  // 6 đơn hàng phủ đủ 6 trạng thái
  const orders: MockOrder[] = [
    {
      id: 1,
      auctionId: 6,
      productId: 6,
      buyerId: 3,
      sellerId: 2,
      finalPrice: 2_400_000,
      status: OrderStatus.PENDING_PAYMENT,
      shippingAddress: "45 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      phoneNumber: "0903000003",
      trackingCode: null,
      paymentDeadline: t(18 * 60),
      confirmDeadline: null,
      paidAt: null,
      shippedAt: null,
      completedAt: null,
      cancelledAt: null,
      cancelReason: null,
      createdAt: t(-6 * 60),
    },
    {
      id: 2,
      auctionId: 9,
      productId: 7,
      buyerId: 3,
      sellerId: 2,
      finalPrice: 3_800_000,
      status: OrderStatus.PAID,
      shippingAddress: "45 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      phoneNumber: "0903000003",
      trackingCode: null,
      paymentDeadline: t(-12 * 60),
      confirmDeadline: null,
      paidAt: t(-24 * 60),
      shippedAt: null,
      completedAt: null,
      cancelledAt: null,
      cancelReason: null,
      createdAt: t(-36 * 60),
    },
    {
      id: 3,
      auctionId: 10,
      productId: 8,
      buyerId: 4,
      sellerId: 2,
      finalPrice: 4_600_000,
      status: OrderStatus.SHIPPING,
      shippingAddress: "88 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh",
      phoneNumber: "0904000004",
      trackingCode: "VNPOST-8841290",
      paymentDeadline: t(-36 * 60),
      confirmDeadline: t(5 * 24 * 60),
      paidAt: t(-50 * 60),
      shippedAt: t(-24 * 60),
      completedAt: null,
      cancelledAt: null,
      cancelReason: null,
      createdAt: t(-60 * 60),
    },
    {
      id: 4,
      auctionId: 11,
      productId: 9,
      buyerId: 3,
      sellerId: 2,
      finalPrice: 6_250_000,
      status: OrderStatus.COMPLETED,
      shippingAddress: "45 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      phoneNumber: "0903000003",
      trackingCode: "GHN-9921045",
      paymentDeadline: t(-156 * 60),
      confirmDeadline: t(-24 * 60),
      paidAt: t(-170 * 60),
      shippedAt: t(-150 * 60),
      completedAt: t(-100 * 60),
      cancelledAt: null,
      cancelReason: null,
      createdAt: t(-180 * 60),
    },
    {
      id: 5,
      auctionId: 6,
      productId: 11,
      buyerId: 4,
      sellerId: 2,
      finalPrice: 1_900_000,
      status: OrderStatus.CANCELLED,
      shippingAddress: null,
      phoneNumber: null,
      trackingCode: null,
      paymentDeadline: t(-80 * 60),
      confirmDeadline: null,
      paidAt: null,
      shippedAt: null,
      completedAt: null,
      cancelledAt: t(-90 * 60),
      cancelReason: "Quản trị viên hủy đơn theo yêu cầu xác minh giao dịch.",
      createdAt: t(-104 * 60),
    },
    {
      id: 6,
      auctionId: 7,
      productId: 11,
      buyerId: 4,
      sellerId: 2,
      finalPrice: 2_100_000,
      status: OrderStatus.EXPIRED,
      shippingAddress: null,
      phoneNumber: null,
      trackingCode: null,
      paymentDeadline: t(-120 * 60),
      confirmDeadline: null,
      paidAt: null,
      shippedAt: null,
      completedAt: null,
      cancelledAt: null,
      cancelReason: null,
      createdAt: t(-144 * 60),
    },
  ];

  // Lịch sử thanh toán có FAILED rồi SUCCESS (trên đơn #2)
  const payments: MockPayment[] = [
    {
      id: 1,
      orderId: 2,
      attemptNo: 1,
      amount: 3_800_000,
      method: "MOCK_CARD",
      status: PaymentStatus.FAILED,
      failureReason: "MOCK_DECLINED",
      idempotencyKey: "seed-pay-2-1",
      createdAt: t(-25 * 60),
      paidAt: null,
    },
    {
      id: 2,
      orderId: 2,
      attemptNo: 2,
      amount: 3_800_000,
      method: "MOCK_CARD",
      status: PaymentStatus.SUCCESS,
      failureReason: null,
      idempotencyKey: "seed-pay-2-2",
      createdAt: t(-24 * 60),
      paidAt: t(-24 * 60),
    },
    {
      id: 3,
      orderId: 3,
      attemptNo: 1,
      amount: 4_600_000,
      method: "MOCK_CARD",
      status: PaymentStatus.SUCCESS,
      failureReason: null,
      idempotencyKey: "seed-pay-3-1",
      createdAt: t(-50 * 60),
      paidAt: t(-50 * 60),
    },
    {
      id: 4,
      orderId: 4,
      attemptNo: 1,
      amount: 6_250_000,
      method: "MOCK_CARD",
      status: PaymentStatus.SUCCESS,
      failureReason: null,
      idempotencyKey: "seed-pay-4-1",
      createdAt: t(-170 * 60),
      paidAt: t(-170 * 60),
    },
  ];

  // Thông báo đủ 5 loại (đúng BR-v4 §7)
  const notifications: MockNotification[] = [
    {
      id: 1,
      userId: 3,
      type: NotificationType.OUTBID,
      title: "Bạn vừa bị vượt giá",
      content: "Có người vừa đặt 2.900.000 ₫ cho phiên Máy ảnh film 35mm kèm ống kính 50mm f/1.8.",
      refType: "AUCTION",
      refId: 2,
      isRead: false,
      createdAt: t(-15),
    },
    {
      id: 2,
      userId: 3,
      type: NotificationType.AUCTION_RESULT,
      title: "Chúc mừng bạn đã thắng phiên đấu giá",
      content:
        "Bạn đã thắng phiên Áo khoác dạ dáng dài thủ công cỡ M với giá 2.400.000 ₫. Vui lòng thanh toán đơn ORD-1 trong vòng 48 giờ.",
      refType: "AUCTION",
      refId: 6,
      isRead: false,
      createdAt: t(-6 * 60),
    },
    {
      id: 3,
      userId: 3,
      type: NotificationType.ORDER_UPDATE,
      title: "Thanh toán đơn hàng ORD-2 thành công",
      content: "Đơn hàng ORD-2 đã được thanh toán. Người bán sẽ sớm chuẩn bị và gửi hàng.",
      refType: "ORDER",
      refId: 2,
      isRead: true,
      createdAt: t(-24 * 60),
    },
    {
      id: 4,
      userId: 4,
      type: NotificationType.AUCTION_CANCELLED,
      title: "Phiên đấu giá AUC-8 đã bị hủy",
      content:
        "Phiên Túi xách da thật thủ công màu nâu cognac đã bị hủy bởi người bán với lý do: Người bán cần cập nhật lại ảnh chi tiết sản phẩm trước khi mở bán.",
      refType: "AUCTION",
      refId: 8,
      isRead: false,
      createdAt: t(-95 * 60),
    },
    {
      id: 5,
      userId: 3,
      type: NotificationType.REPORT_RESOLVED,
      title: "Báo cáo vi phạm REP-2 đã được xử lý",
      content:
        "Quản trị viên đã xem xét và xác nhận báo cáo REP-2 của bạn. Ghi chú xử lý: Đã ẩn sản phẩm vi phạm và khóa tài khoản người đăng.",
      refType: "REPORT",
      refId: 2,
      isRead: false,
      createdAt: t(-48 * 60),
    },
    {
      id: 6,
      userId: 3,
      type: NotificationType.AUCTION_CANCELLED,
      title: "Phiên đấu giá AUC-8 đã bị hủy",
      content:
        "Phiên Túi xách da thật thủ công màu nâu cognac đã bị hủy trước khi kết thúc.",
      refType: "AUCTION",
      refId: 8,
      isRead: true,
      createdAt: t(-95 * 60),
    },
    {
      id: 7,
      userId: 2,
      type: NotificationType.AUCTION_RESULT,
      title: "Phiên đấu giá AUC-6 đã có người thắng",
      content:
        "Phiên Áo khoác dạ dáng dài thủ công cỡ M kết thúc ở mức 2.400.000 ₫ và đã tạo đơn hàng ORD-1.",
      refType: "AUCTION",
      refId: 6,
      isRead: false,
      createdAt: t(-6 * 60),
    },
    {
      id: 8,
      userId: 2,
      type: NotificationType.ORDER_UPDATE,
      title: "Đơn hàng ORD-2 đã được thanh toán",
      content:
        "Người mua đã thanh toán đơn hàng ORD-2. Vui lòng chuẩn bị và cập nhật thông tin gửi hàng.",
      refType: "ORDER",
      refId: 2,
      isRead: false,
      createdAt: t(-24 * 60),
    },
    {
      id: 9,
      userId: 2,
      type: NotificationType.AUCTION_CANCELLED,
      title: "Phiên đấu giá AUC-8 đã bị hủy",
      content:
        "Bạn đã hủy phiên Túi xách da thật thủ công màu nâu cognac. Sản phẩm đã trở về trạng thái Sẵn sàng.",
      refType: "AUCTION",
      refId: 8,
      isRead: true,
      createdAt: t(-95 * 60),
    },
  ];

  // Báo cáo đủ PENDING / RESOLVED / REJECTED và 3 loại đối tượng
  const reports: MockReport[] = [
    {
      id: 1,
      reporterId: 3,
      reportedProductId: 2,
      reportedUserId: null,
      reportedOrderId: null,
      reason: "Mô tả sản phẩm chưa nêu rõ số seri ống kính đi kèm.",
      status: ReportStatus.PENDING,
      adminNote: null,
      resolvedById: null,
      resolvedAt: null,
      createdAt: t(-120),
    },
    {
      id: 2,
      reporterId: 3,
      reportedProductId: 12,
      reportedUserId: 5,
      reportedOrderId: null,
      reason: "Người bán đăng thông tin sai lệch so với hình ảnh sản phẩm.",
      status: ReportStatus.RESOLVED,
      adminNote: "Đã ẩn sản phẩm vi phạm và khóa tài khoản người đăng.",
      resolvedById: 1,
      resolvedAt: t(-48 * 60),
      createdAt: t(-72 * 60),
    },
    {
      id: 3,
      reporterId: 4,
      reportedProductId: null,
      reportedUserId: null,
      reportedOrderId: 3,
      reason: "Muốn kiểm tra lại mã vận đơn giao hàng.",
      status: ReportStatus.REJECTED,
      adminNote: "Mã vận đơn VNPOST-8841290 hợp lệ và đang trong thời gian giao hàng.",
      resolvedById: 1,
      resolvedAt: t(-12 * 60),
      createdAt: t(-20 * 60),
    },
  ];

  return {
    clockOffsetMs: 0,
    defaultPaymentOutcome: PaymentStatus.SUCCESS,
    nextIds: {
      user: 6,
      category: 7,
      product: 13,
      productImage: 14,
      auction: 12,
      bid: 14,
      order: 7,
      payment: 5,
      notification: 10,
      report: 4,
    },
    users,
    categories,
    products,
    auctions,
    bids,
    orders,
    payments,
    notifications,
    reports,
  };
}
