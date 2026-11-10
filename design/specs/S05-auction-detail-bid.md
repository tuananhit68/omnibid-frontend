# S05 – Chi tiết phiên & Đặt giá (Người mua)

| | |
|---|---|
| Route | `/auctions/[id] (đã đăng nhập)` |
| Vai trò | User |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S05-auction-detail-bid.png` (PNG @2x, frame 1280×1715px) |
| Outline đầy đủ | `design/outline/S05.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Đặt giá realtime và theo dõi diễn biến phiên.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Giống S02 phần breadcrumb, gallery, thẻ người bán, card thông tin, đồng hồ, `PricePanel`.
2. Khối "Bảng đặt giá trực tiếp" (nền `surface-subtle`, bo 12px, padding 16px) trong cột phải: tiêu đề có icon búa; nhãn "Mức giá của bạn" + phụ "Đang dẫn đầu: 21.500.000 ₫"; `MoneyInput` cao 48px hậu tố VND, giá trị mặc định = `minNextBid`; dòng gợi ý có icon (i) "Tối thiểu X (giá hiện tại + bước giá)"; nút `primary-strong` xl full-width "Đặt giá".
3. Card tabs dưới: mặc định mở tab "Lịch sử đặt giá (n lượt)": tiêu đề "Nhật ký đặt giá thời gian thực", phụ đề "Hiển thị 5 lượt gần nhất (Tổng n)", `BidHistoryTable`, link "Xem toàn bộ n lượt đặt giá →" (tải thêm).

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S05.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 0, 0 | 1280 × 1630 | col gap 0, pad 88 32 24 32, bg #FAF8FF | Trang chủ / Phiên đấu giá |
| 2 | · Container | 32, 88 | 1216 × 1518 | col gap 0 | Trang chủ / Phiên đấu giá |
| 3 | · · Breadcrumb & Top Bar:margin | 32, 88 | 1216 × 60 | col gap 0, pad 0 0 24 0 | Trang chủ / Phiên đấu giá |
| 4 | · · · Breadcrumb & Top Bar | 32, 88 | 1216 × 36 | row gap 154 | Trang chủ / Phiên đấu giá |
| 5 | · · · · Button – Báo cáo phiên này | 1091, 88 | 156 × 36 | row gap 4, pad 0 16 0 16, bg #F2F3FF, r 4 | Báo cáo phiên này |
| 3 | · · Main Auction Header Block (Grid 8 / 4 Architec | 32, 148 | 1216 × 918 | col gap 0, pad 0 0 32 0 | ● ĐANG DIỄN RA / #AUC-9821 |
| 4 | · · · Main Auction Header Block (Grid 8 / 4 Architec | 32, 148 | 1216 × 886 |  | ● ĐANG DIỄN RA / #AUC-9821 |
| 5 | · · · · LEFT COLUMN: Imagery & Verified Specs (8 Cols) | 32, 148 | 699 × 886 | col gap 24, pad 0 0 142 0 | ● ĐANG DIỄN RA / #AUC-9821 |
| 6 | · · · · · Main Visual & Thumbnail Dock | 32, 148 | 699 × 642 | col gap 16, pad 16, bg #FFFFFF, r 12, shadow | ● ĐANG DIỄN RA / #AUC-9821 |
| 7 | · · · · · · Background | 48, 164 | 667 × 440 | row gap 0, bg #F2F3FF, r 12 | ● ĐANG DIỄN RA / #AUC-9821 |
| 8 | · · · · · · · iPhone 15 Pro Max 256GB Titan Tự Nhiên | 48, 164 | 667 × 440 |  |  |
| 7 | · · · · · · Container | 48, 620 | 667 × 84 | row gap 8, pad 0 0 4 0 |  |
| 7 | · · · · · · Margin | 48, 720 | 667 × 54 | col gap 0, pad 12 0 16 0 | Mã phiên: #AUC-9821 / Kiểm duyệt: Hợp lệ 100% |
| 6 | · · · · · Essential Item Details Box | 32, 814 | 699 × 78 | row gap 231, pad 16, bg #FFFFFF, border #E2E7FF@0.60, r 12, shadow | TechStore_Official / Đối tác Uy tín |
| 7 | · · · · · · Container | 49, 831 | 295 × 44 | row gap 12 | TechStore_Official / Đối tác Uy tín |
| 8 | · · · · · · · Container | 101, 831 | 243 × 44 | col gap 2 | TechStore_Official / Đối tác Uy tín |
| 7 | · · · · · · Button – Xem gian hàng | 579, 838 | 134 × 30 | row gap 6, pad 6 12 6 12, border #E2E7FF, r 8 | Xem gian hàng |
| 5 | · · · · RIGHT COLUMN: Realtime Live Metrics & Interact | 755, 148 | 492 × 886 | col gap 16 | Điện thoại & Máy tính bảng / Tình trạng: Mới 100% |
| 6 | · · · · · Background+Shadow | 755, 148 | 492 × 162 | col gap 8, pad 16, bg #FFFFFF, r 12, shadow | Điện thoại & Máy tính bảng / Tình trạng: Mới 100% |
| 7 | · · · · · · Heading 1:margin | 771, 230 | 460 × 64 | col gap 0, pad 4 0 0 0 | iPhone 15 Pro Max 256GB Titan Tự Nhiên - Chính H |
| 8 | · · · · · · · Heading 1 | 771, 234 | 460 × 60 | col gap 0 | iPhone 15 Pro Max 256GB Titan Tự Nhiên - Chính H |
| 6 | · · · · · Time Countdown Box:margin | 755, 326 | 492 × 146 | col gap 0, pad 0 0 24 0 | THỜI GIAN CÒN LẠI / Đang đếm ngược |
| 7 | · · · · · · Time Countdown Box | 755, 326 | 492 × 122 | col gap 6, pad 16, bg #FEF3C7, border #FDE68A, r 12 | THỜI GIAN CÒN LẠI / Đang đếm ngược |
| 8 | · · · · · · · Container | 772, 375 | 458 × 34 | row gap 8, pad 2 0 0 0 | 01 giờ 12 phút 40 giây |
| 6 | · · · · · Realtime Price Board | 755, 488 | 492 × 546 | col gap 16, pad 24 24 40 24, bg #FFFFFF, r 12, shadow | GIÁ HIỆN TẠI / Chưa đạt giá sàn |
| 7 | · · · · · · Container | 779, 512 | 444 × 69 | col gap 4 | GIÁ HIỆN TẠI / Chưa đạt giá sàn |
| 8 | · · · · · · · Container | 779, 537 | 444 × 44 | row gap 0 | 21.500.000 ₫ |
| 7 | · · · · · · Specifications Breakdown Table | 779, 597 | 444 × 128 | col gap 8, pad 8, bg #F2F3FF, r 8 | Giá khởi điểm: / 18.000.000 ₫ |
| 8 | · · · · · · · Overlay | 787, 689 | 428 × 28 | row gap 170, pad 8 8 0 8, bg #EAEDFF@0.50, r 4 | Giá tối thiểu tiếp theo: / 22.000.000 ₫ |
| 7 | · · · · · · INTERACTIVE LIVE BID CONSOLE DOCK | 779, 741 | 444 × 253 | col gap 8, pad 16, bg #F2F3FF@0.70, r 12, shadow | Bảng đặt giá trực tiếp / Mức giá của bạn |
| 8 | · · · · · · · Live Form Demo (Active State Frame 0) | 795, 785 | 412 × 193 | col gap 8 | Mức giá của bạn / Đang dẫn đầu: 21.500.000 ₫ |
| 3 | · · SECTION: TABS DETAILS & BID HISTORY (8/4 Align | 32, 1066 | 1216 × 540 | col gap 24, pad 24, bg #FFFFFF, r 12, shadow | Mô tả sản phẩm / Lịch sử đặt giá (22 lượt) |
| 4 | · · · Tab Controls Navigation | 56, 1090 | 1168 × 56 | row gap 16, pad 6 6 8 6, bg #F2F3FF@0.40, r 8 | Mô tả sản phẩm / Lịch sử đặt giá (22 lượt) |
| 5 | · · · · Link – Mô tả sản phẩm | 62, 1097 | 159 × 40 | row gap 8, pad 10 16 10 16 | Mô tả sản phẩm |
| 5 | · · · · Button – Lịch sử đặt giá (22 lượt) | 237, 1096 | 212 × 42 | row gap 8, pad 10 16 10 16, border #1D4ED8 | Lịch sử đặt giá (22 lượt) |
| 4 | · · · TAB 2: BID HISTORY CONTENT (Hidden by default, | 56, 1170 | 1168 × 412 | col gap 16 | Nhật ký đặt giá thời gian thực / Hiển thị 5 lượt đặt giá gần |
| 5 | · · · · Container | 56, 1170 | 1168 × 52 | row gap 0, pad 0 0 4 0 | Nhật ký đặt giá thời gian thực / Hiển thị 5 lượt đặt giá gần |
| 6 | · · · · · Container | 56, 1170 | 300 × 48 | col gap 0 | Nhật ký đặt giá thời gian thực / Hiển thị 5 lượt đặt giá gần |
| 7 | · · · · · · Heading 3 | 56, 1170 | 300 × 28 | col gap 0 | Nhật ký đặt giá thời gian thực |
| 5 | · · · · Live Bids Table: 4 chuẩn cột Người đặt \| Mức g | 56, 1238 | 1168 × 308 | col gap 0, bg #FFFFFF@0.00, border #E2E7FF, r 8, shadow | NGƯỜI ĐẶT / MỨC GIÁ |
| 6 | · · · · · Table | 57, 1239 | 1166 × 306 | col gap 0 | NGƯỜI ĐẶT / MỨC GIÁ |
| 7 | · · · · · · Header → Row | 57, 1239 | 1166 × 40 | row gap 0, bg #F2F3FF | NGƯỜI ĐẶT / MỨC GIÁ |
| 8 | · · · · · · · Cell | 56, 1239 | 300 × 40 | col gap 0, pad 12 16 12 16 | NGƯỜI ĐẶT |
| 8 | · · · · · · · Cell | 356, 1239 | 294 × 40 | col gap 0, pad 12 16 12 16 | MỨC GIÁ |
| 8 | · · · · · · · Cell | 651, 1239 | 335 × 40 | col gap 0, pad 12 16 12 16 | THỜI GIAN |
| 8 | · · · · · · · Cell | 987, 1239 | 235 × 40 | col gap 0, pad 12 16 12 16 | TRẠNG THÁI |
| 7 | · · · · · · Body | 57, 1279 | 1166 × 266 | col gap -1 | TR / Tr***g |
| 8 | · · · · · · · Row - Bid 1: Leading Bid | 57, 1279 | 1166 × 54 | row gap 0, pad 0 0 0 16, bg #EFF6FF@0.60 | TR / Tr***g |
| 8 | · · · · · · · Row - Bid 2 (×4 lặp lại) | 57, 1333 | 1166 × 54 | row gap 0, pad 0 0 0 16, border #E2E7FF@0.60 | NG / Ng***n |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#434655` | `text-secondary` | 39 |
| `#131B2E` | `text` | 25 |
| `#FFFFFF` | `surface / text-inverse` | 21 |
| `#0037B0` | `primary-700` | 16 |
| `#F2F3FF` | `surface-subtle` | 9 |
| `#475569` | `neutral` | 7 |
| `#166534` | `success` | 7 |
| `#1D4ED8` | `primary-600` | 5 |
| `#747686` | `text-subtle (sửa #696B7B)` | 5 |
| `#92400E` | `warning-strong` | 4 |
| `#E2E7FF` | `surface-strong / border-brand` | 4 |
| `#EAEDFF` | `surface-muted` | 4 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 400 | `text-body` | 14 |
| 14px / 600 | `text-body (600)` | 13 |
| 14px / 500 | `text-body` | 11 |
| 12px / 500 | `text-label / .label` | 9 |
| 12px / 700 | `text-label / .label` | 6 |
| 11px / 700 | `text-caption (Figma <12px – nâng lên)` | 6 |
| 12px / 600 | `text-label / .label` | 5 |
| 14px / 700 | `text-body (600)` | 5 |
| 12px / 400 | `text-caption` | 4 |
| 16px / 600 | `text-h4` | 4 |

## API

- `GET /auctions/{id}`
- `GET /auctions/{id}/bids`
- `POST /bids { auctionId, amount } → 201 BidResponse (lỗi BID_TOO_LOW có data.minNextBid)`
- `WS /ws-auction → /topic/auction/{id}: BID_PLACED (BidResponse), AUCTION_UPDATED (AuctionResponse)`
- `⛔ B4 minNextBid, ảnh, giá sàn chưa có – minNextBid tự tính để gợi ý`
- `POST /reports (VIOLATION, reportedProductId) từ nút báo cáo`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Đang gửi: khoá nút + spinner, chặn Enter lặp.
- Thành công: toast "Đặt giá thành công", input về `minNextBid` mới, hàng mới chèn đầu bảng với hiệu ứng nhẹ (tắt khi reduced-motion).
- BID_TOO_LOW: hiện lỗi dưới ô + điền sẵn `minNextBid` mới từ response.
- ALREADY_LEADING: thay khối đặt giá bằng thông báo `success-bg` "Bạn đang dẫn đầu với X".
- SELF_BID_NOT_ALLOWED (chủ phiên): không render khối đặt giá, thay bằng "Đây là phiên của bạn" + link quản lý (S17).
- AUCTION_NOT_ACTIVE / phiên kết thúc qua WS: khoá khối đặt giá, hiện kết quả.
- Mất kết nối WS: banner nhỏ "Đang kết nối lại…", tự reconnect, sau khi nối lại refetch chi tiết phiên.
- ACCOUNT_BANNED: thông báo và đăng xuất.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Frontend chỉ gợi ý `minNextBid`; backend quyết định.
- Không có nút rút giá.
- Không tự gia hạn đồng hồ.
- Chip "Bạn" cạnh tên trong lịch sử nếu bidder là người đang xem.
- Giá mới đọc cho screen reader qua `aria-live="polite"`: "Giá hiện tại 22.000.000 đồng, 23 lượt đặt".
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G2**, **G3**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S05-auction-detail-bid.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S05 – Chi tiết phiên & Đặt giá (Người mua).
Đọc: design/specs/S05-auction-detail-bid.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S05-auction-detail-bid.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
