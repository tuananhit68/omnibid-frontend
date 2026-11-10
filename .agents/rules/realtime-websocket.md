---
trigger: model_decision
description: Áp dụng khi làm đặt giá realtime, đồng hồ đếm ngược, kết nối WebSocket/STOMP, kênh /topic/auction/{id}, thông báo /user/queue/notifications, kết quả thanh toán bất đồng bộ.
---

# Realtime: WebSocket (STOMP qua SockJS)

## Kết nối (`src/lib/ws/stomp.ts`)

- Một client STOMP dùng chung toàn app (singleton), endpoint `NEXT_PUBLIC_WS_URL` = `http://localhost:8080/ws-auction` (SockJS).
- Header CONNECT gửi `Authorization: Bearer <token>` khi đã đăng nhập; khách vẫn kết nối được để xem giá.
- Tự kết nối lại (`reconnectDelay` 3–5 giây). Khi nối lại thành công: refetch dữ liệu đang hiển thị để bù tin bị lỡ.
- Hiện banner nhỏ "Đang kết nối lại…" khi mất kết nối quá 3 giây; ẩn khi nối lại.

## Hook

| Hook | Kênh | Việc làm |
| --- | --- | --- |
| `useAuctionChannel(auctionId)` | `/topic/auction/{id}` (**số ít**) | tin `{ type, auctionId, data }`: `BID_PLACED` (`data` = BidResponse) → chèn đầu lịch sử, `currentPrice = amount`, `bidCount + 1`, người dẫn đầu = `bidderName`; `AUCTION_UPDATED` (`data` = AuctionResponse) → thay cả object phiên (mở, đóng, huỷ) |
| `useUserNotifications()` | `/user/queue/notifications` | tin = NotificationResponse; badge chuông = `unreadCount` trong tin; chèn thông báo mới; `OUTBID`, `PAYMENT_RESULT`, `ORDER_CREATED`… → invalidate query liên quan |

- Subscribe trong `useEffect`, **unsubscribe khi unmount** hoặc khi đổi `auctionId`.
- Cập nhật cache TanStack Query bằng `setQueryData`, không giữ state song song.
- Bỏ qua tin cũ hơn dữ liệu đang có (so `bidCount` hoặc `updatedAt`) để tránh giá "nhảy lùi".
- Trang danh sách chỉ subscribe các phiên ACTIVE đang hiển thị trên màn hình.

## Đồng hồ đếm ngược

- Tính từ `endTime` (giờ VN, không múi giờ – xem `api-data.md`) và độ lệch giờ: `serverOffsetMs = Date.parse(response.headers.date) − Date.now()` lấy từ lần gọi `GET /auctions/{id}` (backend chưa có trường `serverTime`).
- Cập nhật mỗi giây bằng một `setInterval` chung, không tạo interval cho từng thẻ.
- Về 0: hiện "Đang chốt phiên…", khoá khối đặt giá, chờ sự kiện kết thúc qua WebSocket; nếu 10 giây chưa có thì refetch. **Không tự đặt trạng thái ENDED/UNSOLD.**
- Không gia hạn đồng hồ ở frontend.

## Đặt giá

- Gửi `POST /bids { auctionId, amount }` → 201 `BidResponse`. Trong lúc chờ: khoá nút, không optimistic update.
- `minNextBid` backend không trả trong dữ liệu phiên → frontend tính để **gợi ý**: `bidCount === 0 ? startPrice : currentPrice + bidIncrement`. Ô nhập mặc định bằng giá trị này.
- Xử lý mã lỗi: `BID_TOO_LOW` (409 – điền `error.data.minNextBid`), `ALREADY_LEADING` (409), `SELF_BID_NOT_ALLOWED` (422), `AUCTION_NOT_ACTIVE` (409), `ACCOUNT_BANNED` (403 – đăng xuất).

## Thanh toán bất đồng bộ

- `202` (status `PENDING`) hoặc lỗi `PAYMENT_IN_PROGRESS`: hiện "Đang xử lý…", chờ thông báo `PAYMENT_RESULT` qua `/user/queue/notifications`; dự phòng poll `GET /orders/{id}/payments` (trả mảng) mỗi 5 giây, tối đa 5 phút (backend tự huỷ PENDING sau 5 phút).
