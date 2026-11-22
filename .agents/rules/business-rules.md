---
trigger: model_decision
description: "Áp dụng khi làm màn hình hoặc logic về phiên, đặt giá, giá sàn, sản phẩm, ảnh, đơn hàng, thanh toán, gửi hàng, báo cáo vi phạm, thông báo, quyền theo vai trò, trang admin."
---
# Quy tắc nghiệp vụ giao diện phải tôn trọng (v4)
Nguồn: `.agents/skills/omnibid-fe-v4/references/backend/BUSINESS_RULES_v4.md`. Backend là chốt chặn; frontend chỉ ẩn/khóa nút để dẫn hướng và xử lý đúng mã lỗi.
- **Vai trò:** Guest xem; USER vừa mua vừa bán; ADMIN chỉ quản trị + hồ sơ của mình (không đặt giá, không tạo sản phẩm/phiên, không thông báo, không xem `/orders/{id}` của người dùng — dùng API admin).
- **Mật khẩu:** ≥ 8 ký tự, có hoa, thường, số. Đổi mật khẩu/đăng xuất làm mọi token mất hiệu lực → về đăng nhập.
- **Sản phẩm:** 1–5 ảnh JPG/PNG/WEBP ≤ 5 MB; sửa/thêm/xóa ảnh chỉ khi AVAILABLE (BR-23); xóa chỉ khi chưa từng lên phiên; HIDDEN là cuối, không bỏ ẩn (BR-16); ảnh chính = ảnh đầu khi tạo.
- **Phiên:** tạo khi sản phẩm AVAILABLE; giá > 0, giá sàn ≥ giá khởi điểm (tùy chọn); bắt đầu ở tương lai; độ dài do backend cấu hình. Sửa chỉ khi SCHEDULED. Người bán hủy khi SCHEDULED hoặc ACTIVE chưa có lượt; Admin hủy bất kỳ lúc nào, lý do bắt buộc.
- **Giá sàn:** người khác chỉ thấy Đã đạt/Chưa đạt/Không có giá sàn; số chỉ hiện cho chủ phiên và Admin.
- **Đặt giá:** không đặt phiên của mình, không đặt khi đang dẫn đầu, không rút; mức tối thiểu = giá hiện tại + bước giá (hoặc giá khởi điểm khi chưa có lượt) — lấy từ backend. Phiên kết thúc đúng giờ, không gia hạn. Kết quả ENDED/UNSOLD do backend quyết (người dẫn đầu bị khóa → UNSOLD, không trao người thứ hai).
- **Đơn:** hạn thanh toán, hạn xác nhận lấy từ API. Thanh toán đồng bộ SUCCESS/FAILED, thử lại không giới hạn trong hạn; cần địa chỉ + SĐT trước. Người bán gửi hàng khi PAID (mã vận đơn tùy chọn); người mua xác nhận khi SHIPPING; quá hạn hệ thống tự hoàn tất. Chỉ Admin hủy đơn PENDING_PAYMENT.
- **Báo cáo:** chọn ≥ 1 đối tượng (sản phẩm/người dùng/đơn) + lý do. Admin chỉ kết luận RESOLVED/REJECTED + ghi chú bắt buộc; khóa/ẩn/hủy là thao tác riêng.
- **Thông báo:** 5 loại (OUTBID, AUCTION_RESULT, AUCTION_CANCELLED, ORDER_UPDATE, REPORT_RESOLVED); tải bằng REST.
- **Không** tự tính kết quả nghiệp vụ để chặn; **không** tự đổi trạng thái khi đồng hồ về 0.
