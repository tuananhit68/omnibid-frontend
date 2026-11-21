# DELETE_LIST_FE — Gỡ khỏi frontend để khớp v4

Agent được phép xóa các mục dưới đây (sau khi tìm và sửa mọi chỗ import). Không xóa tệp khác nếu chưa ghi lý do vào `docs/v4/PROGRESS.md`.

## Tính năng
| Tính năng | Tệp |
|---|---|
| Watchlist | `src/features/watchlist/**`, `src/app/(user)/watchlist/**`, hàm `watchAuction`/`unwatchAuction` trong `features/auction/api.ts`, nút/biểu tượng Theo dõi trong `AuctionCard`, `UpcomingAuctionCard`, `FeaturedAuctionHeroCard`, `AuctionDetailClient`, trang chủ; mã lỗi `SELF_WATCH_NOT_ALLOWED`; mục "Theo dõi" ở nav |
| Vận chuyển nhiều bước | `src/components/ui/ShipmentStepper.tsx` (thay bằng `OrderProgress`), enum `ShipmentStatus` |
| Nhật ký hệ thống | mục sidebar, route nếu có |
| Khiếu nại riêng / hành động báo cáo | `ReportType`, `ReportAction`, `reportType`, `orderId` trong request báo cáo |
| Trạng thái Bid | `BidStatus`, `BID_STATUS_META`, cột Trạng thái trong `BidHistoryTable` |
| Thanh toán bất đồng bộ | `PaymentStatus.PENDING`, polling, `PAYMENT_IN_PROGRESS`, `PAYMENT_RATE_LIMITED`, `MOCK_BANK`, `MOCK_WALLET`, `SimulatedOutcome.PROCESSING` |
| Thống kê tóm tắt | `getMyBidsSummary`, `MyBidsSummary`, `/watchlist/summary` |
| `allowedActions`, `viewerRole`, `OrderAction` | `types/enums.ts` |
| SockJS | `sockjs-client`, `@types/sockjs-client`, import `SockJS` |
| Ảnh lưu local backend | remotePattern `localhost:8080/uploads` |
| Kênh người bán | `components/layout/SellerLayout.tsx` (sau khi `AccountLayout` thay thế), mọi link `/seller` |

## Endpoint frontend không được gọi nữa
`POST /bids`, `GET /bids/mine/summary`, `/watchlist/**`, `GET /categories/{id}`, `GET /products` (toàn bộ), `GET /products/mine/summary`,
`PATCH /products/{id}/images/{imageId}/primary`, `PATCH /users/me/avatar`, `GET /orders/summary`, `PATCH /orders/{id}/confirm-receipt`,
`GET /orders/{id}/shipment`, `PATCH /shipments/**`, `PATCH /notifications/{id}/read`, `GET /notifications/unread-count`, `PATCH /notifications/read-all`,
`PATCH /admin/users/{id}`, `PATCH /admin/products/{id}`, `PATCH /admin/reports/{id}/resolve`, `GET /admin/audit-logs`.

## Đã xóa khi tạo kit (21/11/2026)
- Bộ hướng dẫn cũ: `AGENTS.md` cũ, `.agents/` cũ, `design/README.md` cũ, `design/backend-contract.md`, `design/gaps.md`, `design/specs/**`, `design/style-overrides.md`, `design/components.md`, `design/layouts.md`.
- Tài sản Figma không còn dùng: `design/screens/**` (ảnh khung), `design/outline/**` (cây layer). Chỉ giữ `design/tokens/tokens.css` (màu).
- Tất cả còn trong lịch sử Git nếu cần xem lại. Wireframe trong tài liệu Thiết kế v4 là tạm, không đưa vào kit.
