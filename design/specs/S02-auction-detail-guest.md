# S02 – Chi tiết phiên đấu giá (Khách)

| | |
|---|---|
| Route | `/auctions/[id] (chưa đăng nhập)` |
| Vai trò | Guest |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S02-auction-detail-guest.png` (PNG @2x, frame 1280×1601px) |
| Outline đầy đủ | `design/outline/S02.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Xem đầy đủ thông tin phiên, đồng hồ, giá hiện tại và lịch sử; mời đăng nhập để đặt giá.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Thanh breadcrumb (tên sản phẩm `truncate`) + nút `tertiary` "Báo cáo phiên này" bên phải; vạch kẻ dưới.
2. Lưới 8/4 (trái 699px, phải 492px, gap 24px). Trái: `ImageGallery` (badge trạng thái + chip mã phiên góc trên, nút phóng to), 4 thumbnail, dòng "Mã phiên" + chip kiểm duyệt, thẻ người bán.
3. Phải: card thông tin (chip danh mục, chip tình trạng, tên sản phẩm h2 24/32 700); `CountdownTimer`; `PricePanel` (badge giá sàn, giá 30–36/700, bảng 4 dòng); nút `primary` lg full-width "Đăng nhập để đặt giá"; nút `outline` "Theo dõi phiên này".
4. Card tabs dưới cùng (full width, padding 24px): tab "Mô tả sản phẩm" (mặc định) | "Lịch sử đặt giá (n lượt)". Tab mô tả: tiêu đề "Thông số kỹ thuật chi tiết" + bảng 2 cột hàng xen kẽ nền + đoạn "Cam kết của người bán".

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S02.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main - MAIN WRAPPER: Fixed desktop container ( | 0, 65 | 1280 × 1471 | col gap 24, pad 20 32 20 32 | Trang chủ / Phiên đấu giá |
| 2 | · Section - 1. BREADCRUMB & REPORT BAR | 32, 85 | 1216 × 49 | row gap 119, pad 0 0 12 0, border #CBD5E1 | Trang chủ / Phiên đấu giá |
| 3 | · · Button – Báo cáo phiên này | 1102, 85 | 145 × 36 | row gap 6, pad 0 12 0 12, bg #F1F5F9, r 4 | Báo cáo phiên này |
| 2 | · 2. MAIN AUCTION DETAIL SECTION (2 COLUMNS: ~55 | 32, 158 | 1216 × 824 |  | ĐANG DIỄN RA / #AUC-9821 |
| 3 | · · Section - LEFT COLUMN: Image Gallery (~55% ->  | 32, 158 | 696 × 786 | col gap 16 | ĐANG DIỄN RA / #AUC-9821 |
| 4 | · · · Main Large Image Container | 32, 158 | 696 × 522 | row gap 0, bg #FFFFFF, border #CBD5E1, r 12, shadow | ĐANG DIỄN RA / #AUC-9821 |
| 5 | · · · · iPhone 15 Pro Max Titan Tự Nhiên | 33, 159 | 694 × 520 | r 12 |  |
| 4 | · · · 5 Interactive Thumbnails | 32, 696 | 696 × 84 | row gap 12, pad 0 0 4 0 |  |
| 4 | · · · Product Specs Badges & Tags below gallery:marg | 32, 796 | 696 × 54 | col gap 0, pad 12 0 16 0 | Mã phiên: #AUC-9821 / Kiểm duyệt: Hợp lệ 100% |
| 4 | · · · Background+Border+Shadow | 32, 866 | 696 × 78 | row gap 259, pad 16, bg #FFFFFF, border #CBD5E1, r 12, shadow | TechStore_Official / Đối tác Uy tín |
| 5 | · · · · Container | 49, 883 | 290 × 44 | row gap 12 | TechStore_Official / Đối tác Uy tín |
| 6 | · · · · · Container | 105, 885 | 234 × 39 | col gap 0 | TechStore_Official / Đối tác Uy tín |
| 3 | · · Section - RIGHT COLUMN: Pricing & Bidding Pane | 760, 158 | 488 × 809 | col gap 20, pad 24, bg #FFFFFF, border #CBD5E1, r 8, shadow | Điện thoại & Máy tính bảng / Tình trạng: Mới 100% |
| 4 | · · · Chips & Title | 785, 183 | 438 × 170 | col gap 0 | Điện thoại & Máy tính bảng / Tình trạng: Mới 100% |
| 5 | · · · · Heading 1:margin | 785, 239 | 438 × 114 | col gap 0, pad 8 0 16 0 | iPhone 15 Pro Max 256GB Titan Tự Nhiên - Chính H |
| 6 | · · · · · Heading 1 | 785, 247 | 438 × 90 | col gap 0 | iPhone 15 Pro Max 256GB Titan Tự Nhiên - Chính H |
| 4 | · · · Countdown Box:margin | 785, 373 | 438 × 136 | col gap 0, pad 0 0 16 0 | THỜI GIAN CÒN LẠI / Đang đếm ngược |
| 5 | · · · · Countdown Box | 785, 373 | 438 × 120 | col gap 4, pad 16, bg #FEF3C7, border #FDE68A, r 12 | THỜI GIAN CÒN LẠI / Đang đếm ngược |
| 6 | · · · · · Container | 802, 420 | 404 × 36 | row gap 8, pad 4 0 0 0 | 02 giờ 14 phút 34 giây |
| 7 | · · · · · · Container | 831, 424 | 251 × 32 | col gap 0 | 02 giờ 14 phút 34 giây |
| 4 | · · · Pricing Box | 785, 529 | 438 × 262 | col gap 12, pad 16, bg #FAF8FF, border #DAE2FD, r 12 | GIÁ HIỆN TẠI / Chưa đạt giá sàn |
| 5 | · · · · Container | 802, 581 | 404 × 36 | row gap 0 | 21.500.000 ₫ |
| 5 | · · · · Specs table inside pricing card | 802, 651 | 404 × 123 | col gap 8, pad 12, bg #F8F9FB, border #CBD5E1, r 8 | Giá khởi điểm: / 18.000.000 ₫ |
| 4 | · · · Guest CTA Buttons | 785, 811 | 438 × 131 | col gap 10, pad 4 0 0 0 | Đăng nhập để đặt giá / Theo dõi phiên này |
| 5 | · · · · Button – Đăng nhập để đặt giá | 785, 815 | 438 × 44 | row gap 8, pad 12 16 12 16, bg #1D4ED8, r 8, shadow | Đăng nhập để đặt giá |
| 5 | · · · · Button – Theo dõi phiên này | 785, 869 | 438 × 42 | row gap 8, pad 10 16 10 16, bg #FFFFFF, border #CBD5E1, r 8 | Theo dõi phiên này |
| 2 | · Section - 3. TABS SECTION (Below Main Fold):ma | 32, 1006 | 1216 × 509 | col gap 0, pad 16 0 0 0 | Mô tả sản phẩm / Lịch sử đặt giá (22 lượt) |
| 3 | · · Section - 3. TABS SECTION (Below Main Fold) | 32, 1022 | 1216 × 493 | col gap 24, pad 0 0 36 0, bg #FFFFFF, border #CBD5E1, r 8, shadow | Mô tả sản phẩm / Lịch sử đặt giá (22 lượt) |
| 4 | · · · Tab Header Bar | 33, 1023 | 1214 × 51 | row gap 0, pad 0 24 0 24, bg #F8F9FB, border #CBD5E1 | Mô tả sản phẩm / Lịch sử đặt giá (22 lượt) |
| 5 | · · · · Button – Mô tả sản phẩm | 57, 1023 | 175 × 50 | row gap 8, pad 14 24 14 24, border #1D4ED8 | Mô tả sản phẩm |
| 5 | · · · · Button – Lịch sử đặt giá (22 lượt) | 232, 1023 | 227 × 50 | row gap 8, pad 14 24 14 24 | Lịch sử đặt giá (22 lượt) |
| 4 | · · · Tab Content Area → Tab 1: Product Description  | 57, 1098 | 1166 × 380 | col gap 24 | Thông số kỹ thuật chi tiết / Mẫu máy (Model) |
| 5 | · · · · Container | 57, 1098 | 1166 × 279 | col gap 8 | Thông số kỹ thuật chi tiết / Mẫu máy (Model) |
| 6 | · · · · · Border | 57, 1130 | 1166 × 247 | col gap 0, border #CBD5E1, r 8 | Mẫu máy (Model) / iPhone 15 Pro Max (Mã VN/A) |
| 7 | · · · · · · Background+HorizontalBorder (×5 lặp lại) | 58, 1131 | 1164 × 41 | bg #F8F9FB, border #CBD5E1 | Mẫu máy (Model) / iPhone 15 Pro Max (Mã VN/A) |
| 7 | · · · · · · Background | 58, 1336 | 1164 × 40 | bg #FFFFFF | Phụ kiện trong hộp / Thân máy iPhone 15 Pro Max, Cáp sạc USB |
| 5 | · · · · Container | 57, 1401 | 1166 × 77 | col gap 7 | Cam kết của người bán & Quy định giao hàng / Sản phẩm được c |
| 6 | · · · · · Container | 57, 1432 | 1166 × 46 | col gap 0, pad 0 0 1 0 | Sản phẩm được cam kết chính hãng 100%, bảo quản  |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#FFFFFF` | `surface / text-inverse` | 23 |
| `#515F74` | `text-tertiary` | 16 |
| `#0E111B` | `text` | 15 |
| `#475569` | `neutral` | 10 |
| `#1D4ED8` | `primary-600` | 7 |
| `#F8F9FB` | `bg` | 6 |
| `#92400E` | `warning-strong` | 5 |
| `#94A3B8` | `text-placeholder (sửa #5F6B7F)` | 4 |
| `#F1F5F9` | `border-subtle / neutral-bg` | 4 |
| `#166534` | `success` | 4 |
| `#0037B0` | `primary-700` | 4 |
| `#B45309` | `warning` | 4 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 500 | `text-body` | 13 |
| 12px / 400 | `text-caption` | 13 |
| 14px / 400 | `text-body` | 10 |
| 12px / 500 | `text-label / .label` | 8 |
| 12px / 600 | `text-label / .label` | 7 |
| 14px / 700 | `text-body (600)` | 3 |
| 24px / 700 | `text-h2 / text-timer` | 2 |
| 14px / 600 | `text-body (600)` | 2 |
| 16px / 700 | `text-h4` | 2 |
| 10px / 600 | `text-caption (Figma <12px – nâng lên)` | 1 |

## API

- `GET /auctions/{id}`
- `GET /auctions/{id}/bids (mảng đầy đủ, cắt 5 dòng)`
- `WS /ws-auction → /topic/auction/{id} (khách vẫn xem realtime)`
- `⛔ B4 ảnh, mô tả, danh mục, tình trạng, giá sàn – chưa có trong AuctionResponse`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Server Component render lần đầu (SEO, `generateMetadata` với tên sản phẩm + ảnh chính).
- 404: trang "Không tìm thấy phiên đấu giá".
- Phiên CANCELLED: thay khối đồng hồ bằng khối `danger-bg` "Phiên đã bị huỷ" + lý do; ENDED/UNSOLD: "Phiên đã kết thúc" + giá cuối và người thắng che tên.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- "Đăng nhập để đặt giá" → `/login?redirect=/auctions/{id}`.
- Không hiển thị giá sàn.
- Nút "Báo cáo phiên này" với khách cũng chuyển tới đăng nhập.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G2**, **G3**, **G4**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S02-auction-detail-guest.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S02 – Chi tiết phiên đấu giá (Khách).
Đọc: design/specs/S02-auction-detail-guest.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S02-auction-detail-guest.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
