# S23 – Quản lý phiên đấu giá (Admin)

| | |
|---|---|
| Route | `/admin/auctions` |
| Vai trò | Admin |
| Layout | AdminLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S23-admin-auctions.png` (PNG @2x, frame 1280×1056px) |
| Outline đầy đủ | `design/outline/S23.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Giám sát phiên, huỷ phiên vi phạm.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả.
2. Hàng 4 KPI (Tổng · Đang diễn ra · Sắp diễn ra · Chờ xử lý/báo cáo).
3. Card lọc: ô tìm kiếm (mã phiên, người bán, sản phẩm), select trạng thái, nhóm nút Hôm nay/Tuần này, "Đặt lại"; dòng chip "Bộ lọc đang áp dụng" + "Xoá tất cả bộ lọc".
4. Bảng: Mã phiên (link mở trang phiên ở tab mới) + ngày tạo | Người bán | Sản phẩm (icon danh mục + tên + mã) | Giá hiện tại | Giá sàn (badge đạt/chưa đạt – admin có thể xem số trong tooltip) | Thời gian kết thúc (đếm ngược hoặc "Kết thúc lúc …") | Trạng thái | Thao tác ("Huỷ phiên").
5. Phân trang có chọn số dòng mỗi trang.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S23.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main Content | 256, 0 | 1021 × 1056 | col gap 0, pad 64 0 0 0 | Quản trị hệ thống / Phiên đấu giá |
| 2 | · Main | 256, 64 | 1021 × 928 | col gap 0, pad 24, bg #FAF8FF | Quản trị hệ thống / Phiên đấu giá |
| 3 | · · Container | 280, 88 | 973 × 880 | col gap 24 | Quản trị hệ thống / Phiên đấu giá |
| 4 | · · · Top Breadcrumb & Header | 280, 88 | 973 × 84 | col gap 8 | Quản trị hệ thống / Phiên đấu giá |
| 5 | · · · · Margin | 280, 112 | 973 × 60 | col gap 0, pad 4 0 0 0 | Quản lý phiên đấu giá / Giám sát và kiểm duyệt các phiên đấu |
| 6 | · · · · · Container | 280, 116 | 973 × 56 | row gap 0 | Quản lý phiên đấu giá / Giám sát và kiểm duyệt các phiên đấu |
| 7 | · · · · · · Container | 280, 116 | 722 × 56 | col gap 4 | Quản lý phiên đấu giá / Giám sát và kiểm duyệt các phiên đấu |
| 8 | · · · · · · · Heading 1 | 280, 116 | 722 × 32 | col gap 0 | Quản lý phiên đấu giá |
| 4 | · · · 4 Stat Summary Cards | 280, 196 | 973 × 118 | row gap 16 | TỔNG SỐ PHIÊN / 342 |
| 5 | · · · · Background+Border+Shadow (×4 lặp lại) | 280, 196 | 231 × 118 | row gap 43, pad 20 20 28 20, bg #FFFFFF, border #E2E8F0, r 16, shadow | TỔNG SỐ PHIÊN / 342 |
| 4 | · · · Filters and Search Bar Container | 280, 338 | 973 × 115 | col gap 12, pad 16, bg #FFFFFF, border #E2E8F0, r 16, shadow | Tìm kiếm mã phiên #AUC-..., người bán, sản phẩm. / Tất cả tr |
| 5 | · · · · Container | 297, 355 | 939 × 38 | row gap 12 | Tìm kiếm mã phiên #AUC-..., người bán, sản phẩm. / Tất cả tr |
| 6 | · · · · · Container | 297, 355 | 527 × 38 | col gap 0 | Tìm kiếm mã phiên #AUC-..., người bán, sản phẩm. |
| 7 | · · · · · · Input | 297, 355 | 527 × 38 | row gap 0, pad 9 16 10 40, bg #F2F3FF, border #C4C5D7@0.40, r 8 | Tìm kiếm mã phiên #AUC-..., người bán, sản phẩm. |
| 6 | · · · · · Container | 836, 357 | 399 × 34 | row gap 8 | Tất cả trạng thái / Hôm nay |
| 7 | · · · · · · Container | 836, 357 | 150 × 34 | col gap 0 | Tất cả trạng thái |
| 8 | · · · · · · · Options | 836, 357 | 150 × 34 | row gap 0, pad 8 32 8 12, bg #F2F3FF, border #C4C5D7@0.40, r 8 | Tất cả trạng thái |
| 5 | · · · · HorizontalBorder | 297, 405 | 939 × 31 | row gap 8, pad 4 0 0 0, border #F1F5F9 | Bộ lọc đang áp dụng: / Trạng thái: Tất cả trạng thái |
| 4 | · · · Auctions Data Table | 280, 477 | 973 × 491 | col gap 0, bg #FFFFFF, border #E2E8F0, r 16, shadow | MÃ PHIÊN / NGƯỜI BÁN |
| 5 | · · · · Container | 281, 478 | 971 × 424 | col gap 0 | MÃ PHIÊN / NGƯỜI BÁN |
| 6 | · · · · · Table | 281, 478 | 1258 × 424 | col gap -1 | MÃ PHIÊN / NGƯỜI BÁN |
| 7 | · · · · · · Header | 281, 478 | 1258 × 41 | col gap 0, bg #F2F3FF@0.70, border #E2E8F0 | MÃ PHIÊN / NGƯỜI BÁN |
| 8 | · · · · · · · Row | 281, 478 | 1258 × 40 | row gap 0 | MÃ PHIÊN / NGƯỜI BÁN |
| 7 | · · · · · · Body | 281, 518 | 1258 × 384 | col gap -1 | #AUC-9821 / 29/10/2026 14:15 |
| 8 | · · · · · · · Row 1 | 281, 518 | 1258 × 73 | row gap 0 | #AUC-9821 / 29/10/2026 14:15 |
| 8 | · · · · · · · Row 2 | 281, 590 | 1258 × 74 | row gap 0, border #C4C5D7@0.20 | #AUC-9820 / 29/10/2026 11:30 |
| 8 | · · · · · · · Row 3 | 281, 663 | 1258 × 94 | row gap 0, border #C4C5D7@0.20 | #AUC-9818 / 28/10/2026 09:20 |
| 8 | · · · · · · · Row 4 (×2 lặp lại) | 281, 756 | 1258 × 74 | row gap 0, border #C4C5D7@0.20 | #AUC-9815 / 27/10/2026 16:45 |
| 5 | · · · · Pagination bar mirroring S24 | 281, 902 | 971 × 65 | row gap 314, pad 16 24 16 24, bg #FFFFFF, border #E2E8F0 | Hiển thị / 10 |
| 6 | · · · · · Container | 921, 919 | 306 × 32 | row gap 4 | 1 / 2 |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#515F74` | `text-tertiary` | 49 |
| `#0037B0` | `primary-700` | 43 |
| `#131B2E` | `text` | 21 |
| `#FFFFFF` | `surface / text-inverse` | 16 |
| `#94A3B8` | `text-placeholder (sửa #5F6B7F)` | 15 |
| `#EFF6FF` | `surface-info` | 10 |
| `#747686` | `text-subtle (sửa #696B7B)` | 10 |
| `#BA1A1A` | `danger` | 9 |
| `#B45309` | `warning` | 8 |
| `#047857` | `success-strong` | 8 |
| `#F2F3FF` | `surface-subtle` | 6 |
| `#EAEDFF` | `surface-muted` | 5 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 500 | `text-label / .label` | 36 |
| 12px / 600 | `text-label / .label` | 20 |
| 12px / 700 | `text-label / .label` | 18 |
| 10px / 400 | `text-caption (Figma <12px – nâng lên)` | 10 |
| 16px / 500 | `text-body-lg` | 7 |
| 24px / 700 | `text-h2 / text-timer` | 6 |
| 12px / 400 | `text-caption` | 6 |
| 11px / 400 | `text-caption (Figma <12px – nâng lên)` | 5 |
| 11px / 500 | `text-caption (Figma <12px – nâng lên)` | 5 |
| 14px / 400 | `text-body` | 3 |

## API

- `GET /auctions?status&page&size (không có endpoint admin riêng)`
- `POST /admin/auctions/{id}/cancel { reason }`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Huỷ phiên đã có bid: `ConfirmDialog` nhấn mạnh "Giữ lịch sử đặt giá, bid dẫn đầu chuyển Không thắng, không tạo đơn".
- Phiên ENDED/UNSOLD/CANCELLED: ẩn nút huỷ.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S23-admin-auctions.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S23 – Quản lý phiên đấu giá (Admin).
Đọc: design/specs/S23-admin-auctions.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S23-admin-auctions.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
