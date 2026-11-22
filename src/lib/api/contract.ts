/**
 * OmniBid v4 — Hợp đồng DTO (sao chính xác từ RESPONSE_DTO_v4.md)
 * TypeScript types + Zod schemas cho 54 endpoint và WebSocket AuctionEvent.
 */
import { z } from "zod";
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

// --------------------------------------------------
// 1. Enum Schemas
// --------------------------------------------------
export const UserRoleSchema = z.enum([UserRole.USER, UserRole.ADMIN]);
export const UserStatusSchema = z.enum([UserStatus.ACTIVE, UserStatus.BANNED]);
export const ProductConditionSchema = z.enum([
  ProductCondition.NEW,
  ProductCondition.LIKE_NEW,
  ProductCondition.GOOD,
  ProductCondition.FAIR,
  ProductCondition.POOR,
]);
export const ProductStatusSchema = z.enum([
  ProductStatus.AVAILABLE,
  ProductStatus.IN_AUCTION,
  ProductStatus.RESERVED,
  ProductStatus.SOLD,
  ProductStatus.HIDDEN,
]);
export const AuctionStatusSchema = z.enum([
  AuctionStatus.SCHEDULED,
  AuctionStatus.ACTIVE,
  AuctionStatus.ENDED,
  AuctionStatus.UNSOLD,
  AuctionStatus.CANCELLED,
]);
export const ReserveStatusSchema = z.enum([
  ReserveStatus.MET,
  ReserveStatus.NOT_MET,
  ReserveStatus.NO_RESERVE,
]);
export const OrderStatusSchema = z.enum([
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.PAID,
  OrderStatus.SHIPPING,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
  OrderStatus.EXPIRED,
]);
export const PaymentStatusSchema = z.enum([
  PaymentStatus.SUCCESS,
  PaymentStatus.FAILED,
]);
export const NotificationTypeSchema = z.enum([
  NotificationType.OUTBID,
  NotificationType.AUCTION_RESULT,
  NotificationType.AUCTION_CANCELLED,
  NotificationType.ORDER_UPDATE,
  NotificationType.REPORT_RESOLVED,
]);
export const ReportStatusSchema = z.enum([
  ReportStatus.PENDING,
  ReportStatus.RESOLVED,
  ReportStatus.REJECTED,
]);

// --------------------------------------------------
// 2. Shared DTOs
// --------------------------------------------------
export function createPageSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    content: z.array(itemSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  });
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const UserRefSchema = z.object({
  id: z.number(),
  fullName: z.string(),
});
export type UserRef = z.infer<typeof UserRefSchema>;

export const UserSummarySchema = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  avatarUrl: z.string().nullable(),
});
export type UserSummary = z.infer<typeof UserSummarySchema>;

export const UserProfileSchema = UserSummarySchema.extend({
  phoneNumber: z.string().nullable(),
  address: z.string().nullable(),
  createdAt: z.string(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().nullable(),
});
export type Category = z.infer<typeof CategorySchema>;

export const ProductImageSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
  isPrimary: z.boolean(),
});
export type ProductImage = z.infer<typeof ProductImageSchema>;

// --------------------------------------------------
// 3. Auth & Users
// --------------------------------------------------
export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.literal("Bearer"),
  expiresIn: z.number(),
  expiresAt: z.string(),
  role: UserRoleSchema,
  user: UserSummarySchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const MessageResponseSchema = z.object({
  message: z.string(),
});
export type MessageResponse = z.infer<typeof MessageResponseSchema>;

export const AvatarResponseSchema = z.object({
  avatarUrl: z.string(),
});
export type AvatarResponse = z.infer<typeof AvatarResponseSchema>;

// --------------------------------------------------
// 4. Products
// --------------------------------------------------
export const ProductListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  categoryId: z.number(),
  categoryName: z.string(),
  condition: ProductConditionSchema,
  status: ProductStatusSchema,
  primaryImageUrl: z.string().nullable(),
  imageCount: z.number(),
  activeAuctionId: z.number().nullable(),
  everAuctioned: z.boolean(),
  createdAt: z.string(),
});
export type ProductListItem = z.infer<typeof ProductListItemSchema>;

export const ProductSchema = ProductListItemSchema.extend({
  description: z.string(),
  images: z.array(ProductImageSchema),
  updatedAt: z.string(),
});
export type Product = z.infer<typeof ProductSchema>;

// --------------------------------------------------
// 5. Auctions & Bids
// --------------------------------------------------
export const AuctionSummarySchema = z.object({
  id: z.number(),
  productId: z.number(),
  title: z.string(),
  primaryImageUrl: z.string().nullable(),
  categoryId: z.number(),
  categoryName: z.string(),
  status: AuctionStatusSchema,
  startPrice: z.number(),
  currentPrice: z.number(),
  minNextBid: z.number(),
  bidCount: z.number(),
  reserveStatus: ReserveStatusSchema,
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string(),
});
export type AuctionSummary = z.infer<typeof AuctionSummarySchema>;

export const AuctionDetailSchema = AuctionSummarySchema.extend({
  description: z.string(),
  condition: ProductConditionSchema,
  images: z.array(ProductImageSchema),
  bidIncrement: z.number(),
  seller: UserRefSchema,
  highestBidderName: z.string().nullable(),
  viewerIsSeller: z.boolean(),
  viewerIsLeading: z.boolean(),
  reservePrice: z.number().nullable().optional(),
  winnerName: z.string().nullable(),
  finalPrice: z.number().nullable(),
  closedAt: z.string().nullable(),
  cancelReason: z.string().nullable(),
  orderId: z.number().nullable().optional(),
});
export type AuctionDetail = z.infer<typeof AuctionDetailSchema>;

export const MyAuctionItemSchema = AuctionSummarySchema.extend({
  reservePrice: z.number().nullable(),
  orderId: z.number().nullable(),
});
export type MyAuctionItem = z.infer<typeof MyAuctionItemSchema>;

export const BidHistoryItemSchema = z.object({
  id: z.number(),
  amount: z.number(),
  bidderName: z.string(),
  createdAt: z.string(),
});
export type BidHistoryItem = z.infer<typeof BidHistoryItemSchema>;

export const PlaceBidResponseSchema = z.object({
  bidId: z.number(),
  auctionId: z.number(),
  amount: z.number(),
  currentPrice: z.number(),
  bidCount: z.number(),
  minNextBid: z.number(),
});
export type PlaceBidResponse = z.infer<typeof PlaceBidResponseSchema>;

export const MyBidItemSchema = z.object({
  id: z.number(),
  auctionId: z.number(),
  title: z.string(),
  primaryImageUrl: z.string().nullable(),
  amount: z.number(),
  createdAt: z.string(),
  auctionStatus: AuctionStatusSchema,
  currentPrice: z.number(),
  endTime: z.string(),
  leading: z.boolean(),
  orderId: z.number().nullable(),
});
export type MyBidItem = z.infer<typeof MyBidItemSchema>;

// --------------------------------------------------
// 6. Orders, Payments & Shipping
// --------------------------------------------------
export const OrderSummarySchema = z.object({
  id: z.number(),
  auctionId: z.number(),
  productId: z.number(),
  title: z.string(),
  primaryImageUrl: z.string().nullable(),
  finalPrice: z.number(),
  status: OrderStatusSchema,
  buyer: UserRefSchema,
  seller: UserRefSchema,
  paymentDeadline: z.string(),
  confirmDeadline: z.string().nullable(),
  createdAt: z.string(),
});
export type OrderSummary = z.infer<typeof OrderSummarySchema>;

export const OrderDetailSchema = OrderSummarySchema.extend({
  shippingAddress: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  trackingCode: z.string().nullable(),
  paidAt: z.string().nullable(),
  shippedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  cancelledAt: z.string().nullable(),
  cancelReason: z.string().nullable(),
  productStatus: ProductStatusSchema,
  viewerRole: z.enum(["BUYER", "SELLER"]),
});
export type OrderDetail = z.infer<typeof OrderDetailSchema>;

export const PaymentResultSchema = z.object({
  paymentId: z.number(),
  attemptNo: z.number(),
  status: PaymentStatusSchema,
  orderStatus: OrderStatusSchema,
  failureReason: z.string().optional(),
});
export type PaymentResult = z.infer<typeof PaymentResultSchema>;

export const PaymentHistoryItemSchema = z.object({
  id: z.number(),
  attemptNo: z.number(),
  amount: z.number(),
  method: z.literal("MOCK_CARD"),
  status: PaymentStatusSchema,
  failureReason: z.string().nullable(),
  createdAt: z.string(),
  paidAt: z.string().nullable(),
});
export type PaymentHistoryItem = z.infer<typeof PaymentHistoryItemSchema>;

export const ShipResultSchema = z.object({
  id: z.number(),
  orderStatus: OrderStatusSchema,
  shippedAt: z.string(),
  confirmDeadline: z.string(),
  trackingCode: z.string().nullable(),
});
export type ShipResult = z.infer<typeof ShipResultSchema>;

export const ConfirmReceiptResultSchema = z.object({
  id: z.number(),
  orderStatus: OrderStatusSchema,
  productStatus: ProductStatusSchema,
});
export type ConfirmReceiptResult = z.infer<typeof ConfirmReceiptResultSchema>;

// --------------------------------------------------
// 7. Notifications & Reports
// --------------------------------------------------
export const NotificationSchema = z.object({
  id: z.number(),
  type: NotificationTypeSchema,
  title: z.string(),
  content: z.string(),
  refType: z.enum(["AUCTION", "ORDER", "REPORT"]).nullable(),
  refId: z.number().nullable(),
  isRead: z.boolean(),
  createdAt: z.string(),
});
export type Notification = z.infer<typeof NotificationSchema>;

export const CreateReportResponseSchema = z.object({
  id: z.number(),
  status: z.literal("PENDING"),
  createdAt: z.string(),
});
export type CreateReportResponse = z.infer<typeof CreateReportResponseSchema>;

// --------------------------------------------------
// 8. Admin DTOs
// --------------------------------------------------
export const AdminUserSchema = UserSummarySchema.extend({
  phoneNumber: z.string().nullable(),
  createdAt: z.string(),
});
export type AdminUser = z.infer<typeof AdminUserSchema>;

export const AdminBanUserResponseSchema = z.object({
  id: z.number(),
  status: z.literal("BANNED"),
  cancelledAuctions: z.number(),
  cancelledOrders: z.number(),
});
export type AdminBanUserResponse = z.infer<typeof AdminBanUserResponseSchema>;

export const AdminUnbanUserResponseSchema = z.object({
  id: z.number(),
  status: z.literal("ACTIVE"),
});
export type AdminUnbanUserResponse = z.infer<typeof AdminUnbanUserResponseSchema>;

export const AdminProductItemSchema = ProductListItemSchema.extend({
  seller: UserRefSchema,
});
export type AdminProductItem = z.infer<typeof AdminProductItemSchema>;

export const AdminProductDetailSchema = ProductSchema.extend({
  seller: UserSummarySchema,
});
export type AdminProductDetail = z.infer<typeof AdminProductDetailSchema>;

export const AdminHideProductResponseSchema = z.object({
  id: z.number(),
  status: z.literal("HIDDEN"),
  cancelledAuctions: z.number(),
  cancelledOrders: z.number(),
});
export type AdminHideProductResponse = z.infer<typeof AdminHideProductResponseSchema>;

export const AdminAuctionItemSchema = AuctionSummarySchema.extend({
  seller: UserRefSchema,
  reservePrice: z.number().nullable(),
});
export type AdminAuctionItem = z.infer<typeof AdminAuctionItemSchema>;

export const AdminAuctionDetailSchema = AuctionSummarySchema.extend({
  description: z.string(),
  condition: ProductConditionSchema,
  images: z.array(ProductImageSchema),
  bidIncrement: z.number(),
  reservePrice: z.number().nullable(),
  seller: UserSummarySchema,
  highestBidder: UserSummarySchema.nullable(),
  winner: UserSummarySchema.nullable(),
  finalPrice: z.number().nullable(),
  closedAt: z.string().nullable(),
  cancelReason: z.string().nullable(),
  productStatus: ProductStatusSchema,
  orderId: z.number().nullable(),
});
export type AdminAuctionDetail = z.infer<typeof AdminAuctionDetailSchema>;

export const AdminOrderDetailSchema = OrderDetailSchema.omit({
  viewerRole: true,
}).extend({
  buyer: UserSummarySchema,
  seller: UserSummarySchema,
  payments: z.array(PaymentHistoryItemSchema),
});
export type AdminOrderDetail = z.infer<typeof AdminOrderDetailSchema>;

export const ReportTargetSummarySchema = z.object({
  product: z
    .object({
      id: z.number(),
      title: z.string(),
      status: ProductStatusSchema,
      sellerId: z.number(),
      activeAuction: z
        .object({
          id: z.number(),
          status: AuctionStatusSchema,
          bidCount: z.number(),
        })
        .nullable(),
    })
    .optional(),
  user: z
    .object({
      id: z.number(),
      fullName: z.string(),
      email: z.string(),
      role: UserRoleSchema,
      status: UserStatusSchema,
    })
    .optional(),
  order: z
    .object({
      id: z.number(),
      status: OrderStatusSchema,
      buyerId: z.number(),
      sellerId: z.number(),
      auctionId: z.number(),
    })
    .optional(),
});
export type ReportTargetSummary = z.infer<typeof ReportTargetSummarySchema>;

export const AdminReportItemSchema = z.object({
  id: z.number(),
  reporter: UserRefSchema,
  targets: ReportTargetSummarySchema,
  reason: z.string(),
  status: ReportStatusSchema,
  createdAt: z.string(),
});
export type AdminReportItem = z.infer<typeof AdminReportItemSchema>;

export const AdminReportDetailSchema = AdminReportItemSchema.extend({
  adminNote: z.string().nullable(),
  resolvedBy: UserRefSchema.nullable(),
  resolvedAt: z.string().nullable(),
});
export type AdminReportDetail = z.infer<typeof AdminReportDetailSchema>;

export const AdminCategorySchema = CategorySchema.extend({
  productCount: z.number(),
});
export type AdminCategory = z.infer<typeof AdminCategorySchema>;

export const AdminStatisticsSchema = z.object({
  totalUsers: z.number(),
  bannedUsers: z.number(),
  auctionsByStatus: z.record(AuctionStatusSchema, z.number()),
  ordersByStatus: z.record(OrderStatusSchema, z.number()),
  completedOrderValue: z.number(),
  pendingReports: z.number(),
});
export type AdminStatistics = z.infer<typeof AdminStatisticsSchema>;

// --------------------------------------------------
// 9. WebSocket AuctionEvent (/topic/auctions/{id})
// --------------------------------------------------
export const AuctionEventTypeSchema = z.enum([
  "BID_PLACED",
  "AUCTION_UPDATED",
  "AUCTION_STARTED",
  "AUCTION_ENDED",
  "AUCTION_CANCELLED",
]);
export type AuctionEventType = z.infer<typeof AuctionEventTypeSchema>;

export const AuctionEventSchema = z.object({
  type: AuctionEventTypeSchema,
  auctionId: z.number(),
  status: AuctionStatusSchema,
  currentPrice: z.number(),
  minNextBid: z.number(),
  bidCount: z.number(),
  highestBidderName: z.string().nullable(),
  reserveStatus: ReserveStatusSchema,
  startTime: z.string(),
  endTime: z.string(),
  bid: BidHistoryItemSchema.optional(),
  createdAt: z.string(),
});
export type AuctionEvent = z.infer<typeof AuctionEventSchema>;

// --------------------------------------------------
// 10. Endpoint → Schema map (dùng để kiểm tra response ở dev live mode)
// --------------------------------------------------
interface EndpointSchemaRule {
  method: string;
  pattern: RegExp;
  schema: z.ZodTypeAny;
}

const ENDPOINT_SCHEMA_RULES: EndpointSchemaRule[] = [
  // Auth & Users
  { method: "POST", pattern: /^\/auth\/register$/, schema: UserProfileSchema },
  { method: "POST", pattern: /^\/auth\/login$/, schema: LoginResponseSchema },
  { method: "POST", pattern: /^\/auth\/logout$/, schema: MessageResponseSchema },
  { method: "GET", pattern: /^\/users\/me$/, schema: UserProfileSchema },
  { method: "PATCH", pattern: /^\/users\/me$/, schema: UserProfileSchema },
  { method: "PATCH", pattern: /^\/users\/me\/password$/, schema: MessageResponseSchema },
  { method: "POST", pattern: /^\/users\/me\/avatar$/, schema: AvatarResponseSchema },
  // Categories & Products
  { method: "GET", pattern: /^\/categories$/, schema: createPageSchema(CategorySchema) },
  { method: "POST", pattern: /^\/products$/, schema: ProductSchema },
  { method: "GET", pattern: /^\/products\/mine$/, schema: createPageSchema(ProductListItemSchema) },
  { method: "GET", pattern: /^\/products\/\d+$/, schema: ProductSchema },
  { method: "PATCH", pattern: /^\/products\/\d+$/, schema: ProductSchema },
  { method: "DELETE", pattern: /^\/products\/\d+$/, schema: z.null() },
  { method: "POST", pattern: /^\/products\/\d+\/images$/, schema: ProductSchema },
  { method: "DELETE", pattern: /^\/products\/\d+\/images\/\d+$/, schema: ProductSchema },
  // Auctions & Bids
  { method: "GET", pattern: /^\/auctions$/, schema: createPageSchema(AuctionSummarySchema) },
  { method: "GET", pattern: /^\/auctions\/mine$/, schema: createPageSchema(MyAuctionItemSchema) },
  { method: "GET", pattern: /^\/auctions\/\d+$/, schema: AuctionDetailSchema },
  { method: "POST", pattern: /^\/auctions$/, schema: AuctionDetailSchema },
  { method: "PATCH", pattern: /^\/auctions\/\d+$/, schema: AuctionDetailSchema },
  { method: "POST", pattern: /^\/auctions\/\d+\/cancel$/, schema: AuctionDetailSchema },
  { method: "GET", pattern: /^\/auctions\/\d+\/bids$/, schema: createPageSchema(BidHistoryItemSchema) },
  { method: "POST", pattern: /^\/auctions\/\d+\/bids$/, schema: PlaceBidResponseSchema },
  { method: "GET", pattern: /^\/bids\/mine$/, schema: createPageSchema(MyBidItemSchema) },
  // Orders & Payments
  { method: "GET", pattern: /^\/orders$/, schema: createPageSchema(OrderSummarySchema) },
  { method: "GET", pattern: /^\/orders\/\d+$/, schema: OrderDetailSchema },
  { method: "PATCH", pattern: /^\/orders\/\d+\/shipping-info$/, schema: OrderDetailSchema },
  { method: "POST", pattern: /^\/orders\/\d+\/payments$/, schema: PaymentResultSchema },
  { method: "GET", pattern: /^\/orders\/\d+\/payments$/, schema: createPageSchema(PaymentHistoryItemSchema) },
  { method: "POST", pattern: /^\/orders\/\d+\/ship$/, schema: ShipResultSchema },
  { method: "POST", pattern: /^\/orders\/\d+\/confirm-receipt$/, schema: ConfirmReceiptResultSchema },
  // Notifications & Reports
  { method: "GET", pattern: /^\/notifications$/, schema: createPageSchema(NotificationSchema) },
  { method: "POST", pattern: /^\/notifications\/\d+\/read$/, schema: NotificationSchema },
  { method: "POST", pattern: /^\/reports$/, schema: CreateReportResponseSchema },
  // Admin
  { method: "GET", pattern: /^\/admin\/users$/, schema: createPageSchema(AdminUserSchema) },
  { method: "POST", pattern: /^\/admin\/users\/\d+\/ban$/, schema: AdminBanUserResponseSchema },
  { method: "POST", pattern: /^\/admin\/users\/\d+\/unban$/, schema: AdminUnbanUserResponseSchema },
  { method: "GET", pattern: /^\/admin\/products$/, schema: createPageSchema(AdminProductItemSchema) },
  { method: "GET", pattern: /^\/admin\/products\/\d+$/, schema: AdminProductDetailSchema },
  { method: "POST", pattern: /^\/admin\/products\/\d+\/hide$/, schema: AdminHideProductResponseSchema },
  { method: "GET", pattern: /^\/admin\/auctions$/, schema: createPageSchema(AdminAuctionItemSchema) },
  { method: "GET", pattern: /^\/admin\/auctions\/\d+$/, schema: AdminAuctionDetailSchema },
  { method: "POST", pattern: /^\/admin\/auctions\/\d+\/cancel$/, schema: AdminAuctionDetailSchema },
  { method: "GET", pattern: /^\/admin\/orders$/, schema: createPageSchema(OrderSummarySchema) },
  { method: "GET", pattern: /^\/admin\/orders\/\d+$/, schema: AdminOrderDetailSchema },
  { method: "POST", pattern: /^\/admin\/orders\/\d+\/cancel$/, schema: AdminOrderDetailSchema },
  { method: "GET", pattern: /^\/admin\/reports$/, schema: createPageSchema(AdminReportItemSchema) },
  { method: "GET", pattern: /^\/admin\/reports\/\d+$/, schema: AdminReportDetailSchema },
  { method: "POST", pattern: /^\/admin\/reports\/\d+\/resolve$/, schema: AdminReportDetailSchema },
  { method: "GET", pattern: /^\/admin\/categories$/, schema: createPageSchema(AdminCategorySchema) },
  { method: "POST", pattern: /^\/admin\/categories$/, schema: AdminCategorySchema },
  { method: "PUT", pattern: /^\/admin\/categories\/\d+$/, schema: AdminCategorySchema },
  { method: "DELETE", pattern: /^\/admin\/categories\/\d+$/, schema: z.null() },
  { method: "GET", pattern: /^\/admin\/statistics$/, schema: AdminStatisticsSchema },
];

export function validateEndpointResponse(
  method: string | undefined,
  url: string | undefined,
  data: unknown
): void {
  if (process.env.NODE_ENV !== "development") return;
  if (!method || !url) return;

  const upperMethod = method.toUpperCase();
  const path = url.split("?")[0].replace(/^https?:\/\/[^/]+/, "").replace(/^\/api\/v1/, "");

  const rule = ENDPOINT_SCHEMA_RULES.find(
    (r) => r.method === upperMethod && r.pattern.test(path)
  );
  if (!rule) return;

  const result = rule.schema.safeParse(data);
  if (!result.success) {
    console.warn(
      `[Contract Mismatch] ${upperMethod} ${path}`,
      result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
    );
  }
}
