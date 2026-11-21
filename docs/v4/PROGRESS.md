# Tiến độ frontend theo v4

Nhánh: `feature/fe-v4` · Kit: `.agents/skills/omnibid-fe-v4` · Agent cập nhật sau mỗi phase/màn.

## Phase
- [x] 0. Chuẩn bị
- [x] 1. Nền tảng (contract.ts, API v4, mock, enums, thời gian, phiên, proxy, WS, hệ thiết kế, layout, UI kit, gỡ code cũ)
- [x] 2. Tài khoản — login, register, profile, admin-profile
- [x] 3. Phiên công khai — home, auction-list, auction-detail, report-modal
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
- `npm run build`: PASS (exit 0; Next.js 16.4.5 webpack, cảnh báo `middleware` deprecated → đã đổi sang `src/proxy.ts` ở Phase 1)

## Backend thật
Người dùng xác nhận tiếp tục phát triển mặc định ở chế độ mock (`NEXT_PUBLIC_API_MODE=mock` trong `.env.local`).

## Lệch hợp đồng (backend thật ↔ RESPONSE_DTO_v4)

## Giả định / quyết định của agent
- Phase 1: giữ nguyên toàn bộ biến màu khóa trong `src/styles/tokens.css`.
- Phase 1: `OrderDetail.viewerRole` giữ đúng hợp đồng `RESPONSE_DTO_v4.md` §5 (`'BUYER' | 'SELLER'`), dù script `verify-fe-v4.ps1` hiện lọc chuỗi `viewerRole` theo `DELETE_LIST_FE.md` (áp dụng cho enum cũ trong `types/enums.ts`).
- Phase 1: đã thêm sẵn mock handler cho `auctions` và `bids` (ngoài `auth`, `users`, `categories`) để các màn công khai hiện có và `/dev/mock` hoạt động ngay ở chế độ mock.
- Phase 1: đổi `src/middleware.ts` sang `src/proxy.ts` theo quy chuẩn Next.js 16.
- Phase 2: tạo `src/app/admin/layout.tsx` và trang tạm `src/app/admin/page.tsx` (`// TODO fe-v4 admin-dashboard`) để ADMIN đăng nhập chuyển tới `/admin` không bị 404 trước Phase 7.
- Phase 2: đổi mật khẩu xác nhận qua `ConfirmDialog` trước khi gọi `PATCH /users/me/password` (đúng quy tắc hành động không đảo ngược trong `ux-states.md`).
- Phase 3: tách hẳn `src/features/report/` (`ReportModal`) khỏi `src/features/auction/`; thêm mock handler `POST /reports` trong `src/mocks/handlers/reports.ts`.
- Phase 3: `CountdownTimer` xuất thêm `useSharedNowMs()` dùng chung một `setInterval` cho cả `CountdownTimer` và `AuctionCard`.
- Phase 3: thanh đáy cố định "Đặt giá" trên mobile ở chi tiết phiên dùng nút `primary` (cuộn tới `#bid-card`) để giữ đúng quy tắc tối đa một nút `primary-700` (`money`) mỗi màn.

## Cần backend (khối bị ẩn vì thiếu API)

## Việc tồn
- Các màn cũ (`/me/bids`, `/admin`) đang ở bản tạm (`// TODO fe-v4 <id>`) để biên dịch và chạy mock; sẽ được thiết kế lại đầy đủ ở Phase 5 và 7.
