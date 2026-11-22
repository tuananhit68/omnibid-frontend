---
trigger: model_decision
description: "Áp dụng khi làm đặt giá realtime, đồng hồ đếm ngược, kết nối STOMP /ws, kênh /topic/auctions/{id}, trạng thái Đang chốt phiên."
---
# Realtime (STOMP qua WebSocket thuần)
- Một client `@stomp/stompjs` dùng chung (`src/lib/ws/stomp.ts`), `brokerURL = NEXT_PUBLIC_WS_URL` (`ws://localhost:8080/ws`). Không SockJS.
- CONNECT gửi `Authorization: Bearer <token>` nếu có; Guest vẫn kết nối. Client chỉ SUBSCRIBE, không `publish`.
- `reconnectDelay` 3–5s; nối lại thì refetch dữ liệu đang hiển thị. Banner "Đang kết nối lại…" khi mất > 3s. Đăng xuất thì `deactivate()` rồi tạo lại client với header mới.
- `useAuctionChannel(auctionId)` subscribe `/topic/auctions/{id}`; unsubscribe khi unmount/đổi id. Thông điệp `AuctionEvent` phẳng: `BID_PLACED` (có `bid`), `AUCTION_UPDATED`, `AUCTION_STARTED`, `AUCTION_ENDED`, `AUCTION_CANCELLED`. Ghi vào cache bằng `setQueryData`; bỏ qua tin có `bidCount` nhỏ hơn dữ liệu đang có.
- Không có kênh thông báo người dùng; badge chuông lấy bằng REST.
- Chế độ mock: cùng interface kênh, nguồn là `src/mocks/ws-bus.ts` (`MOCK_MODE.md`).
- Đồng hồ: tính từ `endTime` (ISO có offset) + `serverOffsetMs` (header `Date` của response chi tiết, hoặc giá trị tính phía server khi render). Một `setInterval` dùng chung. Về 0: "Đang chốt phiên…", khóa đặt giá, chờ `AUCTION_ENDED`; 15s chưa có thì refetch. **Không tự đặt ENDED/UNSOLD**, không gia hạn.
- Đặt giá: `POST /auctions/{id}/bids {amount}`; khóa nút khi chờ; không optimistic. `minNextBid` lấy từ backend (chi tiết, sự kiện, `details` của `BID_TOO_LOW`).
