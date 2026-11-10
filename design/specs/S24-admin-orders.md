# S24 – Quản lý đơn hàng (Admin)

| | |
|---|---|
| Route | `/admin/orders` |
| Vai trò | Admin |
| Layout | AdminLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S24-admin-orders.png` (PNG @2x, frame 1280×1091px) |
| Outline đầy đủ | `design/outline/S24.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Giám sát đơn, thanh toán, vận chuyển; huỷ đơn khi cần.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả.
2. Hàng 4 KPI (Tổng đơn · Chờ thanh toán · Đang giao · Đã huỷ/Hết hạn).
3. Card lọc giống S23.
4. Bảng: Mã đơn (link) + ngày | Người mua | Người bán | Sản phẩm (ảnh + tên + mã) | Giá trúng | Trạng thái | Thanh toán/Hạn (mốc gần nhất) | Thao tác (Xem · Huỷ).

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S24.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 256, 0 | 1024 × 1090 | col gap 2, pad 64 0 0 0, bg #FAF8FF | Quản trị hệ thống / Quản lý đơn hàng |
| 2 | · Content Area | 256, 64 | 1024 × 946 | col gap 24, pad 24 | Quản trị hệ thống / Quản lý đơn hàng |
| 3 | · · Breadcrumb & Header Section | 280, 88 | 976 × 96 | row gap 0 | Quản trị hệ thống / Quản lý đơn hàng |
| 4 | · · · Container | 280, 88 | 767 × 96 | col gap 4 | Quản trị hệ thống / Quản lý đơn hàng |
| 5 | · · · · Container | 280, 108 | 767 × 32 | row gap 0 | Quản lý đơn hàng |
| 6 | · · · · · Heading 1 | 280, 108 | 194 × 32 | col gap 0 | Quản lý đơn hàng |
| 5 | · · · · Container | 280, 144 | 767 × 40 | col gap 0 | Giám sát giao dịch trúng đấu giá, theo dõi lịch  |
| 3 | · · Quick Stat Cards / Summary Row | 280, 208 | 976 × 120 | row gap 16 | TỔNG SỐ ĐƠN / 1.842 |
| 4 | · · · Card 1: Tổng số đơn | 280, 208 | 232 × 120 | col gap 0, pad 16, bg #FFFFFF, r 12, shadow | TỔNG SỐ ĐƠN / 1.842 |
| 5 | · · · · Container | 296, 224 | 200 × 68 | row gap 38 | TỔNG SỐ ĐƠN / 1.842 |
| 6 | · · · · · Container | 296, 224 | 122 × 68 | col gap 8 | TỔNG SỐ ĐƠN / 1.842 |
| 7 | · · · · · · Paragraph | 296, 248 | 122 × 44 | row gap 6 | 1.842 / đơn |
| 4 | · · · Card 2: Chờ thanh toán | 528, 208 | 232 × 120 | col gap 0, pad 16 16 36 16, bg #FFFFFF, r 12, shadow | CHỜ THANH TOÁN / 24 |
| 5 | · · · · Container | 544, 224 | 200 × 68 | row gap 41 | CHỜ THANH TOÁN / 24 |
| 4 | · · · Card 3: Đang giao | 776, 208 | 232 × 120 | col gap 0, pad 16 16 36 16, bg #FFFFFF, r 12, shadow | ĐANG GIAO / 38 |
| 5 | · · · · Container | 792, 224 | 200 × 68 | row gap 86 | ĐANG GIAO / 38 |
| 4 | · · · Card 4: Đã hủy / Hết hạn | 1024, 208 | 232 × 120 | col gap 0, pad 16, bg #FFFFFF, r 12, shadow | ĐÃ HỦY / HẾT HẠN / 19 |
| 5 | · · · · Container | 1040, 224 | 200 × 68 | row gap 39 | ĐÃ HỦY / HẾT HẠN / 19 |
| 6 | · · · · · Container | 1040, 224 | 121 × 68 | col gap 8 | ĐÃ HỦY / HẾT HẠN / 19 |
| 7 | · · · · · · Paragraph | 1040, 248 | 121 × 44 | row gap 6 | 19 / đơn |
| 3 | · · Filters & Search Toolbar | 280, 352 | 976 × 116 | col gap 8, pad 16, bg #FFFFFF, r 12, shadow | Tìm kiếm mã đơn #ORD-..., người mua, người bán,  / Tất cả tr |
| 4 | · · · Container | 296, 368 | 944 × 44 | row gap 16 | Tìm kiếm mã đơn #ORD-..., người mua, người bán,  / Tất cả tr |
| 5 | · · · · Search Input | 296, 368 | 495 × 44 | col gap 0 | Tìm kiếm mã đơn #ORD-..., người mua, người bán,  |
| 6 | · · · · · Input | 296, 368 | 495 × 44 | row gap 0, pad 14 16 14 40, bg #F2F3FF, r 8 | Tìm kiếm mã đơn #ORD-..., người mua, người bán,  |
| 5 | · · · · Filter Controls | 807, 368 | 432 × 44 | row gap 8 | Tất cả trạng thái / Hôm nay |
| 6 | · · · · · Status Dropdown | 807, 368 | 161 × 44 | col gap 0 | Tất cả trạng thái |
| 7 | · · · · · · Options | 807, 368 | 161 × 44 | row gap 0, pad 0 36 0 14, bg #F2F3FF, r 8 | Tất cả trạng thái |
| 6 | · · · · · Quick Date Range Chips | 976, 372 | 167 × 36 | row gap 4, pad 4, bg #F2F3FF, r 8 | Hôm nay / Tuần này |
| 4 | · · · Active Filters Tag Row | 296, 420 | 944 × 32 | row gap 8, pad 8 0 0 0 | Bộ lọc đang áp dụng: / Trạng thái: Tất cả trạng thái |
| 3 | · · Main Content Layout (Table & Side Drawer) → Or | 280, 492 | 976 × 494 | col gap 0, bg #FFFFFF, r 12, shadow | MÃ ĐƠN HÀNG / NGƯỜI MUA |
| 4 | · · · Container | 280, 492 | 976 × 429 | col gap 0 | MÃ ĐƠN HÀNG / NGƯỜI MUA |
| 5 | · · · · Table | 280, 492 | 1352 × 429 | col gap 0 | MÃ ĐƠN HÀNG / NGƯỜI MUA |
| 6 | · · · · · Header → Row | 280, 492 | 1352 × 40 | row gap 0, bg #F2F3FF | MÃ ĐƠN HÀNG / NGƯỜI MUA |
| 7 | · · · · · · Cell | 280, 492 | 126 × 40 | col gap 0, pad 12 | MÃ ĐƠN HÀNG |
| 7 | · · · · · · Cell | 406, 492 | 149 × 40 | col gap 0, pad 12 | NGƯỜI MUA |
| 7 | · · · · · · Cell | 556, 492 | 132 × 40 | col gap 0, pad 12 | NGƯỜI BÁN |
| 7 | · · · · · · Cell | 688, 492 | 220 × 40 | col gap 0, pad 12 | SẢN PHẨM |
| 7 | · · · · · · Cell | 908, 492 | 154 × 40 | col gap 0, pad 12 | GIÁ TRÚNG ĐẤU GIÁ |
| 7 | · · · · · · Cell | 1063, 492 | 149 × 40 | col gap 0, pad 12 | TRẠNG THÁI |
| 7 | · · · · · · Cell | 1213, 492 | 137 × 40 | col gap 0, pad 12 | THANH TOÁN |
| 7 | · · · · · · Cell | 1351, 492 | 124 × 40 | col gap 0, pad 12 | VẬN CHUYỂN |
| 7 | · · · · · · Cell | 1475, 492 | 157 × 40 | col gap 0, pad 12 | THAO TÁC |
| 6 | · · · · · Body | 280, 532 | 1352 × 389 | col gap -1 | #ORD-9102 / 29/10/2026 14:15 |
| 7 | · · · · · · Row 1: #ORD-9102 | 280, 532 | 1352 × 64 | row gap 0, pad 0 12 0 0, bg #F2F3FF@0.30 | #ORD-9102 / 29/10/2026 14:15 |
| 8 | · · · · · · · Data | 280, 532 | 126 × 64 | col gap 0, pad 14 12 14 12 | #ORD-9102 / 29/10/2026 14:15 |
| 8 | · · · · · · · Data | 406, 546 | 137 × 36 | row gap 8, pad 0 0 0 12 | MN / Minh Nguyệt |
| 8 | · · · · · · · Data | 544, 546 | 132 × 36 | row gap 8, pad 0 0 0 24 | ĐT / Đặng Tuấn |
| 8 | · · · · · · · Data | 676, 544 | 219 × 40 | row gap 10, pad 0 0 0 24 | Túi Hermes Kelly 28 / #HER-992 |
| 8 | · · · · · · · Data | 896, 532 | 166 × 64 | col gap 0, pad 22 12 23 24 | 480.000.000 đ |
| 8 | · · · · · · · Data | 1063, 532 | 149 × 64 | col gap 0, pad 20 12 20 12 | Chờ thanh toán |
| 8 | · · · · · · · Data | 1213, 548 | 125 × 32 | col gap 0, pad 0 0 0 12 | Thử 3 lần lỗi / Hạn: 30/10 21:00 |
| 8 | · · · · · · · Data | 1339, 532 | 136 × 64 | col gap 0, pad 24 12 24 24 | Chưa tạo vận đơn |
| 8 | · · · · · · · Data | 1475, 548 | 145 × 32 | row gap 6, pad 0 0 0 12 | Xem / Hủy |
| 7 | · · · · · · Row 2: #ORD-9088 (×5 lặp lại) | 280, 595 | 1352 × 66 | row gap 0, pad 0 12 0 0, border #F2F3FF | #ORD-9088 / 29/10/2026 11:30 |
| 8 | · · · · · · · Data | 280, 596 | 126 × 64 | col gap 0, pad 14 12 14 12 | #ORD-9088 / 29/10/2026 11:30 |
| 8 | · · · · · · · Data | 406, 611 | 137 × 36 | row gap 8, pad 0 0 0 12 | TL / Trần Long |
| 8 | · · · · · · · Data | 544, 611 | 132 × 36 | row gap 8, pad 0 0 0 24 | VL / Vũ Lâm |
| 8 | · · · · · · · Data | 676, 609 | 219 × 40 | row gap 10, pad 0 0 0 24 | Rolex Submariner / #RLX-410 |
| 8 | · · · · · · · Data | 896, 596 | 166 × 65 | col gap 0, pad 22 12 23 24 | 120.000.000 đ |
| 8 | · · · · · · · Data | 1063, 596 | 149 × 65 | col gap 0, pad 20 12 20 12 | Chờ thanh toán |
| 8 | · · · · · · · Data | 1213, 613 | 125 × 32 | col gap 0, pad 0 0 0 12 | Còn 6h 30m / Thử 3 lần mô phỏng |
| 8 | · · · · · · · Data | 1339, 596 | 136 × 65 | col gap 0, pad 25 12 24 24 | Chờ thanh toán |
| 8 | · · · · · · · Data | 1475, 613 | 145 × 32 | row gap 6, pad 0 0 0 12 | Xem / Hủy |
| 4 | · · · Table Pagination Footer | 280, 921 | 976 × 65 | row gap 330, pad 16, bg #FFFFFF, border #F2F3FF | Hiển thị / 10 |
| 5 | · · · · Container | 296, 938 | 305 × 32 | row gap 8 | Hiển thị / 10 |
| 5 | · · · · Container | 931, 938 | 308 × 32 | row gap 4 | 1 / 2 |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#131B2E` | `text` | 40 |
| `#0037B0` | `primary-700` | 38 |
| `#434655` | `text-secondary` | 36 |
| `#515F74` | `text-tertiary` | 36 |
| `#747686` | `text-subtle (sửa #696B7B)` | 28 |
| `#FFFFFF` | `surface / text-inverse` | 17 |
| `#F2F3FF` | `surface-subtle` | 15 |
| `#E2E7FF` | `surface-strong / border-brand` | 15 |
| `#1D4ED8` | `primary-600` | 9 |
| `#BA1A1A` | `danger` | 9 |
| `#7F2500` | `tertiary-800` | 7 |
| `#D5E3FC` | `primary-100` | 6 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 600 | `text-label / .label` | 44 |
| 12px / 400 | `text-caption` | 38 |
| 14px / 600 | `text-body (600)` | 22 |
| 12px / 700 | `text-label / .label` | 12 |
| 14px / 400 | `text-body` | 10 |
| 16px / 500 | `text-body-lg` | 7 |
| 14px / 700 | `text-body (600)` | 6 |
| 14px / 500 | `text-body` | 6 |
| 12px / 500 | `text-label / .label` | 5 |
| 36px / 700 | `text-display / text-price-xl` | 4 |

## API

- `GET /admin/orders?status&buyerId&sellerId&from&to&page&size`
- `POST /admin/orders/{id}/cancel { reason }`
- `GET /orders/{id} + /payments + /shipment (trang chi tiết dùng lại S18 ở chế độ admin)`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Huỷ chỉ cho PENDING_PAYMENT (người mua/bán bị khoá, sản phẩm bị ẩn) hoặc qua xử lý khiếu nại.
- Bọc bảng `overflow-x-auto` (Figma cắt cột cuối).
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S24-admin-orders.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S24 – Quản lý đơn hàng (Admin).
Đọc: design/specs/S24-admin-orders.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S24-admin-orders.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
