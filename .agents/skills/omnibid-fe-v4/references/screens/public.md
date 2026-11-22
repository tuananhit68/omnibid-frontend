# Màn công khai — `home`, `auction-list`, `auction-detail`

Dữ liệu: `backend/RESPONSE_DTO_v4.md` §4 (`AuctionSummary`, `AuctionDetail`, `BidHistoryItem`, `PlaceBidResponse`), §8 (`AuctionEvent`); quy tắc BR-01…BR-09.
Thiết kế lại từ dữ liệu; chỉ giữ màu token. Code hiện có của ba màn này được sửa (không cần giữ bố cục cũ).

## `home` — Trang chủ `/` (SỬA)
Mục tiêu: đưa người xem tới phiên sắp kết thúc và danh mục.
| Khối | Dữ liệu | API |
|---|---|---|
| Hero: tiêu đề + ô tìm kiếm lớn | — | điều hướng `/auctions?keyword=` |
| Danh mục (lưới chip/thẻ có `CategoryIcon`) | `Category` | `GET /categories?size=100` |
| Sắp kết thúc (4 `AuctionCard`) | `AuctionSummary` | `GET /auctions?status=ACTIVE&sort=endTime,asc&size=4` |
| Sắp diễn ra (4 `AuctionCard`) | `AuctionSummary` | `GET /auctions?status=SCHEDULED&sort=endTime,asc&size=4` |
| Cách đấu giá hoạt động (3 bước tĩnh: đặt giá → thắng phiên → thanh toán trong 48 giờ) | tĩnh | — |
Server Component tải dữ liệu đầu (chế độ live); phần tương tác là Client Component. Mỗi khối có skeleton/empty/error riêng. Bỏ mọi thứ theo dõi phiên.

## `auction-list` — Danh sách phiên `/auctions` (SỬA)
Desktop: cột bộ lọc 280px + lưới 3 cột; mobile: nút "Lọc (n)" mở bottom sheet.
- Bộ lọc ↔ tham số `GET /auctions`: `keyword` (ô tìm ở header/trang), `categoryId` (một danh mục), khoảng giá hiện tại `minPrice`–`maxPrice`, `status` (radio: Tất cả · Đang diễn ra · Sắp diễn ra · Đã kết thúc · Không bán được), "Kết thúc trong" (Bất kỳ · 1 giờ · 24 giờ · 7 ngày → `endBefore = now + khoảng`, ISO +07:00).
- Sắp xếp (4 giá trị whitelist): Sắp kết thúc `endTime,asc` (mặc định) · Mới nhất `createdAt,desc` · Giá tăng `currentPrice,asc` · Giá giảm `currentPrice,desc`.
- Dòng kết quả "`totalElements` phiên phù hợp"; chip bộ lọc đang áp dụng có nút bỏ; `Pagination` (size 12).
- `AuctionCard` từ `AuctionSummary`: ảnh `primaryImageUrl` · `StatusBadge` · `title` (2 dòng) · `categoryName` · ACTIVE: "Giá hiện tại" `currentPrice` + "`bidCount` lượt · còn …" ; SCHEDULED: "Giá khởi điểm" `startPrice` + "Bắt đầu HH:mm dd/MM"; ENDED/UNSOLD/CANCELLED: giá + nhãn trạng thái · `ReserveBadge` nhỏ · nút "Xem chi tiết".
- Đồng bộ toàn bộ bộ lọc lên URL; đổi lọc về trang đầu; rỗng: "Không có phiên phù hợp" + "Xóa bộ lọc".

## `auction-detail` — Chi tiết phiên & đặt giá `/auctions/[id]` (SỬA)
Desktop 7/5 cột; mobile: ảnh → khối giá/đặt giá → mô tả → lịch sử, thanh đáy cố định "Đặt giá".
| Khối | Trường |
|---|---|
| Đầu trang | breadcrumb Phiên đấu giá › `categoryName`; `title`; `StatusBadge(status)`; `ReserveBadge(reserveStatus)`; mã `AUC-{id}` |
| Ảnh | `ImageGallery(images)` |
| Card giá + đặt giá | "Giá hiện tại" `currentPrice` (`text-price-xl`, `aria-live`) · lưới số liệu: Giá khởi điểm `startPrice` · Bước giá `bidIncrement` · Số lượt `bidCount` · **Mức tối thiểu tiếp theo `minNextBid`** (ô nhấn) · người dẫn đầu `highestBidderName` · `CountdownTimer(endTime)` hoặc "Bắt đầu lúc `startTime`" · đường kẻ · khối đặt giá (bảng dưới) · ghi chú "Lượt đặt giá đã ghi nhận không thể rút." |
| Kết quả (ENDED/UNSOLD/CANCELLED) | `winnerName`, `finalPrice`, `closedAt`, `cancelReason` |
| Mô tả | `condition` · Người bán `seller.fullName` · `description` |
| Lịch sử đặt giá | `BidHistoryTable` từ `GET /auctions/{id}/bids?sort=createdAt,desc&size=20` + "Xem thêm" |
| Báo cáo | nút "Báo cáo vi phạm" → `report-modal` (sản phẩm + người bán) |
**Khối đặt giá theo người xem** (dùng `viewerIsSeller`, `viewerIsLeading` của `AuctionDetail`; backend vẫn quyết định):
| Người xem / trạng thái | Hiển thị |
|---|---|
| Guest | "Đăng nhập để đặt giá" → `/login?redirect=/auctions/{id}` |
| ADMIN | không form; "Tài khoản quản trị không tham gia đặt giá" + link `/admin/auctions/{id}` |
| `viewerIsSeller` | không form; "Đây là phiên của bạn", giá sàn `reservePrice` (nếu có), link `/me/auctions/{id}`; ẩn nút báo cáo |
| ACTIVE & `viewerIsLeading` | "Bạn đang dẫn đầu với `currentPrice`" — không form |
| ACTIVE | `MoneyInput` mặc định `minNextBid`, nhãn "Tối thiểu `minNextBid`", nút `money` xl "Đặt giá" |
| ACTIVE, đồng hồ về 0 | "Đang chốt phiên…", khóa; chờ `AUCTION_ENDED`, 15 giây chưa có thì refetch |
| SCHEDULED | "Phiên bắt đầu lúc …", khóa; mở khi nhận `AUCTION_STARTED` |
| ENDED, người xem thắng (`orderId` có giá trị) | "Bạn đã thắng phiên này" + nút "Thanh toán đơn hàng" → `/orders/{orderId}` |
| ENDED / UNSOLD / CANCELLED khác | thông báo kết quả tương ứng |
**Đặt giá:** `POST /auctions/{id}/bids {amount}` → cập nhật cache từ `PlaceBidResponse` (+ `viewerIsLeading = true`), toast. Không optimistic.
**Lỗi:** `BID_TOO_LOW` (điền `details.minNextBid`, câu "Vừa có người đặt cao hơn, mức tối thiểu mới là …") · `ALREADY_LEADING` · `SELF_BID_NOT_ALLOWED` · `AUCTION_NOT_ACTIVE` · `CONFLICT` · `ACCOUNT_BANNED` · `NOT_FOUND` → trang 404.
**Realtime:** `useAuctionChannel(id)` → cập nhật `currentPrice, minNextBid, bidCount, highestBidderName, reserveStatus, status`; chèn `bid` vào lịch sử; nếu nhận `BID_PLACED` khi đang `viewerIsLeading` thì đặt `viewerIsLeading = false` (người khác vừa vượt — vì người xem không thể tự vượt mình) và hiện toast "Bạn vừa bị vượt giá".
