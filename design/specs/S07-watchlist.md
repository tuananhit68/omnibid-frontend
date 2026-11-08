# S07 – Phiên đang theo dõi (Người mua)

| | |
|---|---|
| Route | `/watchlist` |
| Vai trò | User |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S07-watchlist.png` (PNG @2x, frame 1280×1662px) |
| Outline đầy đủ | `design/outline/S07.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Theo dõi realtime các phiên đã lưu.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả.
2. Hàng 5 `StatCard` nhỏ (Tổng · Đang diễn ra · Sắp diễn ra · Đã kết thúc · Đã huỷ) với ô icon 40px bên phải.
3. Thanh lọc: tabs (Tất cả/Đang diễn ra/Sắp diễn ra/Đã kết thúc) + ô tìm kiếm + select sắp xếp.
4. Lưới 3 cột thẻ phiên lớn (ảnh ~270×170 có chip danh mục, chip tình trạng, mã phiên, nút tim góc phải; badge trạng thái + badge thời gian ở đáy ảnh); tên 18/26 700 2 dòng; giá + bước giá; dải thông tin (lượt đặt, trạng thái giá sàn); nút full-width theo trạng thái.
5. `Pagination`.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S07.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 0, 0 | 1280 × 1578 | col gap 0, pad 64 0 0 0, bg #FAF8FF | Trang chủ / Tài khoản của tôi |
| 2 | · Top Hero & Breadcrumb Workspace | 0, 64 | 1280 × 1514 | col gap 0, pad 16 32 64 32 | Trang chủ / Tài khoản của tôi |
| 3 | · · Page Title & High-Level Summary Header | 32, 99 | 1216 × 106 | row gap 0, pad 16 0 24 0 | Phiên đang theo dõi / Quản lý và cập nhật thời gian thực các |
| 4 | · · · Container | 32, 115 | 546 × 66 | col gap 4 | Phiên đang theo dõi / Quản lý và cập nhật thời gian thực các |
| 5 | · · · · Heading 1 | 32, 115 | 546 × 38 | col gap 0 | Phiên đang theo dõi |
| 3 | · · Metrics / Counters Bar (Visual Bento Array) | 32, 205 | 1216 × 106 | row gap 16, pad 0 0 24 0 | TỔNG THEO DÕI / 06 |
| 4 | · · · Total | 32, 205 | 230 × 82 | row gap 63, pad 16, bg #FFFFFF, r 8, shadow | TỔNG THEO DÕI / 06 |
| 4 | · · · Live / Active | 278, 205 | 230 × 82 | row gap 72, pad 16, bg #FFFFFF, r 8, shadow | ĐANG DIỄN RA / 03 |
| 4 | · · · Upcoming | 524, 205 | 230 × 82 | row gap 84, pad 16, bg #FFFFFF, r 8, shadow | SẮP DIỄN RA / 01 |
| 4 | · · · Ended | 771, 205 | 230 × 82 | row gap 77, pad 16, bg #FFFFFF, r 8, shadow | ĐÃ KẾT THÚC / 01 |
| 4 | · · · Canceled | 1017, 205 | 230 × 82 | row gap 91, pad 16, bg #FFFFFF, r 8, shadow | ĐÃ HỦY / 01 |
| 3 | · · Control Bar: Filter Tabs & Sorting Toolbar | 32, 311 | 1216 × 60 | row gap 103, pad 8, bg #FFFFFF, r 8, shadow | Tất cả (6) / Đang diễn ra (3) |
| 4 | · · · Left: Filter Tabs | 40, 319 | 584 × 44 | row gap 6 | Tất cả (6) / Đang diễn ra (3) |
| 5 | · · · · Button – Đang diễn ra (3) | 164, 319 | 156 × 44 | row gap 8, pad 0 16 0 16, bg #FFFFFF, r 6 | Đang diễn ra (3) |
| 5 | · · · · Button – Sắp diễn ra (1) | 326, 319 | 143 × 44 | row gap 8, pad 0 16 0 16, bg #FFFFFF, r 6 | Sắp diễn ra (1) |
| 5 | · · · · Button – Đã kết thúc (2) | 476, 319 | 147 × 44 | row gap 8, pad 0 16 0 16, bg #FFFFFF, r 6 | Đã kết thúc (2) |
| 4 | · · · Right: Search Input & Sort Selector | 720, 319 | 519 × 44 | row gap 8 | Tìm theo tên sản phẩm, mã phiên... / Sắp xếp: |
| 5 | · · · · Search bar | 720, 319 | 283 × 44 | row gap 0, pad 0 16 0 16, bg #F2F3FF, r 8 | Tìm theo tên sản phẩm, mã phiên... |
| 5 | · · · · Sort dropdown | 1011, 319 | 228 × 44 | row gap 0, pad 0 16 0 16, bg #F2F3FF, r 8 | Sắp xếp: / Sắp kết thúc |
| 3 | · · Auction Cards Grid: Responsive 3 Columns Layou | 32, 371 | 1216 × 1074 |  | Đang diễn ra / Còn 14 phút |
| 4 | · · · CARD 1: Đang diễn ra - iPhone 15 Pro Max | 32, 395 | 389 × 521 | col gap 0, bg #FFFFFF, r 8, shadow | Đang diễn ra / Còn 14 phút |
| 5 | · · · · Image & Badges header | 32, 395 | 389 × 243 | col gap 0, bg #F2F3FF | Đang diễn ra / Còn 14 phút |
| 6 | · · · · · AB6AXuCfRLgClXBPdBNi5VvXPe1Ftk-KNSTsc1qZygNXPo | 32, 395 | 389 × 243 |  |  |
| 5 | · · · · Card Content Body | 32, 638 | 389 × 278 | col gap 0, pad 16 | iPhone 15 Pro Max 256GB Titan Tự Nhiên (VN/A) / Giá hiện tại |
| 6 | · · · · · Container | 48, 654 | 357 × 182 | col gap 8 | iPhone 15 Pro Max 256GB Titan Tự Nhiên (VN/A) / Giá hiện tại |
| 7 | · · · · · · Heading 3 | 48, 654 | 357 × 78 | col gap 0 | iPhone 15 Pro Max 256GB Titan Tự Nhiên (VN/A) |
| 7 | · · · · · · Container | 48, 740 | 357 × 52 | row gap 140, pad 4 0 0 0 | Giá hiện tại / 21.500.000 ₫ |
| 8 | · · · · · · · Container | 48, 744 | 149 × 48 | col gap 0 | Giá hiện tại / 21.500.000 ₫ |
| 7 | · · · · · · Auction Metrics Strip | 48, 800 | 357 × 36 | row gap 116, pad 8 12 8 12, bg #F2F3FF, r 6 | 18 / lượt đặt |
| 6 | · · · · · Action Button:margin | 48, 836 | 357 × 64 | col gap 0, pad 20 0 0 0 | Vào đặt giá ngay |
| 7 | · · · · · · Button – Vào đặt giá ngay | 48, 856 | 357 × 44 | row gap 8, bg #0037B0, r 6, shadow | Vào đặt giá ngay |
| 4 | · · · CARD 2: Đang diễn ra - Sony WH-1000XM5 | 445, 395 | 389 × 495 | col gap 0, bg #FFFFFF, r 8, shadow | Đang diễn ra / Còn 02 giờ 45 phút |
| 5 | · · · · Background | 445, 395 | 389 × 243 | col gap 0, bg #F2F3FF | Đang diễn ra / Còn 02 giờ 45 phút |
| 6 | · · · · · AB6AXuCxpoWVhXgoKwZdaqV0SFqKSDIZhgb8EgU0tIJ1Ij | 445, 395 | 389 × 243 |  |  |
| 5 | · · · · Container | 445, 638 | 389 × 252 | col gap 4, pad 16 | Tai nghe chống ồn Sony WH-1000XM5 Silver Chính H / Giá hiện  |
| 6 | · · · · · Container | 461, 654 | 357 × 152 | col gap 8 | Tai nghe chống ồn Sony WH-1000XM5 Silver Chính H / Giá hiện  |
| 7 | · · · · · · Heading 3 | 461, 654 | 357 × 52 | col gap 0 | Tai nghe chống ồn Sony WH-1000XM5 Silver Chính H |
| 7 | · · · · · · Container | 461, 714 | 357 × 52 | row gap 179, pad 4 0 0 0 | Giá hiện tại / 530.000 ₫ |
| 7 | · · · · · · Background | 461, 774 | 357 × 32 | row gap 145, pad 8 12 8 12, bg #F2F3FF, r 6 | 22 / lượt đặt |
| 6 | · · · · · Margin | 461, 810 | 357 × 64 | col gap 0, pad 20 0 0 0 | Vào đặt giá ngay |
| 7 | · · · · · · Button – Vào đặt giá ngay | 461, 830 | 357 × 44 | row gap 8, bg #0037B0, r 6, shadow | Vào đặt giá ngay |
| 4 | · · · CARD 3: Đang diễn ra - MacBook Pro 14 M3 Pro | 858, 395 | 389 × 495 | col gap 0, bg #FFFFFF, r 8, shadow | Đang diễn ra / Còn 04 giờ 10 phút |
| 5 | · · · · Background | 858, 395 | 389 × 243 | col gap 0, bg #F2F3FF | Đang diễn ra / Còn 04 giờ 10 phút |
| 6 | · · · · · AB6AXuB4zsFAWTtciDpLVD5F498qv0Nha2K8_tfjL-D2Td | 858, 395 | 389 × 243 |  |  |
| 5 | · · · · Container | 858, 638 | 389 × 252 | col gap 4, pad 16 | MacBook Pro 14 inch M3 Pro (18GB / 512GB SSD) Sp / Giá hiện  |
| 6 | · · · · · Container | 874, 654 | 357 × 152 | col gap 8 | MacBook Pro 14 inch M3 Pro (18GB / 512GB SSD) Sp / Giá hiện  |
| 7 | · · · · · · Heading 3 | 874, 654 | 357 × 52 | col gap 0 | MacBook Pro 14 inch M3 Pro (18GB / 512GB SSD) Sp |
| 7 | · · · · · · Container | 874, 714 | 357 × 52 | row gap 132, pad 4 0 0 0 | Giá hiện tại / 38.500.000 ₫ |
| 8 | · · · · · · · Container | 874, 718 | 154 × 48 | col gap 0 | Giá hiện tại / 38.500.000 ₫ |
| 7 | · · · · · · Background | 874, 774 | 357 × 32 | row gap 147, pad 8 12 8 12, bg #F2F3FF, r 6 | 31 / lượt đặt |
| 6 | · · · · · Margin | 874, 810 | 357 × 64 | col gap 0, pad 20 0 0 0 | Vào đặt giá ngay |
| 7 | · · · · · · Button – Vào đặt giá ngay | 874, 830 | 357 × 44 | row gap 8, bg #0037B0, r 6, shadow | Vào đặt giá ngay |
| 4 | · · · CARD 4: Sắp diễn ra - Sony Alpha A7 IV | 32, 914 | 389 × 499 | col gap 0, bg #FFFFFF, r 8, shadow | Sắp diễn ra / Mở lúc 30/10 09:00 |
| 5 | · · · · Background | 32, 914 | 389 × 243 | col gap 0, bg #F2F3FF | Sắp diễn ra / Mở lúc 30/10 09:00 |
| 6 | · · · · · AB6AXuCOzLjV6mMrsYcFf7N89rgD-MHXQOshV0j1jMOdhW | 32, 914 | 389 × 243 |  |  |
| 5 | · · · · Container | 32, 1158 | 389 × 256 | col gap 8, pad 16 | Máy ảnh không gương lật Sony Alpha A7 Mark IV Bo / Giá khởi  |
| 6 | · · · · · Container | 48, 1174 | 357 × 152 | col gap 8 | Máy ảnh không gương lật Sony Alpha A7 Mark IV Bo / Giá khởi  |
| 7 | · · · · · · Heading 3 | 48, 1174 | 357 × 52 | col gap 0 | Máy ảnh không gương lật Sony Alpha A7 Mark IV Bo |
| 7 | · · · · · · Container | 48, 1234 | 357 × 52 | row gap 132, pad 4 0 0 0 | Giá khởi điểm / 35.000.000 ₫ |
| 8 | · · · · · · · Container | 48, 1238 | 154 × 48 | col gap 0 | Giá khởi điểm / 35.000.000 ₫ |
| 7 | · · · · · · Background | 48, 1294 | 357 × 32 | row gap 25, pad 8 12 8 12, bg #F2F3FF, r 6 | 142 người / đăng ký nhận tin |
| 6 | · · · · · Margin | 48, 1334 | 357 × 64 | col gap 0, pad 20 0 0 0 | Xem chi tiết & Đặt nhắc nhở |
| 7 | · · · · · · Button – Xem chi tiết & Đặt nhắc nhở | 48, 1354 | 357 × 44 | row gap 8, bg #E2E7FF, r 6 | Xem chi tiết & Đặt nhắc nhở |
| 4 | · · · CARD 5: Đã kết thúc - Seiko Presage Automatic | 445, 914 | 389 × 499 | col gap 0, bg #FFFFFF, r 8, shadow | Đã kết thúc / Chốt 27/10 21:00 |
| 5 | · · · · Background | 445, 914 | 389 × 243 | col gap 0, bg #F2F3FF | Đã kết thúc / Chốt 27/10 21:00 |
| 6 | · · · · · AB6AXuDe8xhkz7yZxqKDcOez7jnMXxrDqvFIAvVvo9XaV3 | 445, 914 | 389 × 243 | bg #FFFFFF@0.20 |  |
| 5 | · · · · Container | 445, 1158 | 389 × 256 | col gap 8, pad 16 | Đồng hồ cơ Nam Seiko Presage Cocktail Time Autom / Giá trúng |
| 6 | · · · · · Container | 461, 1174 | 357 × 152 | col gap 8 | Đồng hồ cơ Nam Seiko Presage Cocktail Time Autom / Giá trúng |
| 7 | · · · · · · Heading 3 | 461, 1174 | 357 × 52 | col gap 0 | Đồng hồ cơ Nam Seiko Presage Cocktail Time Autom |
| 7 | · · · · · · Container | 461, 1234 | 357 × 52 | row gap 132, pad 4 0 0 0 | Giá trúng cuối cùng / 12.500.000 ₫ |

_(Bảng rút gọn 70/85 khối; xem outline để có đủ.)_

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#FFFFFF` | `surface / text-inverse` | 57 |
| `#434655` | `text-secondary` | 52 |
| `#131B2E` | `text` | 36 |
| `#0037B0` | `primary-700` | 28 |
| `#F2F3FF` | `surface-subtle` | 17 |
| `#1D4ED8` | `primary-600` | 11 |
| `#747686` | `text-subtle (sửa #696B7B)` | 10 |
| `#BA1A1A` | `danger` | 8 |
| `#DAE2FD` | `primary-100` | 7 |
| `#A73400` | `tertiary-600` | 6 |
| `#EAEDFF` | `surface-muted` | 4 |
| `#EEF0FF` | `primary-50` | 4 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 600 | `text-body (600)` | 21 |
| 12px / 600 | `text-label / .label` | 19 |
| 12px / 400 | `text-caption` | 17 |
| 12px / 700 | `text-label / .label` | 16 |
| 12px / 500 | `text-label / .label` | 11 |
| 24px / 700 | `text-h2 / text-timer` | 11 |
| 14px / 400 | `text-body` | 9 |
| 14px / 500 | `text-body` | 7 |
| 18px / 700 | `text-h3` | 6 |
| 14px / 700 | `text-body (600)` | 2 |

## API

- `⛔ B6 watchlist – backend chưa có; làm giao diện với mock`
- `WS /topic/auction/{id} cho các phiên ACTIVE đang hiển thị (tối đa số thẻ trên trang)`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- ACTIVE: nút `primary-strong` "Vào đặt giá ngay"; badge thời gian đỏ khi còn < 15 phút.
- SCHEDULED: "Giá khởi điểm", "Bắt đầu sau…", nút `secondary` "Xem chi tiết".
- ENDED: "Giá trúng cuối cùng", người thắng che tên, nút `secondary` "Xem kết quả". UNSOLD: badge "Không đạt giá sàn".
- CANCELLED: giá gạch ngang, khối `danger-bg` "Lý do huỷ: …".
- Bỏ theo dõi: xoá thẻ khỏi lưới kèm toast có nút "Hoàn tác".
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Nút tim là `button` có `aria-label="Bỏ theo dõi <tên>"`.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G8**, **G18**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S07-watchlist.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S07 – Phiên đang theo dõi (Người mua).
Đọc: design/specs/S07-watchlist.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S07-watchlist.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
