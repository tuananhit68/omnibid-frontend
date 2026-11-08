# S11 – Chi tiết đơn hàng & Thanh toán (Người mua)

| | |
|---|---|
| Route | `/orders/[id]` |
| Vai trò | User (người mua của đơn) |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S11-order-detail-payment.png` (PNG @2x, frame 1280×1019px) |
| Outline đầy đủ | `design/outline/S11.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Thanh toán mô phỏng trước hạn 48 giờ và nhập thông tin giao hàng.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb; tiêu đề h1 "Đơn hàng #ORD-…" + `StatusBadge`; link "← Quay lại danh sách đơn hàng" bên phải.
2. Lưới 2 cột (trái ~ 58%, phải ~ 42%, gap 24px).
3. Trái trên – card "Thông tin tài sản trúng đấu giá": ảnh 180×120; danh mục (`.label`), tên 18/700, dòng meta "Mã phiên AUC-…", người bán; khối giá nền `surface-subtle` (Giá trúng + "Giá cuối cần thanh toán" 36/700 `primary-700`).
4. Trái dưới – card "Thông tin giao hàng": Số điện thoại liên hệ, Địa chỉ nhận hàng (mặc định lấy từ hồ sơ), nút lưu.
5. Phải – card thanh toán (sticky top 88px): "Trạng thái đơn hàng" + chip đếm ngược đỏ "Hạn thanh toán: còn 47:12:08"; "Thời hạn chót"; khối tổng tiền 24/700 `primary-700`; radio phương thức; nút `primary-strong` xl "Thanh toán 38.200.000 ₫" (icon khoá 16px trước chữ). Bổ sung (G11): khối "Lịch sử thanh toán" (lần, phương thức, trạng thái, lý do lỗi, thời gian).

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S11.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 0, 0 | 1280 × 935 | col gap 0, pad 64 0 0 0, bg #FAF8FF | Trang chủ / Đơn hàng của tôi |
| 2 | · Container | 0, 64 | 1280 × 871 | col gap 0 | Trang chủ / Đơn hàng của tôi |
| 3 | · · Section - Top Navigation & Order Identity Bar: | 0, 64 | 1280 × 122 | col gap 0, pad 0 0 24 0 | Trang chủ / Đơn hàng của tôi |
| 4 | · · · Section - Top Navigation & Order Identity Bar | 0, 64 | 1280 × 98 | col gap 0, bg #FFFFFF, shadow | Trang chủ / Đơn hàng của tôi |
| 5 | · · · · Container | 0, 64 | 1280 × 98 | col gap 8, pad 16 32 16 32 | Trang chủ / Đơn hàng của tôi |
| 6 | · · · · · Order Header Row | 32, 108 | 1216 × 38 | row gap 532 | Đơn hàng #ORD-8841 / Trúng đấu giá |
| 7 | · · · · · · Container | 32, 108 | 464 × 38 | row gap 16 | Đơn hàng #ORD-8841 / Trúng đấu giá |
| 8 | · · · · · · · Heading 1 | 32, 108 | 308 × 38 | col gap 0 | Đơn hàng #ORD-8841 |
| 8 | · · · · · · · Background | 356, 113 | 139 × 28 | row gap 6, pad 4 12 4 12, bg #D5E3FC, r 4 | Trúng đấu giá |
| 3 | · · Main Content Layout (Desktop 12-col: 7 cols le | 0, 186 | 1280 × 749 | col gap 0, pad 0 32 0 32 | Thông tin tài sản trúng đấu giá / MÃ PHIÊN: #AUC-2049 |
| 5 | · · · · LEFT COLUMN (~58%) | 32, 186 | 699 × 748 | col gap 24 | Thông tin tài sản trúng đấu giá / MÃ PHIÊN: #AUC-2049 |
| 6 | · · · · · Article - CARD 1: Thông tin tài sản trúng đấu  | 32, 186 | 699 × 366 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Thông tin tài sản trúng đấu giá / MÃ PHIÊN: #AUC-2049 |
| 7 | · · · · · · Container | 56, 210 | 651 × 36 | row gap 180, pad 0 0 8 0 | Thông tin tài sản trúng đấu giá / MÃ PHIÊN: #AUC-2049 |
| 8 | · · · · · · · Container | 56, 210 | 309 × 28 | row gap 4 | Thông tin tài sản trúng đấu giá |
| 7 | · · · · · · Container | 56, 262 | 651 × 266 | row gap 16 | 4 ảnh giám định / ĐỒNG HỒ CỔ & TRANG SỨC |
| 8 | · · · · · · · Thumbnail Image | 56, 262 | 176 × 176 | col gap 0, bg #EAEDFF, r 8 | 4 ảnh giám định |
| 8 | · · · · · · · Asset Details | 248, 262 | 459 × 266 | col gap 0 | ĐỒNG HỒ CỔ & TRANG SỨC / Đồng hồ Thụy Sỹ Chronograph Heritag |
| 6 | · · · · · Article - CARD 2: Form Thông tin giao hàng | 32, 576 | 699 × 358 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Thông tin giao hàng & Nhận bàn giao tài sản / Họ và tên ngườ |
| 7 | · · · · · · Container | 56, 600 | 651 × 32 | row gap 0, pad 0 0 4 0 | Thông tin giao hàng & Nhận bàn giao tài sản |
| 8 | · · · · · · · Container | 56, 600 | 447 × 28 | row gap 4 | Thông tin giao hàng & Nhận bàn giao tài sản |
| 7 | · · · · · · Form | 56, 648 | 651 × 262 | col gap 16 | Họ và tên người nhận / Nguyễn Văn An |
| 8 | · · · · · · · Container | 56, 648 | 651 × 70 | row gap 16 | Họ và tên người nhận / Nguyễn Văn An |
| 8 | · · · · · · · Delivery Address | 56, 734 | 651 × 94 | col gap 6 | Địa chỉ nhận hàng / Số 12, Ngõ 45, Đường Lê Duẩn, Phường Bến |
| 8 | · · · · · · · Delivery Notes | 56, 844 | 651 × 66 | col gap 6 | Ghi chú giao hàng / Giao giờ hành chính, gọi điện trước 15 p |
| 5 | · · · · RIGHT COLUMN (~42%): LIVE SIMULATED PAYMENT CO | 755, 186 | 492 × 349 | col gap 0 | TRẠNG THÁI ĐƠN HÀNG / Hạn thanh toán: còn 47:12:08 |
| 6 | · · · · · Background | 755, 186 | 492 × 349 | col gap 16, pad 24, bg #FFFFFF, r 12 | TRẠNG THÁI ĐƠN HÀNG / Hạn thanh toán: còn 47:12:08 |
| 7 | · · · · · · Overlay+Shadow | 755, 186 | 492 × 349 | bg #FFFFFF@0.00, r 12, shadow |  |
| 7 | · · · · · · Countdown & Deadline Header | 779, 210 | 444 × 64 | col gap 8, pad 0 0 8 0 | TRẠNG THÁI ĐƠN HÀNG / Hạn thanh toán: còn 47:12:08 |
| 8 | · · · · · · · Container | 779, 210 | 444 × 28 | row gap 43 | TRẠNG THÁI ĐƠN HÀNG / Hạn thanh toán: còn 47:12:08 |
| 7 | · · · · · · Total Calculation preview in console | 779, 290 | 444 × 64 | row gap 85, pad 16, bg #F2F3FF, r 8 | Tổng tiền cần chuyển: / 38.200.000 ₫ |
| 8 | · · · · · · · Container | 1048, 306 | 159 × 32 | col gap 0 | 38.200.000 ₫ |
| 7 | · · · · · · Simulated Payment Options (No real bank detail | 779, 370 | 444 × 77 | col gap 8 | Phương thức thanh toán mô phỏng / Cổng thanh toán mô phỏng |
| 8 | · · · · · · · Label | 779, 398 | 444 × 49 | row gap 0, pad 14, bg #FFFFFF, r 8, shadow | Cổng thanh toán mô phỏng / Mặc định |
| 7 | · · · · · · Button – Thanh toán 38.200.000 ₫ | 779, 463 | 444 × 48 | row gap 8, bg #0037B0, r 8, shadow | Thanh toán 38.200.000 ₫ |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#131B2E` | `text` | 20 |
| `#FFFFFF` | `surface / text-inverse` | 17 |
| `#0037B0` | `primary-700` | 10 |
| `#434655` | `text-secondary` | 10 |
| `#747686` | `text-subtle (sửa #696B7B)` | 10 |
| `#475569` | `neutral` | 7 |
| `#F2F3FF` | `surface-subtle` | 4 |
| `#1D4ED8` | `primary-600` | 3 |
| `#FAF8FF` | `bg` | 2 |
| `#94A3B8` | `text-placeholder (sửa #5F6B7F)` | 2 |
| `#57657A` | `text-tertiary` | 2 |
| `#A73400` | `tertiary-600` | 2 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 600 | `text-body (600)` | 15 |
| 14px / 400 | `text-body` | 9 |
| 16px / 400 | `text-body-lg` | 4 |
| 16px / 500 | `text-body-lg` | 4 |
| 20px / 600 | `text-h2 / text-price-lg` | 3 |
| 12px / 600 | `text-label / .label` | 2 |
| 11px / 400 | `text-caption (Figma <12px – nâng lên)` | 2 |
| 14px / 500 | `text-body` | 1 |
| 30px / 700 | `text-h1` | 1 |
| 12px / 400 | `text-caption` | 1 |

## API

- `GET /orders/{id}`
- `PATCH /orders/{id}/shipping-info { shippingAddress, phoneNumber }`
- `GET /orders/{id}/payments (mảng)`
- `Nút hiển thị theo allowedActions của GET /orders/{id}`
- `POST /orders/{id}/payments + header Idempotency-Key { method, simulateResult? }`
- `WS /user/queue/notifications (kết quả PAYMENT_RESULT khi 202 PENDING)`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Mỗi lần bấm Thanh toán sinh `crypto.randomUUID()` mới; retry do lỗi mạng dùng lại key cũ.
- 200 SUCCESS: toast + chuyển khối phải sang trạng thái PAID kèm mã vận đơn và nút "Theo dõi vận chuyển" (S12).
- 200 FAILED: hiện lỗi `failureReason` trong khối, nút đổi thành "Thanh toán lại".
- 202 PENDING / PAYMENT_IN_PROGRESS: khoá nút, hiện "Đang xử lý…", chờ WS hoặc poll `GET /orders/{id}/payments` mỗi 5 giây tối đa 5 phút.
- 429 PAYMENT_RATE_LIMITED: đếm ngược `retryAfterSeconds` trên nút.
- ORDER_EXPIRED / ORDER_CANCELLED: thay khối thanh toán bằng khối trạng thái, ẩn form.
- Đếm ngược về 0: khoá nút, hiện "Đã quá hạn thanh toán" và refetch.
- Chưa có địa chỉ/SĐT: nút thanh toán bị khoá, gợi ý điền thông tin giao hàng.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Hạn = `paymentDeadline` từ API (closed_at + 48h), không tự tính.
- Không có hoàn tiền thật; chữ trên nút phải là "Thanh toán (mô phỏng)" ở chế độ demo.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G2**, **G10**, **G11**, **G12**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S11-order-detail-payment.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S11 – Chi tiết đơn hàng & Thanh toán (Người mua).
Đọc: design/specs/S11-order-detail-payment.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S11-order-detail-payment.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
