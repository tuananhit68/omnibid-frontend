---
name: new-component
description: Tạo một component UI dùng chung theo design/components.md. Cách gọi: /new-component Button
---

# /new-component <Tên>

1. Tìm `<Tên>` trong `design/components.md` và các spec dùng nó (`grep` trong `design/specs`). Tìm trong `src/components` xem đã có component tương tự chưa – nếu có thì đề xuất mở rộng thay vì tạo mới.
2. Đề xuất API của component: props, variant, size, state, ví dụ sử dụng. **Chờ đồng ý.**
3. Viết `src/components/ui/<Tên>.tsx` theo `.agents/rules/components-ui.md` và `.agents/rules/styling-tokens.md`:
   - phần tử HTML đúng ngữ nghĩa, `forwardRef`, nhận thuộc tính gốc;
   - đủ `hover`, `focus-visible`, `active`, `disabled`, `loading` (nếu có);
   - yêu cầu accessibility riêng của loại component đó.
4. Thêm vào `src/app/dev/ui/page.tsx`: mỗi variant × size × state một mẫu.
5. Chạy `npm run lint` và `npm run typecheck`.
6. Commit `feat(ui): add <Tên> component` (không push). Báo lại props cuối cùng và chỗ nào lệch với Figma (nếu có) kèm lý do.
