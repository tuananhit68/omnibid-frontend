# S13 – Modal báo cáo vi phạm & Khiếu nại (Người mua)

| | |
|---|---|
| Route | `(modal, mở từ S02/S05/S12/S06)` |
| Vai trò | User |
| Layout | Modal 448px (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S13-report-complaint-modal.png` (PNG @2x, frame 448×583px) |
| Outline đầy đủ | `design/outline/S13.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Gửi báo cáo vi phạm (sản phẩm/phiên/người dùng) hoặc khiếu nại đơn hàng.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Header: ô icon 40px nền `tertiary-50` (icon cảnh báo), tiêu đề 24/700 ("Khiếu nại đơn hàng" hoặc "Báo cáo vi phạm"), phụ đề "Đơn hàng #ORD-… • OmniBid"; nút đóng `icon`.
2. Body: select "Lý do*" (danh sách lý do theo loại) + nhãn phụ "Bắt buộc"; textarea "Mô tả chi tiết vấn đề*" (≥ 20 ký tự, đếm ký tự); vùng tải bằng chứng (ẩn – G13).
3. Footer có vạch kẻ trên: `secondary` "Huỷ" + `primary-strong` "Gửi khiếu nại" (icon gửi 16px).

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S13.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main Modals Canvas Grid Container → Article | 0, 0 | 448 × 583 | col gap 0, bg #FFFFFF, r 12, shadow | Khiếu nại đơn hàng / Đơn hàng #ORD-8841 • OmniBid |
| 2 | · Container | 0, 77 | 448 × 429 | col gap 16, pad 24 | Lý do khiếu nại * / Bắt buộc |
| 3 | · · Container | 24, 101 | 400 × 59 | col gap 4 | Lý do khiếu nại * / Bắt buộc |
| 4 | · · · Options | 24, 125 | 400 × 35 | row gap 0, pad 8 24 8 12, bg #F2F3FF, r 8 | Hàng không đúng mô tả |
| 3 | · · Container | 24, 176 | 400 × 150 | col gap 4, pad 0 0 6 0 | Mô tả chi tiết vấn đề * / Bắt buộc |
| 4 | · · · Textarea | 24, 200 | 400 × 120 | row gap 0, pad 8 8 70 8, bg #FFFFFF, border #E2E7FF, r 8 | Mặt kính đồng hồ có vết trầy xước không đúng với |
| 5 | · · · · Container | 33, 209 | 382 × 40 | col gap 0 | Mặt kính đồng hồ có vết trầy xước không đúng với |
| 3 | · · Container | 24, 342 | 400 × 140 | col gap 6, pad 2 0 0 0 | Tải lên bằng chứng (ảnh/video) / Tải lên hình ảnh hoặc video |
| 4 | · · · Background | 24, 370 | 400 × 112 | col gap 0, pad 16, bg #F2F3FF, r 8 | Tải lên hình ảnh hoặc video mở kiện hàng / Định dạng JPG, PN |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#131B2E` | `text` | 8 |
| `#FFFFFF` | `surface / text-inverse` | 7 |
| `#747686` | `text-subtle (sửa #696B7B)` | 3 |
| `#434655` | `text-secondary` | 2 |
| `#F2F3FF` | `surface-subtle` | 2 |
| `#0037B0` | `primary-700` | 2 |
| `#FAF8FF` | `bg` | 1 |
| `#FFDBCF` | `tertiary-100` | 1 |
| `#390C00` | `tertiary-800` | 1 |
| `#DAE2FD` | `primary-100` | 1 |
| `#EAEDFF` | `surface-muted` | 1 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 600 | `text-body (600)` | 6 |
| 12px / 400 | `text-caption` | 4 |
| 14px / 400 | `text-body` | 2 |
| 20px / 600 | `text-h2 / text-price-lg` | 1 |

## API

- `POST /reports { reportType: VIOLATION|COMPLAINT, reportedUserId?, reportedProductId?, orderId?, reason }`

Body, DTO, mã lỗi chi tiết ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Thành công: đóng modal + toast "Đã gửi, quản trị viên sẽ xử lý".
- COMPLAINT_WINDOW_CLOSED / VALIDATION_ERROR: lỗi trong modal.
- Đóng khi đang nhập: hỏi xác nhận bỏ nội dung.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Lý do khiếu nại gợi ý: Hàng không đúng mô tả · Hàng hư hỏng · Không nhận được hàng · Khác. Lý do vi phạm: Hàng giả/nhái · Thông tin sai lệch · Gian lận đấu giá · Khác.
- `reason` gửi lên = "<Lý do>: <Mô tả>".
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G13**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S13-report-complaint-modal.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S13 – Modal báo cáo vi phạm & Khiếu nại (Người mua).
Đọc: design/specs/S13-report-complaint-modal.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S13-report-complaint-modal.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
