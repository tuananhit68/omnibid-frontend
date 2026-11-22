---
trigger: glob
globs: "src/**/*.tsx"
description: "WCAG 2.2 AA cho mọi component và trang."
---
# Accessibility (WCAG 2.2 AA)
- Tương phản chữ ≥ 4.5:1 (chữ lớn, viền điều khiển ≥ 3:1); token đã chỉnh, không thay bằng màu gốc Figma. Không truyền thông tin chỉ bằng màu.
- Chữ đoạn văn ≥ 14px; nhỏ nhất `text-caption` 12px cho meta.
- Mọi thứ bấm được là `<button>` hoặc `<a href>`; cấm `div onClick`. Không `tabIndex` dương. Không xóa outline; focus `focus-visible` ring 2px. `scroll-padding-top` bằng chiều cao header. Có link "Bỏ qua đến nội dung chính".
- Mỗi trang một `<h1>`, heading không nhảy cấp; landmark `header`, `nav aria-label`, `main id="main"`, `aside`, `footer`. Ảnh sản phẩm `alt` = tên; ảnh trang trí `alt=""`. Breadcrumb `nav aria-label="Breadcrumb"`, mục cuối `aria-current="page"`.
- Form: label luôn hiển thị; bắt buộc có `*` + `aria-required`; lỗi dưới ô nối `aria-describedby`, `aria-invalid`; submit lỗi thì focus ô lỗi đầu; không xóa dữ liệu đã nhập; `autocomplete` đúng (`email`, `name`, `tel`, `street-address`, `current-password`, `new-password`).
- Nội dung động: giá realtime trong `aria-live="polite"` ("Giá hiện tại X đồng, Y lượt đặt"); không đọc từng giây đồng hồ, chỉ báo khi còn 5 phút và 1 phút; toast thành công `role="status"`, lỗi `role="alert"`; badge chuông `aria-label="Thông báo, n chưa đọc"`.
- Vùng bấm ≥ 44×44px, cách nhau ≥ 8px; không tương tác chỉ dựa vào hover; tôn trọng `prefers-reduced-motion`, animation 150–250ms chỉ `opacity`/`transform`.
