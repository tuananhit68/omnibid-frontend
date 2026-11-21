---
name: fe-phase-4-selling
description: Phase 4 frontend Omnibid v4 — sản phẩm của tôi, thêm/sửa sản phẩm multipart 1–5 ảnh, tạo phiên, phiên của tôi, quản lý một phiên (sửa khi SCHEDULED, hủy có lý do).
---
# Phase 4 — Bán hàng

> Tài liệu ở `.agents/skills/omnibid-fe-v4/references/`; tiến độ ở `docs/v4/PROGRESS.md`. Mỗi màn làm bằng `/build-screen <id>`; mỗi màn bổ sung handler + seed mock cho endpoint của nó (`MOCK_MODE.md`).
Spec: `screens/seller.md`. Màn: `my-products`, `product-form`, `auction-create`, `my-auctions`, `my-auction`.
- `features/product`; bổ sung `features/auction` (create, update, cancel, mine).
- Mock: products (multipart → data URL, 1–5 ảnh, BR-23, xóa khi chưa từng lên phiên), auctions create/update/cancel (BR-06…BR-08, BR-15), `/auctions/mine`.
Cổng: lint/typecheck/build; `/review-screen` từng màn; commit theo màn.
