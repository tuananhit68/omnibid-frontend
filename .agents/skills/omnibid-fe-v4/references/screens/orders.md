# Mua hàng và đơn — `my-bids`, `my-orders`, `order-detail`

Dữ liệu: `backend/RESPONSE_DTO_v4.md` §4 (`MyBidItem`), §5 (`OrderSummary`, `OrderDetail`, `PaymentResult`, `PaymentHistoryItem`, `ShipResult`, `ConfirmReceiptResult`); BR-09…BR-14, BR-16; UC08–UC10.

## `my-bids` — `/me/bids` (SỬA)
Code cũ dùng `BidStatus` và `/bids/mine/summary` — bỏ. `GET /bids/mine?auctionId&page&size=20&sort=createdAt,desc`.
`DataTable`: Phiên (ảnh + `title`, link `/auctions/{auctionId}`) · Giá tôi đặt `amount` · Thời điểm · Giá hiện tại · Trạng thái phiên · Vị thế (`BidPosition`: ACTIVE+`leading` → Đang dẫn đầu; ACTIVE+!leading → Bị vượt; ENDED+`orderId` → Đã thắng; còn lại → Không thắng) · Thao tác (Bị vượt → "Đặt lại giá" `/auctions/{id}`; Đã thắng → "Thanh toán" `/orders/{orderId}`).
Lọc nhanh: "Tất cả · Đang diễn ra · Đã kết thúc" (lọc phía client trên trang hiện tại, ghi rõ) hoặc theo `auctionId` khi mở từ trang phiên. Không có thẻ thống kê tổng.

## `my-orders` — `/me/orders` (MỚI)
Tabs "Đơn mua" (`role=BUYER`) · "Đơn bán" (`role=SELLER`) đồng bộ URL; `SegmentedControl` trạng thái (6 trạng thái + Tất cả).
`DataTable` (`GET /orders?role&status&page&size&sort=createdAt,desc`): `ORD-{id}` · Sản phẩm (ảnh + `title`) · Bên kia (`seller.fullName` hoặc `buyer.fullName`) · Giá `finalPrice` · Trạng thái · Hạn (`paymentDeadline` khi PENDING_PAYMENT, `confirmDeadline` khi SHIPPING, kèm "còn …") · "Xem" → `/orders/{id}`.
Hàng cần hành động của người xem (mua: PENDING_PAYMENT, SHIPPING; bán: PAID) nền `warning-subtle-bg` + nhãn "Cần bạn xử lý".

## `order-detail` — `/orders/[id]` (MỚI, chung cho người mua và người bán)
`GET /orders/{id}` → `OrderDetail` (`viewerRole` = BUYER | SELLER). 403 → trang 403 (Admin: link `/admin/orders/{id}`).
Desktop 8/4. Cột chính:
1. **Tóm tắt:** ảnh, `title`, "Giá thắng" `finalPrice`, `StatusBadge`, bên kia (tên), mã `ORD-{id}`, phiên `AUC-{auctionId}` (link).
2. **Tiến trình:** `OrderProgress(status, createdAt, paidAt, shippedAt, completedAt)`; EXPIRED/CANCELLED → hộp thông báo (`cancelReason`).
3. **Khối hành động theo `viewerRole` × `status`:**
| Vai trò | Trạng thái | Nội dung |
|---|---|---|
| BUYER | PENDING_PAYMENT | Hạn thanh toán + đồng hồ · form "Thông tin nhận hàng" (Địa chỉ*, SĐT* → `PATCH /orders/{id}/shipping-info`) · "Phương thức: Thẻ mô phỏng (không phát sinh tiền thật)" · nếu `NEXT_PUBLIC_DEMO_MODE=true`: chọn kết quả mô phỏng Thành công/Thất bại · nút `money` xl "Thanh toán `finalPrice`" |
| BUYER | PAID | "Đã thanh toán lúc `paidAt`. Chờ người bán gửi hàng." |
| BUYER | SHIPPING | Mã vận đơn, `shippedAt`, hạn `confirmDeadline` · nút "Xác nhận đã nhận hàng" (ConfirmDialog) → `POST /orders/{id}/confirm-receipt` |
| SELLER | PENDING_PAYMENT | "Đang chờ người mua thanh toán trước `paymentDeadline`" |
| SELLER | PAID | Địa chỉ + SĐT người nhận · form "Gửi hàng": mã vận đơn (tùy chọn ≤ 50) → `POST /orders/{id}/ship` |
| SELLER | SHIPPING | "Đã gửi lúc `shippedAt`; người mua xác nhận trước `confirmDeadline`, quá hạn hệ thống tự hoàn tất" |
| cả hai | COMPLETED | `completedAt`; sản phẩm `productStatus` |
4. **Lịch sử thanh toán** (chỉ BUYER): `GET /orders/{id}/payments` → Lần · Thời điểm · Kết quả · Lý do.
Cột phụ: thông tin hai bên, hạn chót, nút "Báo cáo vi phạm" (`report-modal`: đơn + bên kia).
**Thanh toán:** mỗi lần bấm `Idempotency-Key = crypto.randomUUID()`; lỗi mạng không có phản hồi → thử lại cùng key. `PaymentResult` SUCCESS → toast + refetch; FAILED → hộp lỗi "Thanh toán thất bại (`failureReason`), bạn có thể thử lại trước hạn". Lỗi: `VALIDATION_ERROR` (thiếu thông tin nhận hàng → focus ô), `ORDER_EXPIRED`, `ORDER_CANCELLED`, `INVALID_STATUS_TRANSITION`, `CONFLICT`.
Hạn về 0: khóa nút, "Đã quá hạn, hệ thống sẽ chuyển đơn sang hết hạn" — không tự đổi trạng thái.
