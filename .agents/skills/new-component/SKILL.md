---
name: new-component
description: Tạo hoặc sửa một component UI dùng chung của Omnibid theo DESIGN_SYSTEM.md và rule components-ui. Cách gọi /new-component OrderProgress.
---
# /new-component <Tên>
1. Tìm component tương tự trong `src/components/ui`, `src/features/*/components`; có thì mở rộng variant.
2. Đọc `.agents/skills/omnibid-fe-v4/references/design/DESIGN_SYSTEM.md` §6–§8 và rule `components-ui`, `styling-tokens`, `accessibility`.
3. Tạo `src/components/ui/<Tên>.tsx`: props có kiểu, variant/size union, đủ state, a11y; export ở `src/components/ui/index.ts`.
4. Thêm mọi variant/state vào `src/app/dev/ui/page.tsx`.
5. `npm run lint`, `npm run typecheck`; commit `feat(ui): add <Tên>`.
