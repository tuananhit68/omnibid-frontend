---
trigger: model_decision
description: Áp dụng khi làm màn hình hoặc logic về phiên đấu giá, đặt giá, giá sàn, sản phẩm, đơn hàng, thanh toán, vận chuyển, khiếu nại, báo cáo vi phạm, quyền theo vai trò, trang admin.
---

# Quy tắc nghiệp vụ mà giao diện phải tôn trọng

Backend là chốt chặn. Bảng này để frontend **ẩn/khoá đúng nút** và **xử lý đúng mã lỗi**, không để tự kiểm tra thay backend.

## Tài khoản

- Đăng ký: họ tên, email, mật khẩu **≥ 6 ký tự** (đúng quy tắc backend), SĐT và địa chỉ không bắt buộc. Đăng ký xong backend trả token luôn → vào thẳng app.
- `EMAIL_ALREADY_EXISTS`, `INVALID_CREDENTIALS`, `ACCOUNT_BANNED`.

## Vai trò

| Vai trò | Được làm |
| --- | --- |
| Guest | Xem trang chủ, danh sách, chi tiết phiên, lịch sử giá (tên che). Bấm hành động → chuyển `/login?redirect=` |
| User | Vừa mua vừa bán: đặt giá, theo dõi, thanh toán, khiếu nại, báo cáo; đăng sản phẩm, tạo/quản lý phiên, cập nhật vận chuyển đơn của mình |
| Admin | Mọi trang `/admin/*`; khoá/mở tài khoản, ẩn sản phẩm, huỷ phiên/đơn, xử lý báo cáo, quản lý danh mục, xem nhật ký |

Không có vai trò "Người bán" riêng. `middleware.ts` chặn route theo đăng nhập/role; component vẫn kiểm tra để ẩn nút.

## Sản phẩm

- 1–5 ảnh. Sửa/xoá chỉ khi `AVAILABLE`; khoá khi `IN_AUCTION`, `RESERVED`, `SOLD`, `HIDDEN` (bị admin ẩn). Xoá = chuyển `REMOVED`, không xoá cứng.
- Chỉ sản phẩm `AVAILABLE` mới tạo được phiên.

## Phiên đấu giá

- Tạo: giá khởi điểm > 0, bước giá > 0, giá sàn trống hoặc ≥ giá khởi điểm, bắt đầu > hiện tại, 1 giờ ≤ thời lượng ≤ 30 ngày. zod kiểm tra sớm, backend vẫn là chuẩn (`VALIDATION_ERROR`, `PRODUCT_NOT_AVAILABLE`).
- Sửa: chỉ khi `SCHEDULED` (`AUCTION_NOT_EDITABLE`).
- Người bán huỷ: khi `SCHEDULED`, hoặc `ACTIVE` và `bidCount = 0` (`CANNOT_CANCEL`). Admin huỷ được cả khi đã có bid.
- **Giá sàn**: người mua chỉ thấy "Đã đạt / Chưa đạt / Không có giá sàn". Con số chỉ hiện ở S17 (chủ phiên) và admin.
- Kết thúc: `ENDED` (có người thắng, tạo đơn) hoặc `UNSOLD` (không bid hoặc chưa đạt giá sàn). Frontend không tự suy ra.

## Đặt giá

- Không đặt giá phiên của mình, không đặt khi đang dẫn đầu, không rút giá.
- Ẩn khối đặt giá và nói lý do khi: chưa đăng nhập, là chủ phiên, đang dẫn đầu, phiên không `ACTIVE`, tài khoản bị khoá.

## Đơn hàng: dùng `allowedActions`

`GET /orders/{id}` trả `viewerRole` và `allowedActions` (`PAY`, `UPDATE_SHIPPING_INFO`, `CONFIRM_RECEIPT`, `COMPLAIN`, `UPDATE_SHIPMENT`). **Chỉ hiện nút có trong mảng**; không tự suy từ trạng thái. Các quy tắc dưới đây chỉ để viết thông báo và xử lý lỗi.

## Đơn hàng và thanh toán

- Đơn tạo khi phiên `ENDED`, hạn thanh toán = `paymentDeadline` từ API (48 giờ). Không tự tính.
- Thanh toán mô phỏng: `MOCK_CARD`, `MOCK_BANK`, `MOCK_WALLET`; `simulateResult` chỉ hiện khi `NEXT_PUBLIC_DEMO_MODE=true`.
- Mỗi lần bấm "Thanh toán" một `Idempotency-Key` mới (`crypto.randomUUID()`); retry vì lỗi mạng dùng lại key của lần đó.
- Mã lỗi: `ORDER_EXPIRED`, `ORDER_CANCELLED`, `PAYMENT_IN_PROGRESS`, `PAYMENT_RATE_LIMITED` (429, đếm ngược `error.data.retryAfterSeconds`), `VALIDATION_ERROR` khi đơn chưa có địa chỉ/SĐT.
- Thanh toán `FAILED` được thử lại trong hạn. Hết hạn → `EXPIRED`, khoá form.

## Vận chuyển

- Chỉ người bán của đơn (hoặc admin) cập nhật, đúng thứ tự `CREATED → PICKED_UP → IN_TRANSIT → DELIVERED`, mỗi lần một bước kế tiếp (`INVALID_STATUS_TRANSITION`). Không dùng dropdown cho phép chọn bước bất kỳ.
- Người mua xác nhận nhận hàng khi `DELIVERED`, trong `confirmDeadline` (7 ngày); bị chặn khi có khiếu nại đang chờ (`COMPLAINT_PENDING`).

## Báo cáo và khiếu nại

- Lý do báo cáo/khiếu nại 10–2000 ký tự; ghi chú xử lý và lý do thao tác admin ≥ 5 ký tự. `DUPLICATE_PENDING_REPORT` khi đã có báo cáo đang chờ cho cùng đối tượng.
- `VIOLATION`: nhắm vào người dùng hoặc sản phẩm (`reportedUserId` / `reportedProductId`); không tự báo cáo mình hay sản phẩm của mình. `COMPLAINT`: nhắm vào đơn `PAID`/`SHIPPING` chưa quá `confirmDeadline` (`COMPLAINT_WINDOW_CLOSED`).
- Admin xử lý: VIOLATION → `BAN_USER`, `HIDE_PRODUCT`, `CANCEL_AUCTION`, `NONE`; COMPLAINT → `COMPLETE_ORDER`, `CANCEL_ORDER`, `NONE`. Bắt buộc ghi chú.

## Admin

- Không có nút xoá người dùng/sản phẩm/phiên/đơn – chỉ đổi trạng thái.
- Mọi thao tác admin cần `ConfirmDialog` + lý do; backend ghi audit log.
- Không khoá được admin hay chính mình (`CANNOT_BAN_ADMIN`). Danh mục còn sản phẩm không xoá được (`CATEGORY_IN_USE`); slug do backend tự sinh từ tên.
