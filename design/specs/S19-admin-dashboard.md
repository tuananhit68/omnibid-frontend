# S19 – Tổng quan (Admin)

| | |
|---|---|
| Route | `/admin` |
| Vai trò | Admin |
| Layout | AdminLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S19-admin-dashboard.png` (PNG @2x, frame 1280×1366px) |
| Outline đầy đủ | `design/outline/S19.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Nhìn tổng quan hoạt động và việc cần xử lý.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả; bên phải nhóm nút khoảng thời gian (Hôm nay / 7 ngày qua / 30 ngày qua / Tuỳ chọn) + `outline` "Làm mới dữ liệu"; vạch kẻ dưới.
2. Hàng 4 KPI có link dưới: Người dùng → S20 · Phiên đang diễn ra → S23 · Đơn chờ thanh toán → S24 · Báo cáo chờ xử lý (danger) → S25.
3. Hàng 2 biểu đồ (gap 24px): cột "Phiên đấu giá theo trạng thái" (5 cột: Sắp diễn ra, Đang diễn ra, Có người thắng, Không đạt giá sàn, Đã huỷ + chú giải + tỷ lệ chốt); đường/vùng "Số lượt đặt giá 7 ngày gần nhất" có tooltip.
4. Card "Hoạt động kiểm duyệt gần đây": bảng 5 dòng mới nhất từ audit log (Thời gian | Quản trị viên | Hành động (badge) | Đối tượng | Lý do) + link "Xem tất cả nhật ký →".

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S19.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 288, 0 | 992 × 1366 | col gap 0, pad 64 0 0 0, bg #FAF8FF | Quản trị hệ thống / Tổng quan |
| 2 | · Container | 288, 64 | 992 × 1233 | col gap 24, pad 32 | Quản trị hệ thống / Tổng quan |
| 3 | · · HorizontalBorder | 320, 96 | 928 × 127 | row gap 8, pad 0 0 24 0, border #E2E7FF | Quản trị hệ thống / Tổng quan |
| 4 | · · · Container | 320, 96 | 475 × 102 | col gap 4 | Quản trị hệ thống / Tổng quan |
| 5 | · · · · Heading 1 | 320, 116 | 475 × 38 | col gap 0 | Tổng quan điều hành hệ thống |
| 5 | · · · · Container | 320, 158 | 475 × 40 | col gap 0 | Theo dõi chỉ số hoạt động, lưu lượng phiên đấu g |
| 4 | · · · Container | 814, 102 | 433 × 90 | col gap 10, pad 0 61 0 0 | Hôm nay / 7 ngày qua |
| 5 | · · · · Background+Border | 814, 102 | 372 × 42 | row gap 0, pad 4, bg #F2F3FF, border #C4C5D7@0.40, r 8 | Hôm nay / 7 ngày qua |
| 5 | · · · · Button – Làm mới dữ liệu | 814, 154 | 157 × 38 | row gap 6, pad 8 14 8 14, bg #FFFFFF, border #C4C5D7@0.60, r 8 | Làm mới dữ liệu |
| 3 | · · Container | 320, 247 | 928 × 179 | row gap 16 | Người dùng / 12.480 |
| 4 | · · · Background+Border+Shadow (×4 lặp lại) | 320, 247 | 220 × 179 | col gap 20, pad 20, bg #FFFFFF, border #C4C5D7@0.50, r 12, shadow | Người dùng / 12.480 |
| 5 | · · · · Container | 341, 268 | 178 × 72 | row gap 17 | Người dùng / 12.480 |
| 5 | · · · · Margin | 341, 360 | 178 × 45 | col gap 0, pad 16 0 0 0 | Quản lý người dùng |
| 6 | · · · · · HorizontalBorder | 341, 376 | 178 × 29 | col gap 0, pad 12 0 0 0, border #E2E7FF | Quản lý người dùng |
| 3 | · · Container | 320, 450 | 928 × 476 | row gap 24 | Phiên đấu giá theo trạng thái / Tổng số 342 phiên được ghi n |
| 4 | · · · Background+Border+Shadow (×2 lặp lại) | 320, 450 | 452 × 476 | bg #FFFFFF, border #C4C5D7@0.50, r 12, shadow | Phiên đấu giá theo trạng thái / Tổng số 342 phiên được ghi n |
| 5 | · · · · HorizontalBorder | 345, 475 | 402 × 61 | row gap 36, pad 0 0 16 0, border #E2E7FF | Phiên đấu giá theo trạng thái / Tổng số 342 phiên được ghi n |
| 6 | · · · · · Container | 345, 475 | 241 × 44 | col gap 2 | Phiên đấu giá theo trạng thái / Tổng số 342 phiên được ghi n |
| 5 | · · · · HorizontalBorder | 345, 824 | 402 × 77 | col gap 8, pad 16 0 0 0, border #E2E7FF | Sắp diễn ra / Đang diễn ra |
| 5 | · · · · Container | 345, 536 | 402 × 288 | col gap 0, pad 24 0 8 0 | 200 / 150 |
| 6 | · · · · · Container | 345, 560 | 402 × 256 | row gap 0 | 200 / 150 |
| 7 | · · · · · · Container | 345, 536 | 402 × 288 | col gap 40, pad 16 0 32 0 | 200 / 150 |
| 7 | · · · · · · Container | 345, 560 | 402 × 256 | row gap 17, pad 16 0 32 36 | 34 / Sắp tới |
| 3 | · · Background+Border+Shadow | 320, 950 | 928 × 318 | col gap 0, bg #FFFFFF, border #C4C5D7@0.50, r 12, shadow | Hoạt động kiểm duyệt gần đây / 24 giờ qua |
| 4 | · · · HorizontalBorder | 321, 951 | 926 × 97 | row gap 203, pad 24, border #E2E7FF | Hoạt động kiểm duyệt gần đây / 24 giờ qua |
| 5 | · · · · Container | 345, 975 | 511 × 48 | col gap 2 | Hoạt động kiểm duyệt gần đây / 24 giờ qua |
| 5 | · · · · Button – Xem tất cả nhật ký | 1067, 985 | 155 × 28 | row gap 4, pad 6 12 6 12, bg #F2F3FF, r 8 | Xem tất cả nhật ký |
| 4 | · · · Container | 321, 1048 | 926 × 178 | col gap 0 | THỜI GIAN / QUẢN TRỊ VIÊN |
| 5 | · · · · Table | 321, 1048 | 1062 × 178 | col gap -1 | THỜI GIAN / QUẢN TRỊ VIÊN |
| 6 | · · · · · Header → Row | 321, 1048 | 1062 × 57 | row gap 0, bg #F2F3FF, border #C4C5D7@0.50 | THỜI GIAN / QUẢN TRỊ VIÊN |
| 7 | · · · · · · Cell | 432, 1048 | 251 × 56 | col gap 0, pad 20 16 21 16 | QUẢN TRỊ VIÊN |
| 7 | · · · · · · Cell | 684, 1048 | 170 × 56 | col gap 0, pad 20 16 21 16 | HÀNH ĐỘNG |
| 7 | · · · · · · Cell | 854, 1048 | 193 × 56 | col gap 0, pad 20 16 21 16 | ĐỐI TƯỢNG / MỤC TIÊU |
| 7 | · · · · · · Cell | 1048, 1048 | 260 × 56 | col gap 0, pad 20 16 21 16 | LÝ DO / GHI CHÚ |
| 6 | · · · · · Body | 321, 1104 | 1062 × 121 | col gap -1 | 28/10 10:42 / TL |
| 7 | · · · · · · Row | 321, 1104 | 1062 × 61 | row gap 16 | 28/10 10:42 / TL |
| 8 | · · · · · · · Data | 448, 1121 | 219 × 28 | row gap 8 | TL / Trần Linh (Quản trị viên) |
| 8 | · · · · · · · Data | 684, 1106 | 170 × 57 | col gap 0, pad 14 16 16 16 | Khóa tài khoản |
| 8 | · · · · · · · Data | 870, 1119 | 161 × 32 | col gap 0 | User @vinh_antiques92 / ID: USR-84192 (Người bán) |
| 7 | · · · · · · Row | 321, 1164 | 1062 × 61 | row gap 16, border #E2E7FF | 28/10 09:15 / HQ |
| 8 | · · · · · · · Data | 448, 1181 | 219 × 28 | row gap 8 | HQ / Hoàng Quân (Quản trị viên) |
| 8 | · · · · · · · Data | 684, 1167 | 170 × 56 | col gap 0, pad 14 16 16 16 | Ẩn sản phẩm |
| 8 | · · · · · · · Data | 870, 1179 | 161 × 32 | col gap 0 | SP #PRD-5104 / Bộ tiền xu Đông Dương 1930 |
| 4 | · · · Overlay+HorizontalBorder | 321, 1226 | 926 × 41 | row gap 488, pad 12 24 12 24, bg #F2F3FF@0.40, border #E2E7FF | Hiển thị 5 thao tác quản trị gần nhất từ tổng số |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#515F74` | `text-tertiary` | 45 |
| `#FFFFFF` | `surface / text-inverse` | 23 |
| `#0037B0` | `primary-700` | 20 |
| `#434655` | `text-secondary` | 20 |
| `#131B2E` | `text` | 18 |
| `#747686` | `text-subtle (sửa #696B7B)` | 12 |
| `#1D4ED8` | `primary-600` | 6 |
| `#F2F3FF` | `surface-subtle` | 5 |
| `#BA1A1A` | `danger` | 5 |
| `#FAF8FF` | `bg` | 3 |
| `#E2E7FF` | `surface-strong / border-brand` | 3 |
| `#D5E3FC` | `primary-100` | 2 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 400 | `text-caption` | 37 |
| 12px / 600 | `text-label / .label` | 25 |
| 12px / 700 | `text-label / .label` | 8 |
| 16px / 500 | `text-body-lg` | 7 |
| 14px / 400 | `text-body` | 5 |
| 14px / 600 | `text-body (600)` | 5 |
| 14px / 500 | `text-body` | 4 |
| 36px / 700 | `text-display / text-price-xl` | 4 |
| 18px / 600 | `text-h3` | 3 |
| 12px / 500 | `text-label / .label` | 3 |

## API

- `GET /admin/statistics?from&to`
- `GET /admin/audit-logs?size=5`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Biểu đồ: dùng thư viện nhẹ (Recharts) hoặc SVG tự vẽ; màu theo token tông trạng thái; luôn có nhãn số trên cột (không chỉ dựa vào màu).
- Bảng/biểu đồ có skeleton riêng.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Nhãn trục X của biểu đồ cột trong Figma bị cắt ("ang diễn r") – xoay hoặc xuống dòng nhãn.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G18**, **G19**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S19-admin-dashboard.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S19 – Tổng quan (Admin).
Đọc: design/specs/S19-admin-dashboard.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S19-admin-dashboard.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
