# S09a – Dropdown thông báo (Người mua)

| | |
|---|---|
| Route | `(thành phần của header)` |
| Vai trò | User |
| Layout | Popover gắn vào nút chuông trên header (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S09a-notification-dropdown.png` (PNG @2x, frame 389×500px) |
| Outline đầy đủ | `design/outline/S09a.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Xem nhanh thông báo mới nhất.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Popover rộng 389px, bo 12px, shadow `lg`; header nền `surface-subtle`: icon + "Thông báo" 18/700 + chip đỏ "3 mới", link "Đã đọc tất cả".
2. Tabs gạch chân: Tất cả / Chưa đọc (n).
3. Tối đa 5 mục rút gọn (icon 32px, tiêu đề 14/600, 1 dòng nội dung, thời gian, chấm chưa đọc).
4. Footer: link "Xem toàn bộ thông báo hệ thống →" tới S09.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S09a.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Simulated Dropdown Card | 0, 0 | 389 × 500 | col gap 0, bg #FFFFFF, r 12, shadow | Thông báo / 3 mới |
| 2 | · Quick Micro Tabs | 0, 56 | 389 × 28 | row gap 8, pad 4 16 4 16, bg #FFFFFF | Tất cả / Chưa đọc (3) |
| 2 | · Condensed Dropdown List (4 Items) | 0, 84 | 389 × 376 | col gap 0 | Bị vượt giá: #AUC-9821 / Mức giá mới: 21.500.000 ₫ |
| 3 | · · Item 1 (Outbid) | 0, 84 | 389 × 94 | row gap 8, pad 16, bg #F2F3FF@0.40 | Bị vượt giá: #AUC-9821 / Mức giá mới: 21.500.000 ₫ |
| 4 | · · · Container | 56, 100 | 317 × 62 | col gap 2, pad 0 0 1 0 | Bị vượt giá: #AUC-9821 / Mức giá mới: 21.500.000 ₫ |
| 3 | · · Item 2 (Won Auction) | 0, 178 | 389 × 94 | row gap 8, pad 16, bg #F2F3FF@0.40 | Thắng phiên #AUC-9820! / MacBook Pro 14 M3 Pro (38.200.000 ₫ |
| 4 | · · · Container | 56, 194 | 317 × 62 | col gap 2, pad 0 0 1 0 | Thắng phiên #AUC-9820! / MacBook Pro 14 M3 Pro (38.200.000 ₫ |
| 3 | · · Item 3 (Order Created) | 0, 272 | 389 × 94 | row gap 8, pad 16, bg #F2F3FF@0.40 | Tạo đơn #ORD-8841 / Hạn thanh toán 27/10 20:30 |
| 4 | · · · Container | 56, 288 | 317 × 62 | col gap 2, pad 0 0 1 0 | Tạo đơn #ORD-8841 / Hạn thanh toán 27/10 20:30 |
| 3 | · · Item 4 (Payment Reminder) | 0, 366 | 389 × 94 | row gap 8, pad 16 | Nhắc thanh toán còn 24h / Đơn #ORD-8839 sắp hết hạn nộp tiền |
| 4 | · · · Container | 56, 382 | 317 × 62 | col gap 2, pad 0 0 1 0 | Nhắc thanh toán còn 24h / Đơn #ORD-8839 sắp hết hạn nộp tiền |
| 2 | · Button – Xem toàn bộ thông báo hệ thống | 0, 460 | 389 × 40 | col gap 0, pad 8, bg #F2F3FF | Xem toàn bộ thông báo hệ thống |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#0037B0` | `primary-700` | 8 |
| `#434655` | `text-secondary` | 6 |
| `#131B2E` | `text` | 4 |
| `#747686` | `text-subtle (sửa #696B7B)` | 4 |
| `#FFFFFF` | `surface / text-inverse` | 3 |
| `#F2F3FF` | `surface-subtle` | 2 |
| `#BA1A1A` | `danger` | 1 |
| `#FEF3C7` | `warning-bg` | 1 |
| `#B45309` | `warning` | 1 |
| `#DCFCE7` | `success-bg` | 1 |
| `#166534` | `success` | 1 |
| `#DBEAFE` | `info-bg` | 1 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 400 | `text-caption` | 4 |
| 11px / 400 | `text-caption (Figma <12px – nâng lên)` | 4 |
| 14px / 700 | `text-body (600)` | 3 |
| 12px / 600 | `text-label / .label` | 2 |
| 12px / 700 | `text-label / .label` | 2 |
| 16px / 700 | `text-h4` | 1 |
| 10px / 700 | `text-caption (Figma <12px – nâng lên)` | 1 |
| 14px / 600 | `text-body (600)` | 1 |

## API

- `GET /notifications?size=5`
- `GET /notifications/unread-count`
- `PATCH /notifications/read-all`
- `PATCH /notifications/{id}/read`
- `WS /user/queue/notifications (cập nhật badge số trên chuông)`

Body, DTO, mã lỗi chi tiết ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Badge số trên chuông = số chưa đọc, ẩn khi 0, hiển thị "9+" khi > 9; `aria-label="Thông báo, 3 chưa đọc"`.
- Mở bằng click/Enter, đóng bằng Esc hoặc click ngoài; focus vào mục đầu tiên.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G15**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S09a-notification-dropdown.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S09a – Dropdown thông báo (Người mua).
Đọc: design/specs/S09a-notification-dropdown.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S09a-notification-dropdown.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
