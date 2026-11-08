# S00 – Trang chủ (Khách)

| | |
|---|---|
| Route | `/` |
| Vai trò | Guest, User |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S00-home.png` (PNG @2x, frame 1280×2893px) |
| Outline đầy đủ | `design/outline/S00.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Giới thiệu sàn, đẩy người xem vào danh sách phiên và phiên sắp kết thúc.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Hero 2 cột (trái ~55%, phải ~45%), nền gradient rất nhạt `primary-50` → `bg`: trái là tiêu đề display 36/44 2 dòng (dòng 2 màu `primary-600`), mô tả 16/24 `text-secondary`, 2 nút xl (`primary` "Khám phá phiên đấu giá" có icon búa, `outline` "Tìm hiểu quy chế"), 3 thẻ số liệu nhỏ (phiên đang diễn ra, phiên sắp diễn ra, lượt đặt hôm nay). Phải là thẻ phiên nổi bật: badge "Đang diễn ra trực tiếp", số người theo dõi, ảnh lớn có đồng hồ đếm ngược góc dưới, mã phiên, tên, khối giá (giá hiện tại 24/700 `primary-700`, bước giá, người dẫn đầu che tên, số lượt), 2 nút lg ("Đăng nhập để đặt giá"/"Đặt giá ngay" + "Xem chi tiết phiên").
2. Section "Danh mục tài sản nổi bật": tiêu đề h1 30px (bỏ nhãn chữ hoa phía trên) + link "Xem toàn bộ danh mục →"; 5 `CategoryCard` 224×160 gap 16–24px.
3. Section "Phiên sắp kết thúc": 4 `AuctionCard` biến thể dọc (ảnh 4:3 + badge đồng hồ + badge giá sàn, danh mục • mã, tên 2 dòng, khởi điểm + số lượt, giá hiện tại 20/700, nút `primary` lg full-width "Xem chi tiết & Đặt giá").
4. Section "Phiên sắp diễn ra": 3 thẻ ngang (ảnh 96px trái, chip "Bắt đầu dd/MM/yyyy HH:mm", tên, mã + khởi điểm; 2 nút "Theo dõi phiên" (`secondary`) và "Xem chi tiết").
5. Section "Quy trình 4 bước": tiêu đề căn giữa, 4 thẻ có số 01–04 trong ô vuông `primary-50`.
6. Banner người bán: card trắng bo 12px, tiêu đề h2 (bỏ nhãn "DÀNH CHO NGƯỜI BÁN"), mô tả, nút `primary` xl bên phải.
7. Footer lớn 4 cột (chỉ trang chủ): logo + mô tả; Về OmniBid; Dành cho người mua / người bán; Hỗ trợ & quy chế; dòng bản quyền.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S00.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 0, 65 | 1280 × 2468 | col gap 0, bg #FAF8FF | PHÂN LOẠI CHUYÊN SÂU / Danh mục tài sản nổi bật |
| 3 | · · Section - SECTION 2: DANH MỤC NỔI BẬT (FEATURE | 0, 679 | 1280 × 314 | col gap 0, pad 32 0 32 0, bg #F2F3FF | PHÂN LOẠI CHUYÊN SÂU / Danh mục tài sản nổi bật |
| 4 | · · · Container | 0, 711 | 1280 × 250 | col gap 24, pad 0 32 0 32 | PHÂN LOẠI CHUYÊN SÂU / Danh mục tài sản nổi bật |
| 5 | · · · · Container | 32, 711 | 1216 × 66 | row gap 745 | PHÂN LOẠI CHUYÊN SÂU / Danh mục tài sản nổi bật |
| 6 | · · · · · Paragraph | 32, 711 | 349 × 66 | col gap 7, pad 5 0 0 0 | PHÂN LOẠI CHUYÊN SÂU / Danh mục tài sản nổi bật |
| 5 | · · · · 6 Category Cards Bento-grid style | 32, 801 | 1216 × 160 | row gap 24 | Điện thoại & Máy tính bảng / 48 phiên đang mở |
| 6 | · · · · · Button – Điện thoại & Máy tính bảng | 32, 801 | 224 × 160 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Điện thoại & Máy tính bảng / 48 phiên đang mở |
| 7 | · · · · · · Container | 53, 897 | 182 × 40 | col gap 4 | Điện thoại & Máy tính bảng / 48 phiên đang mở |
| 6 | · · · · · Button – Máy tính & Laptop | 280, 801 | 224 × 160 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Máy tính & Laptop / 32 phiên đang mở |
| 7 | · · · · · · Container | 330, 897 | 123 × 40 | col gap 4 | Máy tính & Laptop / 32 phiên đang mở |
| 6 | · · · · · Button – Đồng hồ & Phụ kiện | 528, 801 | 224 × 160 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Đồng hồ & Phụ kiện / 21 phiên đang mở |
| 7 | · · · · · · Container | 574, 897 | 132 × 40 | col gap 4 | Đồng hồ & Phụ kiện / 21 phiên đang mở |
| 6 | · · · · · Button – Máy ảnh & Ống kính | 776, 801 | 224 × 160 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Máy ảnh & Ống kính / 19 phiên đang mở |
| 7 | · · · · · · Container | 820, 897 | 135 × 40 | col gap 4 | Máy ảnh & Ống kính / 19 phiên đang mở |
| 6 | · · · · · Button – Đồ gia dụng cao cấp | 1024, 801 | 224 × 160 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Đồ gia dụng cao cấp / 24 phiên đang mở |
| 7 | · · · · · · Container | 1067, 897 | 138 × 40 | col gap 4 | Đồ gia dụng cao cấp / 24 phiên đang mở |
| 3 | · · Section - SECTION 4: PHIÊN SẮP DIỄN RA (UPCOMI | 0, 1549 | 1280 × 342 | col gap 0, pad 32 0 32 0, bg #F2F3FF | LỊCH TRÌNH ĐẤU GIÁ / Phiên sắp diễn ra |
| 4 | · · · Container | 0, 1581 | 1280 × 278 | col gap 24, pad 0 32 0 32 | LỊCH TRÌNH ĐẤU GIÁ / Phiên sắp diễn ra |
| 5 | · · · · Container | 32, 1581 | 1216 × 66 | row gap 738 | LỊCH TRÌNH ĐẤU GIÁ / Phiên sắp diễn ra |
| 6 | · · · · · Paragraph | 32, 1581 | 243 × 66 | col gap 7, pad 5 0 0 0 | LỊCH TRÌNH ĐẤU GIÁ / Phiên sắp diễn ra |
| 5 | · · · · 3 Upcoming Cards Grid | 32, 1671 | 1216 × 188 | row gap 24 | Bắt đầu 27/10/2026 19:30 / Tai nghe Sennheiser HD 800 S Refe |
| 6 | · · · · · Upcoming 1 (×3 lặp lại) | 32, 1671 | 389 × 188 | col gap 16, pad 16, bg #FFFFFF, r 12, shadow | Bắt đầu 27/10/2026 19:30 / Tai nghe Sennheiser HD 800 S Refe |
| 7 | · · · · · · Container | 48, 1687 | 357 × 96 | row gap 16 | Bắt đầu 27/10/2026 19:30 / Tai nghe Sennheiser HD 800 S Refe |
| 8 | · · · · · · · Container | 160, 1687 | 245 × 96 | col gap 32 | Bắt đầu 27/10/2026 19:30 / Tai nghe Sennheiser HD 800 S Refe |
| 7 | · · · · · · Container | 48, 1799 | 357 × 44 | row gap 8, pad 4 0 0 0 | Theo dõi phiên / Xem chi tiết |
| 8 | · · · · · · · Button – Theo dõi phiên | 48, 1803 | 235 × 40 | row gap 4, pad 0 8 0 8, bg #EAEDFF, r 4 | Theo dõi phiên |
| 3 | · · Section - SECTION 1: HERO SECTION & LIVE PREVI | 0, 65 | 1280 × 614 | col gap 0, pad 24 32 32 32, bg #FAF8FF | Sàn đấu giá trực tuyến minh bạch & hiện đại / Khám phá hàng  |
| 4 | · · · Ambient subtle background depth shapes | -128, -63 | 384 × 384 | bg #1D4ED8@0.05, r 9999, shadow |  |
| 4 | · · · Overlay+Blur | 780, 257 | 500 × 500 | bg #D5E3FC@0.30, r 9999, shadow |  |
| 5 | · · · · Hero Copy & Call-to-Actions (7 Cols) | 32, 202 | 699 × 332 | col gap 24 | Sàn đấu giá trực tuyến minh bạch & hiện đại / Khám phá hàng  |
| 6 | · · · · · Container | 32, 202 | 699 × 144 | col gap 8 | Sàn đấu giá trực tuyến minh bạch & hiện đại / Khám phá hàng  |
| 7 | · · · · · · Heading 1 | 32, 202 | 699 × 88 | col gap 0 | Sàn đấu giá trực tuyến minh bạch & hiện đại |
| 7 | · · · · · · Container | 32, 298 | 576 × 48 | col gap 0 | Khám phá hàng trăm tài sản công nghệ, đồng hồ, đ |
| 6 | · · · · · CTAs | 32, 370 | 699 × 52 | row gap 16, pad 4 0 0 0 | Khám phá phiên đấu giá / Tìm hiểu quy chế |
| 7 | · · · · · · Button – Khám phá phiên đấu giá | 32, 374 | 246 × 48 | row gap 4, pad 0 32 0 32, bg #1D4ED8, r 4 | Khám phá phiên đấu giá |
| 8 | · · · · · · · Link:shadow | 32, 374 | 245 × 48 | bg #FFFFFF@0.00, r 4, shadow |  |
| 7 | · · · · · · Button – Tìm hiểu quy chế | 294, 374 | 187 × 48 | row gap 4, pad 0 24 0 24, bg #FFFFFF, r 4, shadow | Tìm hiểu quy chế |
| 6 | · · · · · Trust Badges & Key Metrics | 32, 446 | 576 × 88 | row gap 8, pad 8 0 0 0 | Phiên đang diễn ra / Phiên sắp diễn ra |
| 7 | · · · · · · Background+Shadow | 32, 454 | 186 × 67 | col gap 4, pad 16, bg #FFFFFF, r 4, shadow | Phiên đang diễn ra |
| 7 | · · · · · · Background+Shadow | 226, 454 | 186 × 65 | col gap 4, pad 16, bg #FFFFFF, r 4, shadow | Phiên sắp diễn ra |
| 7 | · · · · · · Background+Shadow | 421, 454 | 186 × 80 | col gap 4, pad 16, bg #FFFFFF, r 4, shadow | bid / 142 |
| 8 | · · · · · · · Container | 437, 470 | 154 × 28 | row gap 4 | bid / 142 |
| 5 | · · · · Featured Live Bidding Hero Card (5 Cols) | 755, 76 | 492 × 584 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Đang diễn ra trực tiếp / 1.428 người theo dõi |
| 6 | · · · · · Background | 779, 140 | 444 × 224 | col gap 0, bg #EAEDFF, r 8 | 04:18:31 |
| 7 | · · · · · · AB6AXuDFR-0rvTrWUamuVKZ6nmcPRyXNdNEng5K1Q5BKP3 | 779, 140 | 444 × 224 |  |  |
| 6 | · · · · · Container | 779, 380 | 444 × 80 | col gap 7, pad 5 0 0 0 | MÃ PHIÊN: #AUC-5521 / iPad Pro M4 11 inch 256GB Wi-Fi (Chính |
| 7 | · · · · · · Heading 3 | 779, 408 | 444 × 52 | col gap 0 | iPad Pro M4 11 inch 256GB Wi-Fi (Chính Hãng VN/A |
| 6 | · · · · · Background | 779, 476 | 444 × 100 | row gap 8, pad 16, bg #F2F3FF, r 8 | Giá đặt hiện tại / 22.400.000 ₫ |
| 7 | · · · · · · Container (×2 lặp lại) | 795, 492 | 202 × 68 | col gap 0 | Giá đặt hiện tại / 22.400.000 ₫ |
| 8 | · · · · · · · Container | 795, 508 | 202 × 32 | col gap 0 | 22.400.000 ₫ |
| 6 | · · · · · Container | 779, 592 | 444 × 44 | row gap 8 | Đăng nhập để đặt giá / Xem chi tiết phiên |
| 7 | · · · · · · Button – Đăng nhập để đặt giá | 779, 592 | 259 × 44 | row gap 4, pad 12 0 12 0, bg #1D4ED8, r 4, shadow | Đăng nhập để đặt giá |
| 7 | · · · · · · Button – Xem chi tiết phiên | 1046, 592 | 177 × 44 | row gap 4, pad 10 16 12 16, bg #FFFFFF, border #CBD5E1, r 4 | Xem chi tiết phiên |
| 3 | · · Section - SECTION 3: PHIÊN ĐẤU GIÁ TÂM ĐIỂM (H | 0, 993 | 1280 × 582 | col gap 0, pad 32 0 32 0, bg #FAF8FF | Phiên sắp kết thúc / Đang diễn ra |
| 4 | · · · Container | 0, 1025 | 1280 × 518 | col gap 24, pad 0 32 0 32 | Phiên sắp kết thúc / Đang diễn ra |
| 5 | · · · · Container | 32, 1025 | 1216 × 42 | row gap 0 | Phiên sắp kết thúc |
| 6 | · · · · · Container | 32, 1025 | 1216 × 42 | col gap 0, pad 4 0 0 0 | Phiên sắp kết thúc |
| 5 | · · · · 4 Live Auction Cards Grid | 32, 1091 | 1216 × 452 | row gap 24 | Đang diễn ra / Chưa đạt giá sàn |
| 6 | · · · · · Auction Item 1 (00:45:19) (×4 lặp lại) | 32, 1091 | 286 × 452 | col gap 0, bg #FFFFFF, r 12, shadow | Đang diễn ra / Chưa đạt giá sàn |
| 7 | · · · · · · Background | 32, 1091 | 286 × 208 | col gap 0, bg #EAEDFF | Đang diễn ra / Chưa đạt giá sàn |
| 8 | · · · · · · · AB6AXuDH74ewqF8tnuI_R3UHcZIExh1uYj8Hhg5SPzkaMI | 32, 1091 | 286 × 208 |  |  |
| 7 | · · · · · · Container | 32, 1299 | 286 × 244 | col gap 16, pad 16 | Đồng hồ • #AUC-3044 / Đồng hồ Omega Seamaster Co- |
| 8 | · · · · · · · Container | 48, 1315 | 254 × 72 | col gap 4 | Đồng hồ • #AUC-3044 / Đồng hồ Omega Seamaster Co- |
| 8 | · · · · · · · Background | 48, 1403 | 254 × 64 | col gap 4, pad 8, bg #F2F3FF, r 4 | Khởi điểm: 70.000.000 ₫ / 35 lượt đặt |
| 8 | · · · · · · · Button – Xem chi tiết & Đặt giá | 48, 1483 | 254 × 44 | row gap 4, pad 12 0 12 0, bg #1D4ED8, r 4, shadow | Xem chi tiết & Đặt giá |
| 3 | · · Section - SECTION 5: QUY TRÌNH 4 BƯỚC ĐƠN GIẢN | 0, 1891 | 1280 × 416 | col gap 0, pad 32 0 32 0, bg #FAF8FF | MINH BẠCH & CHUẨN XÁC / Quy trình tham gia đấu giá 4 bước |
| 4 | · · · Container | 0, 1923 | 1280 × 352 | col gap 32, pad 0 32 0 32 | MINH BẠCH & CHUẨN XÁC / Quy trình tham gia đấu giá 4 bước |
| 5 | · · · · Container | 304, 1923 | 672 × 118 | col gap 4, pad 5 0 0 0 | MINH BẠCH & CHUẨN XÁC / Quy trình tham gia đấu giá 4 bước |
| 6 | · · · · · Heading 2 | 304, 1948 | 672 × 41 | col gap 0, pad 3 0 0 0 | Quy trình tham gia đấu giá 4 bước |
| 6 | · · · · · Container | 304, 1993 | 672 × 48 | col gap 0 | Trải nghiệm sàn đấu giá trực tuyến chuyên nghiệp |

_(Bảng rút gọn 70/82 khối; xem outline để có đủ.)_

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#1D4ED8` | `primary-600` | 47 |
| `#434655` | `text-secondary` | 47 |
| `#FFFFFF` | `surface / text-inverse` | 46 |
| `#131B2E` | `text` | 46 |
| `#EAEDFF` | `surface-muted` | 13 |
| `#F2F3FF` | `surface-subtle` | 8 |
| `#D5E3FC` | `primary-100` | 8 |
| `#E2E7FF` | `surface-strong / border-brand` | 6 |
| `#FAF8FF` | `bg` | 5 |
| `#283044` | `text` | 5 |
| `#FFDBCF` | `tertiary-100` | 5 |
| `#EEF0FF` | `primary-50` | 5 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 400 | `text-caption` | 32 |
| 14px / 700 | `text-body (600)` | 29 |
| 12px / 700 | `text-label / .label` | 23 |
| 14px / 400 | `text-body` | 20 |
| 18px / 700 | `text-h3` | 9 |
| 30px / 700 | `text-h1` | 5 |
| 20px / 700 | `text-h2 / text-price-lg` | 5 |
| 16px / 400 | `text-body-lg` | 3 |
| 20px / 400 | `text-h2 / text-price-lg` | 2 |
| 36px / 700 | `text-display / text-price-xl` | 1 |

## API

- `GET /auctions?status=ACTIVE&sort=endTime,asc&size=4 (phiên sắp kết thúc; phiên đầu làm phiên nổi bật)`
- `GET /auctions?status=SCHEDULED&sort=startTime,asc&size=3`
- `⛔ B2 GET /categories – chưa có, dùng mock`
- `⛔ B6 watchlist – chưa có, ẩn nút Theo dõi`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Loading: skeleton cho thẻ phiên nổi bật và 4 thẻ phiên (giữ đúng kích thước ảnh để không nhảy layout).
- Không có phiên ACTIVE: ẩn thẻ nổi bật, hero chiếm full chiều ngang; section "Phiên sắp kết thúc" hiện empty state "Chưa có phiên đang diễn ra".
- Guest bấm "Theo dõi": chuyển `/login?redirect=/`.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Không hiển thị con số giá sàn, chỉ "Đã đạt / Chưa đạt / Không có giá sàn".
- Đồng hồ trên thẻ chạy theo `endTime` + độ lệch giờ máy chủ; khi về 0 hiện "Đang chốt" và refetch.
- 3 số liệu ở hero chỉ hiện nếu API có dữ liệu; nếu không thì ẩn cả hàng (gaps G18).
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G1**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S00-home.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S00 – Trang chủ (Khách).
Đọc: design/specs/S00-home.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S00-home.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
