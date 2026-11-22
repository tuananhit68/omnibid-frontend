---
name: review-screen
description: Rà một màn hình Omnibid theo hợp đồng API v4, hệ thiết kế (màu khóa), accessibility, nghiệp vụ và chế độ mock. Cách gọi /review-screen order-detail.
---
# /review-screen <id>
Lập danh sách vấn đề trước (P0 chặn demo · P1 sai nghiệp vụ/hợp đồng/a11y · P2 thiết kế · P3 nhỏ), rồi hỏi có sửa không (trong `/build-screen` thì sửa luôn P0–P1).
## 1. Hợp đồng
- [ ] Chỉ endpoint trong `API_SPEC_v4.md`, đúng tham số; type lấy từ `contract.ts` (đúng `RESPONSE_DTO_v4.md`); không gọi endpoint trong `DELETE_LIST_FE.md`.
- [ ] Lỗi đọc `error.code`/`details`; mọi mã lỗi của màn có câu tiếng Việt.
- [ ] Thời gian có offset, gửi `+07:00`; tiền số nguyên.
- [ ] Handler mock trả đúng DTO + mã lỗi như spec; màn chạy được ở cả mock và live (không nhánh code riêng cho mock trong component).
## 2. Thiết kế
- [ ] Mọi trường quan trọng của DTO có chỗ hiển thị hợp lý; không khối cho dữ liệu không tồn tại.
- [ ] Chỉ token màu, đúng vai trò; tối đa một nút `money`; không `uppercase`, viền màu một bên, hex, giá trị arbitrary; không enum thô.
- [ ] Thứ bậc rõ: con số chính nổi bật, hành động chính dễ thấy, trạng thái + lý do khóa hành động được nêu.
- [ ] Tái dùng component; không bản sao gần giống.
## 3. Trạng thái
- [ ] Skeleton đúng kích thước; empty có câu riêng + nút; error có "Thử lại"; nút gửi có loading; ConfirmDialog nêu hệ quả, lý do bắt buộc khi API yêu cầu.
## 4. Vai trò, nghiệp vụ
- [ ] Ẩn/hiện đúng Guest/USER/chủ/người mua/người bán/ADMIN theo spec (dùng `viewerIsSeller`, `viewerIsLeading`, `viewerRole`, `orderId`).
- [ ] Không render số giá sàn khi API không trả; không tự đổi trạng thái khi hạn/đồng hồ về 0.
- [ ] WebSocket unsubscribe khi rời trang, refetch khi nối lại; `Idempotency-Key` mới mỗi lần bấm thanh toán.
## 5. Accessibility, responsive
- [ ] Bàn phím, focus, label/lỗi `aria-describedby`, `aria-live` giá, vùng bấm ≥ 44px, tương phản.
- [ ] 375px không cuộn ngang; bảng thành thẻ hoặc cuộn trong khung; 768/1280 theo DESIGN_SYSTEM §5.
## 6. Kỹ thuật
- [ ] `lint`, `typecheck`, `build` pass; không `console.log`, `any` thừa, code chết; `'use client'` ở lá.
