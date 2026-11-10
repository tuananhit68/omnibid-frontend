# Hợp đồng API thật – đối chiếu với backend

Đối chiếu với `Kiii0512/omnibid-backend`, nhánh `feature/post-auction-backend`, commit `a5cab9d` (05/11/2026). **File này thắng mục "API" trong các spec** – spec được viết trước khi có code.

Khi backend thêm endpoint, cập nhật file này trước rồi mới code màn hình liên quan.

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

### Phân trang

`PageResponse`: `{ content: T[], page, size, totalElements, totalPages }`, `page` bắt đầu từ 0. Tham số `page`, `size` (mặc định 20); `GET /auctions` nhận thêm `sort=field,asc|desc` (Spring Pageable).

### Thời gian

Backend trả `LocalDateTime` **không có múi giờ** (`"2026-10-28T21:30:00"`), là giờ Việt Nam (`Asia/Ho_Chi_Minh`). Frontend phải parse là giờ VN: `dayjs.tz(value, 'Asia/Ho_Chi_Minh')`, **không** dùng `new Date(value)` (trình duyệt ở múi giờ khác sẽ lệch). Gửi lên cũng dạng `YYYY-MM-DDTHH:mm:ss` giờ VN, không thêm `Z`.

### Tiền

`BigDecimal` → JSON là số (`21500000` hoặc `21500000.00`). Frontend đọc bằng `Number()`; hiển thị không phần thập phân.

### Xác thực

- `POST /auth/login` → `{ accessToken, tokenType: "Bearer", userId, email, fullName, role: "USER"|"ADMIN" }`. Không có refresh token; JWT hết hạn sau 24 giờ → 401 thì chuyển trang đăng nhập.
- `POST /auth/register` `{ fullName, email, password (≥ 6 ký tự), phoneNumber?, address? }` → cùng dạng `AuthResponse` (đăng nhập luôn). Lỗi `EMAIL_ALREADY_EXISTS` (409).
- Không có endpoint đăng xuất: xoá token ở client.
- Không có `GET /users/me`: thông tin người dùng lấy từ `AuthResponse` lúc đăng nhập.

### WebSocket

| | Giá trị |
| --- | --- |
| Endpoint | `/ws-auction` (SockJS: `http://host:8080/ws-auction`) |
| CONNECT header | `Authorization: Bearer <token>` (khách bỏ trống vẫn nhận được kênh phiên) |
| Kênh phiên | `/topic/auction/{auctionId}` (**số ít**) |
| Kênh cá nhân | `/user/queue/notifications` |

Tin trên kênh phiên: `{ type, auctionId, data }`
- `type: "BID_PLACED"`, `data` = `BidResponse` (`id, auctionId, bidderId, bidderName (đã che), amount, status, createdAt`) → cộng vào lịch sử, cập nhật giá = `amount`, `bidCount + 1`, tính lại `minNextBid`.
- `type: "AUCTION_UPDATED"`, `data` = `AuctionResponse` (mở phiên, đóng phiên, huỷ, admin huỷ) → thay toàn bộ dữ liệu phiên trong cache.

Tin trên kênh cá nhân: `NotificationResponse` (`id, type, title, content, refType, refId, isRead, createdAt, unreadCount`) → `unreadCount` dùng thẳng cho badge chuông.

## 2. Endpoint có sẵn (base `/api/v1`)

| Màn hình | Method + path | Body / query | Ghi chú |
| --- | --- | --- | --- |
| S03 | `POST /auth/register` | xem trên | |
| S04 | `POST /auth/login` | `{ email, password }` | |
| S00, S01, S07 | `GET /auctions` | `status?`, `page`, `size`, `sort` | **Chỉ lọc theo trạng thái** – xem B3 |
| S02, S05, S17 | `GET /auctions/{id}` | | `AuctionResponse` – xem B4 |
| S02, S05, S17 | `GET /auctions/{id}/bids` | | Mảng **toàn bộ** bid, giá giảm dần (không phân trang) – frontend tự cắt 5 dòng đầu |
| S05 | `POST /bids` | `{ auctionId, amount }` | 201 → `BidResponse`. Lỗi: `BID_TOO_LOW` (409, `data.minNextBid`), `ALREADY_LEADING` (409), `SELF_BID_NOT_ALLOWED` (422), `AUCTION_NOT_ACTIVE` (409), `ACCOUNT_BANNED` (403) |
| S16 | `POST /auctions` | `{ productId, startPrice, bidIncrement, reservePrice?, startTime, endTime }` | Lỗi: `VALIDATION_ERROR` (thời gian quá khứ, thời lượng 1 giờ–30 ngày, giá sàn < giá khởi điểm), `PRODUCT_NOT_AVAILABLE`, `FORBIDDEN` (không phải chủ sản phẩm) |
| S17 | `POST /auctions/{id}/cancel` | `{ reason? }` | Lỗi `CANNOT_CANCEL` (đã có bid), `FORBIDDEN` |
| S10, seller | `GET /orders` | `role=buyer\|seller`, `status?`, `page`, `size` | `OrderResponse` có `productImageUrl`, `paymentDeadline`, `viewerRole` |
| S11, S12, S18 | `GET /orders/{id}` | | `OrderDetailResponse` có **`allowedActions`** và `viewerRole` – xem mục 3 |
| S11 | `PATCH /orders/{id}/shipping-info` | `{ shippingAddress (≤255), phoneNumber (8–20 ký tự số, + - khoảng trắng) }` | |
| S11 | `POST /orders/{id}/payments` | header `Idempotency-Key`; `{ method: MOCK_CARD\|MOCK_BANK\|MOCK_WALLET, simulateResult?: SUCCESS\|FAILED\|PROCESSING }` | 200 SUCCESS/FAILED, **202** PENDING. Lỗi: `PAYMENT_IN_PROGRESS`, `PAYMENT_RATE_LIMITED` (429, `data.retryAfterSeconds` + header `Retry-After`), `ORDER_EXPIRED`, `ORDER_CANCELLED`, `INVALID_STATUS_TRANSITION`, `VALIDATION_ERROR` (chưa có địa chỉ/SĐT, key sai) |
| S11 | `GET /orders/{id}/payments` | | Mảng `PaymentHistoryResponse` |
| S12, S18 | `GET /orders/{orderId}/shipment` | | `ShipmentDetailResponse` có `events[]` (`status, note, by, createdAt`) |
| S18 | `PATCH /shipments/{id}/status` | `{ status, note? (≤255) }` | `INVALID_STATUS_TRANSITION` |
| S12 | `PATCH /orders/{id}/confirm-receipt` | | `COMPLAINT_PENDING`, `INVALID_STATUS_TRANSITION` |
| S13 | `POST /reports` | `{ reportType, reportedUserId?, reportedProductId?, orderId?, reason (10–2000 ký tự) }` | `DUPLICATE_PENDING_REPORT`, `COMPLAINT_WINDOW_CLOSED`, `VALIDATION_ERROR` (tự báo cáo mình/sản phẩm mình) |
| S09, S09a | `GET /notifications` | `isRead?`, `page`, `size` | **Không lọc theo loại** – chip loại ở S09 lọc phía client trên trang hiện tại hoặc bỏ |
| S09, S09a | `GET /notifications/unread-count` | | `{ unreadCount }` |
| S09, S09a | `PATCH /notifications/{id}/read`, `PATCH /notifications/read-all` | | "Đánh dấu đã đọc tất cả" dùng được |
| S19 | `GET /admin/statistics` | `from?`, `to?` (ISO datetime) | users, products, auctions (kèm `sellThroughRate`), bids, orders, revenue, payments, reports |
| S20 | `GET /admin/users`, `PATCH /admin/users/{id}` | `status?`, `q?`; body `{ status: BANNED\|ACTIVE, reason (≥5) }` | `CANNOT_BAN_ADMIN`, `INVALID_STATUS_TRANSITION` |
| S21 | `GET/POST /admin/categories`, `PUT/DELETE /admin/categories/{id}` | `{ name (≤100), iconUrl? }` – slug backend tự sinh | `CATEGORY_IN_USE`, `VALIDATION_ERROR` (slug trùng) |
| S22 | `GET /admin/products`, `PATCH /admin/products/{id}` | `status?`, `sellerId?`, `categoryId?`; body `{ status: HIDDEN, reason (≥5) }` | Chỉ ẩn, chưa có bỏ ẩn |
| S23 | `POST /admin/auctions/{id}/cancel` | `{ reason (≥5) }` | Danh sách phiên dùng `GET /auctions?status=` |
| S24 | `GET /admin/orders`, `POST /admin/orders/{id}/cancel` | `status?`, `buyerId?`, `sellerId?`, `from?`, `to?`; body `{ reason (≥5) }` | |
| S25 | `GET /admin/reports`, `PATCH /admin/reports/{id}/resolve` | `status` (mặc định PENDING), `reportType?`; body `{ action, note (≥5) }` | Response có `effects` – hiển thị trong toast |
| S26 | `GET /admin/audit-logs` | `adminId?`, `action?`, `targetType?`, `targetId?`, `from?`, `to?` | |

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

## 4. Backend chưa có – ảnh hưởng tới màn hình

| # | Thiếu | Màn hình bị chặn | Frontend làm gì trong lúc chờ |
| --- | --- | --- | --- |
| B1 | **Toàn bộ API sản phẩm**: tạo/sửa/xoá, danh sách của tôi, upload ảnh | S14, S15; S16 (chọn sản phẩm) | Dựng giao diện với dữ liệu mock trong `src/mocks`, chưa nối API. Ưu tiên báo nhóm backend |
| B2 | `GET /categories` công khai (SecurityConfig đã mở đường dẫn nhưng chưa có controller) | S00, S01, S15 | Tạm gọi `/admin/categories` không được (cần ADMIN) → mock danh mục |
| B3 | Lọc phiên theo từ khoá, danh mục, khoảng giá | S01, ô tìm kiếm header, S07 | Chỉ làm lọc trạng thái + sắp xếp; ẩn panel lọc danh mục/giá và ô tìm kiếm cho tới khi có API |
| B4 | `AuctionResponse` thiếu: ảnh, mô tả, danh mục, tình trạng, **trạng thái giá sàn**, `minNextBid`, giờ máy chủ | S00, S01, S02, S05, S07 | Ảnh: placeholder. `minNextBid` frontend tính để **gợi ý**: `bidCount = 0 ? startPrice : currentPrice + bidIncrement` (backend vẫn chặn). Giá sàn: ẩn badge. Độ lệch giờ: đọc header `Date` của response |
| B5 | Hồ sơ: `GET/PATCH /users/me`, đổi mật khẩu | S08 | Hiển thị thông tin từ `AuthResponse`, khoá form, ghi "Sắp có" |
| B6 | Theo dõi phiên (bảng `watchlists` có, chưa có controller) | S07, nút Theo dõi ở S00/S01/S02 | Ẩn nút Theo dõi và mục menu "Theo dõi" |
| B7 | Lượt đặt giá của tôi | S06 | Ẩn mục menu "Lượt đặt giá" |
| B8 | Sửa phiên (`PATCH /auctions/{id}`), danh sách phiên của tôi | S17 (chế độ sửa), `/seller/auctions` | S17 chỉ đọc + huỷ; danh sách phiên của người bán lọc từ `GET /auctions` theo `sellerId` phía client (tạm) |
| B9 | Admin bỏ ẩn sản phẩm | S22 | Không có nút "Bỏ ẩn" |

Khi một mục B được backend làm xong: xoá dòng ở bảng này, thêm endpoint vào mục 2, gỡ mock.

## 5. Khác với spec cũ (đã sửa trong rule)

| Spec cũ | Thực tế |
| --- | --- |
| `{ success:false, error:{ code, message } }` | `{ success:false, errorCode, message, data }` |
| `POST /auctions/{id}/bids` | `POST /bids` với `auctionId` trong body |
| WS `/ws`, kênh `/topic/auctions/{id}` | `/ws-auction`, kênh `/topic/auction/{id}` |
| Thời gian ISO có múi giờ | `LocalDateTime` giờ VN, không múi giờ |
| Mật khẩu ≥ 8 ký tự, có hoa/thường/số | Backend chỉ yêu cầu ≥ 6 ký tự – frontend dùng đúng quy tắc backend |
| Bid lỗi trả `minNextBid` trong response thành công | `minNextBid` chỉ có trong `data` của lỗi `BID_TOO_LOW` |
| `GET /orders/{id}/payments` trả trang | Trả mảng |
| Lý do khiếu nại gộp "Lý do: Mô tả" | Giữ nguyên, nhưng tổng ≥ 10 ký tự |
| Ghi chú/lý do admin bắt buộc | ≥ 5 ký tự |
