# S01 – Danh sách phiên đấu giá (Khách)

| | |
|---|---|
| Route | `/auctions` |
| Vai trò | Guest, User |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S01-auction-list.png` (PNG @2x, frame 1280×1423px) |
| Outline đầy đủ | `design/outline/S01.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Tìm, lọc, sắp xếp và mở phiên đấu giá.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Đầu trang: breadcrumb, tiêu đề h1 "Tất cả phiên đấu giá", mô tả 16/24.
2. Lưới 2 cột gap 24px: trái là `FilterPanel` 280px (card trắng bo 8px padding 24px) gồm Danh mục (checkbox + số lượng bên phải), Khoảng giá (2 `MoneyInput` Từ/Đến + nút `secondary` "Áp dụng giá"), Trạng thái phiên (radio Đang diễn ra / Sắp diễn ra / Tất cả), Sắp xếp (select), nút `primary` "Áp dụng bộ lọc" và link "Khôi phục mặc định"; tiêu đề panel có link "Xóa bộ lọc".
3. Phải 912px: thanh tóm tắt (tổng "128 phiên đấu giá" 20/700 + chip "Đang hiển thị 1 - 9" + các `FilterChips` đã áp dụng có nút ×), lưới 3 cột `AuctionCard` gap 16–24px, `Pagination` trong card ở cuối.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S01.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 0, 65 | 1280 × 1273 | col gap 0, pad 32 | Trang chủ / Tất cả phiên đấu giá |
| 2 | · Container | 32, 97 | 1216 × 1209 | col gap 0 | Trang chủ / Tất cả phiên đấu giá |
| 3 | · · Subtle Breadcrumb & Section Header Banner:marg | 32, 97 | 1216 × 118 | col gap 0, pad 0 0 24 0 | Trang chủ / Tất cả phiên đấu giá |
| 4 | · · · Subtle Breadcrumb & Section Header Banner | 32, 97 | 1216 × 94 | col gap 4 | Trang chủ / Tất cả phiên đấu giá |
| 5 | · · · · Container | 32, 121 | 1216 × 70 | row gap 0, pad 4 0 0 0 | Tất cả phiên đấu giá / Khám phá và tham gia đấu giá các sản  |
| 6 | · · · · · Container | 32, 125 | 623 × 66 | col gap 4 | Tất cả phiên đấu giá / Khám phá và tham gia đấu giá các sản  |
| 7 | · · · · · · Heading 1 | 32, 125 | 623 × 38 | col gap 0 | Tất cả phiên đấu giá |
| 3 | · · Main Grid: 2-Column Desktop Layout (Sidebar 28 | 32, 215 | 1216 × 1091 | row gap 24 | Bộ lọc tìm kiếm / Xóa bộ lọc |
| 4 | · · · Aside - Left Filter Sidebar | 32, 215 | 280 × 921 | col gap 0, pad 24, bg #FFFFFF, border #C4C5D7, r 8, shadow | Bộ lọc tìm kiếm / Xóa bộ lọc |
| 5 | · · · · Header | 57, 240 | 230 × 73 | row gap 0, pad 0 0 16 0, border #C4C5D7@0.60 | Bộ lọc tìm kiếm / Xóa bộ lọc |
| 6 | · · · · · Container | 57, 240 | 163 × 56 | row gap 8 | Bộ lọc tìm kiếm |
| 7 | · · · · · · Container | 83, 240 | 136 × 56 | col gap 0, pad 0 42 0 0 | Bộ lọc tìm kiếm |
| 5 | · · · · Filter Group 1: Danh mục sản phẩm | 57, 313 | 230 × 233 | col gap 12, pad 20 0 20 0, border #C4C5D7@0.60 | Danh mục sản phẩm / Điện thoại & Máy tính bảng |
| 6 | · · · · · Container | 57, 365 | 230 × 160 | col gap 10 | Điện thoại & Máy tính bảng / 45 |
| 7 | · · · · · · Label | 57, 365 | 230 × 40 | row gap 12 | Điện thoại & Máy tính bảng / 45 |
| 8 | · · · · · · · Container | 85, 365 | 174 × 40 | col gap 0 | Điện thoại & Máy tính bảng |
| 5 | · · · · Filter Group 2: Khoảng gi | 57, 546 | 230 × 213 | col gap 8, pad 20 0 20 0, border #C4C5D7@0.60 | Khoảng giá (₫) / Từ |
| 6 | · · · · · Container | 57, 594 | 230 × 68 | row gap 8, pad 4 0 0 0 | Từ / 500.000 ₫ |
| 6 | · · · · · Button – Áp dụng giá | 57, 694 | 230 × 44 | row gap 0, pad 12 16 10 16, bg #EAEDFF, border #C4C5D7, r 8 | Áp dụng giá |
| 5 | · · · · Filter Group 3: Trạng thái phiên | 57, 759 | 230 × 153 | col gap 12, pad 20 0 20 0, border #C4C5D7@0.60 | Trạng thái phiên / Đang diễn ra |
| 6 | · · · · · Container | 57, 811 | 230 × 80 | col gap 10 | Đang diễn ra / Sắp diễn ra |
| 5 | · · · · Filter Group 4: Sắp xếp | 57, 912 | 230 × 112 | col gap 8, pad 20 0 20 0 | Sắp xếp theo / Sắp kết thúc |
| 6 | · · · · · Container | 57, 960 | 230 × 44 | col gap 0 | Sắp kết thúc |
| 7 | · · · · · · Options | 57, 960 | 230 × 44 | row gap 0, pad 0 32 0 12, bg #FFFFFF, border #C4C5D7, r 8 | Sắp kết thúc |
| 5 | · · · · Action Footer | 57, 1024 | 230 × 87 | col gap 12, pad 8 0 0 0 | Áp dụng bộ lọc / Khôi phục mặc định |
| 6 | · · · · · Button – Áp dụng bộ lọc | 57, 1032 | 230 × 44 | row gap 8, pad 12 0 12 0, bg #1D4ED8, r 8, shadow | Áp dụng bộ lọc |
| 4 | · · · Main Content Area | 336, 215 | 912 × 1091 | col gap 24 | 128 phiên đấu giá / Đang hiển thị 1 - 9 |
| 5 | · · · · Top Control Bar | 336, 215 | 912 × 62 | row gap 80, pad 16, bg #FFFFFF, border #C4C5D7, r 8, shadow | 128 phiên đấu giá / Đang hiển thị 1 - 9 |
| 6 | · · · · · Container | 353, 232 | 300 × 28 | row gap 12 | 128 phiên đấu giá / Đang hiển thị 1 - 9 |
| 7 | · · · · · · Heading 2 | 353, 232 | 159 × 28 | col gap 0 | 128 phiên đấu giá |
| 6 | · · · · · Quick Active Filter Chips | 733, 232 | 497 × 28 | row gap 8 | Điện thoại & Máy tính bảng / Đồng hồ |
| 7 | · · · · · · Background+Border | 733, 232 | 196 × 28 | row gap 6, pad 4 10 6 10, bg #DBEAFE, border #BFDBFE, r 8 | Điện thoại & Máy tính bảng |
| 7 | · · · · · · Background+Border | 1037, 232 | 193 × 28 | row gap 6, pad 4 10 6 10, bg #DBEAFE, border #BFDBFE, r 8 | 500.000 ₫ - 20.000.000 ₫ |
| 5 | · · · · 3-Column Grid of Auction Cards | 336, 301 | 912 × 907 |  | Còn 02:14:35 / Đang diễn ra |
| 6 | · · · · · Article - Card 1: iPhone 15 Pro Max | 336, 301 | 288 × 441 | col gap 0, bg #FFFFFF, border #C4C5D7, r 8, shadow | Còn 02:14:35 / Đang diễn ra |
| 7 | · · · · · · Image and Badges | 337, 302 | 286 × 214 | col gap 0, bg #F2F3FF | Còn 02:14:35 / Đang diễn ra |
| 8 | · · · · · · · AB6AXuBrZzQCRYcwb282X2XGDVzZPHcUoAMccWd2hhk2Wo | 337, 302 | 286 × 214 |  |  |
| 7 | · · · · · · Body | 337, 516 | 286 × 225 | col gap 0, pad 16 | MÃ PHIÊN: #AUC-9821 / iPhone 15 Pro Max 256GB Titan Tự Nhiên |
| 8 | · · · · · · · Container | 353, 532 | 254 × 60 | col gap 4 | MÃ PHIÊN: #AUC-9821 / iPhone 15 Pro Max 256GB Titan Tự Nhiên |
| 8 | · · · · · · · Price and Bid status:margin | 353, 592 | 254 × 133 | col gap 0, pad 16 0 0 0 | Giá hiện tại / 21.500.000 ₫ |
| 6 | · · · · · Article - Card 2: MacBook Pro 14 M3 | 648, 301 | 288 × 441 | col gap 0, bg #FFFFFF, border #C4C5D7, r 8, shadow | Còn 00:45:12 / Đang diễn ra |
| 7 | · · · · · · Background | 649, 302 | 286 × 214 | col gap 0, bg #F2F3FF | Còn 00:45:12 / Đang diễn ra |
| 8 | · · · · · · · AB6AXuByvtTCHjqw5wtAIMhN8e-Du8_gYturZ6rbLDNDon | 649, 302 | 286 × 214 |  |  |
| 7 | · · · · · · Container | 649, 516 | 286 × 225 | col gap 0, pad 16 | MÃ PHIÊN: #AUC-9820 / MacBook Pro 14 inch M3 Pro (18GB/512GB |
| 8 | · · · · · · · Container | 665, 532 | 254 × 60 | col gap 4 | MÃ PHIÊN: #AUC-9820 / MacBook Pro 14 inch M3 Pro (18GB/512GB |
| 8 | · · · · · · · Margin | 665, 592 | 254 × 133 | col gap 0, pad 16 0 0 0 | Giá hiện tại / 38.200.000 ₫ |
| 6 | · · · · · Article - Card 3: Seiko Presage Automatic (Sắp | 960, 301 | 288 × 441 | col gap 0, bg #FFFFFF, border #C4C5D7, r 8, shadow | Bắt đầu: 25/10/2026 20:30 / Sắp diễn ra |
| 7 | · · · · · · Background | 961, 302 | 286 × 214 | col gap 0, bg #F2F3FF | Bắt đầu: 25/10/2026 20:30 / Sắp diễn ra |
| 8 | · · · · · · · AB6AXuCNX1nkOLnFfKl1fQIK3HDorpcrDzbms-kU20Nxrz | 961, 302 | 286 × 214 |  |  |
| 8 | · · · · · · · Container | 973, 314 | 262 × 42 | row gap 8 | Bắt đầu: 25/10/2026 20:30 / Sắp diễn ra |
| 7 | · · · · · · Container | 961, 516 | 286 × 225 | col gap 0, pad 16 | MÃ PHIÊN: #AUC-9819 / Đồng hồ Nam Seiko Presage Sharp Edged  |
| 8 | · · · · · · · Container | 977, 532 | 254 × 60 | col gap 4 | MÃ PHIÊN: #AUC-9819 / Đồng hồ Nam Seiko Presage Sharp Edged  |
| 8 | · · · · · · · Margin | 977, 592 | 254 × 133 | col gap 0, pad 16 0 0 0 | Giá khởi điểm / 12.000.000 ₫ |
| 6 | · · · · · Article - Card 4: Sony Alpha A7 IV | 336, 766 | 288 × 441 | col gap 0, bg #FFFFFF, border #C4C5D7, r 8, shadow | Còn 06:12:40 / Đang diễn ra |
| 7 | · · · · · · Background | 337, 767 | 286 × 214 | col gap 0, bg #F2F3FF | Còn 06:12:40 / Đang diễn ra |
| 8 | · · · · · · · AB6AXuDPHTl-2_56fuYR7yPMrPWfAVw7cUvNk7shMDbUcY | 337, 767 | 286 × 214 |  |  |
| 7 | · · · · · · Container | 337, 982 | 286 × 225 | col gap 0, pad 16 | MÃ PHIÊN: #AUC-9818 / Máy ảnh Sony Alpha A7 Mark IV (Body) C |
| 8 | · · · · · · · Container | 353, 998 | 254 × 60 | col gap 4 | MÃ PHIÊN: #AUC-9818 / Máy ảnh Sony Alpha A7 Mark IV (Body) C |
| 8 | · · · · · · · Margin | 353, 1058 | 254 × 133 | col gap 0, pad 16 0 0 0 | Giá hiện tại / 42.500.000 ₫ |
| 6 | · · · · · Article - Card 5: iPad Air 5 M1 | 648, 766 | 288 × 441 | col gap 0, bg #FFFFFF, border #C4C5D7, r 8, shadow | Còn 01:05:19 / Đang diễn ra |
| 7 | · · · · · · Background | 649, 767 | 286 × 214 | col gap 0, bg #F2F3FF | Còn 01:05:19 / Đang diễn ra |
| 8 | · · · · · · · AB6AXuDjaS2ZPoyAcmX2pnrt6_n000OvDhHbX6W-oi_NuW | 649, 767 | 286 × 214 |  |  |
| 7 | · · · · · · Container | 649, 982 | 286 × 225 | col gap 0, pad 16 | MÃ PHIÊN: #AUC-9817 / iPad Air 5 64GB Wifi Màu Starlight Ful |
| 8 | · · · · · · · Container | 665, 998 | 254 × 60 | col gap 4 | MÃ PHIÊN: #AUC-9817 / iPad Air 5 64GB Wifi Màu Starlight Ful |
| 8 | · · · · · · · Margin | 665, 1058 | 254 × 133 | col gap 0, pad 16 0 0 0 | Giá hiện tại / 11.800.000 ₫ |
| 6 | · · · · · Article - Card 6: Apple Watch Ultra 2 (Sắp diễ | 960, 766 | 288 × 441 | col gap 0, bg #FFFFFF, border #C4C5D7, r 8, shadow | Bắt đầu: 26/10/2026 09:00 / Sắp diễn ra |
| 7 | · · · · · · Background | 961, 767 | 286 × 214 | col gap 0, bg #F2F3FF | Bắt đầu: 26/10/2026 09:00 / Sắp diễn ra |
| 8 | · · · · · · · AB6AXuDTTtLi_QgDtfj44uGe2ugOh2yHXGb4GxN0k9tUqO | 961, 767 | 286 × 214 |  |  |
| 8 | · · · · · · · Container | 973, 779 | 262 × 42 | row gap 8 | Bắt đầu: 26/10/2026 09:00 / Sắp diễn ra |
| 7 | · · · · · · Container | 961, 982 | 286 × 225 | col gap 0, pad 16 | MÃ PHIÊN: #AUC-9816 / Apple Watch Ultra 2 GPS + Cellular 49m |

_(Bảng rút gọn 70/74 khối; xem outline để có đủ.)_

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#FFFFFF` | `surface / text-inverse` | 39 |
| `#131B2E` | `text` | 39 |
| `#515F74` | `text-tertiary` | 31 |
| `#1D4ED8` | `primary-600` | 28 |
| `#FEF3C7` | `warning-bg` | 8 |
| `#B45309` | `warning` | 8 |
| `#DBEAFE` | `info-bg` | 7 |
| `#F2F3FF` | `surface-subtle` | 6 |
| `#434655` | `text-secondary` | 5 |
| `#EAEDFF` | `surface-muted` | 4 |
| `#64748B` | `text-placeholder` | 2 |
| `#94A3B8` | `text-placeholder (sửa #5F6B7F)` | 2 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 600 | `text-body (600)` | 31 |
| 12px / 400 | `text-caption` | 21 |
| 14px / 400 | `text-body` | 20 |
| 12px / 600 | `text-label / .label` | 16 |
| 20px / 600 | `text-h2 / text-price-lg` | 8 |
| 12px / 500 | `text-label / .label` | 5 |
| 14px / 500 | `text-body` | 4 |
| 16px / 400 | `text-body-lg` | 2 |
| 30px / 700 | `text-h1` | 1 |
| 24px / 700 | `text-h2 / text-timer` | 1 |

## API

- `GET /auctions?status&page&size=9&sort (chỉ lọc trạng thái)`
- `⛔ B3 lọc keyword/danh mục/giá – chưa có, ẩn các bộ lọc này`
- `⛔ B2 GET /categories – chưa có`
- `⛔ B6 watchlist – chưa có`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Đồng bộ toàn bộ bộ lọc lên URL query; Back/Forward khôi phục đúng bộ lọc.
- Ô tìm kiếm ở header điều hướng tới `/auctions?keyword=`; debounce 300ms nếu tìm trực tiếp.
- Loading: 9 thẻ skeleton. Empty: minh hoạ + "Không tìm thấy phiên phù hợp" + nút "Khôi phục bộ lọc". Error: thông báo + "Thử lại".
- Nút Theo dõi đã theo dõi: icon tim đặc, chữ "Đang theo dõi", `aria-pressed="true"`.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Giá "Từ" phải ≤ "Đến"; báo lỗi ngay dưới ô.
- Phiên SCHEDULED hiện "Giá khởi điểm" và "Bắt đầu: dd/MM/yyyy HH:mm"; phiên ACTIVE hiện "Giá hiện tại" và đồng hồ "Còn hh:mm:ss".
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S01-auction-list.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S01 – Danh sách phiên đấu giá (Khách).
Đọc: design/specs/S01-auction-list.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S01-auction-list.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
