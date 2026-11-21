# Tiến độ frontend theo v4

Nhánh: `feature/fe-v4` · Kit: `.agents/skills/omnibid-fe-v4` · Agent cập nhật sau mỗi phase/màn.

## Phase
- [x] 0. Chuẩn bị
- [ ] 1. Nền tảng (contract.ts, API v4, mock, enums, thời gian, phiên, proxy, WS, hệ thiết kế, layout, UI kit, gỡ code cũ)
- [ ] 2. Tài khoản — login, register, profile, admin-profile
- [ ] 3. Phiên công khai — home, auction-list, auction-detail, report-modal
- [ ] 4. Bán hàng — my-products, product-form, auction-create, my-auctions, my-auction
- [ ] 5. Mua hàng — my-bids, my-orders, order-detail
- [ ] 6. Thông báo — notifications, notification-bell
- [ ] 7. Quản trị — admin-dashboard, admin-users, admin-categories, admin-products, admin-auctions, admin-orders, admin-reports
- [ ] 8. Rà soát cuối

## Baseline
- Ngày: 2026-11-21 · Nhánh gốc: `develop` (`e100f25`) · Nhánh làm việc: `feature/fe-v4`
- `npm install`: PASS (up to date, 153 packages)
- `npm run lint`: PASS (exit 0)
- `npm run typecheck`: PASS (exit 0)
- `npm run build`: PASS (exit 0; Next.js 16.4.5 webpack, cảnh báo `middleware` deprecated → sẽ đổi sang `proxy.ts` ở Phase 1)

## Backend thật
Chờ người dùng xác nhận (mặc định phát triển ở chế độ mock `NEXT_PUBLIC_API_MODE=mock`).

## Lệch hợp đồng (backend thật ↔ RESPONSE_DTO_v4)

## Giả định / quyết định của agent

## Cần backend (khối bị ẩn vì thiếu API)

## Việc tồn
