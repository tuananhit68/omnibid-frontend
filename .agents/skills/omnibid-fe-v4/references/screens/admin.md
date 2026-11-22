# Quản trị — `admin-dashboard`, `admin-users`, `admin-categories`, `admin-products`, `admin-auctions`, `admin-orders`, `admin-reports`

Dữ liệu: `backend/RESPONSE_DTO_v4.md` §7; quy tắc BR-08, BR-14, BR-16…BR-20. Chung: `AdminLayout`, `DataTable` (hàng 48, chữ 14), lọc đồng bộ URL, size 20, tìm kiếm debounce 300 ms. Mọi thao tác đổi trạng thái: `ConfirmDialog` nêu **hệ quả**; sau thành công invalidate danh sách + chi tiết + thống kê. Không có nút xóa người dùng/sản phẩm/phiên/đơn.

## `admin-dashboard` — `/admin`
`GET /admin/statistics` (`AdminStatistics`). Hàng 5 `StatCard`: Người dùng `totalUsers` (phụ: "`bannedUsers` bị khóa") · Phiên (tổng, phụ: "n đang diễn ra") · Đơn hàng (tổng, phụ: "n chờ thanh toán") · Giá trị đơn hoàn tất `completedOrderValue` · Báo cáo chờ xử lý `pendingReports` (link). Hai bảng phân bố theo trạng thái (đủ mọi trạng thái, kể cả 0) với thanh tỉ lệ ngang dùng màu tông trạng thái. Ghi chú "Số liệu tích lũy đến thời điểm xem". Không bộ lọc thời gian.

## `admin-users` — `/admin/users`
Lọc keyword (tên/email) · trạng thái · vai trò. Cột: `USR-{id}` · Họ tên · Email · SĐT · Vai trò · Trạng thái · Ngày tạo · Thao tác.
- Khóa (USER đang ACTIVE, không phải chính mình): ConfirmDialog "Tài khoản bị chặn ngay; các phiên đang bán bị hủy; đơn chờ thanh toán liên quan bị hủy; lượt đặt giá đã có được giữ nguyên." + lý do (tùy chọn) → `POST /admin/users/{id}/ban` → toast "Đã khóa; hủy `cancelledAuctions` phiên, `cancelledOrders` đơn".
- Mở khóa (BANNED): "Không khôi phục phiên, đơn đã bị hủy" → `POST /admin/users/{id}/unban`.
- ADMIN: không có nút khóa (`CANNOT_BAN_ADMIN` vẫn xử lý).

## `admin-categories` — `/admin/categories`
`GET /admin/categories` (`AdminCategory`): Icon · Tên · Slug · Số sản phẩm `productCount` · Sửa/Xóa. Form (modal): Tên* · Slug* (tự gợi ý từ tên, bỏ dấu, kebab-case) · Icon (lưới chọn từ danh sách icon cho phép của `CategoryIcon`).
`POST`/`PUT`/`DELETE /admin/categories`; Xóa bị khóa khi `productCount > 0` (vẫn xử lý `CATEGORY_IN_USE`); slug trùng → `VALIDATION_ERROR` dưới ô.

## `admin-products` — `/admin/products`, `/admin/products/[id]`
Lọc keyword · danh mục · trạng thái. Cột: Ảnh · Tiêu đề · Người bán `seller.fullName` · Danh mục · Trạng thái · Ngày tạo · "Xem".
Chi tiết (`AdminProductDetail`): ảnh, mô tả, người bán đầy đủ, `activeAuctionId` (link), trạng thái.
"Ẩn sản phẩm" (chưa HIDDEN): ConfirmDialog "Phiên đang mở bị hủy; đơn chờ thanh toán bị hủy; đơn đã thanh toán/đang giao vẫn tiếp tục. **Ẩn là vĩnh viễn.**" + lý do (tùy chọn) → `POST /admin/products/{id}/hide`.

## `admin-auctions` — `/admin/auctions`, `/admin/auctions/[id]`
Lọc keyword · trạng thái · người bán (`sellerId`). Cột: `AUC-{id}` · Sản phẩm · Người bán · Giá hiện tại · Giá sàn · Lượt · Bắt đầu · Kết thúc · Trạng thái · "Xem".
Chi tiết (`AdminAuctionDetail`): số liệu đầy đủ, người dẫn đầu/người thắng (tên + email), `productStatus`, `orderId` (link), lịch sử đặt giá (`GET /auctions/{id}/bids`) + realtime.
"Hủy phiên" (SCHEDULED/ACTIVE, kể cả đã có lượt): lý do bắt buộc → `POST /admin/auctions/{id}/cancel`.

## `admin-orders` — `/admin/orders`, `/admin/orders/[id]`
Lọc trạng thái · người mua · người bán (id) · khoảng ngày tạo (`fromDate`, `toDate` ISO +07:00). Cột: `ORD-{id}` · Sản phẩm · Người mua · Người bán · Giá · Trạng thái · Ngày tạo · "Xem".
Chi tiết (`AdminOrderDetail`): như `order-detail` (không có form của hai bên) + email hai bên + lịch sử thanh toán `payments`.
"Hủy đơn" chỉ khi PENDING_PAYMENT: lý do bắt buộc → `POST /admin/orders/{id}/cancel`.

## `admin-reports` — `/admin/reports`, `/admin/reports/[id]`
Tabs "Chờ xử lý (n) · Đã xử lý · Bác bỏ"; lọc `targetType` (Sản phẩm/Người dùng/Đơn hàng). Desktop: danh sách trái + panel chi tiết phải (`?id=`); mobile: route chi tiết.
Danh sách (`AdminReportItem`): `REP-{id}` · Người gửi · Đối tượng (tóm tắt từ `targets`) · Lý do rút gọn · Ngày gửi.
Panel (`AdminReportDetail`):
- Thẻ đối tượng từ `targets`: sản phẩm (tiêu đề, trạng thái, phiên đang mở + số lượt), người dùng (tên, email, vai trò, trạng thái), đơn (trạng thái, hai bên) — mỗi thẻ có link tới trang admin tương ứng.
- Lý do đầy đủ · (đã xử lý) ghi chú, người xử lý, thời điểm.
- Form (khi PENDING): Kết luận* (Đã xử lý / Bác bỏ) · Ghi chú* → `POST /admin/reports/{id}/resolve {decision, note}`; ghi chú "Người gửi nhận thông báo ở cả hai kết luận."
- **Thao tác quản trị riêng** (tiện ích, không thuộc bước xử lý báo cáo): "Ẩn sản phẩm", "Hủy phiên", "Khóa người dùng" — mở đúng dialog của `admin-products`/`admin-auctions`/`admin-users`; hiện theo `targets` và trạng thái hiện tại.
