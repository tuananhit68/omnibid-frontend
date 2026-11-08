---
trigger: glob
globs: src/**/*.tsx
---

# Styling: màu theo Figma, kiểu chữ và trang trí theo style-overrides

Token nằm ở `src/styles/tokens.css` (copy từ `design/tokens/tokens.css`), khai báo bằng `@theme` của Tailwind v4 nên tự sinh class. **Màu là thứ duy nhất bắt buộc giống Figma.** Font, thang chữ, bo góc, bóng, spacing là khung đề xuất; được chỉnh trong `tokens.css` (không chỉnh rải rác trong component) và báo lại khi chỉnh.

## Được dùng

| Nhu cầu | Class | Ghi chú |
| --- | --- | --- |
| Nền trang / card / ô nhập | `bg-bg`, `bg-surface`, `bg-surface-subtle`, `bg-surface-muted` | |
| Chữ | `text-text`, `text-text-secondary`, `text-text-tertiary`, `text-text-subtle` | `text-text-disabled` chỉ cho trạng thái disabled |
| Hành động thường | `bg-primary-600`, `text-primary-600` | nút chính, link, nav active |
| Tiền và hành động tiền bạc | `text-primary-700`, `bg-primary-700` | giá tiền, nút Đặt giá, Thanh toán |
| Trạng thái | `success`, `warning`, `danger`, `info`, `neutral` + hậu tố `-bg`, `-border`, `-strong` | qua `StatusBadge`, không tự ghép |
| Cỡ chữ | `text-display`, `text-h1`…`text-h4`, `text-body-lg`, `text-body` (mặc định 15/24), `text-small`, `text-label`, `text-caption` | đã kèm line-height và độ đậm; bảng đầy đủ ở `design/style-overrides.md` mục 3 |
| Con số | `text-price-xl`, `text-price-lg`, `text-timer` + `tabular` | giá chi tiết phiên, giá trên thẻ, đồng hồ |
| Nhãn phụ (thay nhãn chữ hoa của Figma) | `label` | 13px, 500, `text-tertiary`, viết thường kiểu câu |
| Hàng/mục đang chọn | `bg-primary-50` + `font-semibold` | kèm `aria-selected`/`aria-current` |
| Bo góc | `rounded-sm` 6 · `rounded-md` 8 (nút, ô nhập) · `rounded-lg` 10 (cỡ xl, thumbnail) · `rounded-xl` 12 (card) · `rounded-2xl` 16 (modal) · `rounded-full` | |
| Card | `bg-surface border border-border-brand rounded-xl` | **không** đổ bóng; khối phụ bên trong `bg-surface-subtle rounded-lg` |
| Bóng | `shadow-md` (dropdown, popover), `shadow-lg` (modal, drawer), `shadow-xs` (mục chọn trong segmented) | không dùng cho card |
| Spacing | thang Tailwind gốc 4px: `gap-2`=8, `p-4`=16, `p-6`=24, `gap-8`=32 | |
| Số tiền, đồng hồ | thêm class `tabular` | chữ số không nhảy |

## Cấm

- Hex/rgb/hsl trong className hoặc style: `bg-[#1D4ED8]`, `style={{ color: '#fff' }}`.
- Giá trị arbitrary: `text-[13px]`, `p-[18px]`, `w-[437px]`. Nếu Figma có số lẻ, làm tròn về bậc gần nhất của thang 4px. Ngoại lệ được phép: kích thước ảnh cố định ghi trong spec (vd `size-[76px]` cho thumbnail) – ghi comment nguồn spec.
- Màu xám Figma `#747686`, `#94A3B8` cho chữ thường (không đạt tương phản) – dùng `text-text-subtle`, `text-text-placeholder`.
- Gradient, glassmorphism, bóng màu, màu mới ngoài bảng màu.
- Font Inter. Font là Be Vietnam Pro qua `--font-sans`.
- `uppercase`, `tracking-wide`, `tracking-wider`, `tracking-widest`; nhãn chữ nhỏ đặt phía trên tiêu đề (eyebrow). Ngoại lệ: mã vốn viết hoa như `AUC-9821`, `VND`.
- Viền màu một bên để nhấn: `border-l-2/4` hoặc `border-t-2/4` có màu trên card, hàng bảng, hộp thông báo. Được giữ: gạch chân 2px dưới tab/menu đang chọn.
- `!important`, CSS module riêng cho từng component, styled-components.

## Gộp class

Dùng `cn()` (clsx + tailwind-merge) trong `src/lib/cn.ts` để gộp class có điều kiện. Variant của component khai báo bằng object map, không nối chuỗi rải rác.

```tsx
const variants = {
  primary: 'bg-primary-600 text-text-inverse hover:bg-primary-700',
  secondary: 'bg-surface-muted text-text hover:bg-surface-strong',
} as const;
```

## Responsive (Figma chỉ có 1280px)

- Viết mobile-first: class gốc cho mobile, thêm `md:` (768) và `lg:` (1024) cho màn lớn hơn. Theo bảng trong `design/layouts.md` mục 5.
- Container trang: `mx-auto w-full max-w-(--container-page) px-4 md:px-6 lg:px-8`.
- Không dùng chiều rộng cố định bằng px cho khối bố cục; dùng grid/flex + `min-w-0`.
- Bảng luôn bọc trong `overflow-x-auto`; dưới `md` chuyển sang danh sách thẻ nếu spec yêu cầu.
- Badge và chip: `whitespace-nowrap`. Tên sản phẩm dài: `line-clamp-2` hoặc `truncate` + `title`.
- Input trên mobile cỡ chữ 16px để iOS không tự phóng to.
