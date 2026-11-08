# Bố cục khung trang và responsive

Figma có 4 khung trang (layout) dùng lại cho 28 màn hình. Làm 3 layout này trước tiên (Phase 0), các trang chỉ lắp phần nội dung vào.

## 1. `PublicLayout` – khách và người mua (S00–S13)

Route group: `app/(public)` và `app/(user)`.

| Vùng | Số đo Figma | Ghi chú |
| --- | --- | --- |
| Header | cao 64px, sticky top, nền trắng 95% + blur 8px, shadow `xs`; padding ngang 32px | Logo 122×32 · Nav gap 24–32px · Ô tìm kiếm 310–448px cao 38–44px · Khối phải gap 12–16px |
| Main | nền `bg` #FAF8FF, padding 32px (trên 24–32px sau header), nội dung tối đa 1216px căn giữa | Breadcrumb cách tiêu đề 8–16px; tiêu đề trang cách nội dung 24–32px |
| Footer | cao 84px, nền trắng, padding 32px; © bên trái, 4 link bên phải gap 24px | S00 có footer lớn 4 cột (chỉ trang chủ) |

Nav khách: Trang chủ · Phiên đấu giá. Nav người dùng: Trang chủ · Phiên đấu giá · Theo dõi · Lượt đặt giá · Đơn hàng. Menu avatar: Cài đặt tài khoản · Kênh người bán · (Quản trị nếu ADMIN) · Đăng xuất.

## 2. `SellerLayout` – kênh người bán (S14–S18)

Route group: `app/(user)/seller`.

| Vùng | Số đo Figma |
| --- | --- |
| Header | cao 64px; logo + chip "Kênh Người Bán" (nền `primary-50`, chữ 12/600); ô tìm kiếm 446px; "Chuyển sang Mua hàng" (link về `/`); chuông; tên + nhãn phụ + avatar |
| Sidebar | rộng 256px, cố định trái dưới header, nền trắng, padding 16px; tiêu đề nhóm "Quản lý cửa hàng" (`.label`, viết thường); 3 mục cao 40px: Sản phẩm của tôi · Phiên đấu giá · Đơn hàng |
| Main | lề trái 256px, padding 64px trên (dưới header) / 32px ngang, nội dung rộng 960px, các khối cách nhau 24px |
| Footer | cao 48px, chữ 12px |

Nhãn phụ dưới tên trong header ghi "Người bán" theo Figma – đổi thành email hoặc bỏ (xem `gaps.md` G16).

## 3. `AdminLayout` – quản trị (S19–S26)

Route group: `app/admin`, chỉ role ADMIN (kiểm tra ở `middleware.ts` + ẩn menu; backend vẫn là chốt chặn).

| Vùng | Số đo Figma |
| --- | --- |
| Header | cao 64px, padding ngang 24px; logo + chip "Quản trị viên"; ô tìm kiếm 384×40; nút `tertiary` "Xem sàn đấu giá"; chuông; vạch ngăn 1×32; tên + email + avatar |
| Sidebar | Figma 288px → **dùng 256px** cho thống nhất; nhóm "Quản trị hệ thống" (`.label`); 8 mục: Tổng quan · Người dùng · Danh mục · Sản phẩm · Phiên đấu giá · Đơn hàng · Báo cáo vi phạm · Nhật ký hệ thống |
| Main | padding 32px, các khối cách 24px; hàng KPI 4 thẻ gap 16px; khối lọc; bảng |

## 4. `AuthLayout` – đăng ký, đăng nhập (S03, S04)

Route group: `app/(auth)`. Không header/footer, nền `bg` #FAF8FF, card trắng căn giữa theo chiều ngang, cách mép trên 32–64px, bo 12px, shadow `sm`. Đăng ký: card 620px, padding 32px. Đăng nhập: card 520px, padding 40px, viền 1px `border` bốn cạnh (Figma có viền trên 4px màu xanh – bỏ theo `style-overrides.md`). Nên thêm logo OmniBid phía trên card để người dùng quay về trang chủ (Figma không có – đề xuất). Người đã đăng nhập vào route này được chuyển về `/`.

## 5. Quy tắc responsive (Figma chỉ có bản 1280px)

Breakpoint Tailwind mặc định: `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Viết mobile-first.

| Thành phần | < 768px | 768–1023px | ≥ 1024px |
| --- | --- | --- | --- |
| Header công khai | Logo + nút tìm kiếm (icon) + chuông + menu hamburger; nav vào drawer | Ẩn bớt nav, giữ ô tìm kiếm | Như Figma |
| Sidebar người bán/admin | Ẩn, mở bằng nút menu (drawer, bẫy focus) | Thu gọn còn icon 72px | 256px |
| Padding trang | 16px | 24px | 32px |
| Lưới thẻ phiên | 1 cột | 2 cột | 3 cột (S01, S07) / 4 cột (S00) |
| Trang có cột phụ (S01 lọc, S05 8/4, S11, S16, S25 danh sách + chi tiết) | Xếp dọc; bộ lọc S01 vào bottom sheet có nút "Lọc (3)"; S05 đưa khối giá + đặt giá lên ngay dưới ảnh và cố định nút "Đặt giá" ở đáy màn hình | Xếp dọc | 2 cột như Figma |
| Thẻ KPI | Cuộn ngang 1 hàng hoặc lưới 2 cột | 2 cột | 4–5 cột |
| Bảng | Chuyển sang danh sách thẻ (mỗi hàng 1 thẻ) với cột quan trọng nhất | Cuộn ngang trong khung, cột hành động sticky | Như Figma (vẫn bọc overflow) |
| Form 2 cột (S08, S11, S16, S17) | 1 cột | 2 cột | 2 cột |
| Modal (S13) | Toàn màn hình, nút ở đáy | 448px giữa màn hình | 448px |

Kiểm tra ở 375px, 768px, 1280px: không cuộn ngang cả trang, chữ đoạn văn không dưới 14px (mobile ưu tiên 16px cho input để iOS không tự phóng to), vùng bấm ≥ 44×44px.
