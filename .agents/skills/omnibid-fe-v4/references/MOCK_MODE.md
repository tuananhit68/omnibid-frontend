# MOCK_MODE — Chạy frontend không cần backend

Mục tiêu: làm và demo toàn bộ giao diện khi backend chưa chạy, với **đúng hợp đồng v4** (endpoint, envelope, mã lỗi, `RESPONSE_DTO_v4.md`, sự kiện WebSocket) để khi đổi sang backend thật không phải sửa màn hình. Không thêm thư viện.

## 1. Bật/tắt
- `NEXT_PUBLIC_API_MODE=mock | live` (`.env.example` để `live`; `.env.local` của máy chưa có backend để `mock`).
- `src/lib/api/client.ts`: khi `mock`, gắn `adapter` của axios = `mockAdapter` (import động `@/mocks/adapter`) — mọi `api.ts` giữ nguyên.
- `src/lib/ws`: khi `mock`, `getAuctionChannel()` trả kênh giả dùng bus trong bộ nhớ thay vì STOMP; cùng interface `subscribe(auctionId, cb)`.
- Trang dùng Server Component để tải dữ liệu đầu: ở chế độ mock **bỏ tải phía server** (trả `null`), để Client Component tự tải — vì kho dữ liệu mock nằm trong trình duyệt.
- Banner nhỏ cố định "Chế độ dữ liệu giả lập" (chỉ ở mock) + link `/dev/mock`. Mã mock không được import ở đâu khác ngoài `client.ts`, `lib/ws`, `/dev/mock`.

## 2. Cấu trúc `src/mocks/`
```text
src/mocks/
  adapter.ts        # axios adapter: định tuyến METHOD + path → handler; trả envelope v4, HTTP status đúng; trễ 150–400ms
  db.ts             # kho trong bộ nhớ + lưu sessionStorage (giữ qua F5), reset(); đồng hồ giả lập now()
  seed.ts           # dữ liệu mẫu (mục 4)
  errors.ts         # mockError(code, message, details?) đúng 24 mã v4 và HTTP status
  auth.ts           # token giả "mock.<userId>.<tokenVersion>", kiểm tra như backend (401/403)
  scheduler.ts      # tick(now): mở phiên đến giờ, chốt phiên hết giờ (BR-09), hết hạn đơn, tự hoàn tất — chạy trước mỗi request và mỗi 5 giây
  ws-bus.ts         # phát AuctionEvent cho kênh giả
  handlers/         # auth.ts users.ts categories.ts products.ts auctions.ts bids.ts orders.ts payments.ts notifications.ts reports.ts admin.ts
```
Mỗi handler: kiểm tra quyền (vai trò, chủ sở hữu), kiểm tra quy tắc nghiệp vụ theo `backend/BUSINESS_RULES_v4.md` ở mức đủ để giao diện gặp đúng các mã lỗi (BID_TOO_LOW kèm `minNextBid`, ALREADY_LEADING, SELF_BID_NOT_ALLOWED, PRODUCT_NOT_EDITABLE, CANNOT_CANCEL, ORDER_EXPIRED, TOO_MANY_REQUESTS sau 5 lần sai…), trả DTO đúng `RESPONSE_DTO_v4.md` (dùng chung type `src/lib/api/contract.ts` — typecheck bảo đảm khớp). Sinh thông báo như bảng §7 của BUSINESS_RULES.
Ảnh tải lên: đọc `File` thành data URL (giới hạn 5 MB/ảnh như thật), kiểm tra magic bytes đơn giản để thử được `INVALID_IMAGE`. `next/image` với data URL cần `unoptimized` — chỉ bật khi mock.
Phân trang, lọc, sắp xếp (whitelist) làm đúng như API để thử được UI danh sách.

## 3. Trang `/dev/mock` (chỉ khi mock)
- Đăng nhập nhanh bằng tài khoản mẫu; xem người dùng hiện tại.
- "Người khác đặt giá" vào một phiên (chọn tài khoản mẫu) → phát `BID_PLACED` để thử realtime và OUTBID.
- Tua đồng hồ giả lập: +1 phút, +1 giờ, +2 ngày (để thấy chốt phiên, hết hạn thanh toán, tự hoàn tất).
- Đặt kết quả thanh toán mặc định; reset dữ liệu về seed.

## 4. Dữ liệu mẫu (seed)
- Người dùng (mật khẩu đều `Demo@1234`, trừ admin): `admin@omnibid.local` / `Admin@123456` (ADMIN); `seller@omnibid.local` (bán); `buyer1@omnibid.local`, `buyer2@omnibid.local` (mua); `banned@omnibid.local` (BANNED).
- 6 danh mục giống V2 backend: Đồng hồ `watch`, Máy ảnh `camera`, Điện thoại `smartphone`, Sách `book-open`, Đồ sưu tầm `gem`, Thời trang `shirt`.
- Khoảng 12 sản phẩm phủ đủ 5 trạng thái; ảnh dùng ảnh minh họa trung tính sinh bằng SVG data URL (không ảnh thương hiệu, không ảnh người thật).
- Phiên phủ đủ 5 trạng thái: ACTIVE kết thúc sau 3 phút (để demo chốt), ACTIVE có giá sàn chưa đạt, SCHEDULED bắt đầu sau 2 phút, ENDED có đơn, UNSOLD, CANCELLED có lý do.
- Đơn phủ đủ 6 trạng thái, có lịch sử thanh toán FAILED rồi SUCCESS.
- Thông báo đủ 5 loại; báo cáo PENDING/RESOLVED/REJECTED với đủ 3 loại đối tượng.

## 5. Ranh giới
- Mock là công cụ phát triển, không phải nguồn sự thật: khi mock và `RESPONSE_DTO_v4.md`/`API_SPEC_v4.md` khác nhau, sửa mock.
- Build production luôn ở `live`; `verify-fe-v4.ps1` cảnh báo nếu `.env.example` để `mock`.
- Mỗi phase làm màn nào thì bổ sung handler + seed cho endpoint của màn đó (phase 1 làm khung + auth + categories).
