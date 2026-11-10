# Hợp đồng API – backend OmniBid

Cập nhật 10/11/2026. Gồm các API trên nhánh `feature/post-auction-backend` (commit `a5cab9d`) và các API P1–P11 backend đã làm xong theo bộ prompt "OmniBid – API backend còn thiếu và bộ prompt". Nếu backend đổi tên trường hoặc mã lỗi, sửa file này trước rồi mới sửa code.

**File này thắng mục "API" trong các spec.**

## 1. Quy ước chung

### Response

```json
{ "success": true,  "message": "Auction created successfully", "data": { ... }, "timestamp": "2026-10-28T20:17:22" }
{ "success": false, "errorCode": "BID_TOO_LOW", "message": "Bid amount must be at least 22000000", "data": { "minNextBid": 22000000 }, "timestamp": "..." }
```

- Lỗi nằm ở `errorCode` + `message` + `data` ở **cấp trên cùng** (không có object `error`). Trường null bị bỏ khỏi JSON.
- `VALIDATION_ERROR` (400): `data` là map `{ tênTrường: thông báo }` – gắn vào đúng ô form.
- `message` lẫn tiếng Anh và tiếng Việt → **không hiển thị `message` trực tiếp**, luôn map `errorCode` → câu tiếng Việt trong `lib/errors.ts`; `message` chỉ dùng khi mã lạ.
- Mã lỗi chung: `UNAUTHORIZED` (401), `INVALID_CREDENTIALS` (401), `FORBIDDEN` (403), `ACCOUNT_BANNED` (403), `NOT_FOUND`/`USER_NOT_FOUND` (404), `INTERNAL_ERROR` (500).
- Mã lỗi thêm từ P1–P11: `CATEGORY_NOT_FOUND` (404), `INVALID_IMAGE` (400), `IMAGE_TOO_LARGE` (400), `PRODUCT_NOT_EDITABLE` (409), `PRODUCT_IMAGE_LIMIT` (409), `PRODUCT_IMAGE_REQUIRED` (422), `WRONG_PASSWORD` (400), `SELF_WATCH_NOT_ALLOWED` (422), `AUCTION_NOT_EDITABLE` (409).

### Phân trang

`PageResponse`: `{ content: T[], page, size, totalElements, totalPages }`, `page` bắt đầu từ 0. Tham số `page`, `size` (mặc định 20).

### Thời gian

Backend trả `LocalDateTime` **không có múi giờ** (`"2026-10-28T21:30:00"`), là giờ Việt Nam (`Asia/Ho_Chi_Minh`). Frontend phải parse là giờ VN: `dayjs.tz(value, 'Asia/Ho_Chi_Minh')`, **không** dùng `new Date(value)` (trình duyệt ở múi giờ khác sẽ lệch). Gửi lên cũng dạng `YYYY-MM-DDTHH:mm:ss` giờ VN, không thêm `Z`.

### Tiền

`BigDecimal` → JSON là số (`21500000` hoặc `21500000.00`). Frontend đọc bằng `Number()`; hiển thị không phần thập phân.

### Xác thực

- `POST /auth/login` → `{ accessToken, tokenType: "Bearer", userId, email, fullName, role: "USER"|"ADMIN" }`. Không có refresh token; JWT hết hạn sau 24 giờ → 401 thì chuyển trang đăng nhập.
- `POST /auth/register` `{ fullName, email, password (≥ 6 ký tự), phoneNumber?, address? }` → cùng dạng `AuthResponse` (đăng nhập luôn). Lỗi `EMAIL_ALREADY_EXISTS` (409).
- Không có endpoint đăng xuất: xoá token ở client.
- Hồ sơ đầy đủ lấy từ `GET /users/me` (mục 2); `AuthResponse` chỉ dùng ngay sau đăng nhập.

### WebSocket

| | Giá trị |
| --- | --- |
| Endpoint | `/ws-auction` (SockJS: `http://host:8080/ws-auction`) |
| CONNECT header | `Authorization: Bearer <token>` (khách bỏ trống vẫn nhận được kênh phiên) |
| Kênh phiên | `/topic/auction/{auctionId}` (**số ít**) |
| Kênh cá nhân | `/user/queue/notifications` |

Tin trên kênh phiên: `{ type, auctionId, data }`
- `type: "BID_PLACED"`, `data` = `BidResponse` (`id, auctionId, bidderId, bidderName (đã che), amount, status, createdAt`) + `auctionCurrentPrice, auctionBidCount, minNextBid, reserveStatus` (trạng thái phiên **sau** lượt đặt) → chèn đầu lịch sử, lấy giá, số lượt, `minNextBid`, `reserveStatus` từ chính tin này; **không tự tính**.
- `type: "AUCTION_UPDATED"`, `data` = `AuctionResponse` (mở, đóng, huỷ, admin huỷ, người bán sửa phiên SCHEDULED) → thay toàn bộ dữ liệu phiên trong cache.
- Tin WebSocket không bao giờ có `reservePrice`.

Tin trên kênh cá nhân: `NotificationResponse` (`id, type, title, content, refType, refId, isRead, createdAt, unreadCount`) → `unreadCount` dùng thẳng cho badge chuông.

## 2. Endpoint (base `/api/v1`)

### 2.1. Tài khoản và hồ sơ

| Màn hình | Method + path | Body / query | Ghi chú |
| --- | --- | --- | --- |
| S03 | `POST /auth/register` | `{ fullName, email, password (≥ 6), phoneNumber?, address? }` | → `AuthResponse` (đăng nhập luôn). `EMAIL_ALREADY_EXISTS` |
| S04 | `POST /auth/login` | `{ email, password }` | `INVALID_CREDENTIALS`, `ACCOUNT_BANNED` |
| S08 | `GET /users/me` | | `UserProfileResponse { id, fullName, email, phoneNumber, address, avatarUrl, role, status, createdAt }` |
| S08 | `PATCH /users/me` | `{ fullName (2–100), phoneNumber (8–20, số + - khoảng trắng), address (≤ 255) }` | Email, vai trò, trạng thái không sửa được |
| S08 | `PATCH /users/me/password` | `{ currentPassword, newPassword (≥ 6) }` | `WRONG_PASSWORD`; mật khẩu mới trùng cũ → `VALIDATION_ERROR` có `data.newPassword` |
| S08 | `POST /users/me/avatar`, `DELETE /users/me/avatar` | multipart `file` | → `UserProfileResponse`. `INVALID_IMAGE`, `IMAGE_TOO_LARGE` |

### 2.2. Danh mục, phiên, đặt giá

| Màn hình | Method + path | Body / query | Ghi chú |
| --- | --- | --- | --- |
| S00, S01, S15 | `GET /categories`, `GET /categories/{id}` | | Công khai. `PublicCategoryResponse { id, name, slug, iconUrl, auctionCount }` (`auctionCount` = phiên SCHEDULED + ACTIVE), sắp theo tên |
| S00, S01, S23 | `GET /auctions` | `status` (nhiều giá trị, phẩy), `q` (≤ 100), `categoryIds` (phẩy), `minPrice`, `maxPrice`, `sellerId`, `sort`, `page`, `size` (≤ 50) | `PageResponse<AuctionResponse>`. `sort` chỉ nhận `endTime,asc` · `startTime,asc` · `currentPrice,asc` · `currentPrice,desc` · `bidCount,desc` · `createdAt,desc` (mặc định); khác → `VALIDATION_ERROR`. Lọc giá trên giá hiện tại (chưa có bid thì là giá khởi điểm); `minPrice > maxPrice` → `VALIDATION_ERROR`. Không trả phiên của sản phẩm HIDDEN/REMOVED |
| S02, S05, S17 | `GET /auctions/{id}` | | `AuctionDetailResponse` (mục 2.6) |
| S02, S05, S17 | `GET /auctions/{id}/bids` | `limit?` (1–100) | Mảng bid, giá giảm dần. Không truyền `limit` → toàn bộ |
| S05 | `POST /bids` | `{ auctionId, amount }` | 201 → `BidResponse`. `BID_TOO_LOW` (409, `data.minNextBid`), `ALREADY_LEADING` (409), `SELF_BID_NOT_ALLOWED` (422), `AUCTION_NOT_ACTIVE` (409), `ACCOUNT_BANNED` (403) |
| S06 | `GET /bids/mine` | `status?` (BidStatus của lượt cao nhất của tôi, một giá trị), `auctionStatus?` (nhiều giá trị, phẩy – vd `ENDED,UNSOLD,CANCELLED`), `q?`, `page`, `size` | `PageResponse<MyBidResponse>`, **mỗi phiên một dòng** (mục 2.6). **Không có `sort`**: luôn sắp `myLastBidAt` giảm dần. Tab S06: Tất cả = không truyền · Đang diễn ra = `ACTIVE` · Đã kết thúc = `ENDED,UNSOLD,CANCELLED` |
| S06 | `GET /bids/mine/summary` | | `{ totalAuctions, totalBids, leading, outbid, won }` |
| S07, S00–S02 | `POST /watchlist/{auctionId}` | | 201 (200 nếu đã theo dõi) `{ auctionId, watchedAt }`. `SELF_WATCH_NOT_ALLOWED` (422), 404 |
| S07 | `DELETE /watchlist/{auctionId}` | | 200 (kể cả khi chưa theo dõi) |
| S07 | `GET /watchlist` | `status?`, `page`, `size` | `PageResponse<AuctionResponse + watchedAt>`, sắp `watchedAt` giảm dần |
| S07 | `GET /watchlist/summary` | | `{ total, active, scheduled, ended (ENDED + UNSOLD), cancelled }` |

### 2.3. Kênh người bán

| Màn hình | Method + path | Body / query | Ghi chú |
| --- | --- | --- | --- |
| S15 | `POST /products` | `{ title (5–120), categoryId, condition, description (20–2000) }` | 201 → `ProductDetailResponse`, status AVAILABLE. `CATEGORY_NOT_FOUND` |
| S14 | `GET /products/mine` | `status?`, `categoryId?`, `q?`, `page`, `size` | `PageResponse<ProductSummaryResponse>`; không truyền `status` → không có REMOVED; sắp `updatedAt` giảm dần |
| S14 | `GET /products/mine/summary` | | `{ total, available, inAuction, reserved, sold, hidden }` |
| S15 | `GET /products/{id}` | | `ProductDetailResponse`. Chỉ chủ sản phẩm/admin (`FORBIDDEN`); REMOVED → 404 |
| S15 | `PATCH /products/{id}` | như tạo | Chỉ khi AVAILABLE → `PRODUCT_NOT_EDITABLE` |
| S14 | `DELETE /products/{id}` | | Đổi sang REMOVED, trả `ProductDetailResponse`. Chỉ khi AVAILABLE → `PRODUCT_NOT_EDITABLE` |
| S15 | `POST /products/{id}/images` | multipart `file`, **một ảnh mỗi request** | 201 `ProductImageResponse { id, url, isPrimary, createdAt }`; ảnh đầu tự là ảnh chính. `PRODUCT_IMAGE_LIMIT` (tối đa 5), `INVALID_IMAGE` (PNG/JPG/WEBP), `IMAGE_TOO_LARGE` (> 10MB), `PRODUCT_NOT_EDITABLE` |
| S15 | `DELETE /products/{id}/images/{imageId}` | | → `ProductDetailResponse`; xoá ảnh chính thì ảnh cũ nhất còn lại thành ảnh chính |
| S15 | `PATCH /products/{id}/images/{imageId}/primary` | | → `ProductDetailResponse` |
| S16 | `POST /auctions` | `{ productId, startPrice, bidIncrement, reservePrice?, startTime, endTime }` | `VALIDATION_ERROR` (thời gian quá khứ, thời lượng 1 giờ–30 ngày, giá sàn < giá khởi điểm), `PRODUCT_NOT_AVAILABLE`, `PRODUCT_IMAGE_REQUIRED` (sản phẩm chưa có ảnh), `FORBIDDEN`. Chọn sản phẩm: `GET /products/mine?status=AVAILABLE` |
| S17 | `PATCH /auctions/{id}` | `{ startPrice?, bidIncrement?, reservePrice?, clearReservePrice?, startTime?, endTime? }` | → `AuctionDetailResponse`. Chỉ chủ phiên, chỉ khi SCHEDULED → `AUCTION_NOT_EDITABLE`; cùng quy tắc `VALIDATION_ERROR` như tạo. `clearReservePrice: true` → bỏ giá sàn |
| S17 | `POST /auctions/{id}/cancel` | `{ reason? }` | `CANNOT_CANCEL` (đã có bid), `FORBIDDEN` |
| `/seller/auctions` | `GET /auctions/mine` | `status?`, `page`, `size` | `PageResponse<SellerAuctionResponse>` = `AuctionResponse` + `reservePrice` + `orderId` (nếu ENDED); gồm cả CANCELLED; cần đăng nhập |
| `/seller/orders`, S18 | `GET /orders?role=seller` | xem 2.4 | |

### 2.4. Đơn hàng, thanh toán, vận chuyển, báo cáo, thông báo

| Màn hình | Method + path | Body / query | Ghi chú |
| --- | --- | --- | --- |
| S10, seller | `GET /orders` | `role=buyer\|seller`, `status?`, `page`, `size` | `OrderResponse` có `productImageUrl`, `paymentDeadline`, `viewerRole` |
| S10 | `GET /orders/summary` | `role=buyer\|seller` | `{ total, pendingPayment, paid, shipping, completed, cancelled, expired, completedTotal }` – cho hàng KPI |
| S11, S12, S18 | `GET /orders/{id}` | | `OrderDetailResponse` có **`allowedActions`** và `viewerRole` – xem mục 3 |
| S11 | `PATCH /orders/{id}/shipping-info` | `{ shippingAddress (≤255), phoneNumber (8–20 ký tự số, + - khoảng trắng) }` | |
| S11 | `POST /orders/{id}/payments` | header `Idempotency-Key`; `{ method: MOCK_CARD\|MOCK_BANK\|MOCK_WALLET, simulateResult?: SUCCESS\|FAILED\|PROCESSING }` | 200 SUCCESS/FAILED, **202** PENDING. `PAYMENT_IN_PROGRESS`, `PAYMENT_RATE_LIMITED` (429, `data.retryAfterSeconds` + header `Retry-After`), `ORDER_EXPIRED`, `ORDER_CANCELLED`, `INVALID_STATUS_TRANSITION`, `VALIDATION_ERROR` (chưa có địa chỉ/SĐT, key sai) |
| S11 | `GET /orders/{id}/payments` | | Mảng `PaymentHistoryResponse` |
| S12, S18 | `GET /orders/{orderId}/shipment` | | `ShipmentDetailResponse` có `events[]` (`status, note, by, createdAt`) |
| S18 | `PATCH /shipments/{id}/status` | `{ status, note? (≤255) }` | `INVALID_STATUS_TRANSITION` |
| S12 | `PATCH /orders/{id}/confirm-receipt` | | `COMPLAINT_PENDING`, `INVALID_STATUS_TRANSITION` |
| S13 | `POST /reports` | `{ reportType, reportedUserId?, reportedProductId?, orderId?, reason (10–2000 ký tự) }` | `DUPLICATE_PENDING_REPORT`, `COMPLAINT_WINDOW_CLOSED`, `VALIDATION_ERROR` (tự báo cáo mình/sản phẩm mình) |
| S09, S09a | `GET /notifications` | `isRead?`, `type?` (NotificationType, nhiều giá trị, phẩy), `page`, `size` | Chip lọc loại ở S09 gọi API với `type` |
| S09, S09a | `GET /notifications/unread-count` | | `{ unreadCount }` |
| S09, S09a | `PATCH /notifications/{id}/read`, `PATCH /notifications/read-all` | | |

### 2.5. Quản trị

| Màn hình | Method + path | Body / query | Ghi chú |
| --- | --- | --- | --- |
| S19 | `GET /admin/statistics` | `from?`, `to?` (ISO datetime) | users, products, auctions (kèm `sellThroughRate`), bids, orders, revenue, payments, reports |
| S20 | `GET /admin/users`, `PATCH /admin/users/{id}` | `status?`, `q?`; body `{ status: BANNED\|ACTIVE, reason (≥5) }` | `CANNOT_BAN_ADMIN`, `INVALID_STATUS_TRANSITION` |
| S21 | `GET/POST /admin/categories`, `PUT/DELETE /admin/categories/{id}` | `{ name (≤100), iconUrl? }` – slug backend tự sinh | `CATEGORY_IN_USE`, `VALIDATION_ERROR` (slug trùng) |
| S22 | `GET /admin/products`, `PATCH /admin/products/{id}` | `status?`, `sellerId?`, `categoryId?`; body `{ status: HIDDEN\|AVAILABLE, reason (≥5) }` | `AVAILABLE` = bỏ ẩn, chỉ từ HIDDEN (khác → `INVALID_STATUS_TRANSITION`); không khôi phục phiên/đơn đã huỷ khi ẩn |
| S23 | `POST /admin/auctions/{id}/cancel` | `{ reason (≥5) }` | Danh sách phiên dùng `GET /auctions` (đủ bộ lọc ở 2.2) |
| S24 | `GET /admin/orders`, `POST /admin/orders/{id}/cancel` | `status?`, `buyerId?`, `sellerId?`, `from?`, `to?`; body `{ reason (≥5) }` | |
| S25 | `GET /admin/reports`, `PATCH /admin/reports/{id}/resolve` | `status` (mặc định PENDING), `reportType?`; body `{ action, note (≥5) }` | Response có `effects` – hiển thị trong toast |
| S26 | `GET /admin/audit-logs` | `adminId?`, `action?`, `targetType?`, `targetId?`, `from?`, `to?` | Có thêm action `PRODUCT_UNHIDDEN` |

### 2.6. DTO mới (P1–P11)

| DTO | Trường |
| --- | --- |
| `AuctionResponse` (danh sách, WS `AUCTION_UPDATED`) | các trường cũ (`id, productId, productTitle, sellerId, sellerName, startPrice, bidIncrement, currentPrice, highestBidderId, highestBidderName, bidCount, startTime, endTime, status, winnerId, finalPrice, closedAt, cancelReason, createdAt`) **+** `categoryId, categoryName, productCondition, primaryImageUrl, minNextBid, reserveStatus`; khi có token thêm `isWatched` |
| `AuctionDetailResponse` (`GET /auctions/{id}`) | `AuctionResponse` + `productDescription, images[{ id, url, isPrimary }]` (ảnh chính đầu tiên), `serverTime`, `isWatched` (null khi là khách), `reservePrice` (chỉ chủ phiên/admin, người khác không có khoá này) |
| `reserveStatus` | `NONE` (không đặt giá sàn) · `MET` (có bid và giá hiện tại ≥ giá sàn) · `NOT_MET` |
| `minNextBid` | Backend tính, dùng chung với kiểm tra `BID_TOO_LOW`; null khi phiên không ACTIVE/SCHEDULED |
| `ProductSummaryResponse` | `id, title, categoryId, categoryName, condition, status, primaryImageUrl, imageCount, activeAuctionId, activeAuctionStatus, createdAt, updatedAt` |
| `ProductDetailResponse` | Summary + `description, images[{ id, url, isPrimary, createdAt }], hiddenReason` |
| `MyBidResponse` | `auctionId, productTitle, primaryImageUrl, categoryName, auctionStatus, currentPrice, endTime, closedAt, myHighestBid, myBidCount, myLastBidAt, myStatus, isLeading, orderId`. **Không có** `productCondition` và lý do vô hiệu – xem `gaps.md` G22 |

## 3. Ẩn/hiện nút trong đơn hàng: dùng `allowedActions`

`GET /orders/{id}` trả `viewerRole` (`BUYER` / `SELLER` / `ADMIN`) và `allowedActions`. **Chỉ hiện nút có trong mảng**, không tự suy từ trạng thái:

| Action | Nút |
| --- | --- |
| `PAY` | Thanh toán (S11) |
| `UPDATE_SHIPPING_INFO` | Lưu thông tin giao hàng (S11) |
| `CONFIRM_RECEIPT` | Xác nhận đã nhận hàng (S12) |
| `COMPLAIN` | Gửi khiếu nại (S12 → S13) |
| `UPDATE_SHIPMENT` | Cập nhật vận chuyển (S18) |

`hasPendingComplaint: true` → hiện banner "Khiếu nại đang được xử lý".

## 4. Lưu ý khi nối

- `GET /auctions/{id}` và `GET /auctions`, tin WebSocket: không bao giờ có `reservePrice` cho người không phải chủ phiên/admin – frontend không được dựa vào trường này ở trang người mua.
- `GET /auctions/mine` cần token (không thuộc nhóm `GET /auctions/**` công khai).
- Ảnh: backend lưu Cloudinary hoặc thư mục cục bộ (`http://localhost:8080/uploads/...`) – khai báo cả hai trong `images.remotePatterns` của `next.config`.
- Đồng hồ đếm ngược tính độ lệch giờ từ `serverTime` của `GET /auctions/{id}`.

## 5. Khác với spec cũ (đã sửa trong rule)

| Spec cũ | Thực tế |
| --- | --- |
| `{ success:false, error:{ code, message } }` | `{ success:false, errorCode, message, data }` |
| `POST /auctions/{id}/bids` | `POST /bids` với `auctionId` trong body |
| WS `/ws`, kênh `/topic/auctions/{id}` | `/ws-auction`, kênh `/topic/auction/{id}` |
| Thời gian ISO có múi giờ | `LocalDateTime` giờ VN, không múi giờ |
| Mật khẩu ≥ 8 ký tự, có hoa/thường/số | Backend chỉ yêu cầu ≥ 6 ký tự – frontend dùng đúng quy tắc backend |
| Frontend tự tính `minNextBid` | Backend trả `minNextBid` trong dữ liệu phiên và tin `BID_PLACED`; lỗi `BID_TOO_LOW` cũng có `data.minNextBid` |
| `GET /orders/{id}/payments` trả trang | Trả mảng |
| Lý do khiếu nại gộp "Lý do: Mô tả" | Giữ nguyên, nhưng tổng ≥ 10 ký tự |
| Ghi chú/lý do admin bắt buộc | ≥ 5 ký tự |
