---
name: fe-phase-6-notifications
description: Phase 6 frontend Omnibid v4 — trang thông báo với lọc chưa đọc/loại và POST read; chuông header với số chưa đọc và popover.
---
# Phase 6 — Thông báo

> Tài liệu ở `.agents/skills/omnibid-fe-v4/references/`; tiến độ ở `docs/v4/PROGRESS.md`. Mỗi màn làm bằng `/build-screen <id>`; mỗi màn bổ sung handler + seed mock cho endpoint của nó (`MOCK_MODE.md`).
Spec: `screens/notifications-reports.md`. Màn: `notifications`, `notification-bell`.
- `features/notification`; chuông vào PublicLayout và AccountLayout (chỉ USER); số chưa đọc ở sidebar.
- Mock: list (isRead, type), read; các handler phase trước đã sinh thông báo đúng §7 BUSINESS_RULES — kiểm lại đủ 5 loại.
Cổng: lint/typecheck/build; `/review-screen`; commit.
