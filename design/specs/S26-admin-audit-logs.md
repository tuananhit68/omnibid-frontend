# S26 – Nhật ký thao tác (Admin)

| | |
|---|---|
| Route | `/admin/audit-logs` |
| Vai trò | Admin |
| Layout | AdminLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S26-admin-audit-logs.png` (PNG @2x, frame 1280×1544px) |
| Outline đầy đủ | `design/outline/S26.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Tra cứu nhật ký thao tác quản trị.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả.
2. Hàng 4 KPI (Tổng thao tác · Can thiệp tài khoản · Xử lý hàng & phiên · Giải quyết khiếu nại).
3. Card lọc 2 hàng: ô tìm kiếm mã đối tượng/ghi chú, nhóm Hôm nay/7 ngày/30 ngày, khoảng ngày; select quản trị viên, select hành động, select loại đối tượng, nút "Đặt lại"; dòng chip đang lọc + "Hiển thị: 10 / n bản ghi".
4. Bảng: Thời gian (ngày giờ + tương đối) | Quản trị viên (avatar, tên, email) | Hành động (badge màu theo loại: Khoá tài khoản, Ẩn sản phẩm, Huỷ phiên, Xử lý báo cáo, Huỷ đơn, Thêm danh mục) | Loại đối tượng | Mã đối tượng (link) | Chi tiết ghi chú (tối đa 3 dòng, mở rộng khi bấm).

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S26.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 256, 0 | 1024 × 1544 | col gap 0, pad 64 0 0 0, bg #FAF8FF | Quản trị hệ thống / Nhật ký hệ thống |
| 2 | · Container | 256, 64 | 1022 × 1416 | col gap 24, pad 24 | Quản trị hệ thống / Nhật ký hệ thống |
| 3 | · · Header Section | 280, 132 | 974 × 77 | row gap 135, pad 0 0 20 0, border #C4C5D7@0.40 | Nhật ký thao tác / Ghi nhận toàn bộ thao tác can thiệp quản  |
| 4 | · · · Container | 280, 132 | 867 × 56 | col gap 4 | Nhật ký thao tác / Ghi nhận toàn bộ thao tác can thiệp quản  |
| 5 | · · · · Heading 1 | 280, 132 | 867 × 32 | col gap 0 | Nhật ký thao tác |
| 3 | · · 4 Stat Summary Cards in S23 Style | 280, 233 | 974 × 96 | row gap 16 | TỔNG SỐ THAO TÁC / 1.482 |
| 4 | · · · Card 1 (×4 lặp lại) | 280, 233 | 231 × 96 | row gap 42, pad 20, bg #FFFFFF, border #E2E8F0, r 12, shadow | TỔNG SỐ THAO TÁC / 1.482 |
| 5 | · · · · Container | 301, 254 | 129 × 54 | col gap 6 | TỔNG SỐ THAO TÁC / 1.482 |
| 6 | · · · · · Paragraph | 301, 276 | 129 × 32 |  | 1.482 / bản ghi |
| 3 | · · S23 Style Toolbar / Filter Section | 280, 353 | 974 × 169 | col gap 12, pad 16, bg #FFFFFF, border #E2E8F0, r 12, shadow | Tìm kiếm theo mã đối tượng (#USR-, #AUC-, #PRD-, / Hôm nay |
| 4 | · · · Container | 297, 370 | 940 × 40 | row gap 12 | Tìm kiếm theo mã đối tượng (#USR-, #AUC-, #PRD-, / Hôm nay |
| 5 | · · · · Search Box | 297, 370 | 456 × 40 | col gap 0 | Tìm kiếm theo mã đối tượng (#USR-, #AUC-, #PRD-, |
| 6 | · · · · · Input | 297, 370 | 456 × 40 | row gap 0, pad 12 40 12 40, bg #F2F3FF, border #C4C5D7@0.40, r 8 | Tìm kiếm theo mã đối tượng (#USR-, #AUC-, #PRD-, |
| 7 | · · · · · · Container | 338, 382 | 374 × 30 | col gap 0 | Tìm kiếm theo mã đối tượng (#USR-, #AUC-, #PRD-, |
| 5 | · · · · Quick Range & Calendar | 765, 370 | 471 × 40 | row gap 8 | Hôm nay / 7 ngày qua |
| 6 | · · · · · Background+Border | 765, 373 | 255 × 34 | row gap 0, pad 4, bg #F2F3FF, border #C4C5D7@0.40, r 8 | Hôm nay / 7 ngày qua |
| 6 | · · · · · Container | 1029, 370 | 208 × 40 | row gap 0 | 01/10/2026 - 29/10/2026 |
| 7 | · · · · · · Input | 1029, 370 | 208 × 40 | col gap 0, pad 12 12 12 32, bg #F2F3FF, border #C4C5D7@0.40, r 8 | 01/10/2026 - 29/10/2026 |
| 4 | · · · Dropdown Filters Row | 297, 422 | 940 × 45 | row gap 12, pad 8 0 0 0, border #F1F5F9 | Quản trị viên cấp cao / Tất cả hành động |
| 5 | · · · · Admin Selector | 297, 431 | 226 × 36 | col gap 0 | Quản trị viên cấp cao |
| 6 | · · · · · Options | 297, 431 | 226 × 36 | row gap 0, pad 0 32 0 12, bg #F2F3FF, border #C4C5D7@0.40, r 8 | Quản trị viên cấp cao |
| 5 | · · · · Action Selector | 535, 431 | 226 × 36 | col gap 0 | Tất cả hành động |
| 6 | · · · · · Options | 535, 431 | 226 × 36 | row gap 0, pad 0 32 0 12, bg #F2F3FF, border #C4C5D7@0.40, r 8 | Tất cả hành động |
| 5 | · · · · Target Type Selector | 773, 431 | 226 × 36 | col gap 0 | Tất cả đối tượng |
| 6 | · · · · · Options | 773, 431 | 226 × 36 | row gap 0, pad 0 32 0 12, bg #F2F3FF, border #C4C5D7@0.40, r 8 | Tất cả đối tượng |
| 5 | · · · · Reset Filter Button | 1011, 431 | 226 × 36 | row gap 8 | Đặt lại |
| 6 | · · · · · Button – Đặt lại | 1011, 431 | 182 × 36 | row gap 6, pad 0 12 0 12, bg #E2E7FF, border #C4C5D7@0.40, r 8 | Đặt lại |
| 3 | · · Data Table matching S23 | 280, 546 | 974 × 910 | col gap 0, bg #FFFFFF, border #E2E8F0, r 12, shadow | THỜI GIAN / QUẢN TRỊ VIÊN |
| 4 | · · · Table | 281, 547 | 972 × 847 | col gap -1 | THỜI GIAN / QUẢN TRỊ VIÊN |
| 5 | · · · · Header → Row | 281, 547 | 972 × 41 | row gap 0, bg #F8FAFC, border #E2E8F0 | THỜI GIAN / QUẢN TRỊ VIÊN |
| 6 | · · · · · Cell | 228, 547 | 154 × 40 | col gap 0, pad 12 16 12 16 | THỜI GIAN |
| 6 | · · · · · Cell | 383, 547 | 192 × 40 | col gap 0, pad 12 16 12 16 | QUẢN TRỊ VIÊN |
| 6 | · · · · · Cell | 575, 547 | 155 × 40 | col gap 0, pad 12 16 12 16 | HÀNH ĐỘNG |
| 6 | · · · · · Cell | 731, 547 | 131 × 40 | col gap 0, pad 12 16 12 16 | LOẠI ĐỐI TƯỢNG |
| 6 | · · · · · Cell | 862, 547 | 122 × 40 | col gap 0, pad 12 16 12 16 | MÃ ĐỐI TƯỢNG |
| 6 | · · · · · Cell | 985, 547 | 320 × 40 | col gap 0, pad 12 16 12 16 | CHI TIẾT GHI CHÚ |
| 5 | · · · · Body | 281, 587 | 972 × 807 | col gap -1 | 29/10/2026 15:30:12 / 15 phút trước |
| 6 | · · · · · Row 1 | 281, 587 | 972 × 87 | row gap 0 | 29/10/2026 15:30:12 / 15 phút trước |
| 7 | · · · · · · Data | 228, 587 | 154 × 87 | col gap 0, pad 28 16 28 16 | 29/10/2026 15:30:12 / 15 phút trước |
| 7 | · · · · · · Data | 383, 616 | 176 × 28 | row gap 10, pad 0 0 0 16 | AD / Quản trị viên cấp cao |
| 8 | · · · · · · · Container | 437, 616 | 122 × 28 | col gap 0 | Quản trị viên cấp cao / admin@OmniBid.vn |
| 7 | · · · · · · Data | 559, 587 | 171 × 87 | col gap 0, pad 33 16 33 32 | Khóa tài khoản |
| 7 | · · · · · · Data | 731, 587 | 131 × 87 | col gap 0, pad 34 16 34 16 | Người dùng |
| 7 | · · · · · · Data | 862, 587 | 122 × 87 | col gap 0, pad 34 16 37 16 | USR-88219 |
| 7 | · · · · · · Data | 985, 587 | 320 × 87 | col gap 0, pad 14 16 14 16 | Khóa vĩnh viễn tài khoản Trần Ngọc (USR-88219) d |
| 6 | · · · · · Row 2 | 281, 673 | 972 × 90 | row gap 0, border #F1F5F9 | 29/10/2026 14:18:05 / 1 giờ trước |
| 7 | · · · · · · Data | 228, 674 | 154 × 89 | col gap 0, pad 29 16 29 16 | 29/10/2026 14:18:05 / 1 giờ trước |
| 7 | · · · · · · Data | 383, 705 | 176 × 28 | row gap 10, pad 0 0 0 16 | PS / Phạm Hoàng Sơn |
| 7 | · · · · · · Data | 559, 674 | 171 × 89 | col gap 0, pad 34 16 34 32 | Ẩn sản phẩm |
| 7 | · · · · · · Data | 731, 674 | 131 × 89 | col gap 0, pad 35 16 35 16 | Sản phẩm |
| 7 | · · · · · · Data | 862, 674 | 122 × 89 | col gap 0, pad 35 16 38 16 | #PRD-6612 |
| 7 | · · · · · · Data | 985, 674 | 320 × 89 |  | Ẩn sản phẩm vi phạm bản quyền thương hiệu Patek  / #REP-1039 |
| 6 | · · · · · Row 3 | 281, 763 | 972 × 69 | row gap 0, border #F1F5F9 | 29/10/2026 11:05:44 / 4 giờ trước |
| 7 | · · · · · · Data | 228, 764 | 154 × 68 | col gap 0, pad 18 16 18 16 | 29/10/2026 11:05:44 / 4 giờ trước |
| 7 | · · · · · · Data | 383, 784 | 176 × 28 | row gap 10, pad 0 0 0 16 | AD / Quản trị viên cấp cao |
| 8 | · · · · · · · Container | 437, 784 | 122 × 28 | col gap 0 | Quản trị viên cấp cao / admin@OmniBid.vn |
| 7 | · · · · · · Data | 559, 764 | 171 × 68 | col gap 0, pad 23 16 23 32 | Hủy phiên |
| 7 | · · · · · · Data | 731, 764 | 131 × 68 | col gap 0, pad 24 16 24 16 | Phiên đấu giá |
| 7 | · · · · · · Data | 862, 764 | 122 × 68 | col gap 0, pad 24 16 28 16 | #AUC-2048 |
| 7 | · · · · · · Data | 985, 764 | 320 × 68 | col gap 0, pad 14 16 15 16 | Hủy phiên đấu giá đồng hồ Rolex Submariner do ph |
| 6 | · · · · · Row 4 | 281, 831 | 972 × 104 | row gap 0, border #F1F5F9 | 29/10/2026 09:42:20 / 6 giờ trước |
| 7 | · · · · · · Data | 228, 832 | 154 × 103 | col gap 0, pad 28 16 28 16 | 29/10/2026 09:42:20 / 6 giờ trước |
| 8 | · · · · · · · Container | 244, 859 | 122 × 32 | col gap 0 | 29/10/2026 09:42:20 |
| 7 | · · · · · · Data | 383, 869 | 176 × 28 | row gap 10, pad 0 0 0 16 | LV / Lê Thanh Vân |
| 7 | · · · · · · Data | 559, 840 | 171 × 87 | col gap 0, pad 33 16 33 32 | Xử lý báo cáo |
| 7 | · · · · · · Data | 731, 840 | 131 × 87 | col gap 0, pad 34 16 34 16 | Báo cáo |
| 7 | · · · · · · Data | 862, 840 | 122 × 87 | col gap 0, pad 34 16 37 16 | #REP-1042 |
| 7 | · · · · · · Data | 985, 840 | 320 × 87 | col gap 0, pad 14 16 14 16 | Xác minh khiếu nại tranh chấp trạng thái hàng hó |
| 6 | · · · · · Row 5 | 281, 934 | 972 × 90 | row gap 0, border #F1F5F9 | 28/10/2026 19:12:33 / Hôm qua |
| 7 | · · · · · · Data | 228, 935 | 154 × 89 | col gap 0, pad 29 16 29 16 | 28/10/2026 19:12:33 / Hôm qua |

_(Bảng rút gọn 70/110 khối; xem outline để có đủ.)_

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#747686` | `text-subtle (sửa #696B7B)` | 49 |
| `#131B2E` | `text` | 40 |
| `#434655` | `text-secondary` | 33 |
| `#FFFFFF` | `surface / text-inverse` | 29 |
| `#1D4ED8` | `primary-600` | 29 |
| `#515F74` | `text-tertiary` | 22 |
| `#EAEDFF` | `surface-muted` | 11 |
| `#F2F3FF` | `surface-subtle` | 8 |
| `#0037B0` | `primary-700` | 7 |
| `#991B1B` | `danger-strong` | 5 |
| `#9A3412` | `warning-strong` | 5 |
| `#FAF8FF` | `bg` | 3 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 400 | `text-caption` | 36 |
| 12px / 600 | `text-label / .label` | 23 |
| 11px / 500 | `text-caption (Figma <12px – nâng lên)` | 18 |
| 11px / 700 | `text-caption (Figma <12px – nâng lên)` | 15 |
| 12px / 500 | `text-label / .label` | 11 |
| 11px / 400 | `text-caption (Figma <12px – nâng lên)` | 9 |
| 10px / 400 | `text-caption (Figma <12px – nâng lên)` | 9 |
| 12px / 700 | `text-label / .label` | 9 |
| 16px / 500 | `text-body-lg` | 7 |
| 24px / 700 | `text-h2 / text-timer` | 6 |

## API

- `GET /admin/audit-logs?adminId&action&targetType&targetId&from&to&page&size`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Mã đối tượng link tới trang quản trị tương ứng.
- Bảng trong Figma bị cắt cột Thời gian bên trái – bọc `overflow-x-auto` và đặt cột Thời gian sticky trái.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Chỉ đọc.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G18**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S26-admin-audit-logs.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S26 – Nhật ký thao tác (Admin).
Đọc: design/specs/S26-admin-audit-logs.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S26-admin-audit-logs.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
