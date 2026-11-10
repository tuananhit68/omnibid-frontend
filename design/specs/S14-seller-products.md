# S14 – Sản phẩm của tôi (Người bán)

| | |
|---|---|
| Route | `/seller/products` |
| Vai trò | User (người bán) |
| Layout | SellerLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S14-seller-products.png` (PNG @2x, frame 1280×1297px) |
| Outline đầy đủ | `design/outline/S14.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Quản lý kho sản phẩm và khởi tạo phiên.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb "Kênh Người Bán › Quản lý kho hàng › Sản phẩm của tôi"; h1 + mô tả; nút `primary` lg "+ Thêm sản phẩm" bên phải.
2. Hàng 4 `StatCard`: Tổng sản phẩm · Có thể tạo phiên (AVAILABLE) · Đang đấu giá/Giữ chỗ · Cần lưu ý (HIDDEN, danger).
3. Card lọc: ô tìm kiếm, select danh mục, select sắp xếp; hàng chip trạng thái có số đếm (Tất cả · Có thể đấu giá · Đang đấu giá · Đang giữ chỗ · Đã bán · Đã ẩn · Đã gỡ).
4. Bảng: checkbox | Hình ảnh & tên (ảnh 40px, badge "Đang đấu giá" nếu đang đấu giá, tên, mã PRD) | Danh mục | Tình trạng | Trạng thái (`StatusBadge` + dòng phụ) | Thao tác (menu ⋯: Sửa · Tạo phiên · Gỡ). Hàng HIDDEN nền `danger-bg` nhạt, ảnh mờ + icon khoá.
5. `Pagination`.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S14.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Container | 0, 0 | 1280 × 1297 | col gap 0, pad 0 0 0 256 | Kênh Người Bán / Quản lý kho hàng |
| 2 | · Main | 256, 0 | 1024 × 1249 | col gap 0, pad 64 32 24 32, bg #FAF8FF | Kênh Người Bán / Quản lý kho hàng |
| 3 | · · Container | 288, 64 | 960 × 1161 | col gap 24, pad 24 0 24 0 | Kênh Người Bán / Quản lý kho hàng |
| 4 | · · · 1. Header & Breadcrumb | 288, 88 | 960 × 94 | row gap 222 | Kênh Người Bán / Quản lý kho hàng |
| 5 | · · · · Container | 288, 88 | 557 × 94 | col gap 4 | Kênh Người Bán / Quản lý kho hàng |
| 6 | · · · · · Margin | 288, 116 | 557 × 42 | col gap 0, pad 4 0 0 0 | Sản phẩm của tôi |
| 7 | · · · · · · Container | 288, 120 | 557 × 38 | row gap 0 | Sản phẩm của tôi |
| 8 | · · · · · · · Heading 1 | 288, 120 | 557 × 38 | col gap 0 | Sản phẩm của tôi |
| 5 | · · · · Button – Thêm sản phẩm | 1076, 113 | 171 × 44 | row gap 4, pad 0 24 0 24, bg #1D4ED8, r 8, shadow | Thêm sản phẩm |
| 4 | · · · 2. Metrics Overview Cards | 288, 206 | 960 × 164 | row gap 16 | Tổng sản phẩm / 08 |
| 5 | · · · · Card 1 (×4 lặp lại) | 288, 206 | 228 × 164 | col gap 8, pad 24, bg #FFFFFF, r 12, shadow | Tổng sản phẩm / 08 |
| 6 | · · · · · Container | 312, 230 | 180 × 36 | row gap 40 | Tổng sản phẩm |
| 6 | · · · · · Container | 312, 274 | 180 × 44 | row gap 0 | 08 |
| 4 | · · · 3. Filter & Control Toolbar | 288, 394 | 960 × 128 | col gap 16, pad 16, bg #FFFFFF, r 12, shadow | Tìm kiếm theo tên sản phẩm, mã SKU hoặc danh mục / Tất cả da |
| 5 | · · · · Container | 304, 410 | 928 × 44 | row gap 16 | Tìm kiếm theo tên sản phẩm, mã SKU hoặc danh mục / Tất cả da |
| 6 | · · · · · Search | 304, 410 | 528 × 44 | col gap 0 | Tìm kiếm theo tên sản phẩm, mã SKU hoặc danh mục |
| 7 | · · · · · · Input | 304, 410 | 528 × 44 | row gap 0, pad 14 16 14 40, bg #F2F3FF, r 8 | Tìm kiếm theo tên sản phẩm, mã SKU hoặc danh mục |
| 6 | · · · · · Filters on Right | 848, 410 | 383 × 44 | row gap 8 | Tất cả danh mục / Mới nhất |
| 7 | · · · · · · Background | 848, 410 | 198 × 44 | row gap 4, pad 0 16 0 16, bg #F2F3FF, r 8 | Tất cả danh mục |
| 7 | · · · · · · Background | 1054, 410 | 177 × 44 | row gap 4, pad 0 16 0 16, bg #F2F3FF, r 8 | Mới nhất |
| 5 | · · · · Status Tabs | 304, 470 | 928 × 36 | row gap 4, pad 4 0 4 0 | Tất cả (8) / Có thể đấu giá (3) |
| 6 | · · · · · Button – Có thể đấu giá (3) | 398, 474 | 139 × 28 | col gap 0, pad 6 16 6 16, bg #EAEDFF, r 8 | Có thể đấu giá (3) |
| 6 | · · · · · Button – Đang đấu giá (2) | 541, 474 | 131 × 28 | col gap 0, pad 6 16 6 16, bg #EAEDFF, r 8 | Đang đấu giá (2) |
| 6 | · · · · · Button – Đang giữ chỗ (1) | 676, 474 | 129 × 28 | col gap 0, pad 6 16 6 16, bg #EAEDFF, r 8 | Đang giữ chỗ (1) |
| 4 | · · · 4. Product Inventory Table | 288, 546 | 960 × 655 | col gap 0, bg #FFFFFF, r 12, shadow | HÌNH ẢNH & TÊN SẢN PHẨM / DANH MỤC |
| 5 | · · · · Container | 288, 546 | 960 × 587 | col gap 0 | HÌNH ẢNH & TÊN SẢN PHẨM / DANH MỤC |
| 6 | · · · · · Table | 288, 546 | 1279 × 587 | col gap 0 | HÌNH ẢNH & TÊN SẢN PHẨM / DANH MỤC |
| 7 | · · · · · · Header → Row | 288, 546 | 1279 × 52 | row gap 0, bg #F2F3FF | HÌNH ẢNH & TÊN SẢN PHẨM / DANH MỤC |
| 8 | · · · · · · · Cell | 336, 546 | 501 × 52 | col gap 0, pad 18 16 18 16 | HÌNH ẢNH & TÊN SẢN PHẨM |
| 8 | · · · · · · · Cell | 837, 546 | 150 × 52 | col gap 0, pad 18 16 18 16 | DANH MỤC |
| 8 | · · · · · · · Cell | 987, 546 | 160 × 52 | col gap 0, pad 18 16 18 16 | TÌNH TRẠNG |
| 8 | · · · · · · · Cell | 1147, 546 | 180 × 52 | col gap 0, pad 18 16 18 16 | TRẠNG THÁI |
| 8 | · · · · · · · Cell | 1327, 546 | 240 × 52 | col gap 0, pad 18 16 18 16 | THAO TÁC |
| 7 | · · · · · · Body | 288, 598 | 1279 × 535 | col gap 0 | Đồng hồ Thụy Sỹ Omega Seamaster Diver 300M / SKU: PRD-7721 |
| 8 | · · · · · · · Row 1: Có thể đấu giá (Available) | 288, 598 | 1279 × 88 | row gap 0 | Đồng hồ Thụy Sỹ Omega Seamaster Diver 300M / SKU: PRD-7721 |
| 8 | · · · · · · · Row 2: Đang đấu giá (In Auction) | 288, 686 | 1279 × 88 | row gap 0, bg #F2F3FF@0.20 | LIVE / Máy ảnh Leica M3 Double Stroke + Lens Summicron  |
| 8 | · · · · · · · Row 3: Đang giữ chỗ (Reserved) | 288, 774 | 1279 × 90 | row gap 0 | Đồng hồ Thụy Sỹ Chronograph Heritage 1972 / SKU: PRD-8821 |
| 8 | · · · · · · · Row 4: Đã bán (Sold) | 288, 864 | 1279 × 88 | row gap 0 | Bộ bàn trà gỗ Mun hoa chạm khắc nghệ thuật đầu T / SKU: PRD- |
| 8 | · · · · · · · Row 5: Đã ẩn (Hidden by Admin) - STRICT CONSTR | 288, 952 | 1279 × 93 | row gap 0, pad 0 16 0 0, bg #FFDAD6@0.20 | Bộ tiền xu cổ Đông Dương mạ bạc năm 1907 / SKU: PRD-5104 |
| 8 | · · · · · · · Row 6: Đã gỡ (Delisted by Seller) | 288, 1045 | 1279 × 88 | row gap 0 | Tranh sơn mài phong cảnh Tây Bắc bản khắc 1985 / SKU: PRD-44 |
| 5 | · · · · Table Footer / Pagination | 288, 1133 | 960 × 68 | row gap 516, pad 16, bg #F2F3FF@0.40 | Hiển thị 1 - 6 trong tổng số 8 sản phẩm / 1 |
| 6 | · · · · · Container | 1076, 1149 | 156 × 36 | row gap 4 | 1 / 2 |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#434655` | `text-secondary` | 38 |
| `#131B2E` | `text` | 37 |
| `#FFFFFF` | `surface / text-inverse` | 28 |
| `#EAEDFF` | `surface-muted` | 21 |
| `#747686` | `text-subtle (sửa #696B7B)` | 20 |
| `#1D4ED8` | `primary-600` | 9 |
| `#0037B0` | `primary-700` | 8 |
| `#BA1A1A` | `danger` | 7 |
| `#F2F3FF` | `surface-subtle` | 6 |
| `#515F74` | `text-tertiary` | 4 |
| `#D5E3FC` | `primary-100` | 3 |
| `#0D1C2E` | `text` | 3 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 600 | `text-label / .label` | 30 |
| 14px / 400 | `text-body` | 19 |
| 14px / 600 | `text-body (600)` | 18 |
| 12px / 400 | `text-caption` | 15 |
| 12px / 700 | `text-label / .label` | 6 |
| 36px / 700 | `text-display / text-price-xl` | 4 |
| 16px / 500 | `text-body-lg` | 1 |
| 30px / 700 | `text-h1` | 1 |
| 9px / 700 | `text-caption (Figma <12px – nâng lên)` | 1 |
| 12px / 500 | `text-label / .label` | 1 |

## API

- `GET /products/mine?status&categoryId&q&page&size`
- `GET /products/mine/summary (hàng KPI)`
- `DELETE /products/{id} (đổi REMOVED; PRODUCT_NOT_EDITABLE)`
- `GET /categories`

Body, DTO, mã lỗi chi tiết ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- "Tạo phiên" chỉ bật khi AVAILABLE và có 1–5 ảnh → `/seller/auctions/new?productId=`.
- "Sửa" bị khoá khi IN_AUCTION/RESERVED/SOLD; HIDDEN hiện tooltip "Bị quản trị viên ẩn".
- Gỡ: `ConfirmDialog`; PRODUCT_NOT_AVAILABLE → toast lỗi.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Bỏ checkbox chọn nhiều nếu không có thao tác hàng loạt (Figma có nhưng backend không có API hàng loạt).
- Bọc bảng `overflow-x-auto`.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G5**, **G18**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S14-seller-products.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S14 – Sản phẩm của tôi (Người bán).
Đọc: design/specs/S14-seller-products.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S14-seller-products.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
