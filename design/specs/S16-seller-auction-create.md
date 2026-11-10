# S16 – Tạo phiên đấu giá (Người bán)

| | |
|---|---|
| Route | `/seller/auctions/new?productId=` |
| Vai trò | User (chủ sản phẩm) |
| Layout | SellerLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S16-seller-auction-create.png` (PNG @2x, frame 1280×1258px) |
| Outline đầy đủ | `design/outline/S16.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Tạo phiên đấu giá với giá, bước giá, giá sàn và thời gian hợp lệ.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Hàng tiêu đề: ô icon + h1 "Tạo phiên đấu giá mới" + mô tả; nút `outline` "Huỷ" + `primary` "Tạo phiên" bên phải.
2. Card sản phẩm đã chọn: ảnh 64px badge "Đã chọn", mã PRD, danh mục, tên 18/700, tình trạng; nút `secondary` "Đổi sản phẩm khác" (mở chọn sản phẩm AVAILABLE).
3. Lưới 2 cột: trái các card form, phải card "Quy tắc định giá phiên" (2 khối giải thích bước giá và giá sàn).
4. Card "1. Thiết lập giá đấu": Giá khởi điểm* và Bước giá* (`MoneyInput`, 2 cột) + chip gợi ý nhanh (+200k, +500k, +1M); Giá sàn (tuỳ chọn) có chip "Reserve Price"; hộp `info-bg` "Không công khai với người mua. Phải ≥ giá khởi điểm…".
5. Card "2. Thời gian diễn ra phiên": Thời gian bắt đầu* và kết thúc* (`DateTimeInput`); helper "Thời lượng từ 1 giờ đến 30 ngày…"; khối tổng kết nền `surface-muted`: "Thời lượng: 3 ngày 4 giờ" + chip "Hợp lệ" + "Bắt đầu sau 1 ngày 14 giờ".
6. Footer: `outline` "Huỷ bỏ" + `primary` xl "Xác nhận & Tạo phiên" (icon tia sét 16px).

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S16.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Container | 0, 0 | 1280 × 1306 | col gap 0, pad 0 0 0 256 | Kênh Người Bán / / |
| 2 | · Main | 256, 0 | 1024 × 1258 | col gap 0, pad 64 32 24 32, bg #FAF8FF | Kênh Người Bán / / |
| 3 | · · Container | 288, 64 | 960 × 1170 | col gap 0, pad 24 0 24 0 | Kênh Người Bán / / |
| 4 | · · · BREADCRUMB & PAGE HEADER:margin | 288, 88 | 960 × 114 | col gap 0, pad 0 0 24 0 | Kênh Người Bán / / |
| 5 | · · · · BREADCRUMB & PAGE HEADER | 288, 88 | 960 × 90 | col gap 8 | Kênh Người Bán / / |
| 6 | · · · · · Top Action Bar | 288, 116 | 960 × 62 | row gap 206, pad 0 0 8 0 | Tạo phiên đấu giá mới / Mã dự kiến: #AUC-2055 |
| 7 | · · · · · · Container | 288, 116 | 528 × 54 | row gap 16 | Tạo phiên đấu giá mới / Mã dự kiến: #AUC-2055 |
| 8 | · · · · · · · Container | 352, 116 | 464 × 54 | col gap 2 | Tạo phiên đấu giá mới / Mã dự kiến: #AUC-2055 |
| 7 | · · · · · · Container | 1030, 121 | 217 × 44 | row gap 8 | Hủy / Tạo phiên |
| 8 | · · · · · · · Button – Tạo phiên | 1113, 121 | 134 × 44 | row gap 4, pad 0 24 0 24, bg #1D4ED8, r 8, shadow | Tạo phiên |
| 4 | · · · Section - READ-ONLY PRODUCT CARD (Selected fro | 288, 202 | 960 × 176 | col gap 0, pad 0 0 32 0 | ĐÃ CHỌN / SKU: PRD-7721 |
| 5 | · · · · Section - READ-ONLY PRODUCT CARD (Selected fro | 288, 202 | 960 × 144 | col gap 0, pad 24, bg #FFFFFF, r 12, shadow | ĐÃ CHỌN / SKU: PRD-7721 |
| 6 | · · · · · Container | 312, 226 | 912 × 96 | row gap 16 | ĐÃ CHỌN / SKU: PRD-7721 |
| 7 | · · · · · · Container | 312, 226 | 715 × 96 | row gap 16 | ĐÃ CHỌN / SKU: PRD-7721 |
| 8 | · · · · · · · Product Meta | 424, 235 | 595 × 78 | col gap 0 | SKU: PRD-7721 / • |
| 7 | · · · · · · Button – Đổi sản phẩm khác | 1043, 256 | 180 × 36 | row gap 4, pad 8 16 8 16, bg #F2F3FF, r 8 | Đổi sản phẩm khác |
| 4 | · · · MAIN CONFIGURATION FORM & HELPER ASIDES (2 COL | 288, 378 | 960 × 832 |  | 1. Thiết lập giá đấu / Tiền tệ quy chuẩn: VNĐ (₫) |
| 5 | · · · · LEFT COLUMN: MAIN CONFIGURATION FORM (8 Cols) | 288, 378 | 629 × 832 | col gap 32 | 1. Thiết lập giá đấu / Tiền tệ quy chuẩn: VNĐ (₫) |
| 6 | · · · · · FORM BLOCK 1: THIẾT LẬP GIÁ ĐẤU | 288, 378 | 629 × 362 | col gap 24, pad 24, bg #FFFFFF, r 12, shadow | 1. Thiết lập giá đấu / Tiền tệ quy chuẩn: VNĐ (₫) |
| 8 | · · · · · · · Background | 288, 378 | 629 × 58 | row gap 218, pad 24 24 8 24, bg #F2F3FF | 1. Thiết lập giá đấu / Tiền tệ quy chuẩn: VNĐ (₫) |
| 7 | · · · · · · Container | 312, 460 | 581 × 104 | row gap 24 | Giá khởi điểm (₫) * / Bắt buộc |
| 8 | · · · · · · · Starting Price | 312, 460 | 278 × 104 | col gap 4 | Giá khởi điểm (₫) * / Bắt buộc |
| 8 | · · · · · · · Bid Step | 614, 460 | 278 × 104 | col gap 4, pad 0 0 2 0 | Bước giá (₫) * / Bắt buộc |
| 7 | · · · · · · Reserve Price (Giá sàn) | 312, 588 | 581 × 128 | col gap 4, pad 4 0 0 0 | Giá sàn (tùy chọn) / Reserve Price |
| 8 | · · · · · · · Container | 312, 616 | 448 × 44 | row gap 0 | 22.000.000 / ₫ |
| 8 | · · · · · · · Margin | 312, 664 | 581 × 52 | col gap 0, pad 4 0 0 0 | Không công khai với người mua. Phải lớn hơn hoặc |
| 6 | · · · · · FORM BLOCK 2: THỜI GIAN DIỄN RA PHIÊN | 288, 772 | 629 × 330 | col gap 24, pad 24, bg #FFFFFF, r 12, shadow | 2. Thời gian diễn ra phiên / Thời gian bắt đầu * |
| 8 | · · · · · · · Background | 288, 772 | 629 × 58 | row gap 0, pad 24 24 8 24, bg #F2F3FF | 2. Thời gian diễn ra phiên |
| 7 | · · · · · · Container | 312, 854 | 581 × 68 | row gap 24 | Thời gian bắt đầu * / Tương lai |
| 8 | · · · · · · · Start Time Picker | 312, 854 | 278 × 68 | col gap 4 | Thời gian bắt đầu * / Tương lai |
| 8 | · · · · · · · End Time Picker | 614, 854 | 278 × 68 | col gap 4 | Thời gian kết thúc * / Đóng cổng búa |
| 7 | · · · · · · LIVE SUMMARY BOX (Real-time Feedback) | 312, 986 | 581 × 92 | row gap 16, pad 16, bg #EAEDFF, r 12, shadow | Thời lượng: 3 ngày 4 giờ / Hợp lệ (Chuẩn) |
| 8 | · · · · · · · Container | 328, 1002 | 358 × 60 | row gap 16 | Thời lượng: 3 ngày 4 giờ / Hợp lệ (Chuẩn) |
| 8 | · · · · · · · VerticalBorder | 719, 1004 | 158 × 55 | row gap 0, pad 0 0 0 8, border #DAE2FD | Trạng thái khởi động / Bắt đầu sau 1 ngày 14 giờ |
| 6 | · · · · · BOTTOM ACTION BUTTONS | 288, 1134 | 629 × 76 | row gap 16, pad 4 0 24 0 | Hủy bỏ / Xác nhận & Tạo phiên |
| 7 | · · · · · · Button – Xác nhận & Tạo phiên | 689, 1138 | 227 × 48 | row gap 4, pad 0 32 0 32, bg #1D4ED8, r 8 | Xác nhận & Tạo phiên |
| 8 | · · · · · · · Button:shadow | 689, 1138 | 228 × 48 | bg #FFFFFF@0.00, r 8, shadow |  |
| 5 | · · · · RIGHT COLUMN: GUIDANCE CARDS & PLATFORM POLICI | 949, 378 | 298 × 832 | col gap 0, pad 0 0 554 0 | Quy tắc định giá phiên / Bước giá tối thiểu (Increment) |
| 6 | · · · · · CARD 1: QUY TẮC ĐỊNH GIÁ PHIÊN | 949, 378 | 298 × 278 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Quy tắc định giá phiên / Bước giá tối thiểu (Increment) |
| 7 | · · · · · · Container | 973, 402 | 250 × 30 | row gap 4, pad 0 0 4 0 | Quy tắc định giá phiên |
| 7 | · · · · · · Container | 973, 448 | 250 × 184 | col gap 8 | Bước giá tối thiểu (Increment) / Người mua mỗi lần đặt giá t |
| 8 | · · · · · · · Background (×2 lặp lại) | 973, 448 | 250 × 88 | col gap 4, pad 8, bg #F2F3FF, r 8 | Bước giá tối thiểu (Increment) / Người mua mỗi lần đặt giá t |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#434655` | `text-secondary` | 28 |
| `#131B2E` | `text` | 25 |
| `#FFFFFF` | `surface / text-inverse` | 19 |
| `#747686` | `text-subtle (sửa #696B7B)` | 16 |
| `#F2F3FF` | `surface-subtle` | 12 |
| `#0037B0` | `primary-700` | 11 |
| `#1D4ED8` | `primary-600` | 8 |
| `#EAEDFF` | `surface-muted` | 6 |
| `#0D1C2E` | `text` | 4 |
| `#C4C5D7` | `border-strong` | 3 |
| `#D5E3FC` | `primary-100` | 3 |
| `#FAF8FF` | `bg` | 2 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 400 | `text-caption` | 22 |
| 14px / 600 | `text-body (600)` | 21 |
| 18px / 600 | `text-h3` | 5 |
| 14px / 400 | `text-body` | 4 |
| 12px / 600 | `text-label / .label` | 4 |
| 16px / 400 | `text-body-lg` | 3 |
| 16px / 500 | `text-body-lg` | 3 |
| 11px / 400 | `text-caption (Figma <12px – nâng lên)` | 3 |
| 24px / 600 | `text-h2 / text-timer` | 2 |
| 10px / 400 | `text-caption (Figma <12px – nâng lên)` | 1 |

## API

- `POST /auctions { productId, startPrice, bidIncrement, reservePrice?, startTime, endTime }`
- `⛔ B1 chọn sản phẩm AVAILABLE – chưa có API, tạm nhập productId hoặc mock`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Thành công: toast "Tạo phiên đấu giá thành công" và chuyển tới S17 của phiên mới.
- VALIDATION_ERROR: map lỗi về đúng ô; PRODUCT_NOT_AVAILABLE: banner lỗi + nút chọn sản phẩm khác.
- Khối thời lượng đổi sang `danger` khi không hợp lệ.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- start_time > hiện tại; end_time > start_time; 1 giờ ≤ thời lượng ≤ 30 ngày; giá khởi điểm > 0; bước giá > 0; giá sàn trống hoặc ≥ giá khởi điểm (zod kiểm tra sớm, backend vẫn là chuẩn).
- Thời gian nhập theo giờ Việt Nam, gửi ISO 8601.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G7**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S16-seller-auction-create.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S16 – Tạo phiên đấu giá (Người bán).
Đọc: design/specs/S16-seller-auction-create.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S16-seller-auction-create.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
