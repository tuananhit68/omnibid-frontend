# OmniBid – Bộ đặc tả giao diện cho Antigravity

Bộ này thay cho việc kết nối Figma MCP. Nó được trích từ file Figma **Online Auction System** (JSON qua REST API, sửa lần cuối 07/11/2026) và 29 ảnh PNG @2x, đối chiếu với Báo cáo phân tích, Báo cáo thiết kế và API của backend.

Đặt cả thư mục `design/` vào gốc repo frontend và commit. Agent đọc file, không cần mở Figma.

## Cấu trúc

| Đường dẫn | Nội dung | Khi nào đọc |
| --- | --- | --- |
| `tokens/tokens.css` | Màu, chữ, bo góc, đổ bóng, spacing dạng `@theme` của Tailwind v4 | Phase 0, import vào `globals.css` |
| `layouts.md` | 4 khung trang (Public, Seller, Admin, Auth) + quy tắc responsive | Phase 0 và mọi trang |
| `components.md` | Thư viện component gom từ Figma, số đo, variant, map trạng thái → nhãn/màu | Phase 0 và mọi trang |
| `backend-contract.md` | **API thật đối chiếu từ code backend**: envelope, DTO, mã lỗi, WebSocket, endpoint chưa có (bảng B) – thắng mục API trong spec | Trước Phase 0 và mọi màn hình |
| `style-overrides.md` | **Thắng ảnh Figma** về kiểu dáng: thang chữ, bề mặt, thành phần chính theo hướng "Rõ ràng, đáng tin" | Trước Phase 0 |
| `gaps.md` | Chỗ Figma lệch backend, màn hình còn thiếu, lỗi Figma cần sửa – **đọc trước khi code** | Trước Phase 1 |
| `specs/Sxx-*.md` | Spec từng màn hình: route, bố cục, số đo, màu/chữ, API, trạng thái, quy tắc, tiêu chí xong, prompt | Khi làm màn hình đó |
| `outline/Sxx.txt` | Toàn bộ cây layer của frame (toạ độ, auto layout, màu, chữ) | Khi cần số đo chi tiết |
| `screens/Sxx-*.png` | Ảnh màn hình @2x | Đối chiếu trực quan |
| `screens/design-system-OmniBid.png` | Bảng màu và mẫu chữ gốc | Tham khảo |

## Danh sách màn hình

| ID | Màn hình | Route | Layout | Phase |
| --- | --- | --- | --- | --- |
| S00 | [Trang chủ (Khách)](specs/S00-home.md) | `/` | PublicLayout | 3 |
| S01 | [Danh sách phiên đấu giá (Khách)](specs/S01-auction-list.md) | `/auctions` | PublicLayout | 3 |
| S02 | [Chi tiết phiên đấu giá (Khách)](specs/S02-auction-detail-guest.md) | `/auctions/[id] (chưa đăng nhập)` | PublicLayout | 3 |
| S03 | [Đăng ký tài khoản (Khách)](specs/S03-register.md) | `/register` | AuthLayout | 1 |
| S04 | [Đăng nhập (Khách)](specs/S04-login.md) | `/login` | AuthLayout | 1 |
| S05 | [Chi tiết phiên & Đặt giá (Người mua)](specs/S05-auction-detail-bid.md) | `/auctions/[id] (đã đăng nhập)` | PublicLayout | 4 |
| S06 | [Lượt đặt giá của tôi (Người mua)](specs/S06-my-bids.md) | `/me/bids` | PublicLayout | 4 |
| S07 | [Phiên đang theo dõi (Người mua)](specs/S07-watchlist.md) | `/watchlist` | PublicLayout | 3 |
| S08 | [Cài đặt tài khoản (Người mua)](specs/S08-account-settings.md) | `/me/settings` | PublicLayout | 1 |
| S09 | [Thông báo (Người mua)](specs/S09-notifications.md) | `/notifications` | PublicLayout | 6 |
| S09a | [Dropdown thông báo (Người mua)](specs/S09a-notification-dropdown.md) | `(thành phần của header)` | Popover | 6 |
| S10 | [Đơn hàng của tôi (Người mua)](specs/S10-my-orders.md) | `/me/orders` | PublicLayout | 5 |
| S11 | [Chi tiết đơn hàng & Thanh toán (Người mua)](specs/S11-order-detail-payment.md) | `/orders/[id]` | PublicLayout | 5 |
| S12 | [Theo dõi vận chuyển (Người mua)](specs/S12-shipment-tracking.md) | `/orders/[id]/shipment` | PublicLayout | 5 |
| S13 | [Modal báo cáo vi phạm & Khiếu nại (Người mua)](specs/S13-report-complaint-modal.md) | `(modal, mở từ S02/S05/S12/S06)` | Modal | 5 |
| S14 | [Sản phẩm của tôi (Người bán)](specs/S14-seller-products.md) | `/seller/products` | SellerLayout | 2 |
| S15 | [Tạo & Sửa sản phẩm (Người bán)](specs/S15-seller-product-form.md) | `/seller/products/new · /seller/products/[id]/edit` | SellerLayout | 2 |
| S16 | [Tạo phiên đấu giá (Người bán)](specs/S16-seller-auction-create.md) | `/seller/auctions/new?productId=` | SellerLayout | 3 |
| S17 | [Quản lý phiên đấu giá (Người bán)](specs/S17-seller-auction-manage.md) | `/seller/auctions/[id]` | SellerLayout | 3 |
| S18 | [Đơn hàng & Cập nhật vận chuyển (Người bán)](specs/S18-seller-order-shipping.md) | `/seller/orders/[id]` | SellerLayout | 5 |
| S19 | [Tổng quan (Admin)](specs/S19-admin-dashboard.md) | `/admin` | AdminLayout | 7 |
| S20 | [Quản lý người dùng (Admin)](specs/S20-admin-users.md) | `/admin/users` | AdminLayout | 7 |
| S21 | [Quản lý danh mục (Admin)](specs/S21-admin-categories.md) | `/admin/categories` | AdminLayout | 7 |
| S22 | [Quản lý sản phẩm (Admin)](specs/S22-admin-products.md) | `/admin/products` | AdminLayout | 7 |
| S23 | [Quản lý phiên đấu giá (Admin)](specs/S23-admin-auctions.md) | `/admin/auctions` | AdminLayout | 7 |
| S24 | [Quản lý đơn hàng (Admin)](specs/S24-admin-orders.md) | `/admin/orders` | AdminLayout | 7 |
| S25 | [Báo cáo & Khiếu nại (Admin)](specs/S25-admin-reports.md) | `/admin/reports · /admin/reports/[id]` | AdminLayout | 7 |
| S26 | [Nhật ký thao tác (Admin)](specs/S26-admin-audit-logs.md) | `/admin/audit-logs` | AdminLayout | 7 |

Phase theo lộ trình trong tài liệu hướng dẫn vibecoding: 0 nền móng · 1 tài khoản · 2 sản phẩm · 3 phiên đấu giá · 4 đặt giá realtime · 5 sau đấu giá · 6 thông báo · 7 admin.

## Những điểm quan trọng nhất

1. **Hai màu xanh**: `primary-600` #1D4ED8 cho hành động thường; `primary-700` #0037B0 cho giá tiền và hành động liên quan tiền (Đặt giá, Thanh toán). Không dùng lẫn.
2. **Màu, chức năng và thứ tự thông tin giữ như Figma; kiểu dáng theo hướng "Rõ ràng, đáng tin"** trong `style-overrides.md`: font Be Vietnam Pro, chữ mặc định 15/24, card phẳng viền mảnh, không nhãn chữ hoa, không viền màu một bên, con số lớn và đều.
3. **3 màu chữ xám trong Figma không đạt tương phản** – đã được thay trong token (`text-subtle`, `text-placeholder`, `success-strong`).
4. **Figma chỉ có bản desktop 1280px** – responsive theo `layouts.md` mục 5.
5. **Figma vẽ nhiều dữ liệu backend không có** (uy tín người bán, SKU, bằng chứng khiếu nại, KPI…). Mặc định là ẩn đi, chi tiết ở `gaps.md`.
6. File Figma không dùng Component/Variable, nên component được gom thủ công; nếu nhóm design sửa Figma, chạy lại script trích (xem dưới) và cập nhật `components.md` bằng tay.

## Cách dùng với Antigravity

1. Thêm vào rule của agent: "Trước khi làm bất kỳ màn hình nào, đọc `design/README.md`, `design/gaps.md`, `design/layouts.md`, `design/components.md` và spec của màn hình đó."
2. Phase 0: prompt "Đọc design/tokens/tokens.css, design/components.md, design/layouts.md. Import tokens vào globals.css, tạo các component trong mục 1–8 của components.md và 4 layout, kèm trang /dev/ui hiển thị mọi variant. Chưa làm trang nghiệp vụ."
3. Mỗi màn hình: copy khối **Prompt cho Antigravity** ở cuối spec của màn hình đó.
4. Review theo mục **Tiêu chí hoàn thành** trong spec + checklist mục 6 của tài liệu hướng dẫn.

## Cập nhật khi Figma thay đổi

Tải lại JSON (1 lần gọi API) và xuất lại ảnh frame bị đổi, rồi gửi lại để sinh lại `specs/` và `outline/`. Phần viết tay (bố cục, API, trạng thái, quy tắc, gaps) giữ nguyên trừ khi màn hình đổi chức năng.
