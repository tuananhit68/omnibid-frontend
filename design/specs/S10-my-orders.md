# S10 – Đơn hàng của tôi (Người mua)

| | |
|---|---|
| Route | `/me/orders` |
| Vai trò | User (người mua; tab người bán dùng /seller/orders) |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S10-my-orders.png` (PNG @2x, frame 1280×1266px) |
| Outline đầy đủ | `design/outline/S10.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Theo dõi các đơn trúng đấu giá.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả.
2. Hàng 5 `StatCard`: Tổng đơn (+ giá trị trúng) · Chờ thanh toán (nền `warning-subtle-bg`, số `tertiary`) · Đang giao · Đã hoàn tất · Huỷ/Hết hạn.
3. Thanh lọc: tabs pill theo trạng thái có số đếm + ô tìm kiếm + select sắp xếp.
4. Bảng: Mã đơn (`primary-600` + ngày + nhãn "Cần TT ngay" nếu gấp) | Sản phẩm (ảnh 48px + tên + mã phiên + danh mục) | Số tiền | Hạn thanh toán / mốc gần nhất | Trạng thái | (Thao tác). Hàng chờ thanh toán nền `danger-bg` rất nhạt; hàng huỷ/hết hạn chữ gạch ngang + ảnh placeholder.
5. `Pagination`.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S10.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 0, 0 | 1280 × 1182 | col gap 0, pad 64 16 0 16, bg #FAF8FF | Trang chủ / Tài khoản của tôi |
| 2 | · Content Area Wrapper | 16, 64 | 1248 × 1118 | col gap 24, pad 32 32 56 32 | Trang chủ / Tài khoản của tôi |
| 3 | · · Top Breadcrumb & Page Title Section | 48, 96 | 1184 × 126 | col gap 4 | Trang chủ / Tài khoản của tôi |
| 4 | · · · Nav - Breadcrumb:margin | 48, 96 | 1184 × 36 | col gap 0, pad 0 0 16 0 | Trang chủ / Tài khoản của tôi |
| 4 | · · · Container | 48, 136 | 1184 × 86 | row gap 0, pad 4 0 0 0 | Đơn hàng của tôi / Theo dõi tiến trình thanh toán, vận chuyể |
| 5 | · · · · Container | 48, 140 | 750 × 82 | col gap 4 | Đơn hàng của tôi / Theo dõi tiến trình thanh toán, vận chuyể |
| 6 | · · · · · Heading 1 | 48, 140 | 750 × 38 | col gap 0 | Đơn hàng của tôi |
| 6 | · · · · · Container | 48, 182 | 750 × 40 | col gap 0 | Theo dõi tiến trình thanh toán, vận chuyển và bi |
| 3 | · · Overview Metrics Cards (Bento-styled grid) | 48, 246 | 1184 × 161 | row gap 16, pad 25 0 0 0 | TỔNG ĐƠN / 05 |
| 4 | · · · Card 1: Tổng đơn | 48, 271 | 224 × 136 | col gap 0, pad 16, bg #FFFFFF, r 12, shadow | TỔNG ĐƠN / 05 |
| 5 | · · · · Container | 64, 287 | 192 × 32 | row gap 90 | TỔNG ĐƠN |
| 5 | · · · · Margin | 64, 319 | 192 × 72 | col gap 0, pad 16 0 0 0 | 05 / Giá trị trúng: 72.730.000 ₫ |
| 6 | · · · · · Container | 64, 335 | 192 × 56 | col gap 2 | 05 / Giá trị trúng: 72.730.000 ₫ |
| 7 | · · · · · · Container | 64, 335 | 192 × 38 | col gap 0 | 05 |
| 4 | · · · Card 2: Chờ thanh toán (Warning / Action Neede | 288, 271 | 224 × 136 | col gap 18, pad 16, bg #FFDBCF@0.20, r 12, shadow | CHỜ THANH TOÁN / 01 |
| 5 | · · · · Container | 304, 287 | 192 × 32 | row gap 40 | CHỜ THANH TOÁN |
| 5 | · · · · Margin | 304, 337 | 192 × 54 | col gap 0, pad 16 0 0 0 | 01 / đơn |
| 6 | · · · · · Paragraph | 304, 353 | 192 × 38 |  | 01 / đơn |
| 4 | · · · Card 3: Đang giao hàng | 528, 271 | 224 × 136 | col gap 18, pad 16, bg #FFFFFF, r 12, shadow | ĐANG GIAO / 01 |
| 5 | · · · · Container | 544, 287 | 192 × 32 | row gap 86 | ĐANG GIAO |
| 5 | · · · · Margin | 544, 337 | 192 × 54 | col gap 0, pad 16 0 0 0 | 01 |
| 6 | · · · · · Container | 544, 353 | 192 × 38 | col gap 0 | 01 |
| 4 | · · · Card 4: Đã hoàn tất | 768, 271 | 224 × 136 | col gap 18, pad 16, bg #FFFFFF, r 12, shadow | ĐÃ HOÀN TẤT / 02 |
| 5 | · · · · Container | 784, 287 | 192 × 32 | row gap 69 | ĐÃ HOÀN TẤT |
| 5 | · · · · Margin | 784, 337 | 192 × 54 | col gap 0, pad 16 0 0 0 | 02 |
| 6 | · · · · · Container | 784, 353 | 192 × 38 | col gap 0 | 02 |
| 4 | · · · Card 5: Đã hủy / Hết hạn | 1008, 271 | 224 × 136 | col gap 18, pad 16, bg #FFFFFF, r 12, shadow | HỦY / HẾT HẠN / 01 |
| 5 | · · · · Container | 1024, 287 | 192 × 32 | row gap 61 | HỦY / HẾT HẠN |
| 5 | · · · · Margin | 1024, 337 | 192 × 54 | col gap 0, pad 16 0 0 0 | 01 |
| 6 | · · · · · Container | 1024, 353 | 192 × 38 | col gap 0 | 01 |
| 3 | · · Filter Pills & Search Section | 48, 431 | 1184 × 76 | row gap 16, pad 16, bg #FFFFFF, r 12, shadow | Tất cả (5) / Chờ thanh toán (1) |
| 4 | · · · Status Pills | 64, 454 | 640 × 30 |  | Tất cả (5) / Chờ thanh toán (1) |
| 5 | · · · · Button – Chờ thanh toán (1) | 149, 454 | 150 × 30 | row gap 6, pad 6 12 6 12, bg #FFFFFF, border #C4C5D7@0.50, r 8 | Chờ thanh toán (1) |
| 5 | · · · · Button – Đã thanh toán (0) | 303, 454 | 130 × 30 | col gap 0, pad 6 12 6 12, bg #FFFFFF, border #C4C5D7@0.50, r 8 | Đã thanh toán (0) |
| 4 | · · · Search & Sort Controls | 728, 447 | 487 × 44 | row gap 8 | Tìm theo mã đơn hoặc sản phẩm... / Mới nhất |
| 5 | · · · · Background | 728, 447 | 279 × 44 | row gap 0, pad 0 16 0 16, bg #F2F3FF, r 8 | Tìm theo mã đơn hoặc sản phẩm... |
| 5 | · · · · Container | 1016, 447 | 200 × 44 | col gap 0 | Mới nhất |
| 6 | · · · · · Options | 1016, 447 | 200 × 44 | row gap 0, pad 0 36 0 16, bg #F2F3FF, r 8 | Mới nhất |
| 3 | · · Orders Table Container | 48, 531 | 1184 × 595 | col gap 0, bg #FFFFFF, r 12, shadow | MÃ ĐƠN HÀNG / SẢN PHẨM TRÚNG ĐẤU GIÁ |
| 4 | · · · Container | 48, 531 | 1184 × 543 | col gap 0 | MÃ ĐƠN HÀNG / SẢN PHẨM TRÚNG ĐẤU GIÁ |
| 5 | · · · · Table | 48, 531 | 1420 × 543 | col gap -1 | MÃ ĐƠN HÀNG / SẢN PHẨM TRÚNG ĐẤU GIÁ |
| 6 | · · · · · Header → Row | 48, 531 | 1420 × 43 | row gap 0, bg #F2F3FF, border #E2E7FF | MÃ ĐƠN HÀNG / SẢN PHẨM TRÚNG ĐẤU GIÁ |
| 7 | · · · · · · Cell | 48, 531 | 134 × 42 | col gap 0, pad 12 16 12 16 | MÃ ĐƠN HÀNG |
| 7 | · · · · · · Cell | 182, 531 | 614 × 42 | col gap 0, pad 12 16 12 16 | SẢN PHẨM TRÚNG ĐẤU GIÁ |
| 7 | · · · · · · Cell | 797, 531 | 137 × 42 | col gap 0, pad 12 16 12 16 | SỐ TIỀN |
| 7 | · · · · · · Cell | 934, 531 | 198 × 42 | col gap 0, pad 12 16 12 16 | HẠN THANH TOÁN |
| 7 | · · · · · · Cell | 1132, 531 | 169 × 42 | col gap 0, pad 12 16 12 16 | TRẠNG THÁI |
| 7 | · · · · · · Cell | 1302, 531 | 165 × 42 | col gap 0, pad 12 16 12 16 | THAO TÁC |
| 6 | · · · · · Body | 48, 573 | 1420 × 501 | col gap 0 | #ORD-8841 / 26/10/2026 20:45 |
| 7 | · · · · · · Row - ROW 1: Pending Payment (Highlighted urge | 48, 573 | 1420 × 105 | row gap 0, bg #FFDBCF@0.10 | #ORD-8841 / 26/10/2026 20:45 |
| 8 | · · · · · · · Data | 48, 573 | 134 × 105 | col gap 0, pad 16 16 14 16, border #E2E7FF | #ORD-8841 / 26/10/2026 20:45 |
| 8 | · · · · · · · Data | 182, 573 | 614 × 89 | col gap 0, pad 12 16 12 16, border #E2E7FF | Đồng hồ Thụy Sỹ Chronograph Heritage 1972 Automa / #AUC-2049 |
| 8 | · · · · · · · Data | 797, 573 | 137 × 89 | col gap 0, pad 32 16 32 16, border #E2E7FF | 38.200.000 ₫ |
| 8 | · · · · · · · Data | 934, 573 | 198 × 89 | col gap 0, pad 20 16 20 16, border #E2E7FF | Còn 23 giờ 45 phút / Hạn: 27/10/2026 20:30 |
| 8 | · · · · · · · Data | 1132, 573 | 169 × 89 | col gap 0, pad 32 16 32 16, border #E2E7FF | Chờ thanh toán |
| 8 | · · · · · · · Data | 1302, 573 | 165 × 89 | col gap 0, pad 24 16 24 16, border #E2E7FF | Thanh toán |
| 7 | · · · · · · Row - ROW 2: In Shipping | 48, 678 | 1420 × 109 | row gap 0 | #ORD-8839 / 25/10/2026 14:10 |
| 8 | · · · · · · · Data | 48, 678 | 134 × 89 | col gap 0, pad 26 16 24 16, border #E2E7FF | #ORD-8839 / 25/10/2026 14:10 |
| 8 | · · · · · · · Data | 182, 678 | 614 × 89 | col gap 0, pad 12 16 12 16, border #E2E7FF | Máy ảnh cơ Leica M3 Rangefinder (Single Stroke,  / #AUC-1988 |
| 8 | · · · · · · · Data | 797, 678 | 137 × 89 | col gap 0, pad 32 16 32 16, border #E2E7FF | 21.500.000 ₫ |
| 8 | · · · · · · · Data | 934, 678 | 198 × 109 | col gap 0, pad 26 16 24 16, border #E2E7FF | Đã TT: 25/10/2026 15:02 / Mã vận đơn: GHN-89412588 |
| 8 | · · · · · · · Data | 1132, 678 | 169 × 89 | col gap 0, pad 32 16 32 16, border #E2E7FF | Đang giao |
| 8 | · · · · · · · Data | 1302, 678 | 165 × 89 | col gap 0, pad 28 16 28 16, border #E2E7FF | Chi tiết |
| 7 | · · · · · · Row - ROW 3: Completed 1 | 48, 787 | 1420 × 109 | row gap 0 | #ORD-8835 / 22/10/2026 09:15 |
| 8 | · · · · · · · Data | 48, 787 | 134 × 89 | col gap 0, pad 26 16 24 16, border #E2E7FF | #ORD-8835 / 22/10/2026 09:15 |
| 8 | · · · · · · · Data | 182, 787 | 614 × 89 | col gap 0, pad 12 16 12 16, border #E2E7FF | Bộ bàn trà gỗ Mun hoa chạm khắc nghệ thuật đầu t / #AUC-1942 |
| 8 | · · · · · · · Data | 797, 787 | 137 × 89 | col gap 0, pad 32 16 32 16, border #E2E7FF | 12.500.000 ₫ |
| 8 | · · · · · · · Data | 934, 787 | 198 × 109 | col gap 0, pad 26 16 24 16, border #E2E7FF | Đã TT: 22/10/2026 10:30 / Nhận hàng: 24/10/2026 |
| 8 | · · · · · · · Data | 1132, 787 | 169 × 89 | col gap 0, pad 32 16 32 16, border #E2E7FF | Hoàn tất |
| 8 | · · · · · · · Data | 1302, 787 | 165 × 89 | col gap 0, pad 28 16 28 16, border #E2E7FF | Chi tiết |

_(Bảng rút gọn 70/86 khối; xem outline để có đủ.)_

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#515F74` | `text-tertiary` | 45 |
| `#FFFFFF` | `surface / text-inverse` | 23 |
| `#131B2E` | `text` | 19 |
| `#434655` | `text-secondary` | 18 |
| `#0037B0` | `primary-700` | 16 |
| `#747686` | `text-subtle (sửa #696B7B)` | 11 |
| `#EAEDFF` | `surface-muted` | 6 |
| `#7F2500` | `tertiary-800` | 6 |
| `#F2F3FF` | `surface-subtle` | 6 |
| `#064E3B` | `success` | 4 |
| `#64748B` | `text-placeholder` | 3 |
| `#390C00` | `tertiary-800` | 3 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 600 | `text-label / .label` | 36 |
| 12px / 400 | `text-caption` | 20 |
| 14px / 500 | `text-body` | 11 |
| 16px / 700 | `text-h4` | 10 |
| 14px / 700 | `text-body (600)` | 7 |
| 30px / 700 | `text-h1` | 6 |
| 14px / 400 | `text-body` | 5 |
| 14px / 600 | `text-body (600)` | 5 |
| 12px / 700 | `text-label / .label` | 3 |
| 24px / 600 | `text-h2 / text-timer` | 1 |

## API

- `GET /orders?role=buyer&status&page&size (không có keyword/sort)`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Cột hạn thanh toán: PENDING_PAYMENT → chip đỏ "Còn 23 giờ 45 phút" + "Hạn: dd/MM/yyyy HH:mm"; PAID/SHIPPING → "Đã TT: …" + mã vận đơn; COMPLETED → "Nhận hàng: …"; EXPIRED/CANCELLED → ngày huỷ.
- Cả hàng là link tới S11; thêm cột Thao tác (Thanh toán / Theo dõi) để không phụ thuộc click hàng.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Bọc bảng trong `overflow-x-auto` (Figma bị cắt cột Trạng thái).
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G18**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S10-my-orders.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S10 – Đơn hàng của tôi (Người mua).
Đọc: design/specs/S10-my-orders.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S10-my-orders.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
