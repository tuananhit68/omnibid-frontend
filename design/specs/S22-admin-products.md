# S22 – Quản lý sản phẩm (Admin)

| | |
|---|---|
| Route | `/admin/products` |
| Vai trò | Admin |
| Layout | AdminLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S22-admin-products.png` (PNG @2x, frame 1280×1107px) |
| Outline đầy đủ | `design/outline/S22.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Giám sát sản phẩm, ẩn sản phẩm vi phạm.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả.
2. Hàng 4 KPI (Tổng · Đang đấu giá · Có thể đấu giá · Đã ẩn/vi phạm).
3. Card lọc: ô tìm kiếm, select danh mục, select trạng thái, "Đặt lại"; hàng chip lọc nhanh.
4. Bảng: Ảnh & thông tin (ảnh 40px, tên, PRD-id, dòng trạng thái phụ) | Người bán (avatar chữ, tên, USR-id link) | Danh mục (chip) | Giá (khởi điểm/hiện tại/chốt) | Trạng thái | Thao tác ("Ẩn").

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S22.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 256, 0 | 1024 × 1107 | col gap -6, pad 64 0 0 0, bg #FAF8FF | Quản trị hệ thống / Sản phẩm |
| 2 | · Page Main Container | 256, 64 | 1024 × 969 | col gap 0, pad 24 | Quản trị hệ thống / Sản phẩm |
| 3 | · · Header Section:margin | 280, 108 | 976 × 80 | col gap 0, pad 24 0 0 0 | Quản lý sản phẩm / Kiểm soát kho hàng, theo dõi vòng đời tài |
| 4 | · · · Header Section | 280, 132 | 976 × 56 | row gap 0 | Quản lý sản phẩm / Kiểm soát kho hàng, theo dõi vòng đời tài |
| 5 | · · · · Container | 280, 132 | 776 × 56 | col gap 4 | Quản lý sản phẩm / Kiểm soát kho hàng, theo dõi vòng đời tài |
| 6 | · · · · · Heading 1 | 280, 132 | 776 × 32 | col gap 0 | Quản lý sản phẩm |
| 3 | · · 4 Stat Summary Cards:margin | 280, 188 | 976 × 120 | col gap 0, pad 24 0 0 0 | TỔNG SẢN PHẨM / 14.250 |
| 4 | · · · 4 Stat Summary Cards | 280, 212 | 976 × 96 | row gap 16 | TỔNG SẢN PHẨM / 14.250 |
| 5 | · · · · Card 1: Tổng sản phẩm | 280, 212 | 232 × 96 | row gap 27, pad 20, bg #FFFFFF, border #C4C5D7@0.30, r 12, shadow | TỔNG SẢN PHẨM / 14.250 |
| 5 | · · · · Card 2: Đang đấu gi | 528, 212 | 232 × 96 | row gap 42, pad 20, bg #FFFFFF, border #C4C5D7@0.30, r 12, shadow | ĐANG ĐẤU GIÁ / 86 |
| 5 | · · · · Card 3: Có thể đấu gi | 776, 212 | 232 × 96 | row gap 31, pad 20, bg #FFFFFF, border #C4C5D7@0.30, r 12, shadow | CÓ THỂ ĐẤU GIÁ / 1.420 |
| 5 | · · · · Card 4: Đã ẩn / Gỡ vi phạm | 1024, 212 | 232 × 96 | row gap 29, pad 20, bg #FFFFFF, border #C4C5D7@0.30, r 12, shadow | ĐÃ ẨN / VI PHẠM / 12 |
| 3 | · · Toolbar: Search + Selects + Quick Chips:margin | 280, 308 | 976 × 141 | col gap 0, pad 24 0 0 0 | Tìm theo tên sản phẩm, mã SKU hoặc tên/ID người  / Tất cả da |
| 4 | · · · Toolbar: Search + Selects + Quick Chips | 280, 332 | 976 × 117 | col gap 12, pad 16, bg #FFFFFF, border #C4C5D7@0.30, r 12, shadow | Tìm theo tên sản phẩm, mã SKU hoặc tên/ID người  / Tất cả da |
| 5 | · · · · Container | 297, 349 | 942 × 40 | row gap 12 | Tìm theo tên sản phẩm, mã SKU hoặc tên/ID người  / Tất cả da |
| 6 | · · · · · Search Box | 297, 349 | 490 × 40 | col gap 0 | Tìm theo tên sản phẩm, mã SKU hoặc tên/ID người  |
| 7 | · · · · · · Input | 297, 349 | 490 × 40 | row gap 0, pad 10 16 10 40, bg #FAF8FF, border #C4C5D7@0.60, r 8 | Tìm theo tên sản phẩm, mã SKU hoặc tên/ID người  |
| 6 | · · · · · Dropdowns | 799, 349 | 439 × 40 | row gap 10 | Tất cả danh mục / Tất cả trạng thái |
| 7 | · · · · · · Category Filter | 799, 349 | 170 × 40 | col gap 0 | Tất cả danh mục |
| 8 | · · · · · · · Options | 799, 349 | 170 × 40 | row gap 0, pad 0 32 0 12, bg #FAF8FF, border #C4C5D7@0.60, r 8 | Tất cả danh mục |
| 7 | · · · · · · Status Filter | 979, 349 | 160 × 40 | col gap 0 | Tất cả trạng thái |
| 8 | · · · · · · · Options | 979, 349 | 160 × 40 | row gap 0, pad 0 32 0 12, bg #FAF8FF, border #C4C5D7@0.60, r 8 | Tất cả trạng thái |
| 5 | · · · · Quick Filter Chips | 297, 401 | 942 × 31 | row gap 8, pad 4 0 0 0, border #C4C5D7@0.20 | Bộ lọc nhanh: / Tất cả (14.250) |
| 3 | · · Data Table Container:margin | 280, 449 | 976 × 560 | col gap 0, pad 24 0 0 0 | ẢNH & THÔNG TIN SẢN PHẨM / NGƯỜI BÁN (SELLER) |
| 4 | · · · Data Table Container | 280, 473 | 976 × 536 | col gap 0, bg #FFFFFF, border #C4C5D7@0.30, r 12, shadow | ẢNH & THÔNG TIN SẢN PHẨM / NGƯỜI BÁN (SELLER) |
| 5 | · · · · Container | 281, 474 | 974 × 477 | col gap 0 | ẢNH & THÔNG TIN SẢN PHẨM / NGƯỜI BÁN (SELLER) |
| 6 | · · · · · Table | 281, 474 | 1417 × 477 | col gap -1 | ẢNH & THÔNG TIN SẢN PHẨM / NGƯỜI BÁN (SELLER) |
| 7 | · · · · · · Header → Row | 281, 474 | 1417 × 41 | row gap 0, bg #F2F3FF@0.70, border #C4C5D7@0.30 | ẢNH & THÔNG TIN SẢN PHẨM / NGƯỜI BÁN (SELLER) |
| 8 | · · · · · · · Cell | 281, 474 | 450 × 40 | col gap 0, pad 12 16 12 16 | ẢNH & THÔNG TIN SẢN PHẨM |
| 8 | · · · · · · · Cell | 731, 474 | 242 × 40 | col gap 0, pad 12 16 12 16 | NGƯỜI BÁN (SELLER) |
| 8 | · · · · · · · Cell | 973, 474 | 178 × 40 | col gap 0, pad 12 16 12 16 | DANH MỤC |
| 8 | · · · · · · · Cell | 1151, 474 | 197 × 40 | col gap 0, pad 12 16 12 16 | GIÁ KHỞI ĐIỂM / HIỆN TẠI |
| 8 | · · · · · · · Cell | 1348, 474 | 163 × 40 | col gap 0, pad 12 16 12 16 | TRẠNG THÁI |
| 8 | · · · · · · · Cell | 1512, 474 | 185 × 40 | col gap 0, pad 12 16 12 16 | THAO TÁC |
| 7 | · · · · · · Body | 281, 514 | 1417 × 437 | col gap -1 | Đồng hồ Thụy Sỹ Vintage Datejust 1984 / SKU: PRD-6612 |
| 8 | · · · · · · · Row 1: Đang đấu gi | 281, 514 | 1417 × 73 | row gap 16 | Đồng hồ Thụy Sỹ Vintage Datejust 1984 / SKU: PRD-6612 |
| 8 | · · · · · · · Row 2: Có thể đấu gi | 281, 586 | 1417 × 74 | row gap 16, border #E2E7FF | Bình gốm hoa lam thời Khang Hy thế kỷ 18 / SKU: PRD-4489 |
| 8 | · · · · · · · Row 3: Đang giữ ch | 281, 659 | 1417 × 74 | row gap 16, border #E2E7FF | Dây chuyền ngọc lục bảo Colombia 3.8ct / SKU: PRD-7901 |
| 8 | · · · · · · · Row 4: Đã bán | 281, 732 | 1417 × 74 | row gap 16, border #E2E7FF | Tranh sơn dầu "Sương sớm Hàng Bạc" (1998) / SKU: PRD-3180 |
| 8 | · · · · · · · Row 5: Đã ẩn | 281, 805 | 1417 × 74 | row gap 0, pad 0 0 0 16, bg #F2F3FF@0.20, border #E2E7FF | Vang Pháp Chateau Margaux Premier Grand Cru 1961 / SKU: PRD- |
| 8 | · · · · · · · Row 6: Đã g | 281, 878 | 1417 × 73 | row gap 0, pad 0 0 0 16, bg #FEF2F2@0.20, border #E2E7FF | Túi Hermès Birkin 30 Togo Leather (Vi phạm SHTT) / SKU: PRD- |
| 5 | · · · · Pagination Bar | 281, 951 | 974 × 57 | row gap 412, pad 12 16 12 16, bg #F2F3FF@0.40, border #C4C5D7@0.30 | Hiển thị 1 - 6 trong tổng số 14.250 sản phẩm / 1 |
| 6 | · · · · · Container | 992, 964 | 246 × 32 | row gap 6 | 1 / 2 |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#515F74` | `text-tertiary` | 58 |
| `#131B2E` | `text` | 23 |
| `#FFFFFF` | `surface / text-inverse` | 22 |
| `#BA1A1A` | `danger` | 18 |
| `#434655` | `text-secondary` | 18 |
| `#EAEDFF` | `surface-muted` | 16 |
| `#747686` | `text-subtle (sửa #696B7B)` | 15 |
| `#1D4ED8` | `primary-600` | 9 |
| `#0037B0` | `primary-700` | 9 |
| `#FAF8FF` | `bg` | 6 |
| `#FEF2F2` | `danger-bg` | 6 |
| `#F2F3FF` | `surface-subtle` | 6 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 500 | `text-label / .label` | 26 |
| 12px / 400 | `text-caption` | 26 |
| 12px / 700 | `text-label / .label` | 13 |
| 14px / 600 | `text-body (600)` | 11 |
| 12px / 600 | `text-label / .label` | 9 |
| 14px / 500 | `text-body` | 8 |
| 14px / 400 | `text-body` | 7 |
| 16px / 500 | `text-body-lg` | 7 |
| 24px / 700 | `text-h2 / text-timer` | 6 |
| 14px / 700 | `text-body (600)` | 2 |

## API

- `GET /admin/products?status&sellerId&categoryId&page&size`
- `PATCH /admin/products/{id} { status: HIDDEN, reason }`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Ẩn: `ConfirmDialog` nhập lý do, nêu hệ quả (huỷ phiên SCHEDULED/ACTIVE, huỷ đơn PENDING_PAYMENT).
- Bọc bảng `overflow-x-auto`; cột Thao tác sticky phải.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Không có nút xoá.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G5**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S22-admin-products.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S22 – Quản lý sản phẩm (Admin).
Đọc: design/specs/S22-admin-products.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S22-admin-products.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
