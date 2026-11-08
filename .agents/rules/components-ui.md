---
trigger: glob
globs: src/components/**
---

# Component giao diện (`src/components/ui`, `src/components/layout`)

Danh sách, số đo và variant đầy đủ ở `design/components.md`. Rule này nói cách viết.

## Nguyên tắc

- Component UI **thuần giao diện**: chỉ nhận props, không gọi API, không đọc store, không import `src/features/*`.
- Một component một file, tên PascalCase, export có tên (`export function Button`). Props đặt tên `ButtonProps`, export kèm.
- Dựa trên phần tử HTML đúng ngữ nghĩa và nhận hết thuộc tính gốc: `Button` mở rộng `React.ButtonHTMLAttributes<HTMLButtonElement>`, dùng `forwardRef`.
- Variant và size là union type (`variant?: 'primary' | 'primary-strong' | ...`), mặc định theo `components.md`.
- Mỗi component tương tác có đủ: `hover`, `focus-visible`, `active`, `disabled`, và `loading` nếu gửi dữ liệu.
- Không hard-code chữ tiếng Việt trong component UI trừ nhãn mặc định cho screen reader (vd "Đóng"); chữ hiển thị truyền qua props/children.

## Bắt buộc theo loại

| Component | Yêu cầu |
| --- | --- |
| `Button` | `type="button"` mặc định; `loading` → spinner + `aria-busy`, giữ nguyên độ rộng, chặn bấm; cao ≥ 44px với size `lg`/`xl` |
| `IconButton` | prop `label` bắt buộc → `aria-label`; vùng bấm 44×44 dù icon 16–20px |
| `Input`, `Textarea`, `Select` | nhận `label`, `hint`, `error`; tự sinh `id` bằng `useId`; nối `aria-describedby` tới hint/error; `aria-invalid` khi lỗi |
| `MoneyInput` | hiển thị `22.000.000`, giá trị trả ra là `number`; hậu tố `₫`; `inputMode="numeric"` |
| `StatusBadge` | nhận `{ enum, value }`, tự lấy label + tone từ `src/types/enums.ts`; luôn có chữ |
| `Modal`, `ConfirmDialog` | `role="dialog"`, `aria-modal`, `aria-labelledby`; bẫy focus; `Esc` đóng; trả focus về nút mở; khoá cuộn nền |
| `Tabs` | `role="tablist"/"tab"/"tabpanel"`, phím mũi tên chuyển tab |
| `DataTable` | bọc `overflow-x-auto`; `<th scope="col">`; props `loading`, `emptyState`, `error`; cột tiền căn phải + `tabular` |
| `Pagination` | `nav aria-label="Phân trang"`, trang hiện tại `aria-current="page"` |
| `Toast` | thành công `role="status"`; lỗi `role="alert"` và không tự ẩn |
| `CountdownTimer` | nhận `endTime` + `serverOffsetMs`; không tự đổi trạng thái phiên; gọi `onExpire` |

## Icon

- SVG từ `design/` → `src/components/icons/<Name>Icon.tsx`, `fill/stroke="currentColor"`, nhận `className`.
- Icon trang trí: `aria-hidden="true"`. Icon mang nghĩa đứng một mình: có `aria-label` hoặc chữ ẩn `sr-only`.

## Trang xem trước

Mọi component mới phải được thêm vào `src/app/dev/ui/page.tsx` với đủ variant và state. Trang này chỉ bật khi `NODE_ENV !== 'production'`.
