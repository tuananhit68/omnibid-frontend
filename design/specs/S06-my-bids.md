# S06 – Lượt đặt giá của tôi (Người mua)

| | |
|---|---|
| Route | `/me/bids` |
| Vai trò | User |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S06-my-bids.png` (PNG @2x, frame 1280×1075px) |
| Outline đầy đủ | `design/outline/S06.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Xem lại các lượt đặt giá của mình và hành động tiếp (đặt lại, xem đơn).

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + tiêu đề h1 + mô tả.
2. Hàng 4 `StatCard`: Tổng lượt đặt · Đang dẫn đầu (success) · Bị vượt giá (warning) · Đã thắng (info).
3. Card bảng: thanh công cụ (tabs pill Tất cả/Đang diễn ra/Đã kết thúc có chip đếm; ô tìm kiếm; select "Thời gian: Mới nhất"); bảng cột Sản phẩm & phiên (ảnh 40px, mã phiên `primary-600`, danh mục, chip tình trạng, tên 2 dòng, dòng phụ thời gian còn lại/đã kết thúc) | Mức giá của tôi | Giá hiện tại (+ dòng phụ) | Thời gian đặt | Trạng thái (`StatusBadge` BidStatus) | Thao tác; `Pagination`.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S06.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 0, 0 | 1280 × 990 | col gap 0, pad 64 0 0 0, bg #FAF8FF | Trang chủ / Tài khoản của tôi |
| 2 | · Container | 0, 64 | 1280 × 926 | col gap 24, pad 24 32 24 32 | Trang chủ / Tài khoản của tôi |
| 3 | · · Nav - Breadcrumb:margin | 32, 88 | 1216 × 36 | col gap 0, pad 0 0 16 0 | Trang chủ / Tài khoản của tôi |
| 3 | · · Header & Quick Metrics | 32, 148 | 1216 × 180 | col gap 24 | Lượt đặt giá của tôi / Theo dõi và quản lý lịch sử tất cả cá |
| 4 | · · · Container | 32, 148 | 1216 × 66 | col gap 4 | Lượt đặt giá của tôi / Theo dõi và quản lý lịch sử tất cả cá |
| 5 | · · · · Heading 1 | 32, 148 | 1216 × 38 | col gap 0 | Lượt đặt giá của tôi |
| 4 | · · · Container | 32, 238 | 1216 × 90 | row gap 8 | Tổng lượt đặt / 18 |
| 5 | · · · · Background+Border+Shadow (×4 lặp lại) | 32, 238 | 298 × 90 | col gap 0, pad 16, bg #FFFFFF, border #E2E8F0, r 12, shadow | Tổng lượt đặt / 18 |
| 6 | · · · · · Margin | 49, 271 | 264 × 40 | col gap 0, pad 8 0 0 0 | 18 / lượt |
| 7 | · · · · · · Paragraph | 49, 279 | 264 × 32 | row gap 4 | 18 / lượt |
| 3 | · · Main Content Container with Tabs and Live Tabl | 32, 352 | 1216 × 614 | col gap 0, bg #FFFFFF, border #E2E8F0, r 12, shadow | Tất cả / 18 |
| 4 | · · · Tabs & Search Filter Header | 33, 353 | 1214 × 71 | row gap 333, pad 16, bg #FFFFFF, border #F1F5F9 | Tất cả / 18 |
| 5 | · · · · Pill Tabs | 49, 369 | 378 × 38 | row gap 8 | Tất cả / 18 |
| 6 | · · · · · Button – Đang diễn ra | 152, 369 | 135 × 38 | row gap 6, pad 6 12 6 12, bg #FFFFFF, border #E2E8F0, r 8 | Đang diễn ra / 5 |
| 6 | · · · · · Button – Đã kết thúc | 296, 369 | 131 × 38 | row gap 6, pad 6 12 6 12, bg #FFFFFF, border #E2E8F0, r 8 | Đã kết thúc / 13 |
| 5 | · · · · Filter / Quick Search on Right | 761, 370 | 470 × 36 | row gap 8 | Tìm kiếm tài sản, mã phiên... / Thời gian: Mới nhất |
| 6 | · · · · · Container | 761, 370 | 288 × 36 | col gap 0 | Tìm kiếm tài sản, mã phiên... |
| 7 | · · · · · · Input | 761, 370 | 288 × 36 | row gap 0, pad 8 12 8 36, bg #F2F3FF, r 8 | Tìm kiếm tài sản, mã phiên... |
| 6 | · · · · · Container | 1057, 370 | 174 × 36 | col gap 0 | Thời gian: Mới nhất |
| 7 | · · · · · · Options - Sắp xếp theo | 1057, 370 | 174 × 36 | row gap 0, pad 0 32 0 12, bg #F2F3FF, r 8 | Thời gian: Mới nhất |
| 4 | · · · Live Bids Table → Table | 33, 424 | 1214 × 484 | col gap -1 | SẢN PHẨM & PHIÊN / MỨC GIÁ CỦA TÔI |
| 5 | · · · · Header → Row | 33, 424 | 1214 × 41 | row gap 0, bg #F8FAFC, border #E2E8F0 | SẢN PHẨM & PHIÊN / MỨC GIÁ CỦA TÔI |
| 6 | · · · · · Cell | 33, 424 | 477 × 40 | col gap 0, pad 12 16 12 16 | SẢN PHẨM & PHIÊN |
| 6 | · · · · · Cell | 510, 424 | 146 × 40 | col gap 0, pad 12 16 12 16 | MỨC GIÁ CỦA TÔI |
| 6 | · · · · · Cell | 657, 424 | 147 × 40 | col gap 0, pad 12 16 12 16 | GIÁ HIỆN TẠI |
| 6 | · · · · · Cell | 805, 424 | 131 × 40 | col gap 0, pad 12 16 12 16 | THỜI GIAN ĐẶT |
| 6 | · · · · · Cell | 936, 424 | 145 × 40 | col gap 0, pad 12 16 12 16 | TRẠNG THÁI |
| 6 | · · · · · Cell | 1082, 424 | 164 × 40 | col gap 0, pad 12 16 12 16 | THAO TÁC |
| 5 | · · · · Body | 33, 464 | 1214 × 444 | col gap -1 | #AUC-7740 / • |
| 6 | · · · · · Row 1: Leading (Dẫn đầu) | 33, 464 | 1214 × 89 | row gap 0, pad 0 0 0 16 | #AUC-7740 / • |
| 7 | · · · · · · Data | 49, 466 | 445 × 84 | row gap 12 | #AUC-7740 / • |
| 8 | · · · · · · · Container | 117, 466 | 273 × 84 | col gap 0 | #AUC-7740 / • |
| 7 | · · · · · · Data | 494, 464 | 162 × 89 | col gap 0, pad 35 16 34 32 | 530.000 ₫ |
| 7 | · · · · · · Data | 657, 490 | 131 × 36 | col gap 0, pad 0 0 0 16 | 530.000 ₫ / Bạn đang cao nhất |
| 7 | · · · · · · Data | 789, 492 | 131 × 32 | col gap 0, pad 0 0 0 32 | 28/10/2026 20:17:22 |
| 7 | · · · · · · Data | 920, 464 | 161 × 89 | col gap 0, pad 32 16 33 32 | Dẫn đầu |
| 7 | · · · · · · Data | 1082, 464 | 164 × 89 | col gap 0, pad 30 16 30 16 | Xem phiên |
| 6 | · · · · · Row 2: Outbid (Bị vượt) | 33, 552 | 1214 × 90 | row gap 0, pad 0 0 0 16, bg #FFFBEB@0.20, border #F1F5F9 | #AUC-9821 / • |
| 7 | · · · · · · Data | 49, 555 | 445 × 84 | row gap 12 | #AUC-9821 / • |
| 8 | · · · · · · · Container | 117, 555 | 279 × 84 | col gap 0 | #AUC-9821 / • |
| 7 | · · · · · · Data | 494, 553 | 162 × 89 | col gap 0, pad 35 16 34 32 | 21.000.000 ₫ |
| 7 | · · · · · · Data | 657, 579 | 131 × 36 | col gap 0, pad 0 0 0 16 | 21.500.000 ₫ / Bị dẫn +500.000 ₫ |
| 7 | · · · · · · Data | 789, 581 | 131 × 32 | col gap 0, pad 0 0 0 32 | 28/10/2026 19:45:10 |
| 7 | · · · · · · Data | 920, 553 | 161 × 89 | col gap 0, pad 32 16 33 32 | Bị vượt |
| 7 | · · · · · · Data | 1082, 555 | 164 × 85 | col gap 0, pad 26 16 26 16 | Đặt giá lại |
| 8 | · · · · · · · Container | 1104, 581 | 126 × 32 | row gap 6 | Đặt giá lại |
| 6 | · · · · · Row 3: Won (Đã thắng) | 33, 641 | 1214 × 90 | row gap 0, pad 0 0 0 16, border #F1F5F9 | #AUC-9820 / • |
| 7 | · · · · · · Data | 49, 644 | 445 × 84 | row gap 12 | #AUC-9820 / • |
| 8 | · · · · · · · Container | 117, 644 | 295 × 84 | col gap 0 | #AUC-9820 / • |
| 7 | · · · · · · Data | 494, 642 | 162 × 89 | col gap 0, pad 35 16 34 32 | 38.200.000 ₫ |
| 7 | · · · · · · Data | 657, 668 | 131 × 36 | col gap 0, pad 0 0 0 16 | 38.200.000 ₫ / Giá trúng thầu |
| 7 | · · · · · · Data | 789, 670 | 131 × 32 | col gap 0, pad 0 0 0 32 | 27/10/2026 21:00:00 |
| 7 | · · · · · · Data | 920, 642 | 161 × 89 | col gap 0, pad 32 16 33 32 | Đã thắng |
| 7 | · · · · · · Data | 1082, 642 | 164 × 89 | col gap 0, pad 30 16 30 16 | Xem đơn hàng |
| 8 | · · · · · · · Button – Xem đơn hàng | 1110, 672 | 120 × 28 | row gap 6, pad 6 10 6 10, bg #1D4ED8, r 8, shadow | Xem đơn hàng |
| 6 | · · · · · Row 4: Lost (Không thắng) | 33, 730 | 1214 × 90 | row gap 0, pad 0 0 0 16, border #F1F5F9 | #AUC-9818 / • |
| 7 | · · · · · · Data | 49, 733 | 445 × 84 | row gap 12 | #AUC-9818 / • |
| 8 | · · · · · · · Container | 117, 733 | 305 × 84 | col gap 0 | #AUC-9818 / • |
| 7 | · · · · · · Data | 494, 731 | 162 × 89 | col gap 0, pad 35 16 34 32 | 41.000.000 ₫ |
| 7 | · · · · · · Data | 657, 757 | 131 × 36 | col gap 0, pad 0 0 0 16 | 42.500.000 ₫ / Người khác trúng thầu |
| 7 | · · · · · · Data | 789, 759 | 131 × 32 | col gap 0, pad 0 0 0 32 | 26/10/2026 18:30:15 |
| 7 | · · · · · · Data | 920, 731 | 161 × 89 | col gap 0, pad 32 16 33 32 | Không thắng |
| 7 | · · · · · · Data | 1082, 731 | 164 × 89 | col gap 0, pad 30 16 30 16 | Xem phiên |
| 6 | · · · · · Row 5: Disabled / Invalidated (Bị vô hiệu) | 33, 819 | 1214 × 89 | row gap 0, pad 0 0 0 16, bg #FEF2F2@0.15, border #F1F5F9 | #AUC-9819 / • |
| 7 | · · · · · · Data | 49, 822 | 445 × 84 | row gap 12 | #AUC-9819 / • |
| 8 | · · · · · · · Container | 117, 822 | 261 × 84 | col gap 0 | #AUC-9819 / • |
| 7 | · · · · · · Data | 494, 820 | 162 × 88 | col gap 0, pad 35 16 34 32 | 12.000.000 ₫ |
| 7 | · · · · · · Data | 657, 845 | 131 × 36 | col gap 0, pad 0 0 0 16 | 12.500.000 ₫ / Phiên tiếp tục |
| 7 | · · · · · · Data | 789, 848 | 131 × 32 | col gap 0, pad 0 0 0 32 | 25/10/2026 15:10:00 |
| 7 | · · · · · · Data | 920, 820 | 161 × 88 | col gap 0, pad 32 16 32 32 | Bị vô hiệu |

_(Bảng rút gọn 70/73 khối; xem outline để có đủ.)_

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#515F74` | `text-tertiary` | 29 |
| `#131B2E` | `text` | 23 |
| `#FFFFFF` | `surface / text-inverse` | 21 |
| `#434655` | `text-secondary` | 13 |
| `#F2F3FF` | `surface-subtle` | 12 |
| `#64748B` | `text-placeholder` | 9 |
| `#1D4ED8` | `primary-600` | 9 |
| `#166534` | `success` | 9 |
| `#B45309` | `warning` | 9 |
| `#EAEDFF` | `surface-muted` | 9 |
| `#747686` | `text-subtle (sửa #696B7B)` | 8 |
| `#475569` | `neutral` | 8 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 400 | `text-caption` | 20 |
| 12px / 600 | `text-label / .label` | 12 |
| 12px / 700 | `text-label / .label` | 12 |
| 14px / 600 | `text-body (600)` | 12 |
| 14px / 500 | `text-body` | 10 |
| 14px / 700 | `text-body (600)` | 9 |
| 16px / 400 | `text-body-lg` | 6 |
| 12px / 500 | `text-label / .label` | 6 |
| 14px / 400 | `text-body` | 5 |
| 10px / 600 | `text-caption (Figma <12px – nâng lên)` | 5 |

## API

- `GET /bids/mine?status&auctionStatus&q&page&size (mỗi phiên một dòng; auctionStatus nhiều giá trị; không có sort)`
- `GET /bids/mine/summary (hàng KPI)`

Body, DTO, mã lỗi chi tiết ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Thao tác theo trạng thái: LEADING → "Xem phiên"; OUTBID (phiên còn ACTIVE) → nút `primary-strong` sm "Đặt giá lại" tới S05; WON → "Xem đơn hàng" tới S11; NOT_WON → "Xem phiên"; INVALIDATED → hiện lý do khi hover/focus icon (i).
- Hàng OUTBID nền `warning-subtle-bg` rất nhạt. Giá hiện tại đỏ + "Bị dẫn +X" khi bị vượt.
- Empty: "Bạn chưa đặt giá phiên nào" + nút "Khám phá phiên đấu giá".
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Hàng KPI chỉ hiện khi API trả số tổng (G18).
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G18**, **G22**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S06-my-bids.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S06 – Lượt đặt giá của tôi (Người mua).
Đọc: design/specs/S06-my-bids.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S06-my-bids.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
