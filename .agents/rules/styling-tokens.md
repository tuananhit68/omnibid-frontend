---
trigger: glob
globs: "src/**/*.tsx"
description: "Màu khóa theo token Figma; thang chữ, bề mặt, trang trí theo DESIGN_SYSTEM.md."
---
# Styling
Token ở `src/styles/tokens.css` (bản gốc `design/tokens/tokens.css`), khai báo `@theme` Tailwind v4. **Chỉ màu là bắt buộc giữ từ Figma.** Thang chữ, bo góc, bóng, spacing theo `.agents/skills/omnibid-fe-v4/references/design/DESIGN_SYSTEM.md`; muốn chỉnh thì chỉnh trong `tokens.css`, không rải trong component.

## Dùng
| Nhu cầu | Class |
|---|---|
| Nền | `bg-bg`, `bg-surface`, `bg-surface-subtle`, `bg-surface-muted` |
| Chữ | `text-text`, `text-text-secondary`, `text-text-tertiary`, `text-text-subtle` (`text-text-disabled` chỉ cho disabled) |
| Hành động thường | `bg-primary-600`, `text-primary-600` |
| Tiền, hành động tiền bạc (Đặt giá, Thanh toán) | `text-primary-700`, `bg-primary-700` — tối đa một nút `primary-700` mỗi màn |
| Trạng thái | `success/warning/danger/info/neutral` + `-bg/-border/-strong`, qua `StatusBadge` |
| Cỡ chữ | `text-display`, `text-h1…h4`, `text-body-lg`, `text-body`, `text-small`, `text-label`/`.label`, `text-caption`, `text-price-xl`, `text-price-lg`, `text-timer` + `tabular` |
| Card | `bg-surface border border-border-brand rounded-xl` không bóng; khối phụ `bg-surface-subtle rounded-lg` |
| Bóng | `shadow-md` dropdown, `shadow-lg` modal/drawer, `shadow-xs` mục chọn segmented |
| Mục đang chọn | `bg-primary-50 font-semibold text-primary-700` + `aria-current`/`aria-selected` |

## Cấm
- Hex/rgb/hsl trong className hoặc `style`; giá trị arbitrary `text-[13px]`, `p-[18px]`, `w-[437px]` (ngoại lệ kích thước ảnh cố định có comment nguồn).
- Gradient, glassmorphism, bóng màu, màu ngoài bảng màu; font Inter.
- `uppercase`, `tracking-wide*`, nhãn chữ nhỏ phía trên tiêu đề (eyebrow) — trừ mã vốn viết hoa (`AUC-12`, `VND`).
- Viền màu một bên (`border-l-4`, `border-t-4` có màu) để nhấn. Được giữ gạch chân 2px dưới tab/menu đang chọn.
- `!important`, CSS module riêng, styled-components.
- Hiển thị giá trị enum thô (`PENDING_PAYMENT`) cho người dùng — luôn qua nhãn tiếng Việt trong `types/enums.ts`.

## Gộp class & responsive
- `cn()` (`src/lib/cn.ts`); variant bằng object map.
- Mobile-first, `md:` 768, `lg:` 1024 theo `references/design/DESIGN_SYSTEM.md` §5. Container `mx-auto w-full max-w-(--container-page) px-4 md:px-6 lg:px-8`.
- Bảng bọc `overflow-x-auto`, dưới `md` thành danh sách thẻ khi spec yêu cầu. Badge `whitespace-nowrap`. Input mobile cỡ 16px.
