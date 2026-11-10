# S12 – Theo dõi vận chuyển (Người mua)

| | |
|---|---|
| Route | `/orders/[id]/shipment` |
| Vai trò | User (người mua của đơn) |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S12-shipment-tracking.png` (PNG @2x, frame 1280×739px) |
| Outline đầy đủ | `design/outline/S12.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Theo dõi vận đơn mô phỏng, xác nhận nhận hàng hoặc khiếu nại.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + link "← Quay lại chi tiết đơn hàng".
2. Card lớn: tiêu đề h2 "Theo dõi vận chuyển đơn hàng #ORD-…" + chip trạng thái vận đơn; bên phải "Đơn vị: Vận chuyển mô phỏng".
3. Khối sản phẩm (nền `surface-subtle`): ảnh 40px, mã đơn + chip "Đã thanh toán", tên; bên phải "Giá trúng đấu giá" 20/700.
4. `ShipmentStepper` 4 bước: Đã tạo → Đã lấy hàng → Đang vận chuyển → Đã giao (kèm thời điểm dưới mỗi bước đã qua).
5. Khối "Địa chỉ nhận hàng" nền `surface-subtle`.
6. Footer card: trái "Thời hạn xác nhận: 7 ngày sau khi giao hàng"; phải nút `secondary` "Xác nhận đã nhận hàng" + `danger-soft` "Gửi khiếu nại" (mở S13).
7. Bổ sung: danh sách sự kiện vận chuyển (ShipmentEvent: trạng thái, ghi chú, thời gian) dưới stepper.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S12.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 0, 0 | 1280 × 654 | col gap 0, pad 64 0 0 0, bg #FAF8FF | Trang chủ / Đơn hàng của tôi |
| 2 | · Container | 0, 64 | 1280 × 590 | col gap 24, pad 24 32 24 32 | Trang chủ / Đơn hàng của tôi |
| 3 | · · 5 Separate Sections for the 5 States → Section | 32, 136 | 1216 × 494 | col gap 24, pad 24, bg #FFFFFF, border #E2E7FF, r 12, shadow | Theo dõi vận chuyển đơn hàng #ORD-8841 / Đã tạo vận đơn |
| 4 | · · · HorizontalBorder | 57, 161 | 1166 × 37 | row gap 457, pad 0 0 8 0, border #E2E7FF | Theo dõi vận chuyển đơn hàng #ORD-8841 / Đã tạo vận đơn |
| 5 | · · · · Container | 57, 161 | 516 × 28 | row gap 8 | Theo dõi vận chuyển đơn hàng #ORD-8841 / Đã tạo vận đơn |
| 6 | · · · · · Heading 1 | 57, 161 | 398 × 28 | col gap 0 | Theo dõi vận chuyển đơn hàng #ORD-8841 |
| 4 | · · · Overlay | 57, 222 | 1166 × 93 | row gap 548, pad 16, bg #F2F3FF@0.50, r 8 | Mã đơn hàng: #ORD-8841 / Đã thanh toán |
| 5 | · · · · Container | 73, 238 | 302 × 61 | row gap 16 | Mã đơn hàng: #ORD-8841 / Đã thanh toán |
| 6 | · · · · · Container | 145, 238 | 230 × 61 | col gap 0 | Mã đơn hàng: #ORD-8841 / Đã thanh toán |
| 7 | · · · · · · Margin | 145, 257 | 230 × 42 | col gap 0, pad 2 0 0 0 | Đồng hồ Thụy Sỹ Chronograph Heritage 1972 Automa |
| 8 | · · · · · · · Container | 145, 259 | 230 × 40 | col gap 0 | Đồng hồ Thụy Sỹ Chronograph Heritage 1972 Automa |
| 5 | · · · · Container | 1071, 246 | 135 × 44 | col gap 0 | Giá trúng đấu giá / 38.200.000 ₫ |
| 6 | · · · · · Container | 1071, 262 | 135 × 28 | col gap 0 | 38.200.000 ₫ |
| 4 | · · · Container | 57, 339 | 1166 × 72 | col gap 0, pad 4 0 8 0 | 1 / Đã tạo |
| 5 | · · · · Container | 57, 343 | 1166 × 60 | row gap 8 | 1 / Đã tạo |
| 6 | · · · · · Container (×4 lặp lại) | 57, 343 | 285 × 60 | col gap 0 | 1 / Đã tạo |
| 4 | · · · Background | 57, 435 | 1166 × 101 | col gap 3, pad 16, bg #F2F3FF, r 8 | Địa chỉ nhận hàng / Nguyễn Văn An • 0908 ••• 419 Số 12, Ngõ  |
| 5 | · · · · Container | 73, 473 | 1134 × 46 | col gap 0, pad 0 0 1 0 | Nguyễn Văn An • 0908 ••• 419 Số 12, Ngõ 45, Đườn |
| 4 | · · · HorizontalBorder | 57, 560 | 1166 × 45 | row gap 595, pad 4 0 0 0, border #E2E7FF | Thời hạn xác nhận: 7 ngày sau khi giao hàng / Xác nhận đã nh |
| 5 | · · · · Container | 905, 565 | 317 × 40 | row gap 8 | Xác nhận đã nhận hàng / Gửi khiếu nại |
| 6 | · · · · · Button – Xác nhận đã nhận hàng | 905, 565 | 189 × 40 | row gap 0, pad 10 16 10 16, bg #EAEDFF, r 4 | Xác nhận đã nhận hàng |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#747686` | `text-subtle (sửa #696B7B)` | 13 |
| `#434655` | `text-secondary` | 12 |
| `#0037B0` | `primary-700` | 11 |
| `#FFFFFF` | `surface / text-inverse` | 7 |
| `#131B2E` | `text` | 5 |
| `#EAEDFF` | `surface-muted` | 5 |
| `#475569` | `neutral` | 4 |
| `#94A3B8` | `text-placeholder (sửa #5F6B7F)` | 3 |
| `#F2F3FF` | `surface-subtle` | 3 |
| `#FAF8FF` | `bg` | 2 |
| `#E2E7FF` | `surface-strong / border-brand` | 2 |
| `#BA1A1A` | `danger` | 2 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 600 | `text-body (600)` | 10 |
| 14px / 500 | `text-body` | 8 |
| 14px / 400 | `text-body` | 6 |
| 12px / 700 | `text-label / .label` | 4 |
| 12px / 400 | `text-caption` | 3 |
| 20px / 700 | `text-h2 / text-price-lg` | 2 |
| 14px / 700 | `text-body (600)` | 2 |
| 12px / 600 | `text-label / .label` | 1 |
| 10px / 600 | `text-caption (Figma <12px – nâng lên)` | 1 |
| 12px / 500 | `text-label / .label` | 1 |

## API

- `GET /orders/{id}`
- `GET /orders/{id}/shipment`
- `PATCH /orders/{id}/confirm-receipt`
- `POST /reports { reportType: COMPLAINT, orderId, reason }`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- "Xác nhận đã nhận hàng" chỉ bật khi Shipment DELIVERED; mở `ConfirmDialog` trước khi gửi; thành công → Order COMPLETED, ẩn 2 nút.
- Khi DELIVERED hiện "Hạn xác nhận: dd/MM/yyyy HH:mm" từ `confirmDeadline`.
- "Gửi khiếu nại" chỉ bật khi đơn PAID/SHIPPING và chưa quá `confirmDeadline`; COMPLAINT_WINDOW_CLOSED → thông báo.
- Có khiếu nại PENDING: hiện banner `warning-bg` "Khiếu nại đang được xử lý", khoá nút xác nhận (COMPLAINT_PENDING).
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Không cho người mua đổi trạng thái vận chuyển.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G20**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S12-shipment-tracking.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S12 – Theo dõi vận chuyển (Người mua).
Đọc: design/specs/S12-shipment-tracking.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S12-shipment-tracking.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
