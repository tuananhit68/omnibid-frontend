# Thông báo và báo cáo — `notifications`, `notification-bell`, `report-modal`

Dữ liệu: `backend/RESPONSE_DTO_v4.md` §6 (`Notification`, báo cáo); `backend/BUSINESS_RULES_v4.md` §7 (ai nhận thông báo nào); UC11, UC12, BR-19.

## `notifications` — `/me/notifications` (MỚI)
Tabs "Tất cả" · "Chưa đọc (n)"; lọc loại (5 loại). Danh sách `GET /notifications?isRead&type&page&size=20&sort=createdAt,desc`.
`NotificationItem`: icon theo loại · `title` (đậm + chấm nếu chưa đọc) · `content` · thời gian tương đối · nút "Đánh dấu đã đọc" (`POST /notifications/{id}/read`, optimistic + rollback).
Bấm mục: đánh dấu đã đọc rồi đi theo `refType/refId`: AUCTION → `/auctions/{refId}` · ORDER → `/orders/{refId}` · REPORT → mở rộng nội dung tại chỗ (User không có trang báo cáo).
Không có "đánh dấu tất cả" (không có API). Rỗng: "Bạn chưa có thông báo nào".

## `notification-bell` — chuông ở header (MỚI, chỉ USER)
Số chưa đọc = `totalElements` của `GET /notifications?isRead=false&size=1`; refetch khi focus cửa sổ, khi điều hướng, mỗi 60 giây; "9+" khi > 9; `aria-label="Thông báo, n chưa đọc"`. Popover 5 mục mới nhất + "Xem tất cả" → `/me/notifications`. Sidebar tài khoản dùng cùng số.

## `report-modal` — Báo cáo vi phạm (SỬA, component)
Thay `ReportViolationModal` cũ (VIOLATION/COMPLAINT, `orderId`) bằng `src/features/report/components/ReportModal.tsx`.
| Mở từ | Đối tượng chọn (≥ 1) |
|---|---|
| `auction-detail` | Sản phẩm này (`reportedProductId = productId`) · Người bán (`reportedUserId = seller.id`) |
| `order-detail` | Đơn hàng này (`reportedOrderId`) · Bên còn lại (`reportedUserId`) |
Lý do* (textarea, đếm ký tự). `POST /reports` → 201 → toast "Đã gửi báo cáo". Lỗi `VALIDATION_ERROR`, `NOT_FOUND`, `FORBIDDEN`. Không hiện cho Guest (thay bằng đăng nhập), chủ phiên, Admin. Ghi chú: "Báo cáo không làm thay đổi trạng thái đơn hàng."
