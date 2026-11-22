---
name: fe-phase-5-buying-orders
description: Phase 5 frontend Omnibid v4 — lượt đặt giá của tôi, đơn hàng mua/bán, chi tiết đơn chung (thanh toán đồng bộ Idempotency-Key, gửi hàng, xác nhận nhận hàng).
---
# Phase 5 — Mua hàng và đơn

> Tài liệu ở `.agents/skills/omnibid-fe-v4/references/`; tiến độ ở `docs/v4/PROGRESS.md`. Mỗi màn làm bằng `/build-screen <id>`; mỗi màn bổ sung handler + seed mock cho endpoint của nó (`MOCK_MODE.md`).
Spec: `screens/orders.md`. Màn: `my-bids`, `my-orders`, `order-detail`.
- `features/bid` (làm lại), `features/order`. Gắn `report-modal` vào `order-detail`.
- Mock: bids/mine, orders (role), shipping-info, payments (idempotency trả lại kết quả cũ, simulateResult khi DEMO_MODE, ORDER_EXPIRED theo đồng hồ giả lập), ship, confirm-receipt; scheduler hết hạn/tự hoàn tất; thông báo ORDER_UPDATE.
- Thử: FAILED rồi SUCCESS; bấm Thanh toán hai lần nhanh; tua giờ quá hạn → EXPIRED; người bán gửi hàng → người mua xác nhận.
Cổng: lint/typecheck/build; `/review-screen` từng màn; commit theo màn.
