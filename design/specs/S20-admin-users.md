# S20 – Quản lý người dùng (Admin)

| | |
|---|---|
| Route | `/admin/users` |
| Vai trò | Admin |
| Layout | AdminLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S20-admin-users.png` (PNG @2x, frame 1280×1054px) |
| Outline đầy đủ | `design/outline/S20.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Tìm người dùng, khoá/mở khoá tài khoản.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả.
2. Hàng 4 KPI (Tổng tài khoản · Đang hoạt động · (Quản trị viên – G16) · Tài khoản bị khoá).
3. Card lọc: ô tìm kiếm (tên, email, SĐT), select vai trò, select trạng thái, nút "Đặt lại".
4. Card bảng: header "Danh sách hồ sơ người dùng" + chỉ báo "Đồng bộ thời gian thực" (bỏ nếu không có WS); bảng Người dùng (avatar chữ, tên, USR-id) | Email & SĐT (SĐT che giữa) | Vai trò | Trạng thái | Ngày đăng ký | Thao tác ("Khoá" `danger-soft` / "Mở khoá" `secondary`). Hàng bị khoá nền `danger-bg` nhạt + dòng lý do khoá màu `danger`.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S20.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 256, 0 | 1024 × 1054 | col gap 24, pad 64 0 60 0, bg #FAF8FF | Quản trị hệ thống / Người dùng |
| 2 | · Container | 256, 64 | 1024 × 890 | col gap 24, pad 24 | Quản trị hệ thống / Người dùng |
| 3 | · · Breadcrumb & Top Bar | 280, 88 | 976 × 90 | col gap 4 | Quản trị hệ thống / Người dùng |
| 4 | · · · Margin | 280, 108 | 976 × 70 | col gap 0, pad 8 0 0 0 | Quản lý người dùng / Kiểm soát tài khoản, phân quyền vai trò |
| 5 | · · · · Container | 280, 116 | 976 × 62 | row gap 125 | Quản lý người dùng / Kiểm soát tài khoản, phân quyền vai trò |
| 6 | · · · · · Container | 280, 116 | 670 × 62 | col gap 4 | Quản lý người dùng / Kiểm soát tài khoản, phân quyền vai trò |
| 7 | · · · · · · Heading 1 | 280, 116 | 670 × 38 | col gap 0 | Quản lý người dùng |
| 3 | · · 4 Stat Summary Cards matching S23 style | 280, 202 | 976 × 105 | row gap 16 | Tổng tài khoản / 12.480 |
| 4 | · · · Background+Border+Shadow (×4 lặp lại) | 280, 202 | 232 × 105 | row gap 47, pad 16, bg #FFFFFF, border #E2E8F0, r 12, shadow | Tổng tài khoản / 12.480 |
| 3 | · · Search & Filter Toolbar matching S23 | 280, 331 | 976 × 74 | col gap 0, pad 16, bg #FFFFFF, border #E2E8F0, r 12, shadow | Tìm kiếm theo họ tên, email, số điện thoại hoặc  / Vai trò: |
| 4 | · · · Container | 297, 348 | 914 × 40 | row gap 12 | Tìm kiếm theo họ tên, email, số điện thoại hoặc  / Vai trò: |
| 5 | · · · · Container | 297, 348 | 295 × 40 | col gap 0 | Tìm kiếm theo họ tên, email, số điện thoại hoặc  |
| 6 | · · · · · Input | 297, 348 | 295 × 40 | bg #F8FAFC, border #E2E8F0, r 8 | Tìm kiếm theo họ tên, email, số điện thoại hoặc  |
| 5 | · · · · Container | 604, 348 | 607 × 40 | row gap 10 | Vai trò: / Tất cả vai trò |
| 6 | · · · · · Background+Border | 604, 348 | 247 × 40 | row gap 8, pad 0 12 0 12, bg #F8FAFC, border #E2E8F0, r 8 | Vai trò: / Tất cả vai trò |
| 6 | · · · · · Background+Border | 861, 348 | 249 × 40 | row gap 8, pad 0 12 0 12, bg #F8FAFC, border #E2E8F0, r 8 | Trạng thái: / Tất cả trạng thái |
| 3 | · · Data Table Card matching S23 table layout | 280, 429 | 976 × 501 | col gap 0, bg #FFFFFF, border #E2E8F0, r 12, shadow | Danh sách hồ sơ người dùng / Đồng bộ thời gian thực (Real-ti |
| 4 | · · · Table Header Info Bar | 281, 430 | 974 × 45 | row gap 481, pad 12 16 12 16, bg #F2F3FF@0.60, border #E2E8F0 | Danh sách hồ sơ người dùng / Đồng bộ thời gian thực (Real-ti |
| 4 | · · · Table Element → Table | 281, 475 | 974 × 397 | col gap -1 | NGƯỜI DÙNG / EMAIL & SỐ ĐIỆN THOẠI |
| 5 | · · · · Header → Row | 281, 475 | 974 × 57 | row gap 0, bg #F8FAFC, border #E2E8F0 | NGƯỜI DÙNG / EMAIL & SỐ ĐIỆN THOẠI |
| 6 | · · · · · Cell | 296, 475 | 205 × 56 | col gap 0, pad 20 16 21 16 | NGƯỜI DÙNG |
| 6 | · · · · · Cell | 502, 475 | 222 × 56 | col gap 0, pad 20 16 21 16 | EMAIL & SỐ ĐIỆN THOẠI |
| 6 | · · · · · Cell | 725, 475 | 126 × 56 | col gap 0, pad 20 16 21 16 | VAI TRÒ |
| 6 | · · · · · Cell | 852, 475 | 120 × 56 | col gap 0, pad 20 16 21 16 | TRẠNG THÁI |
| 6 | · · · · · Cell | 972, 475 | 123 × 56 | col gap 0, pad 12 16 12 16 | NGÀY ĐĂNG KÝ |
| 6 | · · · · · Cell | 1096, 475 | 142 × 56 | col gap 0, pad 12 16 12 16 | THAO TÁC CHẾ TÀI |
| 5 | · · · · Body | 281, 531 | 974 × 340 | col gap -1 | TH / Nguyễn Thế Hùng |
| 6 | · · · · · Row 1: Nguyễn Thế Hùng | 281, 531 | 974 × 81 | row gap 0, pad 0 0 0 16 | TH / Nguyễn Thế Hùng |
| 7 | · · · · · · Data | 312, 544 | 173 × 56 | row gap 12 | TH / Nguyễn Thế Hùng |
| 8 | · · · · · · · Container | 360, 544 | 124 × 56 | col gap 0 | Nguyễn Thế Hùng / USR-84192 |
| 7 | · · · · · · Data | 486, 531 | 238 × 81 | col gap 0, pad 22 16 22 32 | thehung.bid@gmail.com / 0912 ••• 849 |
| 7 | · · · · · · Data | 725, 531 | 126 × 81 | col gap 0, pad 20 16 20 16 | Người bán |
| 7 | · · · · · · Data | 852, 531 | 120 × 81 | col gap 0, pad 22 16 22 16 | Hoạt động |
| 7 | · · · · · · Data | 972, 531 | 123 × 81 | col gap 0, pad 32 16 33 16 | 12/01/2024 |
| 7 | · · · · · · Data | 1096, 531 | 142 × 81 | col gap 0, pad 24 16 24 16 | Khóa |
| 6 | · · · · · Row 2: Trần Thị Bích Vân | 281, 611 | 974 × 66 | row gap 0, pad 0 0 0 16, border #E2E8F0 | BV / Trần Thị Bích Vân |
| 7 | · · · · · · Data | 312, 627 | 173 × 36 | row gap 12 | BV / Trần Thị Bích Vân |
| 7 | · · · · · · Data | 486, 612 | 238 × 65 | col gap 0, pad 14 16 14 32 | van.bich@yahoo.com / 0983 ••• 112 |
| 7 | · · · · · · Data | 725, 612 | 126 × 65 | col gap 0, pad 12 16 12 16 | Người mua |
| 7 | · · · · · · Data | 852, 612 | 120 × 65 | col gap 0, pad 14 16 14 16 | Hoạt động |
| 7 | · · · · · · Data | 972, 612 | 123 × 65 | col gap 0, pad 24 16 25 16 | 24/04/2024 |
| 7 | · · · · · · Data | 1096, 612 | 142 × 65 | col gap 0, pad 16 | Khóa |
| 6 | · · · · · Row 3: Lê Quốc Hưng | 281, 676 | 974 × 66 | row gap 0, pad 0 0 0 16, bg #FFDAD6@0.20, border #E2E8F0 | QH / Lê Quốc Hưng |
| 7 | · · · · · · Data | 312, 692 | 173 × 36 | row gap 12 | QH / Lê Quốc Hưng |
| 7 | · · · · · · Data | 486, 677 | 238 × 65 | col gap 0, pad 14 16 14 32 | hung_leantique@gmail.com / Khóa 27/10: Thổi giá đấu thầu |
| 7 | · · · · · · Data | 725, 677 | 126 × 65 | col gap 0, pad 12 16 12 16 | Người bán |
| 7 | · · · · · · Data | 852, 677 | 120 × 65 | col gap 0, pad 21 16 22 16 | Bị khóa |
| 7 | · · · · · · Data | 972, 677 | 123 × 65 | col gap 0, pad 24 16 25 16 | 05/11/2023 |
| 7 | · · · · · · Data | 1096, 677 | 142 × 65 | col gap 0, pad 16 | Mở khóa |
| 6 | · · · · · Row 4: Phạm Thùy Linh | 281, 741 | 974 × 66 | row gap 0, pad 0 0 0 16, border #E2E8F0 | TL / Phạm Thùy Linh |
| 7 | · · · · · · Data | 312, 757 | 173 × 36 | row gap 12 | TL / Phạm Thùy Linh |
| 7 | · · · · · · Data | 486, 742 | 238 × 65 | col gap 0, pad 14 16 14 32 | thuylinh.vintage@gmail.com / 0975 ••• 563 |
| 7 | · · · · · · Data | 725, 742 | 126 × 65 | col gap 0, pad 12 16 12 16 | Người mua |
| 7 | · · · · · · Data | 852, 742 | 120 × 65 | col gap 0, pad 14 16 14 16 | Hoạt động |
| 7 | · · · · · · Data | 972, 742 | 123 × 65 | col gap 0, pad 24 16 25 16 | 18/06/2024 |
| 7 | · · · · · · Data | 1096, 742 | 142 × 65 | col gap 0, pad 16 | Khóa |
| 6 | · · · · · Row 5: Đặng Tuấn Kiệt | 281, 806 | 974 × 65 | row gap 0, pad 0 0 0 16, bg #FFDAD6@0.20, border #E2E8F0 | TK / Đặng Tuấn Kiệt |
| 7 | · · · · · · Data | 312, 821 | 173 × 36 | row gap 12 | TK / Đặng Tuấn Kiệt |
| 7 | · · · · · · Data | 486, 807 | 238 × 64 | col gap 0, pad 14 16 14 32 | kiet_dang91@hotmail.com / Bị khóa do quá hạn thanh toán |
| 7 | · · · · · · Data | 725, 807 | 126 × 64 | col gap 0, pad 12 16 12 16 | Người bán |
| 7 | · · · · · · Data | 852, 807 | 120 × 64 | col gap 0, pad 21 16 22 16 | Bị khóa |
| 7 | · · · · · · Data | 972, 807 | 123 × 64 | col gap 0, pad 24 16 24 16 | 02/02/2024 |
| 7 | · · · · · · Data | 1096, 807 | 142 × 64 | col gap 0, pad 16 | Mở khóa |
| 4 | · · · Pagination Bar matching S23 | 281, 872 | 974 × 57 | row gap 432, pad 12 16 12 16, bg #F2F3FF@0.80, border #E2E8F0 | Hiển thị 1 - 5 của 12.480 người dùng / 1 |
| 5 | · · · · Container | 1001, 885 | 237 × 32 | row gap 4 | 1 / 2 |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#515F74` | `text-tertiary` | 50 |
| `#131B2E` | `text` | 20 |
| `#FFFFFF` | `surface / text-inverse` | 15 |
| `#434655` | `text-secondary` | 14 |
| `#BA1A1A` | `danger` | 13 |
| `#0D1C2E` | `text` | 9 |
| `#747686` | `text-subtle (sửa #696B7B)` | 8 |
| `#93000A` | `danger-strong` | 7 |
| `#D5E3FC` | `primary-100` | 6 |
| `#1D4ED8` | `primary-600` | 5 |
| `#065F46` | `success` | 5 |
| `#059669` | `success-strong (sửa #047857)` | 5 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 500 | `text-label / .label` | 20 |
| 14px / 600 | `text-body (600)` | 20 |
| 12px / 400 | `text-caption` | 19 |
| 12px / 600 | `text-label / .label` | 9 |
| 16px / 500 | `text-body-lg` | 7 |
| 24px / 700 | `text-h2 / text-timer` | 5 |
| 12px / 700 | `text-label / .label` | 5 |
| 14px / 500 | `text-body` | 5 |
| 14px / 400 | `text-body` | 4 |
| 30px / 700 | `text-h1` | 1 |

## API

- `GET /admin/users?q&status&page&size`
- `PATCH /admin/users/{id} { status: BANNED|ACTIVE, reason }`

Body, DTO, mã lỗi chi tiết ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Khoá: `ConfirmDialog` bắt buộc nhập lý do, nêu rõ hệ quả (huỷ phiên đang mở của họ, vô hiệu bid, huỷ đơn chờ thanh toán).
- Không cho admin tự khoá chính mình.
- Thành công: cập nhật hàng tại chỗ + toast.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Không có nút xoá người dùng.
- Badge `whitespace-nowrap`.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G16**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S20-admin-users.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S20 – Quản lý người dùng (Admin).
Đọc: design/specs/S20-admin-users.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S20-admin-users.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
