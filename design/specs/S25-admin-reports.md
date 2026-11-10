# S25 – Báo cáo & Khiếu nại (Admin)

| | |
|---|---|
| Route | `/admin/reports · /admin/reports/[id]` |
| Vai trò | Admin |
| Layout | AdminLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S25-admin-reports.png` (PNG @2x, frame 1280×1540px) |
| Outline đầy đủ | `design/outline/S25.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Xử lý báo cáo vi phạm và khiếu nại đơn hàng.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả.
2. Hàng 3 KPI (Chờ xử lý · Đã giải quyết · Đã huỷ/bác bỏ).
3. Bố cục master–detail: trái (~ 56%) card danh sách: tabs Chờ xử lý/Tất cả, chip lọc loại (Tất cả · Vi phạm · Khiếu nại), ô lọc; bảng Loại (badge + REP-id) | Người báo cáo | Đối tượng (chip đơn/sản phẩm/người dùng/phiên) | Lý do tóm tắt; hàng đang chọn nền `primary-50` + `aria-selected` (không dùng viền trái như Figma).
4. Phải (~ 44%) card chi tiết sticky: tiêu đề "Chi tiết #REP-…" + badge loại + badge trạng thái + thời gian; 1) Các bên liên quan & đơn hàng (2 ô người gửi/đối tượng, khối đơn có nút "Xem đơn"); 2) Nội dung phản ánh (khối `danger-bg` nhạt); 3) Quyết định: select "Hành động xử lý*", hộp `info` "Tác động hệ thống" mô tả hệ quả của hành động đã chọn, textarea "Ghi chú xử lý*"; footer `outline` "Xem lịch sử xử lý" + `primary-strong` "Xác nhận xử lý".

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S25.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 256, 0 | 1024 × 1539 | col gap 0, pad 64 0 0 0, bg #FAF8FF | Quản trị hệ thống / Báo cáo & khiếu nại |
| 2 | · Container | 256, 64 | 1024 × 1403 | col gap 0 | Quản trị hệ thống / Báo cáo & khiếu nại |
| 3 | · · Top Navigation & Header Breadcrumbs Area | 256, 64 | 1024 × 1403 | col gap 24, pad 24 | Quản trị hệ thống / Báo cáo & khiếu nại |
| 4 | · · · Container | 280, 88 | 976 × 192 | col gap 16 | Quản trị hệ thống / Báo cáo & khiếu nại |
| 5 | · · · · Container | 280, 120 | 976 × 54 | row gap 0 | Báo cáo và khiếu nại / Tiếp nhận, kiểm duyệt vi phạm và thẩm |
| 6 | · · · · · Container | 280, 120 | 576 × 54 | col gap 2 | Báo cáo và khiếu nại / Tiếp nhận, kiểm duyệt vi phạm và thẩm |
| 7 | · · · · · · Heading 1 | 280, 120 | 576 × 32 | col gap 0 | Báo cáo và khiếu nại |
| 5 | · · · · Margin | 280, 190 | 976 × 90 | col gap 0, pad 4 0 0 0 | CHỜ XỬ LÝ / 12 |
| 6 | · · · · · Container | 280, 194 | 976 × 86 | row gap 16 | CHỜ XỬ LÝ / 12 |
| 7 | · · · · · · Background+Border+Shadow (×3 lặp lại) | 280, 194 | 314 × 86 | row gap 170, pad 16, bg #FFFFFF, border #E2E8F0, r 12, shadow | CHỜ XỬ LÝ / 12 |
| 5 | · · · · Container | 280, 304 | 566 × 603 | col gap 16 | Chờ xử lý / 12 |
| 6 | · · · · · Background+Border+Shadow | 280, 304 | 566 × 124 | col gap 12, pad 16, bg #FFFFFF, border #E2E8F0, r 12, shadow | Chờ xử lý / 12 |
| 7 | · · · · · · Container | 297, 321 | 532 × 38 | row gap 44 | Chờ xử lý / 12 |
| 8 | · · · · · · · Background | 297, 321 | 216 × 38 | row gap 0, pad 4, bg #F1F5F9, r 8 | Chờ xử lý / 12 |
| 7 | · · · · · · Container | 297, 371 | 532 × 40 | col gap 0 | ORD-9088 / Xóa lọc |
| 8 | · · · · · · · Input | 297, 371 | 532 × 40 | row gap 0, pad 10 96 10 40, bg #F8FAFC, border #E2E8F0, r 8 | ORD-9088 |
| 6 | · · · · · Background+Border+Shadow | 280, 444 | 566 × 463 | col gap 0, bg #FFFFFF, border #E2E8F0, r 12, shadow | LOẠI / NGƯỜI BÁO CÁO |
| 7 | · · · · · · Container | 281, 445 | 564 × 404 | col gap 0 | LOẠI / NGƯỜI BÁO CÁO |
| 8 | · · · · · · · Table | 281, 445 | 923 × 404 | col gap -1, pad 0 0 0 2 | LOẠI / NGƯỜI BÁO CÁO |
| 7 | · · · · · · Background+HorizontalBorder | 281, 849 | 564 × 57 | row gap 108, pad 12 16 12 16, bg #FFFFFF, border #E2E8F0 | Hiển thị 1 - 5 trên 12 báo cáo chờ xử lý / 1 |
| 8 | · · · · · · · Container | 681, 862 | 147 × 32 | row gap 4 | 1 / 2 |
| 5 | · · · · Container | 870, 304 | 409 × 1139 | col gap 0, pad 0 24 0 0 | Chi tiết #REP- 1042 / Khiếu nại |
| 6 | · · · · · Background+Border+Shadow | 870, 304 | 385 × 1139 | col gap 20, pad 20, bg #FFFFFF, border #E2E8F0, r 12, shadow | Chi tiết #REP- 1042 / Khiếu nại |
| 7 | · · · · · · HorizontalBorder | 891, 325 | 343 × 92 | row gap 0, pad 0 0 16 0, border #E2E8F0 | Chi tiết #REP- 1042 / Khiếu nại |
| 8 | · · · · · · · Container | 891, 325 | 331 × 75 | col gap 4 | Chi tiết #REP- 1042 / Khiếu nại |
| 7 | · · · · · · Container | 891, 437 | 343 × 248 | col gap 12 | 1. CÁC BÊN LIÊN QUAN & ĐƠN HÀNG / Người gửi khiếu nại (Người |
| 8 | · · · · · · · Container | 891, 465 | 343 × 102 | row gap 12 | Người gửi khiếu nại (Người mua) / Trần Long |
| 8 | · · · · · · · Background+Border | 891, 579 | 343 × 106 | row gap 12, pad 14, bg #F8FAFC, border #E2E8F0, r 8 | #ORD- 9088 / Đang giao / Chờ xác nhận |
| 7 | · · · · · · Container | 891, 705 | 343 × 304 | col gap 12 | 2. NỘI DUNG PHẢN ÁNH & BẰNG CHỨNG ĐÍNH KÈM / Lý do khiếu nại |
| 8 | · · · · · · · Background+Border | 891, 733 | 343 × 144 | col gap 0, pad 14, bg #F8FAFC, border #E2E8F0, r 8 | Lý do khiếu nại: Người bán cam kết giao hàng hỏa |
| 8 | · · · · · · · Container | 891, 889 | 343 × 120 | col gap 8 | Bằng chứng đính kèm (2 ảnh màn hình): / Chat_unresponsive.pn |
| 7 | · · · · · · HorizontalBorder | 891, 1029 | 343 × 393 | col gap 12, pad 8 0 0 0, border #E2E8F0 | 3. QUYẾT ĐỊNH THẨM ĐỊNH & XỬ LÝ / * Bắt buộc hoàn tất |
| 8 | · · · · · · · Container | 891, 1066 | 343 × 70 | col gap 6 | Hành động xử lý * / Hủy giao dịch |
| 8 | · · · · · · · Background+Border | 891, 1148 | 343 × 85 | row gap 8, pad 12, bg #EFF6FF, border #DBEAFE, r 8 | Tác động hệ thống: Đơn #ORD-9088 sẽ chuyển sang  |
| 8 | · · · · · · · Container | 891, 1245 | 343 × 112 | col gap 6 | Ghi chú xử lý * / Sau khi kiểm tra tiến trình vận chuyển San |
| 8 | · · · · · · · HorizontalBorder | 891, 1369 | 343 × 53 | row gap 12, pad 12 0 0 0, border #E2E8F0 | Xem lịch sử xử lý / Xác nhận xử lý |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#64748B` | `text-placeholder` | 31 |
| `#FFFFFF` | `surface / text-inverse` | 23 |
| `#0037B0` | `primary-700` | 23 |
| `#0F172A` | `text` | 23 |
| `#515F74` | `text-tertiary` | 18 |
| `#94A3B8` | `text-placeholder (sửa #5F6B7F)` | 16 |
| `#475569` | `neutral` | 13 |
| `#B45309` | `warning` | 13 |
| `#334155` | `text-secondary` | 12 |
| `#F1F5F9` | `border-subtle / neutral-bg` | 10 |
| `#F8FAFC` | `surface-subtle` | 10 |
| `#FFFBEB` | `warning-subtle-bg` | 8 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 600 | `text-label / .label` | 32 |
| 12px / 400 | `text-caption` | 23 |
| 14px / 400 | `text-body` | 19 |
| 12px / 700 | `text-label / .label` | 11 |
| 14px / 600 | `text-body (600)` | 9 |
| 12px / 500 | `text-label / .label` | 8 |
| 16px / 500 | `text-body-lg` | 7 |
| 24px / 700 | `text-h2 / text-timer` | 5 |
| 11px / 600 | `text-caption (Figma <12px – nâng lên)` | 3 |
| 14px / 500 | `text-body` | 3 |

## API

- `GET /admin/reports?status&reportType&page&size`
- `PATCH /admin/reports/{id}/resolve { action, note (≥5) } → effects`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Hành động theo loại: VIOLATION → BAN_USER, HIDE_PRODUCT, CANCEL_AUCTION, NONE (bác bỏ); COMPLAINT → COMPLETE_ORDER, CANCEL_ORDER, NONE (bác bỏ).
- Hộp "Tác động hệ thống" đổi chữ theo hành động (lấy từ quy tắc nghiệp vụ trong báo cáo phân tích).
- Báo cáo đã xử lý / INVALID_STATUS_TRANSITION: chuyển chi tiết sang chỉ đọc + toast "Báo cáo đã được xử lý".
- Mobile/tablet: chi tiết mở thành trang riêng `/admin/reports/[id]`.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Bắt buộc ghi chú trước khi xác nhận; `ConfirmDialog` lần cuối cho BAN_USER và CANCEL_ORDER.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G14**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S25-admin-reports.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S25 – Báo cáo & Khiếu nại (Admin).
Đọc: design/specs/S25-admin-reports.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S25-admin-reports.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
