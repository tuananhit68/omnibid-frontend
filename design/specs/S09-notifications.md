# S09 – Thông báo (Người mua)

| | |
|---|---|
| Route | `/notifications` |
| Vai trò | User |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S09-notifications.png` (PNG @2x, frame 1280×1480px) |
| Outline đầy đủ | `design/outline/S09.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Xem toàn bộ thông báo, lọc và đánh dấu đã đọc.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb; hàng tiêu đề: icon chuông + h1 "Thông báo hệ thống" bên trái; `outline` "Đánh dấu đã đọc tất cả" + `outline` "Tải lại" bên phải.
2. Card thanh lọc: tabs Tất cả (n) / Chưa đọc (n đỏ) bên trái; chip loại (Tất cả loại · Đấu giá & Đặt giá · Thanh toán đơn hàng · Hệ thống) bên phải.
3. Danh sách `NotificationItem` (card riêng từng mục, gap 8px); mục chưa đọc nền trắng + chấm xanh, đã đọc nền nhạt hơn và chữ `text-secondary`.
4. `Pagination`.

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S09.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 0, 0 | 1280 × 1396 | col gap 0, pad 64 0 0 0, bg #FAF8FF | Trang chủ / Tài khoản của tôi |
| 2 | · Container | 0, 64 | 1280 × 1332 | col gap 0 | Trang chủ / Tài khoản của tôi |
| 3 | · · Top Navigation & Header Context Container | 0, 64 | 1280 × 116 | col gap 0, bg #F2F3FF@0.50 | Trang chủ / Tài khoản của tôi |
| 4 | · · · Container | 0, 64 | 1280 × 116 | col gap 16, pad 16 32 16 32 | Trang chủ / Tài khoản của tôi |
| 5 | · · · · Page Header & Global Actions Bar | 32, 116 | 1216 × 48 | row gap 649, pad 0 0 8 0 | Thông báo hệ thống / Đánh dấu đã đọc tất cả |
| 6 | · · · · · Container | 32, 120 | 251 × 36 | col gap 0, pad 0 0 4 0 | Thông báo hệ thống |
| 7 | · · · · · · Container | 32, 120 | 251 × 32 | row gap 4 | Thông báo hệ thống |
| 8 | · · · · · · · Heading 1 | 59, 120 | 223 × 32 | col gap 0 | Thông báo hệ thống |
| 6 | · · · · · Container | 944, 116 | 303 × 40 | row gap 8 | Đánh dấu đã đọc tất cả / Tải lại |
| 7 | · · · · · · Button – Đánh dấu đã đọc tất cả | 944, 116 | 207 × 40 | row gap 4, pad 0 16 0 16, bg #FFFFFF, r 4, shadow | Đánh dấu đã đọc tất cả |
| 3 | · · Main Viewports: Asymmetric Grid Layout (Feed 6 | 0, 180 | 1280 × 1216 | col gap 0, pad 24 32 24 32 | Tất cả / 8 |
| 5 | · · · · Section - Phân vùng 1: Danh sách thông báo đầy | 32, 204 | 1216 × 1024 | col gap 16 | Tất cả / 8 |
| 6 | · · · · · Controls Container: Status Tabs & Type Filters | 32, 204 | 1216 × 72 | row gap 98, pad 16, bg #FFFFFF, r 8, shadow | Tất cả / 8 |
| 7 | · · · · · · Status Tabs | 48, 220 | 233 × 40 | row gap 4, pad 4, bg #F2F3FF, r 4 | Tất cả / 8 |
| 8 | · · · · · · · Link – Chưa đọc | 155, 224 | 122 × 32 | row gap 6, pad 0 16 0 16, r 4 | Chưa đọc / 3 |
| 6 | · · · · · Vertical Notification Feed Items | 32, 292 | 1216 × 856 | col gap 4 | Bạn đã bị vượt giá tại phiên #AUC-9821 / Bị vượt giá |
| 7 | · · · · · · Article - ITEM 1: Bị vượt giá (Unread) | 32, 292 | 1216 × 103 | row gap 16, pad 16, bg #FFFFFF, r 8, shadow | Bạn đã bị vượt giá tại phiên #AUC-9821 / Bị vượt giá |
| 8 | · · · · · · · Content Body | 104, 308 | 964 × 71 | col gap 4, pad 0 8 0 0 | Bạn đã bị vượt giá tại phiên #AUC-9821 / Bị vượt giá |
| 8 | · · · · · · · Actions Right | 1084, 308 | 147 × 36 | row gap 4 | Đặt giá lại |
| 7 | · · · · · · Article - ITEM 2: Thắng phiên đấu giá (Unread) | 32, 399 | 1216 × 103 | row gap 16, pad 16, bg #FFFFFF, r 8, shadow | Bạn đã thắng phiên đấu giá #AUC-9820! / Trúng đấu giá |
| 8 | · · · · · · · Container | 104, 415 | 893 × 71 | col gap 4, pad 0 8 0 0 | Bạn đã thắng phiên đấu giá #AUC-9820! / Trúng đấu giá |
| 8 | · · · · · · · Container | 1013, 415 | 218 × 36 | row gap 4 | Thanh toán đơn hàng |
| 7 | · · · · · · Article - ITEM 3: Phiên đấu giá đã kết thúc (R | 32, 507 | 1216 × 103 | row gap 16, pad 16, bg #FFFFFF@0.80, r 8, shadow | Phiên đấu giá #AUC-9818 đã kết thúc / Đã kết thúc |
| 8 | · · · · · · · Container | 104, 523 | 986 × 71 | col gap 4, pad 0 8 0 0 | Phiên đấu giá #AUC-9818 đã kết thúc / Đã kết thúc |
| 8 | · · · · · · · Container | 1106, 523 | 125 × 36 | row gap 0 | Xem kết quả |
| 7 | · · · · · · Article - ITEM 4: Đơn hàng đã được tạo, hạn th | 32, 614 | 1216 × 103 | row gap 16, pad 16, bg #FFFFFF, r 8, shadow | Đơn hàng #ORD-8841 đã được tạo thành công / Chờ thanh toán |
| 8 | · · · · · · · Container | 104, 630 | 920 × 71 | col gap 4, pad 0 8 0 0 | Đơn hàng #ORD-8841 đã được tạo thành công / Chờ thanh toán |
| 8 | · · · · · · · Container | 1040, 630 | 191 × 36 | row gap 4 | Thanh toán ngay |
| 7 | · · · · · · Article - ITEM 5: Nhắc thanh toán: còn 24 giờ  | 32, 722 | 1216 × 103 | row gap 16, pad 16, bg #FFFFFF@0.80, r 8, shadow | Nhắc nhở thanh toán: Còn 24 giờ cho đơn #ORD-883 / Khẩn cấp |
| 8 | · · · · · · · Container | 104, 738 | 975 × 71 | col gap 4, pad 0 8 0 0 | Nhắc nhở thanh toán: Còn 24 giờ cho đơn #ORD-883 / Khẩn cấp |
| 8 | · · · · · · · Container | 1095, 738 | 136 × 36 | row gap 0 | Xem đơn hàng |
| 7 | · · · · · · Article - ITEM 6: Kết quả thanh toán (Read) | 32, 829 | 1216 × 103 | row gap 16, pad 16, bg #FFFFFF@0.80, r 8, shadow | Xác nhận kết quả thanh toán đơn #ORD-8835 / Thành công |
| 8 | · · · · · · · Container | 104, 845 | 990 × 71 | col gap 4, pad 0 8 0 0 | Xác nhận kết quả thanh toán đơn #ORD-8835 / Thành công |
| 8 | · · · · · · · Container | 1110, 845 | 121 × 36 | row gap 0 | Xem biên lai |
| 7 | · · · · · · Article - ITEM 7: Cập nhật vận chuyển (Read) | 32, 937 | 1216 × 103 | row gap 16, pad 16, bg #FFFFFF@0.80, r 8, shadow | Cập nhật vận chuyển: Đơn hàng đang được giao / Đang giao hàn |
| 8 | · · · · · · · Container | 104, 953 | 964 × 71 | col gap 4, pad 0 8 0 0 | Cập nhật vận chuyển: Đơn hàng đang được giao / Đang giao hàn |
| 8 | · · · · · · · Container | 1084, 953 | 147 × 36 | row gap 0 | Tra cứu vận đơn |
| 7 | · · · · · · Article - ITEM 8: Báo cáo đã được xử lý (Read) | 32, 1044 | 1216 × 103 | row gap 16, pad 16, bg #FFFFFF@0.80, r 8, shadow | Báo cáo khiếu nại đã được xử lý / Đã phản hồi |
| 8 | · · · · · · · Container | 104, 1060 | 980 × 71 | col gap 4, pad 0 8 0 0 | Báo cáo khiếu nại đã được xử lý / Đã phản hồi |
| 8 | · · · · · · · Container | 1100, 1060 | 131 × 36 | row gap 0 | Xem phản hồi |
| 6 | · · · · · Pagination Bar | 32, 1164 | 1216 × 64 | row gap 408, pad 16, bg #FFFFFF, r 8, shadow | Hiển thị 1 - 8 trong tổng số 8 thông báo / 1 |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#747686` | `text-subtle (sửa #696B7B)` | 35 |
| `#FFFFFF` | `surface / text-inverse` | 27 |
| `#434655` | `text-secondary` | 23 |
| `#131B2E` | `text` | 19 |
| `#0037B0` | `primary-700` | 11 |
| `#F2F3FF` | `surface-subtle` | 7 |
| `#475569` | `neutral` | 7 |
| `#EAEDFF` | `surface-muted` | 5 |
| `#166534` | `success` | 4 |
| `#64748B` | `text-placeholder` | 3 |
| `#1D4ED8` | `primary-600` | 3 |
| `#991B1B` | `danger-strong` | 3 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 400 | `text-caption` | 18 |
| 14px / 400 | `text-body` | 13 |
| 12px / 600 | `text-label / .label` | 12 |
| 14px / 600 | `text-body (600)` | 8 |
| 11px / 600 | `text-caption (Figma <12px – nâng lên)` | 8 |
| 14px / 500 | `text-body` | 6 |
| 16px / 600 | `text-h4` | 5 |
| 16px / 700 | `text-h4` | 3 |
| 11px / 700 | `text-caption (Figma <12px – nâng lên)` | 2 |
| 24px / 700 | `text-h2 / text-timer` | 1 |

## API

- `GET /notifications?isRead&page&size (không lọc theo loại)`
- `GET /notifications/unread-count`
- `PATCH /notifications/read-all`
- `PATCH /notifications/{id}/read`
- `WS /user/queue/notifications (thông báo mới chèn đầu danh sách)`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Map `type` → icon/tông/nút: OUTBID (warning, "Đặt giá lại" → S05) · AUCTION_WON (success, "Thanh toán đơn hàng" → S11) · AUCTION_ENDED (neutral, "Xem kết quả") · ORDER_CREATED (info, "Thanh toán ngay") · PAYMENT_REMINDER (danger, "Xem đơn hàng") · PAYMENT_RESULT (success/danger) · SHIPMENT_UPDATE (info, "Tra cứu vận đơn" → S12) · ORDER_UPDATE · REPORT_RESOLVED ("Xem phản hồi").
- Bấm vào thông báo: đánh dấu đã đọc rồi điều hướng theo `refType`/`refId`.
- Empty theo từng tab.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Nội dung lấy từ `title`/`content` của backend.
- Thời gian hiển thị tương đối ("5 phút trước"), `title` attribute là thời gian đầy đủ.
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

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S09-notifications.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S09 – Thông báo (Người mua).
Đọc: design/specs/S09-notifications.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S09-notifications.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
