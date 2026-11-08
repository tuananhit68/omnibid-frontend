---
trigger: glob
globs: src/**/*.tsx
---

# Accessibility (WCAG 2.2 AA)

Figma không thể hiện accessibility; các yêu cầu dưới đây luôn áp dụng, kể cả khi ảnh Figma "trông khác".

## Màu và chữ

- Tương phản chữ thường ≥ 4.5:1, chữ lớn (≥ 18px đậm hoặc ≥ 24px) và viền điều khiển ≥ 3:1. Token đã được chỉnh để đạt; đừng thay bằng màu gốc Figma.
- Không truyền thông tin chỉ bằng màu: badge có chữ, lỗi có icon + chữ, biểu đồ có nhãn số.
- Chữ đoạn văn không nhỏ hơn 14px; cỡ nhỏ nhất trong app là `text-caption` 12px, chỉ cho meta ngắn.

## Bàn phím và focus

- Mọi thứ bấm được phải là `<button>` hoặc `<a href>`. Cấm `<div onClick>`.
- Thứ tự Tab theo thứ tự đọc. Không dùng `tabIndex` dương.
- Không xoá outline. Focus dùng `focus-visible` (ring 2px `focus`, offset 2px, đã có trong base CSS).
- Header sticky không được che phần tử đang focus: đặt `scroll-padding-top` bằng chiều cao header.
- Có link "Bỏ qua đến nội dung chính" ở đầu mỗi layout.

## Ngữ nghĩa

- Mỗi trang một `<h1>`, heading không nhảy cấp. Layout dùng `<header>`, `<nav aria-label>`, `<main id="main">`, `<aside>`, `<footer>`.
- Ảnh sản phẩm `alt` = tên sản phẩm; ảnh trang trí `alt=""`.
- Breadcrumb: `nav aria-label="Breadcrumb"`, mục cuối `aria-current="page"`.

## Form

- Label luôn hiển thị; placeholder chỉ là ví dụ.
- Trường bắt buộc: dấu `*` + `aria-required`. Lỗi ngay dưới ô, nối bằng `aria-describedby`, `aria-invalid="true"`.
- Khi submit lỗi: focus vào ô lỗi đầu tiên. Không xoá dữ liệu người dùng đã nhập.
- `autocomplete` đúng: `email`, `name`, `tel`, `street-address`, `current-password`, `new-password`.

## Nội dung động

- Giá cập nhật realtime: vùng `aria-live="polite"` đọc "Giá hiện tại X đồng, Y lượt đặt". Không đọc mỗi giây của đồng hồ; chỉ thông báo khi còn 5 phút và 1 phút.
- Kết quả gửi form/toast: `role="status"` hoặc `role="alert"` cho lỗi.
- Badge số trên chuông: `aria-label="Thông báo, 3 chưa đọc"`.

## Chạm và chuyển động

- Vùng bấm ≥ 44×44px; các vùng bấm cạnh nhau cách ≥ 8px.
- Không có tương tác chỉ hoạt động khi hover (tooltip phải mở được bằng focus).
- Tôn trọng `prefers-reduced-motion` (đã có trong base CSS). Animation 150–250ms, chỉ animate `opacity`/`transform`.
