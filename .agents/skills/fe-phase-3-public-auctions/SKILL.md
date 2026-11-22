---
name: fe-phase-3-public-auctions
description: Phase 3 frontend Omnibid v4 — làm lại trang chủ, danh sách/tìm kiếm phiên, chi tiết phiên với đặt giá realtime /topic/auctions/{id}, modal báo cáo vi phạm.
---
# Phase 3 — Phiên công khai

> Tài liệu ở `.agents/skills/omnibid-fe-v4/references/`; tiến độ ở `docs/v4/PROGRESS.md`. Mỗi màn làm bằng `/build-screen <id>`; mỗi màn bổ sung handler + seed mock cho endpoint của nó (`MOCK_MODE.md`).
Spec: `screens/public.md`, `screens/notifications-reports.md` (report-modal). Màn: `home`, `auction-list`, `auction-detail`, `report-modal`.
- `features/auction` (api, hooks, server-api chỉ chạy ở live), `features/report`.
- Mock: `GET /auctions` (lọc, sắp xếp whitelist, phân trang), chi tiết với `viewerIsSeller`/`viewerIsLeading`/`orderId` theo người gọi, lịch sử, đặt giá đủ mã lỗi và phát `BID_PLACED`, OUTBID; `POST /reports`.
- Thử bằng `/dev/mock`: "người khác đặt giá" → giá, lịch sử, toast bị vượt cập nhật; tua giờ → "Đang chốt phiên" → `AUCTION_ENDED`.
Cổng: lint/typecheck/build; `/review-screen` từng màn; commit theo màn.
