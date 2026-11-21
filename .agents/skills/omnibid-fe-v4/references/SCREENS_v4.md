# SCREENS_v4 — Danh mục màn hình (thiết kế lại theo API backend v4)

Căn cứ: 54 endpoint (`backend/API_SPEC_v4.md`), hình dạng dữ liệu (`backend/RESPONSE_DTO_v4.md`), Use Case UC01–UC17 và quy tắc nghiệp vụ v4.
**Không** dùng ảnh Figma cũ hay wireframe tạm trong tài liệu Thiết kế; chỉ giữ màu (`design/tokens/tokens.css`). Hệ thiết kế: `design/DESIGN_SYSTEM.md`.
Trạng thái: **SỬA** = đã có code, làm lại theo v4 (không cần giữ bố cục cũ) · **MỚI** · **XÓA**.

| ID (dùng với `/build-screen`) | Màn | Route | Layout | Vai trò | UC | Endpoint chính | Trạng thái | Spec |
|---|---|---|---|---|---|---|---|---|
| `home` | Trang chủ | `/` | Public | Mọi người | UC03 | #8, #16 | SỬA | `screens/public.md` |
| `auction-list` | Danh sách, tìm kiếm, lọc phiên | `/auctions` | Public | Mọi người | UC03 | #8, #16 | SỬA | `screens/public.md` |
| `auction-detail` | Chi tiết phiên + đặt giá realtime | `/auctions/[id]` | Public | Mọi người | UC03, UC06 | #17, #22, #23, WS | SỬA | `screens/public.md` |
| `login` | Đăng nhập | `/login` | Auth | Guest | UC01 | #2 | SỬA | `screens/auth-account.md` |
| `register` | Đăng ký | `/register` | Auth | Guest | UC01 | #1 | SỬA | `screens/auth-account.md` |
| `profile` | Hồ sơ, ảnh đại diện, đổi mật khẩu | `/me/profile` | Account | USER | UC02 | #3–#7 | MỚI | `screens/auth-account.md` |
| `admin-profile` | Hồ sơ Admin | `/admin/profile` | Admin | ADMIN | UC02 | #3–#7 | MỚI | `screens/auth-account.md` |
| `my-products` | Sản phẩm của tôi | `/me/products` | Account | USER | UC04 | #10, #13 | MỚI | `screens/seller.md` |
| `product-form` | Thêm / sửa sản phẩm | `/me/products/new`, `/me/products/[id]/edit` | Account | USER (chủ) | UC04 | #8, #9, #11, #12, #14, #15 | MỚI | `screens/seller.md` |
| `auction-create` | Tạo phiên | `/me/auctions/new?productId=` | Account | USER (chủ) | UC05 | #11, #18 | MỚI | `screens/seller.md` |
| `my-auctions` | Phiên của tôi | `/me/auctions` | Account | USER | UC05 | #21 | MỚI | `screens/seller.md` |
| `my-auction` | Quản lý một phiên (sửa, hủy) | `/me/auctions/[id]` | Account | USER (chủ phiên) | UC05 | #17, #19, #20, #22, WS | MỚI | `screens/seller.md` |
| `my-bids` | Lượt đặt giá của tôi | `/me/bids` | Account | USER | UC06 | #24 | SỬA | `screens/orders.md` |
| `my-orders` | Đơn hàng (mua / bán) | `/me/orders` | Account | USER | UC08, UC09 | #25 | MỚI | `screens/orders.md` |
| `order-detail` | Chi tiết đơn: thanh toán, gửi hàng, xác nhận | `/orders/[id]` | Account | Hai bên của đơn | UC08, UC09 | #26–#31 | MỚI | `screens/orders.md` |
| `notifications` | Thông báo | `/me/notifications` | Account | USER | UC11 | #32, #33 | MỚI | `screens/notifications-reports.md` |
| `notification-bell` | Chuông + popover | (header) | – | USER | UC11 | #32, #33 | MỚI | `screens/notifications-reports.md` |
| `report-modal` | Báo cáo vi phạm | (modal) | – | USER | UC12 | #34 | SỬA | `screens/notifications-reports.md` |
| `admin-dashboard` | Tổng quan thống kê | `/admin` | Admin | ADMIN | UC17 | #54 | MỚI | `screens/admin.md` |
| `admin-users` | Người dùng | `/admin/users` | Admin | ADMIN | UC14 | #35–#37 | MỚI | `screens/admin.md` |
| `admin-categories` | Danh mục | `/admin/categories` | Admin | ADMIN | UC15 | #50–#53 | MỚI | `screens/admin.md` |
| `admin-products` | Sản phẩm (+ chi tiết) | `/admin/products`, `/admin/products/[id]` | Admin | ADMIN | UC16 | #38–#40 | MỚI | `screens/admin.md` |
| `admin-auctions` | Phiên (+ chi tiết) | `/admin/auctions`, `/admin/auctions/[id]` | Admin | ADMIN | UC16 | #41–#43, #22 | MỚI | `screens/admin.md` |
| `admin-orders` | Đơn hàng (+ chi tiết) | `/admin/orders`, `/admin/orders/[id]` | Admin | ADMIN | UC16 | #44–#46 | MỚI | `screens/admin.md` |
| `admin-reports` | Báo cáo vi phạm (+ xử lý) | `/admin/reports`, `/admin/reports/[id]` | Admin | ADMIN | UC13 | #47–#49 | MỚI | `screens/admin.md` |
| (cũ) watchlist | Phiên theo dõi | `/watchlist` | – | – | – | – | **XÓA** | – |

Số `#n` là số thứ tự endpoint trong `backend/API_SPEC_v4.md` §2 và `RESPONSE_DTO_v4.md`. Mỗi endpoint trong 54 phải được ít nhất một màn dùng (trừ không có ngoại lệ).
Trang hệ thống: `/403`, `not-found`, `error`, `/dev/ui` (dev), `/dev/mock` (chỉ chế độ mock — `MOCK_MODE.md`).

## Quyết định cấu trúc
1. Không có "kênh người bán" riêng: v4 chỉ có USER (vừa mua vừa bán) và ADMIN → mọi trang cá nhân ở `/me/**` với `AccountLayout`.
2. Một trang chi tiết đơn cho hai bên (`OrderDetail.viewerRole`); không có trang vận chuyển riêng (gửi hàng chỉ một bước, BR-13).
3. Một trang chi tiết phiên cho mọi người xem; khác nhau ở khối đặt giá (`viewerIsSeller`, `viewerIsLeading`, `orderId`).
4. Admin không có chuông thông báo (Admin không nhận thông báo); có `/admin/profile`.
5. Không có watchlist, nhật ký hệ thống, khiếu nại riêng, vận chuyển nhiều bước, đổi ảnh chính sau khi tạo sản phẩm.
