---
trigger: glob
globs: "src/components/**"
description: "Cách viết component UI thuần và layout."
---
# Component (`src/components/ui`, `src/components/layout`)
Danh sách, variant: `.agents/skills/omnibid-fe-v4/references/design/DESIGN_SYSTEM.md` §6–§8.
- Component UI thuần giao diện: chỉ props, không gọi API, không import `src/features/*`. Một component một tệp PascalCase, export có tên + `XxxProps`.
- Dựa trên phần tử HTML đúng ngữ nghĩa, nhận hết thuộc tính gốc, `forwardRef` khi là điều khiển form/nút.
- Variant/size là union type, mặc định theo DESIGN_SYSTEM.md. Đủ state `hover`, `focus-visible`, `active`, `disabled`, `loading`.
- Không hard-code chữ tiếng Việt trong UI component trừ nhãn mặc định cho screen reader.

| Component | Bắt buộc |
|---|---|
| `Button` | `type="button"` mặc định; `loading` → spinner + `aria-busy`, giữ độ rộng, chặn bấm |
| `IconButton` | prop `label` → `aria-label`; vùng bấm 44×44 |
| `Input`, `Textarea`, `Select` | `label`, `hint`, `error`; `useId`; `aria-describedby`; `aria-invalid` |
| `MoneyInput` | hiển thị `22.000.000`, giá trị `number` nguyên; hậu tố `₫`; `inputMode="numeric"` |
| `DateTimeInput` | hiển thị `dd/MM/yyyy HH:mm` giờ VN, trả chuỗi ISO **có** `+07:00` |
| `StatusBadge` | nhận `{ kind, value }`, lấy label + tone từ `src/types/enums.ts`; luôn có chữ |
| `Modal`, `ConfirmDialog` | `role="dialog"`, `aria-modal`, `aria-labelledby`, bẫy focus, `Esc`, trả focus, khóa cuộn; `ConfirmDialog` hỗ trợ ô lý do bắt buộc/tùy chọn |
| `Tabs`, `SegmentedControl` | `role="tablist"/"tab"/"tabpanel"`, phím mũi tên |
| `DataTable` | `overflow-x-auto`, `<th scope="col">`, `loading`/`emptyState`/`error`, cột tiền căn phải `tabular`, chế độ thẻ trên mobile |
| `Pagination` | `nav aria-label="Phân trang"`, `aria-current="page"` |
| `Toast` | thành công `role="status"` tự ẩn 5s; lỗi `role="alert"` không tự ẩn |
| `CountdownTimer` | nhận `endTime` (ISO có offset) + `serverOffsetMs`; không tự đổi trạng thái; gọi `onExpire` |
| `OrderProgress` | 4 bước, nhận `status` + các mốc thời gian |
| `CategoryIcon` | nhận tên icon lucide, map tĩnh các icon cho phép, fallback `tag` |

- Icon: `src/components/icons` (SVG, `currentColor`) cho icon giao diện; `lucide-react` chỉ cho icon danh mục (và có thể dùng thay icon thiếu). Icon trang trí `aria-hidden`.
- Mọi component mới/sửa phải có mặt ở `src/app/dev/ui/page.tsx` (chỉ bật khi `NODE_ENV !== 'production'`).
