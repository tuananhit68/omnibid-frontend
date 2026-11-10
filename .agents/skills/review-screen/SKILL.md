---
name: review-screen
description: Rà một màn hình đã làm theo spec, token, accessibility và nghiệp vụ. Cách gọi: /review-screen S05
---

# /review-screen <ID màn hình>

Rà lại code của màn hình, **không sửa ngay**: lập danh sách vấn đề trước, xếp theo mức độ (P0 chặn demo · P1 sai nghiệp vụ/a11y · P2 lệch Figma · P3 nhỏ), rồi hỏi người dùng có sửa không.

## 1. Màu và phong cách

- [ ] Chỉ dùng màu trong bảng màu Figma, đúng vai trò (hành động `primary-600`, giá tiền `primary-700`, trạng thái theo `StatusBadge`).
- [ ] Có đủ khối, trường, nút, cột theo spec, đúng thứ tự và nhóm thông tin.
- [ ] Chữ dùng bậc trong thang (`text-display`…`text-caption`, `text-price-*`, `text-timer`); font Be Vietnam Pro; chỉ 400/500/600, 700 cho con số và hero.
- [ ] Card phẳng viền `border-brand`, không đổ bóng; tối đa một nút `primary-700` mỗi màn hình.
- [ ] Tìm trong diff: `uppercase`, `tracking-w`, `border-l-`, `border-t-[2-8]` – không còn nhãn chữ hoa, không còn viền màu một bên.
- [ ] Khoảng cách đều theo thang 4px, không có card lồng card thừa.
- [ ] Tìm trong diff: `#[0-9a-fA-F]{3,6}`, `-\[`, `style={{` – không còn giá trị cứng ngoài ngoại lệ có comment.
- [ ] Tái dùng component trong `src/components/ui`, không có bản sao gần giống.
- [ ] Các mục `gaps.md` áp dụng đã xử lý đúng (không có dữ liệu giả).

## 2. Trạng thái

- [ ] Loading là skeleton đúng kích thước; refetch không chớp.
- [ ] Empty có câu riêng theo ngữ cảnh + nút hành động.
- [ ] Error có câu tiếng Việt + "Thử lại"; mọi mã lỗi trong spec đều có câu.
- [ ] Nút gửi có loading, chặn bấm lặp; hành động không đảo ngược có `ConfirmDialog`.

## 3. Accessibility

- [ ] Tab qua hết trang theo thứ tự đọc, focus ring nhìn thấy, không bị header che.
- [ ] Không có `div onClick`; nút icon có `aria-label`; ảnh có `alt`.
- [ ] Form: label hiển thị, `aria-describedby` tới lỗi, focus ô lỗi đầu tiên khi submit.
- [ ] Tương phản đạt (không dùng màu xám gốc Figma cho chữ).
- [ ] Nội dung realtime có `aria-live` phù hợp; badge không chỉ dựa vào màu.
- [ ] Vùng bấm ≥ 44×44px.

## 4. Responsive

- [ ] 375px: không cuộn ngang trang; bảng cuộn trong khung hoặc thành thẻ; cột phụ xếp dọc.
- [ ] 768px và 1280px đúng bảng trong `design/layouts.md` mục 5.
- [ ] Tên dài không vỡ bố cục; badge không xuống dòng.

## 5. Nghiệp vụ và dữ liệu

- [ ] Nút ẩn/hiện đúng vai trò và trạng thái theo `.agents/rules/business-rules.md`.
- [ ] Không có số giá sàn trong trang người mua (kiểm tra cả response được render vào DOM).
- [ ] Không tự đổi trạng thái khi đồng hồ về 0; không tự tính hạn thanh toán.
- [ ] WebSocket unsubscribe khi rời trang; refetch sau khi nối lại.
- [ ] Query key đúng, mutation invalidate đúng.

## 6. Kỹ thuật

- [ ] `npm run lint`, `npm run typecheck`, `npm run build` pass.
- [ ] Không có `console.log`, `any` không cần thiết, code chết, TODO không ghi lý do.
- [ ] `'use client'` chỉ ở component lá cần thiết.

Có thể bổ sung một lượt kiểm tra bằng skill thiết kế theo `.agents/rules/design-skills.md` (chỉ audit, không đổi phong cách).
