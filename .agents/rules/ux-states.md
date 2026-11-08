---
trigger: model_decision
description: Áp dụng khi dựng trang hoặc khối hiển thị dữ liệu, danh sách, bảng, form, nút gửi dữ liệu, thông báo lỗi, trạng thái loading/empty/error, toast, xác nhận hành động.
---

# Trạng thái và phản hồi (Figma thường chỉ vẽ trạng thái "có dữ liệu")

## Bốn trạng thái của mọi khối dữ liệu

| Trạng thái | Cách làm |
| --- | --- |
| Loading lần đầu | Skeleton đúng kích thước khối thật (ảnh, thẻ, hàng bảng) để không nhảy layout. Không dùng spinner toàn trang. |
| Đang tải lại (refetch) | Giữ dữ liệu cũ, hiện chỉ báo nhỏ; không chớp skeleton. |
| Empty | Icon + 1 câu nói rõ tình huống + 1 nút hành động tiếp theo. Mỗi bộ lọc/tab có câu riêng ("Không có phiên phù hợp bộ lọc" khác "Bạn chưa theo dõi phiên nào"). |
| Error | Câu từ `lib/errors.ts` + nút "Thử lại". Lỗi một khối không làm hỏng cả trang. |

## Hành động gửi dữ liệu

- Bấm xong: nút vào `loading` ngay, chặn bấm lặp.
- Thành công: toast ngắn + cập nhật UI tại chỗ (invalidate query liên quan). Không reload trang.
- Thất bại: lỗi gần nơi xảy ra (dưới ô, trong khối, trong modal); giữ nguyên dữ liệu đã nhập.
- Hành động không đảo ngược (huỷ phiên, khoá tài khoản, ẩn sản phẩm, xử lý báo cáo, xác nhận nhận hàng, huỷ đơn): `ConfirmDialog` nói rõ hệ quả; nếu backend cần lý do thì bắt buộc nhập.
- Không dùng `window.alert/confirm`.
- Optimistic update chỉ cho hành động nhẹ (theo dõi phiên, đánh dấu đã đọc), có rollback khi lỗi. Không dùng cho đặt giá và thanh toán.

## Thông báo lỗi

- `lib/errors.ts` map `error.code` → câu tiếng Việt dễ hiểu, nói cách khắc phục. Mã lạ: dùng `error.message` của backend. Lỗi mạng: "Không kết nối được máy chủ. Kiểm tra mạng và thử lại."
- 401: xoá phiên đăng nhập, chuyển `/login?redirect=<đường dẫn hiện tại>`.
- 403: trang "Bạn không có quyền truy cập". 404: trang "Không tìm thấy".
- `VALIDATION_ERROR` có chi tiết theo trường: gắn vào đúng ô bằng `setError` của react-hook-form.

## Định dạng hiển thị (`lib/format.ts`)

- Tiền: `22.000.000 ₫` (`Intl.NumberFormat('vi-VN')`).
- Ngày giờ: `28/10/2026 21:30`, luôn giờ Việt Nam; thời gian tương đối "5 phút trước" kèm `title` là giờ đầy đủ.
- Đếm ngược: `01 giờ 12 phút 40 giây` (> 1 ngày: `2 ngày 4 giờ`).
- Che tên người đặt giá `Tr***g`, che SĐT `0908 ••• 419`.
- Mã hiển thị: `AUC-{id}`, `PRD-{id}`, `ORD-{id}`, `REP-{id}`, `USR-{id}`.
