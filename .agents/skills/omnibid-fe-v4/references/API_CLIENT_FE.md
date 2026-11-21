# API_CLIENT_FE — Frontend dùng API backend v4 như thế nào

Hợp đồng gốc: `backend/API_SPEC_v4.md` (54 endpoint, tham số, mã lỗi, JSON mẫu). Quy tắc nghiệp vụ: `backend/BUSINESS_RULES_v4.md`.
Tệp này nói **cách frontend gọi và mô hình hóa** hợp đồng đó. Mặc định backend v4 đã hoàn thành.

## 0. Không cần backend đang chạy
- Hình dạng dữ liệu của cả 54 endpoint đã chốt trong `backend/RESPONSE_DTO_v4.md` (bản giống hệt ở repo backend, backend phải trả đúng). Viết type **theo đúng tệp này**, không cần gọi thử backend.
- Phát triển và demo không cần backend: chế độ mock (`NEXT_PUBLIC_API_MODE=mock`) theo `MOCK_MODE.md`.
- Khi có backend thật (`NEXT_PUBLIC_API_MODE=live`): ở môi trường dev, lớp API kiểm tra response bằng zod schema sinh từ cùng type; lệch hợp đồng thì `console.warn` có tên endpoint và trường → ghi vào `docs/v4/PROGRESS.md` mục "Lệch hợp đồng" (backend phải sửa theo RESPONSE_DTO, hoặc cả hai bên thống nhất sửa tệp này).

## 1. Envelope và lỗi (thay đổi so với code cũ)
```ts
// src/lib/api/types.ts
export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; error: { code: ErrorCode; message: string; details?: Record<string, unknown> } };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
export interface Page<T> { content: T[]; page: number; size: number; totalElements: number; totalPages: number }
```
- Không còn `errorCode`, `message`, `timestamp` cấp ngoài. `ApiError { status, code, message, details, fieldErrors? }`.
- `VALIDATION_ERROR`: `details.fields` là map `{ field: message }` → `setError` của react-hook-form.
- `BID_TOO_LOW`: `details.minNextBid`. Các mã khác: không có details.
- `ErrorCode` là union đúng 24 mã (API_SPEC §5) + mã nội bộ frontend `NETWORK_ERROR`. Xóa mọi mã cũ trong `lib/errors.ts`
  (`INVALID_CREDENTIALS`, `EMAIL_ALREADY_EXISTS`, `WRONG_PASSWORD`, `PAYMENT_IN_PROGRESS`, `PAYMENT_RATE_LIMITED`, `COMPLAINT_*`, `DUPLICATE_PENDING_REPORT`, `SELF_WATCH_NOT_ALLOWED`, `PRODUCT_IMAGE_LIMIT`, `IMAGE_TOO_LARGE`…).
- Câu hiển thị lấy từ `lib/errors.ts` theo `code`; có thể dùng `message` tiếng Việt của backend làm câu phụ khi mã là `VALIDATION_ERROR` hoặc `INVALID_STATUS_TRANSITION`.
- 401 `UNAUTHORIZED` (token hết hạn, đã đăng xuất ở thiết bị khác, đổi mật khẩu) → xóa phiên, chuyển `/login?redirect=`. **Ngoại lệ**: `POST /auth/login` trả 401 nghĩa là sai email/mật khẩu → hiện "Email hoặc mật khẩu không đúng", không redirect.
- 403 `ACCOUNT_BANNED` ở bất kỳ request nào → xóa phiên, chuyển `/login?reason=banned` và hiện "Tài khoản đã bị khóa".
- 403 `FORBIDDEN` → trang/khối "Bạn không có quyền". 404 → `notFound()`.
- 429 `TOO_MANY_REQUESTS` (chỉ đăng nhập) → "Bạn đã đăng nhập sai quá nhiều lần, vui lòng thử lại sau 15 phút".
- 413 `PAYLOAD_TOO_LARGE`, 502 `IMAGE_UPLOAD_FAILED`, 409 `CONFLICT` ("Dữ liệu vừa thay đổi, vui lòng thử lại" + nút thử lại).

## 2. Thời gian và tiền
- Backend trả ISO 8601 **có offset** `+07:00` (`2026-11-20T09:00:00+07:00`) và nhận mọi offset.
- Parse bằng `dayjs(value)` (chuỗi đã có offset) rồi `.tz('Asia/Ho_Chi_Minh')` để hiển thị. **Bỏ** `dayjs.tz(value, VN)` dùng cho chuỗi không múi giờ (cũ).
- Gửi lên: `dayjs.tz(localInput, 'Asia/Ho_Chi_Minh').format()` → `2026-11-20T20:00:00+07:00`. Không gửi chuỗi thiếu offset.
- Không còn `serverTime` trong chi tiết phiên. Độ lệch đồng hồ: lấy header `Date` của response `GET /auctions/{id}` (axios `response.headers.date`) → `serverOffsetMs`. Nếu không đọc được header (CORS chưa expose), dùng 0 và ghi vào PROGRESS.md.
- Tiền là số nguyên VND (`520000`). Type `number`, gửi số nguyên; `MoneyInput` không cho phần thập phân.
- Lịch sử đặt giá hiển thị đến mili giây `HH:mm:ss.SSS`.

## 3. Xác thực
- Lưu JWT ở `localStorage` (quyết định Thiết kế 6.1; XSS được giảm thiểu bằng: không `dangerouslySetInnerHTML`, React escape, CSP, hạn 24h). Bỏ chế độ "ghi nhớ" bằng sessionStorage nếu làm phức tạp — tùy chọn.
- Cookie phụ `omnibid_role` + `omnibid_auth=1` (không chứa token) chỉ để `proxy.ts`/`middleware.ts` điều hướng sớm. Backend vẫn là chốt chặn.
- Lưu kèm `user` từ response đăng nhập (`id, fullName, email, role, status, avatarUrl`) và `expiresAt` (tự đăng xuất khi hết hạn).
- `POST /auth/logout` → dù thành công hay lỗi mạng: xóa token, về `/login`. Đổi mật khẩu thành công → toast "Đã đổi mật khẩu, vui lòng đăng nhập lại" → xóa token → `/login`.
- Đăng ký thành công (201, không có token) → `/login?registered=1&email=<email>` + toast.

## 4. Type
Sao `backend/RESPONSE_DTO_v4.md` thành `src/lib/api/contract.ts` (type + zod schema cho từng DTO, export dùng chung). Feature import từ đây, không định nghĩa lại DTO trong `features/*/types.ts` (chỉ thêm type riêng của UI như giá trị form).
Người xem của đơn: `OrderDetail.viewerRole`. Người xem của phiên: `AuctionDetail.viewerIsSeller`, `viewerIsLeading`, `orderId`.

## 5. Gọi API (lớp `src/features/<domain>/api.ts`)
| Việc | Gọi |
|---|---|
| Đặt giá | `POST /auctions/${id}/bids` body `{ amount }` |
| Lịch sử giá | `GET /auctions/${id}/bids?page&size&sort=createdAt,desc` → `Page<BidHistoryItem>` |
| Tạo sản phẩm | `FormData`: `product` = `new Blob([JSON.stringify(dto)], { type: 'application/json' })`, `files` (append nhiều lần, ảnh chính trước). Không tự đặt header `Content-Type` (để trình duyệt thêm boundary) |
| Thêm ảnh | `POST /products/${id}/images` FormData `files` nhiều tệp |
| Ảnh đại diện | `POST /users/me/avatar` FormData `file` |
| Thanh toán | `POST /orders/${id}/payments` body `{ method: 'MOCK_CARD', simulateResult? }`, header `Idempotency-Key: crypto.randomUUID()`; gửi `simulateResult` chỉ khi `NEXT_PUBLIC_DEMO_MODE=true` (backend tự bỏ qua nếu tắt) |
| Gửi hàng | `POST /orders/${id}/ship` `{ trackingCode? }` |
| Xác nhận | `POST /orders/${id}/confirm-receipt` |
| Đọc thông báo | `POST /notifications/${id}/read` |
| Số chưa đọc | `GET /notifications?isRead=false&size=1` → `totalElements` (không có endpoint `unread-count`) |
| Admin | `POST /admin/users/${id}/ban|unban`, `POST /admin/products/${id}/hide`, `POST /admin/auctions/${id}/cancel`, `POST /admin/orders/${id}/cancel`, `POST /admin/reports/${id}/resolve` `{ decision, note }` |

Query key tập trung theo domain (`auctionKeys`, `orderKeys`, `notificationKeys`, `adminKeys`…). Mutation xong invalidate đúng key.

## 6. WebSocket
- Thư viện `@stomp/stompjs` với **WebSocket thuần** (bỏ `sockjs-client`): `brokerURL = NEXT_PUBLIC_WS_URL` = `ws://localhost:8080/ws`.
- CONNECT gửi `Authorization: Bearer <token>` nếu có (Guest vẫn kết nối). Client **chỉ SUBSCRIBE**, không bao giờ `publish`.
- Kênh duy nhất: `/topic/auctions/{id}`. Không còn `/user/queue/notifications` (thông báo tải khi mở trang/định kỳ).
- Thông điệp `AuctionEvent { type, auctionId, status, currentPrice, minNextBid, bidCount, highestBidderName, reserveStatus, startTime, endTime, bid?, createdAt }`:
  - `BID_PLACED`: cập nhật giá, số lượt, minNextBid, người dẫn đầu; chèn `bid` lên đầu lịch sử (bỏ qua nếu `bidCount` ≤ dữ liệu đang có).
  - `AUCTION_UPDATED`: người bán sửa phiên SCHEDULED → cập nhật giá khởi điểm/bước giá/thời gian (refetch chi tiết).
  - `AUCTION_STARTED`: SCHEDULED → ACTIVE, bật form đặt giá.
  - `AUCTION_ENDED`: ENDED/UNSOLD, tắt form, bỏ "Đang chốt phiên", refetch chi tiết (người thắng, giá cuối).
  - `AUCTION_CANCELLED`: CANCELLED, tắt form, hiện lý do sau refetch.
- Ghi tất cả bằng `queryClient.setQueryData` vào cache của chi tiết phiên và lịch sử; không giữ state song song.
