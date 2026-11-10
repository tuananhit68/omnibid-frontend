---
name: phase-0-foundation
description: Dựng nền móng frontend (token, component UI, layout, API client, WebSocket, enum) trước khi làm màn hình nào. Cách gọi: /phase-0-foundation
---

# /phase-0-foundation

Tạo nhánh `feature/phase-0-foundation` theo `AGENTS.md` mục 7. Làm lần lượt, mỗi bước xong thì chạy `npm run lint && npm run typecheck`, commit (`chore(ui): ...`, `feat(api): ...`) và báo lại trước khi sang bước sau. Không push.

1. **Token và font**: copy `design/tokens/tokens.css` → `src/styles/tokens.css`; trong `src/app/globals.css` thêm `@import "tailwindcss";` và `@import "../styles/tokens.css";`. Nạp Be Vietnam Pro bằng `next/font/google` theo `.agents/rules/nextjs-app.md`. Đọc `design/style-overrides.md`. Tạo `src/lib/cn.ts`.
2. **Enum**: `src/types/enums.ts` với mọi enum backend (danh sách đúng trong `design/backend-contract.md` và `enums/` của repo backend) + map `label`, `tone` theo `design/components.md` mục 3.
3. **Tiện ích**: `src/lib/format.ts` (tiền, ngày giờ GMT+7, đếm ngược, thời gian tương đối, che tên/SĐT, mã hiển thị) và `src/lib/errors.ts` (map mã lỗi → câu tiếng Việt).
4. **API client**: `src/lib/api/client.ts` theo `.agents/rules/api-data.md`; `QueryClientProvider` trong `src/app/providers.tsx`.
5. **WebSocket**: `src/lib/ws/stomp.ts` + `useAuctionChannel`, `useUserNotifications` theo `.agents/rules/realtime-websocket.md` (chưa gắn vào trang).
6. **Component UI** (dùng `/new-component` cho từng cái, theo thứ tự): Button, IconButton, Input, PasswordInput, MoneyInput, Textarea, Select, Checkbox, Radio, StatusBadge, Card, StatCard, Tabs, DataTable, Pagination, Breadcrumb, Modal, ConfirmDialog, Toast, Skeleton, EmptyState, CountdownTimer, ShipmentStepper.
7. **Icon**: export SVG cần dùng vào `src/components/icons`.
8. **Layout**: PublicLayout (header khách + đã đăng nhập), SellerLayout, AdminLayout, AuthLayout theo `design/layouts.md`, kể cả drawer trên mobile và link "Bỏ qua đến nội dung chính".
9. **Bảo vệ route**: `src/middleware.ts` cho `(user)` và `admin`; trang 403, 404.
10. **Trang `/dev/ui`**: hiển thị mọi component, variant, state; 4 layout với nội dung giả.

Xong khi: `/dev/ui` hiển thị đầy đủ, đi được bằng bàn phím, đúng ở 375/768/1280px, `npm run build` pass. Chưa làm trang nghiệp vụ nào.

