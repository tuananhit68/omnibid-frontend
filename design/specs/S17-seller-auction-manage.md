# S17 – Quản lý phiên đấu giá (Người bán)

| | |
|---|---|
| Route | `/seller/auctions/[id]` |
| Vai trò | User (chủ phiên) |
| Layout | SellerLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S17-seller-auction-manage.png` (PNG @2x, frame 1280×1134px) |
| Outline đầy đủ | `design/outline/S17.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Sửa điều kiện khi phiên còn SCHEDULED, huỷ phiên khi được phép, theo dõi phiên.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 "Chi tiết & Quản lý phiên đấu giá" + chip mã phiên.
2. Card sản phẩm: ảnh 56px, mã, danh mục, tên 18/700, tình trạng; nút `tertiary` "Xem kho hàng gốc" (→ S15).
3. Card quản lý: hàng trạng thái (`StatusBadge` + "Khởi tạo ngày …" bên trái; chip "Bắt đầu sau: 1 ngày 14 giờ" bên phải); hộp `info` giải thích quyền sửa; form 2 cột Giá khởi điểm*, Bước giá*, Giá sàn bảo lưu (nhãn cam "Không công khai với người mua"), Thời gian bắt đầu*, kết thúc*; khối thời lượng dự kiến.
4. Footer card: `danger-soft` "Huỷ phiên đấu giá" bên trái; `tertiary` "Khôi phục ban đầu" + `primary` "Lưu thay đổi" bên phải.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S17.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Container | 0, 0 | 1280 × 1134 | col gap 0, pad 0 0 0 256 | Kênh Người Bán / Quản lý phiên đấu giá |
| 2 | · Main | 256, 0 | 1024 × 1086 | col gap 0, pad 64 32 26 32, bg #FAF8FF | Kênh Người Bán / Quản lý phiên đấu giá |
| 3 | · · Container | 288, 64 | 960 × 995 | col gap 0, pad 24 0 24 0 | Kênh Người Bán / Quản lý phiên đấu giá |
| 4 | · · · BREADCRUMB & CONTEXT HEADER:margin | 288, 88 | 960 × 78 | col gap 0, pad 0 0 16 0 | Kênh Người Bán / Quản lý phiên đấu giá |
| 5 | · · · · BREADCRUMB & CONTEXT HEADER | 288, 88 | 960 × 62 | col gap 8 | Kênh Người Bán / Quản lý phiên đấu giá |
| 6 | · · · · · Container | 288, 112 | 960 × 38 | row gap 0 | Chi tiết & Quản lý phiên đấu giá / #AUC-2055 |
| 7 | · · · · · · Container | 288, 112 | 534 × 38 | row gap 8 | Chi tiết & Quản lý phiên đấu giá / #AUC-2055 |
| 8 | · · · · · · · Heading 1 | 288, 112 | 438 × 38 | col gap 0 | Chi tiết & Quản lý phiên đấu giá |
| 4 | · · · READ-ONLY PRODUCT CARD HERO:margin | 288, 166 | 960 × 198 | col gap 0, pad 0 0 24 0 | 99% / SKU: PRD-7721 |
| 5 | · · · · READ-ONLY PRODUCT CARD HERO | 288, 166 | 960 × 174 | row gap 24, pad 16, bg #FFFFFF, r 12, shadow | 99% / SKU: PRD-7721 |
| 6 | · · · · · Container | 304, 182 | 308 × 142 | row gap 16 | 99% / SKU: PRD-7721 |
| 7 | · · · · · · Container | 400, 182 | 212 × 142 | col gap 0 | SKU: PRD-7721 / Đồng hồ cao cấp |
| 8 | · · · · · · · Heading 2:margin | 400, 198 | 212 × 106 | col gap 0, pad 2 0 0 0 | Đồng hồ Thụy Sỹ Omega Seamaster Diver 300M Co-Ax |
| 6 | · · · · · Button – Xem kho hàng gốc | 1056, 231 | 175 × 44 | row gap 4, pad 0 16 0 16, bg #F2F3FF, r 8 | Xem kho hàng gốc |
| 4 | · · · Section - FRAME (a): SCHEDULED (ĐÃ LÊN LỊCH) → | 288, 364 | 960 × 671 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Sắp diễn ra / Khởi tạo ngày 24/10/2026 |
| 5 | · · · · Container | 312, 388 | 912 × 40 | row gap 401, pad 0 0 8 0 | Sắp diễn ra / Khởi tạo ngày 24/10/2026 |
| 6 | · · · · · Container | 312, 390 | 275 × 28 | row gap 8 | Sắp diễn ra / Khởi tạo ngày 24/10/2026 |
| 7 | · · · · · · Background | 312, 390 | 120 × 28 | row gap 6, pad 4 12 4 12, bg #D5E3FC, r 9999 | Sắp diễn ra |
| 6 | · · · · · Background | 994, 388 | 229 × 32 | row gap 8, pad 6 16 6 16, bg #F2F3FF, r 8 | Bắt đầu sau: 1 ngày 14 giờ |
| 5 | · · · · Background | 312, 444 | 912 × 77 | row gap 8, pad 16, bg #F2F3FF, r 8 | Phiên chưa đến thời điểm mở. Bạn có thể thay đổi |
| 5 | · · · · Editable Auction Form identical to S16 paramet | 312, 537 | 912 × 390 | col gap 0, pad 8 0 0 0 | Giá khởi điểm * / 15.000.000 |
| 6 | · · · · · Editable Auction Form identical to S16 paramet | 312, 545 | 912 × 382 |  | Giá khởi điểm * / 15.000.000 |
| 7 | · · · · · · Giá khởi điểm | 312, 545 | 444 × 92 | col gap 6 | Giá khởi điểm * / 15.000.000 |
| 8 | · · · · · · · Container | 312, 571 | 444 × 44 | row gap 0 | 15.000.000 / ₫ |
| 7 | · · · · · · Bước gi | 780, 545 | 444 × 92 | col gap 6, pad 0 0 22 0 | Bước giá (Increment) * / 500.000 |
| 8 | · · · · · · · Container | 780, 571 | 444 × 44 | row gap 0 | 500.000 / ₫ |
| 7 | · · · · · · Giá sàn (Reserve Price) | 312, 661 | 912 × 92 | col gap 6 | Giá sàn bảo lưu (Reserve Price) / Không công khai với người  |
| 8 | · · · · · · · Container | 312, 687 | 912 × 44 | row gap 0 | 22.000.000 / ₫ |
| 7 | · · · · · · Thời gian bắt đầu | 312, 777 | 444 × 70 | col gap 6 | Thời gian bắt đầu * / 28/10/2026 09:00 |
| 8 | · · · · · · · Container | 312, 803 | 444 × 44 | row gap 0 | 28/10/2026 09:00 |
| 7 | · · · · · · Thời gian kết thúc | 780, 777 | 444 × 70 | col gap 6 | Thời gian kết thúc * / 31/10/2026 13:00 |
| 8 | · · · · · · · Container | 780, 803 | 444 × 44 | row gap 0 | 31/10/2026 13:00 |
| 7 | · · · · · · Live Duration Summary Banner | 312, 871 | 912 × 56 | row gap 0, pad 16, bg #D5E3FC@0.50, r 8 | Thời lượng dự kiến: 3 ngày 4 giờ (76 tiếng) |
| 5 | · · · · Bottom Action Controls | 312, 943 | 912 × 68 | row gap 373, pad 24 0 0 0 | Hủy phiên đấu giá / Khôi phục ban đầu |
| 6 | · · · · · Button – Hủy phiên đấu giá | 312, 967 | 186 × 44 | row gap 4, pad 0 24 0 24, bg #FFDAD6, r 8 | Hủy phiên đấu giá |
| 6 | · · · · · Container | 883, 967 | 340 × 44 | row gap 16 | Khôi phục ban đầu / Lưu thay đổi |
| 7 | · · · · · · Button – Khôi phục ban đầu | 883, 967 | 158 × 44 | col gap 0, pad 12 16 12 16, bg #F2F3FF, r 8 | Khôi phục ban đầu |
| 7 | · · · · · · Button – Lưu thay đổi | 1057, 967 | 166 × 44 | row gap 4, pad 0 32 0 32, bg #1D4ED8, r 8, shadow | Lưu thay đổi |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#434655` | `text-secondary` | 24 |
| `#131B2E` | `text` | 20 |
| `#FFFFFF` | `surface / text-inverse` | 12 |
| `#F2F3FF` | `surface-subtle` | 10 |
| `#0037B0` | `primary-700` | 8 |
| `#747686` | `text-subtle (sửa #696B7B)` | 6 |
| `#0D1C2E` | `text` | 4 |
| `#FAF8FF` | `bg` | 2 |
| `#D5E3FC` | `primary-100` | 2 |
| `#93000A` | `danger-strong` | 2 |
| `#1D4ED8` | `primary-600` | 2 |
| `#E2E7FF` | `surface-strong / border-brand` | 1 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 600 | `text-body (600)` | 16 |
| 12px / 400 | `text-caption` | 12 |
| 12px / 600 | `text-label / .label` | 5 |
| 16px / 600 | `text-h4` | 3 |
| 14px / 700 | `text-body (600)` | 3 |
| 16px / 400 | `text-body-lg` | 3 |
| 14px / 400 | `text-body` | 2 |
| 30px / 700 | `text-h1` | 1 |
| 10px / 400 | `text-caption (Figma <12px – nâng lên)` | 1 |
| 18px / 600 | `text-h3` | 1 |

## API

- `GET /auctions/{id}`
- `⛔ B8 PATCH /auctions/{id} – chưa có; form chỉ đọc`
- `POST /auctions/{id}/cancel { reason? }`
- `GET /auctions/{id}/bids`
- `WS /topic/auction/{id}`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- SCHEDULED: như Figma (sửa được).
- ACTIVE/ENDED/UNSOLD/CANCELLED: form chỉ đọc, ẩn nút Lưu/Khôi phục, thêm `BidHistoryTable` và kết quả (người thắng, giá cuối, link đơn hàng).
- Nút Huỷ chỉ hiện khi SCHEDULED hoặc (ACTIVE và `bidCount = 0`); mở `ConfirmDialog` bắt buộc nhập lý do. CANNOT_CANCEL → thông báo "Phiên đã có lượt đặt giá, chỉ quản trị viên được huỷ".
- AUCTION_NOT_EDITABLE khi lưu (phiên vừa mở): refetch và chuyển chỉ đọc.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Hiển thị giá sàn ở đây (chủ phiên được xem), không bao giờ ở trang người mua.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S17-seller-auction-manage.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S17 – Quản lý phiên đấu giá (Người bán).
Đọc: design/specs/S17-seller-auction-manage.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S17-seller-auction-manage.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
