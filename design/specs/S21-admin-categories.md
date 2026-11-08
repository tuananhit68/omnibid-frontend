# S21 – Quản lý danh mục (Admin)

| | |
|---|---|
| Route | `/admin/categories` |
| Vai trò | Admin |
| Layout | AdminLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S21-admin-categories.png` (PNG @2x, frame 1280×1244px) |
| Outline đầy đủ | `design/outline/S21.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Quản lý danh mục.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả + nút `primary` "+ Thêm danh mục".
2. Hàng 4 KPI (chỉ giữ chỉ số có dữ liệu).
3. Card lọc: ô tìm kiếm tên/slug, select sắp xếp, nút làm mới.
4. Bảng: Biểu tượng (ô 32px) | Tên danh mục | Slug (chip mono) | Số lượng sản phẩm | Thao tác (`outline` sm "Sửa", `danger-soft` sm "Xoá").

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S21.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 256, 0 | 1024 × 1244 | col gap -15, pad 64 0 0 0, bg #FAF8FF | Quản trị hệ thống / Danh mục |
| 2 | · Container | 256, 64 | 1024 × 1123 | col gap 24, pad 32 24 32 24 | Quản trị hệ thống / Danh mục |
| 3 | · · Breadcrumb & Header Bar | 280, 96 | 976 × 74 | row gap 149 | Quản trị hệ thống / Danh mục |
| 4 | · · · Container | 280, 96 | 610 × 74 | col gap 2 | Quản trị hệ thống / Danh mục |
| 5 | · · · · Heading 1 | 280, 114 | 610 × 34 | col gap 0, pad 2 0 0 0 | Quản lý danh mục |
| 4 | · · · Button – Thêm danh mục | 1096, 113 | 159 × 40 | row gap 8, pad 0 16 0 16, bg #1D4ED8, r 8, shadow | Thêm danh mục |
| 3 | · · Stat Summary Cards (S23 Card Styling with S21  | 280, 194 | 976 × 110 | row gap 16 | DANH MỤC HOẠT ĐỘNG / 07 / 08 |
| 4 | · · · Background+Border (×4 lặp lại) | 280, 194 | 232 × 110 | row gap 0, pad 20, bg #FFFFFF, border #E2E8F0, r 12 | DANH MỤC HOẠT ĐỘNG / 07 / 08 |
| 3 | · · Filter Toolbar (S23 layout & style) | 280, 328 | 976 × 72 | row gap 12, pad 16, bg #FFFFFF, border #E2E8F0, r 12 | Tìm kiếm tên danh mục, slug... / Trạng thái: |
| 4 | · · · Container | 297, 345 | 385 × 38 | col gap 0 | Tìm kiếm tên danh mục, slug... |
| 5 | · · · · Input | 297, 345 | 385 × 38 | row gap 0, pad 9 16 10 36, bg #FAF8FF, border #C4C5D7@0.40, r 8 | Tìm kiếm tên danh mục, slug... |
| 4 | · · · Container | 694, 345 | 544 × 37 | row gap 10 | Trạng thái: / Đang hiển thị |
| 5 | · · · · Container | 694, 345 | 201 × 37 | row gap 6 | Trạng thái: / Đang hiển thị |
| 6 | · · · · · Options | 761, 345 | 134 × 37 | col gap 0, pad 8 28 8 16, bg #FAF8FF, border #C4C5D7@0.40, r 8 | Đang hiển thị |
| 5 | · · · · Container | 905, 345 | 293 × 37 | row gap 6 | Sắp xếp: / Số lượng sản phẩm giảm dần |
| 6 | · · · · · Options | 961, 345 | 237 × 37 | col gap 0, pad 8 28 8 16, bg #FAF8FF, border #C4C5D7@0.40, r 8 | Số lượng sản phẩm giảm dần |
| 3 | · · Data Table Card (S23 structure) | 280, 424 | 976 × 731 | col gap 0, bg #FFFFFF, border #E2E8F0, r 12 | BIỂU TƯỢNG / TÊN DANH MỤC |
| 4 | · · · Table | 281, 425 | 974 × 672 | col gap -1 | BIỂU TƯỢNG / TÊN DANH MỤC |
| 5 | · · · · Header → Row | 281, 425 | 974 × 61 | row gap 0, bg #FAF8FF, border #E2E8F0 | BIỂU TƯỢNG / TÊN DANH MỤC |
| 6 | · · · · · Cell | 384, 425 | 249 × 60 | col gap 0, pad 22 16 23 16 | TÊN DANH MỤC |
| 6 | · · · · · Cell | 633, 425 | 167 × 60 | col gap 0, pad 22 16 23 16 | SLUG ĐỊNH DANH |
| 6 | · · · · · Cell | 801, 425 | 158 × 60 | col gap 0, pad 14 16 14 16 | SỐ LƯỢNG SẢN PHẨM |
| 6 | · · · · · Cell | 1068, 425 | 162 × 60 | col gap 0, pad 22 16 23 16 | THAO TÁC |
| 5 | · · · · Body | 281, 485 | 974 × 611 | col gap -1 | Đồng hồ cao cấp / Patek Philippe, Rolex, Audemars Piguet |
| 6 | · · · · · Row 1: Đồng hồ cao cấp | 281, 485 | 974 × 81 | row gap 0, pad 0 16 0 0 | Đồng hồ cao cấp / Patek Philippe, Rolex, Audemars Piguet |
| 7 | · · · · · · Data | 384, 500 | 233 × 52 | col gap 0, pad 0 0 0 16 | Đồng hồ cao cấp / Patek Philippe, Rolex, Audemars Piguet |
| 8 | · · · · · · · Container | 400, 520 | 217 × 32 | col gap 0 | Patek Philippe, Rolex, Audemars Piguet |
| 7 | · · · · · · Data | 617, 485 | 183 × 81 | col gap 0, pad 34 16 30 32 | dong-ho-cao-cap |
| 7 | · · · · · · Data | 801, 485 | 158 × 81 | col gap 0, pad 20 16 20 16 | 4.120 sản phẩm |
| 8 | · · · · · · · Background | 817, 506 | 124 × 40 | row gap 6, pad 4 10 4 10, bg #D5E3FC, r 4 | 4.120 sản phẩm |
| 7 | · · · · · · Data | 1068, 510 | 146 × 32 | row gap 6, pad 0 0 0 16 | Sửa |
| 6 | · · · · · Row 2: Đồ cổ & Gốm s | 281, 565 | 974 × 70 | row gap 0, pad 0 16 0 0, border #E2E8F0 | Đồ cổ & Gốm sứ / Cổ vật triều Nguyễn, Minh, Thanh |
| 7 | · · · · · · Data | 384, 583 | 233 × 36 | col gap 0, pad 0 0 0 16 | Đồ cổ & Gốm sứ / Cổ vật triều Nguyễn, Minh, Thanh |
| 7 | · · · · · · Data | 617, 566 | 183 × 69 | col gap 0, pad 28 16 24 32 | do-co-gom-su |
| 7 | · · · · · · Data | 801, 566 | 158 × 69 | col gap 0, pad 14 16 14 16 | 2.850 sản phẩm |
| 8 | · · · · · · · Background | 817, 581 | 124 × 40 | row gap 6, pad 4 10 4 10, bg #D5E3FC, r 4 | 2.850 sản phẩm |
| 7 | · · · · · · Data | 1068, 585 | 146 × 32 | row gap 6, pad 0 0 0 16 | Sửa |
| 6 | · · · · · Row 3: Tranh nghệ thuật | 281, 634 | 974 × 70 | row gap 0, pad 0 16 0 0, border #E2E8F0 | Tranh nghệ thuật / Sơn mài, sơn dầu, tranh lụa đương đại |
| 7 | · · · · · · Data | 384, 652 | 233 × 36 | col gap 0, pad 0 0 0 16 | Tranh nghệ thuật / Sơn mài, sơn dầu, tranh lụa đương đại |
| 7 | · · · · · · Data | 617, 635 | 183 × 69 | col gap 0, pad 28 16 24 32 | tranh-nghe-thuat |
| 7 | · · · · · · Data | 801, 635 | 158 × 69 | col gap 0, pad 14 16 14 16 | 2.310 sản phẩm |
| 8 | · · · · · · · Background | 817, 650 | 124 × 40 | row gap 6, pad 4 10 4 10, bg #D5E3FC, r 4 | 2.310 sản phẩm |
| 7 | · · · · · · Data | 1068, 654 | 146 × 32 | row gap 6, pad 0 0 0 16 | Sửa |
| 6 | · · · · · Row 4: Trang sức quý hiếm | 281, 703 | 974 × 82 | row gap 0, pad 0 16 0 0, border #E2E8F0 | Trang sức quý hiếm / Kim cương kiểm định GIA, ngọc bích tự n |
| 7 | · · · · · · Data | 384, 719 | 233 × 52 | col gap 0, pad 0 0 0 16 | Trang sức quý hiếm / Kim cương kiểm định GIA, ngọc bích tự n |
| 8 | · · · · · · · Container | 400, 739 | 217 × 32 | col gap 0 | Kim cương kiểm định GIA, ngọc bích tự nhiên |
| 7 | · · · · · · Data | 617, 704 | 183 × 81 | col gap 0, pad 24 16 20 32 | trang-suc-quy- / hiem |
| 7 | · · · · · · Data | 801, 704 | 158 × 81 | col gap 0, pad 20 16 20 16 | 1.940 sản phẩm |
| 8 | · · · · · · · Background | 817, 725 | 124 × 40 | row gap 6, pad 4 10 4 10, bg #D5E3FC, r 4 | 1.940 sản phẩm |
| 7 | · · · · · · Data | 1068, 729 | 146 × 32 | row gap 6, pad 0 0 0 16 | Sửa |
| 6 | · · · · · Row 5: Đồ hiệu & Túi xách | 281, 784 | 974 × 70 | row gap 0, pad 0 16 0 0, border #E2E8F0 | Đồ hiệu & Túi xách / Hermès Birkin, Kelly, Chanel Vintage |
| 7 | · · · · · · Data | 384, 802 | 233 × 36 | col gap 0, pad 0 0 0 16 | Đồ hiệu & Túi xách / Hermès Birkin, Kelly, Chanel Vintage |
| 7 | · · · · · · Data | 617, 785 | 183 × 69 | col gap 0, pad 28 16 24 32 | do-hieu-tui-xach |
| 7 | · · · · · · Data | 801, 785 | 158 × 69 | col gap 0, pad 14 16 14 16 | 1.480 sản phẩm |
| 8 | · · · · · · · Background | 817, 800 | 124 × 40 | row gap 6, pad 4 10 4 10, bg #D5E3FC, r 4 | 1.480 sản phẩm |
| 7 | · · · · · · Data | 1068, 804 | 146 × 32 | row gap 6, pad 0 0 0 16 | Sửa |
| 6 | · · · · · Row 6: Rượu vang & Xì g | 281, 853 | 974 × 82 | row gap 0, pad 0 16 0 0, border #E2E8F0 | Rượu vang & Xì gà / Bordeaux Grand Cru, Macallan, Cohiba Beh |
| 7 | · · · · · · Data | 384, 869 | 233 × 52 | col gap 0, pad 0 0 0 16 | Rượu vang & Xì gà / Bordeaux Grand Cru, Macallan, Cohiba Beh |
| 8 | · · · · · · · Container | 400, 889 | 217 × 32 | col gap 0 | Bordeaux Grand Cru, Macallan, Cohiba Behike |
| 7 | · · · · · · Data | 617, 854 | 183 × 81 | col gap 0, pad 34 16 30 32 | ruou-vang-xi-ga |
| 7 | · · · · · · Data | 801, 854 | 158 × 81 | col gap 0, pad 28 16 28 16 | 950 sản phẩm |
| 7 | · · · · · · Data | 1068, 879 | 146 × 32 | row gap 6, pad 0 0 0 16 | Sửa |
| 6 | · · · · · Row 7: Xe cổ điển | 281, 934 | 974 × 82 | row gap 0, pad 0 16 0 0, border #E2E8F0 | Xe cổ điển / Porsche 911 (1974), Mercedes Gullwing, Vespa |
| 7 | · · · · · · Data | 384, 950 | 233 × 52 | col gap 0, pad 0 0 0 16 | Xe cổ điển / Porsche 911 (1974), Mercedes Gullwing, Vespa |
| 8 | · · · · · · · Container | 400, 970 | 217 × 32 | col gap 0 | Porsche 911 (1974), Mercedes Gullwing, Vespa |
| 7 | · · · · · · Data | 617, 935 | 183 × 81 | col gap 0, pad 34 16 30 32 | xe-co-dien |
| 7 | · · · · · · Data | 801, 935 | 158 × 81 | col gap 0, pad 28 16 28 16 | 600 sản phẩm |
| 7 | · · · · · · Data | 1068, 960 | 146 × 32 | row gap 6, pad 0 0 0 16 | Sửa |
| 6 | · · · · · Row 8: Tiền xu & Tem thư hiếm | 281, 1015 | 974 × 81 | row gap 0, pad 0 16 0 0, border #E2E8F0 | Tiền xu & Tem thư hiếm / Danh mục vừa tạo, chưa tiếp nhận lô |
| 7 | · · · · · · Data | 384, 1030 | 233 × 52 | col gap 0, pad 0 0 0 16 | Tiền xu & Tem thư hiếm / Danh mục vừa tạo, chưa tiếp nhận lô |

_(Bảng rút gọn 70/76 khối; xem outline để có đủ.)_

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#515F74` | `text-tertiary` | 60 |
| `#131B2E` | `text` | 33 |
| `#0037B0` | `primary-700` | 28 |
| `#FFFFFF` | `surface / text-inverse` | 18 |
| `#747686` | `text-subtle (sửa #696B7B)` | 18 |
| `#EAEDFF` | `surface-muted` | 18 |
| `#0D1C2E` | `text` | 15 |
| `#EFF6FF` | `surface-info` | 10 |
| `#D5E3FC` | `primary-100` | 8 |
| `#F2F3FF` | `surface-subtle` | 8 |
| `#FAF8FF` | `bg` | 7 |
| `#434655` | `text-secondary` | 4 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 500 | `text-label / .label` | 25 |
| 12px / 400 | `text-caption` | 22 |
| 14px / 600 | `text-body (600)` | 10 |
| 12px / 600 | `text-label / .label` | 10 |
| 16px / 500 | `text-body-lg` | 7 |
| 24px / 700 | `text-h2 / text-timer` | 6 |
| 12px / 700 | `text-label / .label` | 6 |
| 14px / 400 | `text-body` | 5 |
| 14px / 500 | `text-body` | 1 |
| 16px / 600 | `text-h4` | 1 |

## API

- `GET /admin/categories`
- `POST /admin/categories { name, iconUrl? } (slug backend tự sinh)`
- `PUT /admin/categories/{id}`
- `DELETE /admin/categories/{id}`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Thêm/Sửa trong modal (style S13): tên*, slug* (tự sinh từ tên, bỏ dấu tiếng Việt, cho sửa), icon.
- Xoá danh mục còn sản phẩm: backend RESTRICT → hiện lỗi "Danh mục còn sản phẩm, không thể xoá"; nút xoá khoá sẵn khi `productCount > 0` nếu có số.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G17**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S21-admin-categories.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S21 – Quản lý danh mục (Admin).
Đọc: design/specs/S21-admin-categories.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S21-admin-categories.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
