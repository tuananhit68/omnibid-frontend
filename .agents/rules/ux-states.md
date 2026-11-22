---
trigger: model_decision
description: "Áp dụng khi dựng trang/khối dữ liệu, danh sách, bảng, form, nút gửi, thông báo lỗi, loading/empty/error, toast, xác nhận hành động, định dạng hiển thị."
---
# Trạng thái và phản hồi
| Trạng thái | Cách làm |
|---|---|
| Loading lần đầu | skeleton đúng kích thước khối thật; không spinner toàn trang |
| Refetch | giữ dữ liệu cũ, chỉ báo nhỏ |
| Empty | icon + một câu theo ngữ cảnh + một nút hành động |
| Error | câu từ `lib/errors.ts` + "Thử lại"; lỗi một khối không làm hỏng trang |
- Gửi dữ liệu: nút `loading` ngay, chặn bấm lặp; thành công → toast + invalidate (không reload); thất bại → lỗi gần nơi xảy ra, giữ dữ liệu.
- Hành động không đảo ngược (hủy phiên, khóa/mở khóa, ẩn sản phẩm, hủy đơn, xử lý báo cáo, xác nhận nhận hàng, xóa sản phẩm/ảnh/danh mục, đăng xuất mọi thiết bị khi đổi mật khẩu): `ConfirmDialog` nói rõ hệ quả theo BR; lý do bắt buộc khi API yêu cầu. Không `window.alert/confirm`.
- Optimistic chỉ cho đánh dấu đã đọc thông báo (có rollback). Không cho đặt giá, thanh toán, thao tác admin.
- Lỗi mạng: "Không kết nối được máy chủ. Kiểm tra mạng và thử lại." 403 → "Bạn không có quyền truy cập"; 404 → "Không tìm thấy".
- Định dạng (`lib/format.ts`): tiền `22.000.000 ₫`; ngày giờ `28/10/2026 21:30` giờ VN; thời gian tương đối kèm `title`; đếm ngược `01:12:40` hoặc `2 ngày 4 giờ`; giờ đặt giá `18:45:12.381`; mã hiển thị `AUC-{id}`, `PRD-{id}`, `ORD-{id}`, `REP-{id}`, `USR-{id}`. Tên người đặt giá đã được backend che — không che lại.
