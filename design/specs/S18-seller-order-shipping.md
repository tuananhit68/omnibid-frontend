# S18 – Đơn hàng & Cập nhật vận chuyển (Người bán)

| | |
|---|---|
| Route | `/seller/orders/[id]` |
| Vai trò | User (người bán của đơn), Admin |
| Layout | SellerLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S18-seller-order-shipping.png` (PNG @2x, frame 1280×1208px) |
| Outline đầy đủ | `design/outline/S18.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Cập nhật tiến trình vận chuyển mô phỏng theo đúng thứ tự.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 "Chi tiết đơn hàng #ORD-…" + `StatusBadge`; "Khởi tạo ngày"; nút `outline` "Xem phiên đấu giá liên quan".
2. Lưới 2 cột (trái ~ 37%, phải ~ 63%).
3. Trái: card "Sản phẩm trúng đấu giá" (chip phiên, ảnh, mã, tên, khối giá trúng + tổng thanh toán 24/700 `primary-700`); card "Thông tin người mua" (avatar chữ, tên, ID, địa chỉ giao nhận).
4. Phải: card "Bảng cập nhật tiến trình vận chuyển": chip "Mã vận đơn mô phỏng: SIM-…"; `ShipmentStepper` 4 bước có thời điểm; khối hành động nền `surface-subtle` (trạng thái tiếp theo + ô "Ghi chú hành trình (tuỳ chọn)" + nút `primary` "Lưu trạng thái"); bảng "Lịch sử cập nhật" (Trạng thái | Ghi chú | Người cập nhật | Thời gian); chú thích "Chỉ cập nhật trạng thái trong hệ thống mô phỏng".

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S18.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Container | 0, 0 | 1280 × 1256 | col gap 0, pad 0 0 0 256 | Kênh Người Bán / Quản lý đơn hàng |
| 2 | · Main | 256, 0 | 1024 × 1208 | col gap 0, pad 64 32 24 32, bg #FAF8FF | Kênh Người Bán / Quản lý đơn hàng |
| 3 | · · Container | 288, 64 | 960 × 1120 | col gap 0, pad 24 0 24 0 | Kênh Người Bán / Quản lý đơn hàng |
| 4 | · · · Breadcrumb & Top Bar:margin | 288, 88 | 960 × 122 | col gap 0, pad 0 0 24 0 | Kênh Người Bán / Quản lý đơn hàng |
| 5 | · · · · Breadcrumb & Top Bar | 288, 88 | 960 × 98 | col gap 4 | Kênh Người Bán / Quản lý đơn hàng |
| 6 | · · · · · Margin | 288, 108 | 960 × 78 | col gap 0, pad 4 0 0 0 | Chi tiết đơn hàng #ORD-8841 / Đã thanh toán |
| 7 | · · · · · · Container | 288, 112 | 960 × 74 | row gap 16 | Chi tiết đơn hàng #ORD-8841 / Đã thanh toán |
| 8 | · · · · · · · Button – Xem phiên đấu giá liên quan | 1021, 127 | 226 × 44 | row gap 4, pad 0 16 0 16, bg #FFFFFF, r 8, shadow | Xem phiên đấu giá liên quan |
| 4 | · · · Main 12-Column Content Layout (8 Cols Left / 4 | 288, 210 | 960 × 950 |  | Sản phẩm trúng đấu giá / Phiên: |
| 5 | · · · · LEFT 5 COLUMNS: Product, Buyer Info & Payment  | 288, 210 | 386 × 622 | col gap 24 | Sản phẩm trúng đấu giá / Phiên: |
| 6 | · · · · · Product Card | 288, 210 | 386 × 336 | col gap 16, pad 24, bg #FFFFFF, border #C4C5D7@0.30, r 12, shadow | Sản phẩm trúng đấu giá / Phiên: |
| 7 | · · · · · · HorizontalBorder | 313, 235 | 336 × 57 | row gap 0, pad 0 0 4 0, border #EAEDFF | Sản phẩm trúng đấu giá / Phiên: |
| 8 | · · · · · · · Container | 313, 235 | 206 × 52 | row gap 4 | Sản phẩm trúng đấu giá |
| 8 | · · · · · · · Background | 522, 241 | 126 × 40 | row gap 4, pad 4 10 4 10, bg #F2F3FF, r 4 | Phiên: / #AUC- 2049 |
| 7 | · · · · · · Container | 313, 308 | 336 × 96 | row gap 16 | VIP / SKU: PRD-8821 |
| 8 | · · · · · · · Container | 425, 308 | 224 × 77 | col gap 2 | SKU: PRD-8821 / Đồng hồ Thụy Sỹ Chronograph Heritage 1972 Au |
| 7 | · · · · · · Payment Breakdown:margin | 313, 420 | 336 × 101 | col gap 0, pad 4 0 0 0 | Giá trúng phiên / 38.200.000 ₫ |
| 8 | · · · · · · · Payment Breakdown | 313, 424 | 336 × 97 | col gap 8, pad 16, bg #F2F3FF, r 8 | Giá trúng phiên / 38.200.000 ₫ |
| 6 | · · · · · Buyer Information Card | 288, 570 | 386 × 262 | col gap 16, pad 24, bg #FFFFFF, border #C4C5D7@0.30, r 12, shadow | Thông tin người mua / TL |
| 7 | · · · · · · HorizontalBorder | 313, 595 | 336 × 31 | row gap 4, pad 0 0 4 0, border #EAEDFF | Thông tin người mua |
| 7 | · · · · · · Background | 313, 642 | 336 × 68 | row gap 16, pad 8, bg #F2F3FF, r 8 | TL / Trần Bảo Long |
| 7 | · · · · · · Container | 313, 726 | 336 × 81 | col gap 4 | Địa chỉ giao nhận / Số 48, Phố Tràng Tiền, Phường Tràng Tiền |
| 8 | · · · · · · · Background | 313, 746 | 336 × 61 | row gap 4, pad 8, bg #F2F3FF, r 8 | Số 48, Phố Tràng Tiền, Phường Tràng Tiền, Thành  |
| 5 | · · · · RIGHT 7 COLUMNS: Shipping Progress, Update For | 698, 210 | 550 × 950 | col gap 24, pad 24, bg #FFFFFF, border #C4C5D7@0.30, r 12, shadow | Bảng cập nhật tiến trình vận chuyển / Đơn hàng sẵn sàng đóng |
| 6 | · · · · · Header | 723, 235 | 500 × 103 | row gap 8, pad 0 0 8 0, border #EAEDFF | Bảng cập nhật tiến trình vận chuyển / Đơn hàng sẵn sàng đóng |
| 7 | · · · · · · Container | 723, 235 | 298 × 94 | col gap 2 | Bảng cập nhật tiến trình vận chuyển / Đơn hàng sẵn sàng đóng |
| 8 | · · · · · · · Container | 723, 235 | 298 × 52 | row gap 4 | Bảng cập nhật tiến trình vận chuyển |
| 8 | · · · · · · · Container | 723, 289 | 298 × 40 | col gap 0 | Đơn hàng sẵn sàng đóng gói và bàn giao cho đơn v |
| 7 | · · · · · · Background | 1034, 259 | 188 × 45 | row gap 4, pad 6 16 6 16, bg #EAEDFF, r 8 | Mã vận đơn mô phỏng: / SIM-0004 |
| 8 | · · · · · · · Paragraph | 1069, 265 | 137 × 33 | col gap 1 | Mã vận đơn mô phỏng: / SIM-0004 |
| 6 | · · · · · 4-Step Visual Tracker (Clean standard at Step  | 723, 362 | 500 × 92 | col gap 0, pad 8 0 4 0 | 1. Đã tạo / 28/10 14:30 |
| 7 | · · · · · · Container | 723, 370 | 500 × 80 | row gap 46, pad 0 16 0 16 | 1. Đã tạo / 28/10 14:30 |
| 6 | · · · · · Action Form | 723, 478 | 500 × 242 | col gap 0, pad 24, bg #F2F3FF, border #C4C5D7@0.20, r 12 | Chuyển trạng thái tiếp theo / * |
| 7 | · · · · · · Form | 748, 503 | 450 × 192 | col gap 16 | Chuyển trạng thái tiếp theo / * |
| 8 | · · · · · · · Container | 748, 647 | 450 × 48 | row gap 0, pad 4 0 0 133 | Lưu trạng thái / Xác nhận gửi hàng |
| 6 | · · · · · Shipping Update History Log | 723, 744 | 500 × 346 | col gap 8, pad 4 0 0 0 | Lịch sử cập nhật tiến trình vận chuyển / 1 bản ghi |
| 7 | · · · · · · Background+Border+Shadow | 723, 776 | 500 × 314 | col gap 0, bg #F2F3FF, border #C4C5D7@0.20, r 8, shadow | TRẠNG THÁI / GHI CHÚ HÀNH TRÌNH |
| 8 | · · · · · · · Table | 724, 777 | 498 × 312 | col gap 0 | TRẠNG THÁI / GHI CHÚ HÀNH TRÌNH |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#434655` | `text-secondary` | 41 |
| `#131B2E` | `text` | 21 |
| `#FFFFFF` | `surface / text-inverse` | 16 |
| `#0037B0` | `primary-700` | 10 |
| `#0D1C2E` | `text` | 8 |
| `#F2F3FF` | `surface-subtle` | 8 |
| `#747686` | `text-subtle (sửa #696B7B)` | 8 |
| `#D5E3FC` | `primary-100` | 5 |
| `#1D4ED8` | `primary-600` | 5 |
| `#E2E7FF` | `surface-strong / border-brand` | 4 |
| `#FAF8FF` | `bg` | 3 |
| `#EAEDFF` | `surface-muted` | 2 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 400 | `text-caption` | 17 |
| 14px / 600 | `text-body (600)` | 14 |
| 12px / 600 | `text-label / .label` | 11 |
| 14px / 400 | `text-body` | 9 |
| 12px / 700 | `text-label / .label` | 5 |
| 18px / 600 | `text-h3` | 3 |
| 12px / 500 | `text-label / .label` | 3 |
| 30px / 700 | `text-h1` | 1 |
| 11px / 400 | `text-caption (Figma <12px – nâng lên)` | 1 |
| 14px / 500 | `text-body` | 1 |

## API

- `GET /orders/{id}`
- `GET /orders/{id}/shipment`
- `PATCH /shipments/{id}/status { status, note? }`
- `Nút cập nhật hiện khi allowedActions có UPDATE_SHIPMENT`

Body, DTO, mã lỗi chi tiết ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Đơn PENDING_PAYMENT: ẩn khối vận chuyển, hiện "Chờ người mua thanh toán (hạn …)".
- DELIVERED: ẩn khối hành động, hiện "Chờ người mua xác nhận đến …".
- INVALID_STATUS_TRANSITION: refetch + toast.
- COMPLETED/CANCELLED: chỉ đọc.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Chỉ 1 trạng thái kế tiếp hợp lệ (CREATED→PICKED_UP→IN_TRANSIT→DELIVERED) – không dùng dropdown (G21).
- Cột ghi chú min-width 240px.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G5**, **G21**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S18-seller-order-shipping.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S18 – Đơn hàng & Cập nhật vận chuyển (Người bán).
Đọc: design/specs/S18-seller-order-shipping.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S18-seller-order-shipping.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
