---
name: fe-phase-7-admin
description: Phase 7 frontend Omnibid v4 — trang quản trị: tổng quan, người dùng ban/unban, danh mục icon lucide, sản phẩm ẩn vĩnh viễn, phiên hủy có lý do, đơn hủy khi chờ thanh toán, báo cáo vi phạm decision/note + thao tác quản trị riêng.
---
# Phase 7 — Quản trị

> Tài liệu ở `.agents/skills/omnibid-fe-v4/references/`; tiến độ ở `docs/v4/PROGRESS.md`. Mỗi màn làm bằng `/build-screen <id>`; mỗi màn bổ sung handler + seed mock cho endpoint của nó (`MOCK_MODE.md`).
Spec: `screens/admin.md`. Màn theo thứ tự: `admin-dashboard`, `admin-users`, `admin-categories`, `admin-products`, `admin-auctions`, `admin-orders`, `admin-reports`.
- `features/admin/{statistics,users,categories,products,auctions,orders,reports}`; `AdminActionDialogs` dùng chung cho trang danh sách và panel báo cáo.
- Mock: đủ 20 endpoint admin, hệ quả ban/hide (hủy phiên mở, hủy đơn PENDING_PAYMENT, giữ bid, release sản phẩm, thông báo), resolve chỉ đổi báo cáo, thống kê tính từ kho.
Cổng: lint/typecheck/build; `/review-screen` từng màn; commit theo màn.
