# Tiến độ frontend theo v4

Nhánh: `feature/fe-v4` · Kit: `.agents/skills/omnibid-fe-v4` · Agent cập nhật sau mỗi phase/màn.

## Phase
- [x] 0. Chuẩn bị
- [x] 1. Nền tảng (contract.ts, API v4, mock, enums, thời gian, phiên, proxy, WS, hệ thiết kế, layout, UI kit, gỡ code cũ)
- [x] 2. Tài khoản — login, register, profile, admin-profile
- [x] 3. Phiên công khai — home, auction-list, auction-detail, report-modal
- [x] 4. Bán hàng — my-products, product-form, auction-create, my-auctions, my-auction
- [x] 5. Mua hàng — my-bids, my-orders, order-detail
- [x] 6. Thông báo — notifications, notification-bell
- [x] 7. Quản trị — admin-dashboard, admin-users, admin-categories, admin-products, admin-auctions, admin-orders, admin-reports
- [x] 8. Rà soát cuối

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
- Phase 4: bổ sung `"use client"` cho `MoneyInput.tsx` và `PasswordInput.tsx` để import barrel `@/components/ui` hoạt động ổn định trong Server Components (`loading.tsx`, `page.tsx`).
- Phase 4: dùng chung `AuctionScheduleForm` giữa `auction-create` (`/me/auctions/new`) và chỉnh sửa phiên `SCHEDULED` trong `my-auction` (`/me/auctions/[id]`); thêm đầy đủ mock handler cho `products` (multipart → data URL, kiểm tra magic bytes, 1–5 ảnh, BR-23, xóa khi chưa từng lên phiên) và `auctions` (`create`, `update`, `cancel`, `/auctions/mine`).
- Phase 5: làm lại `my-bids` (`/me/bids`, `size=20`, lọc nhanh phía client trên trang hiện tại + lọc theo `auctionId`), thêm `my-orders` (`/me/orders`, tabs `BUYER`/`SELLER`, 6 trạng thái, tô nền `warning-subtle-bg` + nhãn "Cần bạn xử lý"), thêm `order-detail` (`/orders/[id]`, đủ nhánh `BUYER`/`SELLER` × trạng thái, thanh toán đồng bộ `Idempotency-Key` giữ khóa khi retry lỗi mạng, `ReportModal`, `ConfirmDialog`). Bổ sung mock handler `orders.ts`, `payments.ts` và thông báo `ORDER_UPDATE` trong `scheduler.ts`.
- Phase 6: làm mới `features/notification` (`GET /notifications`, `POST /notifications/{id}/read` optimistic + rollback), màn `/me/notifications` (`Tabs` Tất cả/Chưa đọc, lọc 5 loại, `size=20`, điều hướng AUCTION/ORDER và mở rộng tại chỗ cho REPORT, không có "đánh dấu tất cả"), `NotificationBell` ở `PublicLayout` (chỉ USER, `totalElements` của `isRead=false&size=1`, refetch khi focus/điều hướng/60s, `"9+"` khi > 9, popover 5 mục + "Xem tất cả") và số chưa đọc đồng bộ ở sidebar `AccountLayout`. Bổ sung mock handler `notifications.ts`, cập nhật sinh thông báo `AUCTION_CANCELLED` trong `auctions.ts`, `AUCTION_RESULT` kèm hạn thanh toán + `refType: "AUCTION"` trong `scheduler.ts` và `ORDER_UPDATE` khi hết hạn trong `payments.ts` đúng `BUSINESS_RULES_v4.md` §7.
- Phase 7: hoàn thiện 7 màn quản trị (`admin-dashboard`, `admin-users`, `admin-categories`, `admin-products`, `admin-auctions`, `admin-orders`, `admin-reports`) dưới `src/features/admin/{shared,statistics,users,categories,products,auctions,orders,reports}` và `src/app/admin/**`; dùng chung `AdminActionDialogs` cho trang danh sách/chi tiết và panel báo cáo vi phạm; `AdminLayoutShell` đồng bộ badge `pendingReports` trên sidebar; bổ sung đầy đủ 20 endpoint admin trong `src/mocks/handlers/admin.ts` kèm hệ quả khóa người dùng/ẩn sản phẩm (hủy phiên mở + WS event, hủy đơn `PENDING_PAYMENT`, giữ bid, `release()` trừ `HIDDEN`, sinh thông báo), xử lý báo cáo chỉ đổi trạng thái báo cáo + gửi `REPORT_RESOLVED`, thống kê tính trực tiếp từ kho mock.
- Phase 8: rà soát cuối hoàn tất — `npm run lint` PASS (0 lỗi, 4 cảnh báo `window.location.href` khi đăng xuất/chuyển hướng phiên), `npm run typecheck` PASS, `npm run build` PASS (34/34 routes). `verify-fe-v4.ps1` đạt 8/9 kiểm tra (0 cảnh báo màu cứng/uppercase/viền một bên, đủ 28 route v4, cô lập mock); mục duy nhất báo `viewerRole` là trường hợp lệ của `OrderDetail` theo `RESPONSE_DTO_v4.md` §5 (đã ghi ở Phase 1, không sửa `.agents/`). Đã cập nhật `README.md` đầy đủ cho v4.

## Kết quả kiểm thử Phase 8
### Kịch bản đầu-cuối chế độ Mock (`NEXT_PUBLIC_API_MODE=mock`) — 12/12 bước PASS
Thực thi qua toàn bộ mock handler thực tế + kiểm tra lược đồ zod (`src/lib/api/contract.ts`) + kênh WS `src/mocks/ws-bus.ts`:
1. Đăng ký tài khoản mới (`e2e.seller@omnibid.local`) → `UserProfileSchema` hợp lệ.
2. Đăng nhập tài khoản vừa tạo → `LoginResponseSchema` hợp lệ.
3. Tạo sản phẩm multipart 3 ảnh PNG (kiểm tra magic bytes) → `ProductSchema` hợp lệ, `imageCount=3`, ảnh đầu `isPrimary=true`.
4. Tạo phiên đấu giá (`SCHEDULED`) → `AuctionDetailSchema` hợp lệ.
5. Tua đồng hồ mở phiên (`AUCTION_STARTED`), người khác (`buyer1`) đặt giá 1.600.000đ → `PlaceBidResponseSchema` + sự kiện WS `BID_PLACED` (`AuctionEventSchema`) hợp lệ.
6. Tua đồng hồ quá `endTime` chốt phiên → `AUCTION_ENDED`, trạng thái `ENDED`, tự sinh đơn hàng `PENDING_PAYMENT`.
7. Người mua (`buyer1`) cập nhật địa chỉ/SĐT, thanh toán mô phỏng `FAILED` (lần 1, đơn giữ `PENDING_PAYMENT`), sau đó thử lại với `Idempotency-Key` mới và kết quả `SUCCESS` (lần 2, đơn chuyển `PAID`); lịch sử thanh toán ghi nhận đủ 2 lần.
8. Người bán gửi hàng kèm mã vận đơn → `ShipResultSchema` hợp lệ, đơn chuyển `SHIPPING`.
9. Người mua xác nhận đã nhận hàng → `ConfirmReceiptResultSchema` hợp lệ, đơn chuyển `COMPLETED`, sản phẩm chuyển `SOLD`.
10. Thông báo hai bên: người mua và người bán đều nhận đủ `AUCTION_RESULT` và `ORDER_UPDATE`; đánh dấu đã đọc (`POST /notifications/{id}/read`) → `NotificationSchema` hợp lệ.
11. Người mua gửi báo cáo vi phạm cho sản phẩm & đơn hàng → `CreateReportResponseSchema` hợp lệ (`PENDING`).
12. Admin xử lý báo cáo (`RESOLVED` + ghi chú → người mua nhận thông báo `REPORT_RESOLVED`), ẩn vĩnh viễn sản phẩm (`HIDDEN`), khóa người bán (`BANNED` → đăng nhập lại bị chặn với mã `ACCOUNT_BANNED`), thống kê `AdminStatisticsSchema` hợp lệ.

### Chế độ Live
- Chưa thực thi do backend v4 chưa khởi chạy trên máy; cần chạy lại kịch bản ở chế độ `NEXT_PUBLIC_API_MODE=live` khi ghép backend thật và ghi nhận mọi cảnh báo lệch hợp đồng zod (nếu có) vào mục "Lệch hợp đồng".

### A11y & Responsive (kiểm thử trực quan Chrome 375/768/1280px)
- Đã kiểm thử trực quan trên trình duyệt thật (Chrome) toàn bộ 19 màn đại diện (Guest: `/`, `/auctions`, `/auctions/1`, `/login`, `/register`; USER: `/me/profile`, `/me/products`, `/me/auctions`, `/me/bids`, `/me/orders`, `/orders/1`, `/me/notifications`; ADMIN: `/admin`, `/admin/users`, `/admin/categories`, `/admin/products`, `/admin/auctions`, `/admin/orders`, `/admin/reports`) ở 3 mốc `375×812`, `768×1024`, `1280×800`:
  - Phát hiện và sửa lỗi build production: `package.json` cũ dùng `next build --webpack` khiến `@tailwindcss/turbopack` không biên dịch Tailwind v4; đã đổi sang `next build` (Turbopack).
  - **Tràn ngang cấp trang (`scrollWidth <= innerWidth`)**: đạt `0px` trên 57/57 tổ hợp màn × kích thước; `0` lỗi console; xác nhận `aria-live="polite"` + `aria-atomic="true"` trên khối giá realtime tại `/auctions/1`.
  - Đã sửa và kiểm tra lại 4 lỗi hiển thị phát hiện khi test trực quan: (1) ẩn link `"Xem sàn đấu giá"` khỏi header admin `< sm` và đưa vào drawer mobile (`AdminLayout.tsx`), (2) đổi lưới KPI `/admin` sang `lg:grid-cols-3 2xl:grid-cols-5` + `StatCard` dùng `text-h1 font-bold whitespace-nowrap`, (3) thêm `overflow-y-hidden` và `.no-scrollbar` cho `Tabs.tsx`, (4) sửa `pl-3.5 pr-10` + `::picker-icon` + mở rộng ô lọc thông báo `sm:w-64`.
  - Bảng dữ liệu nhiều cột ở các trang quản trị/tài khoản cuộn ngang an toàn trong vùng `overflow-x-auto` riêng mà không làm tràn khung trang.

## Nâng cấp giao diện bằng Impeccable (`feature/fe-polish`, 2026-11-22)
- Nhánh gốc: `develop` · Nhánh làm việc: `feature/fe-polish` · Tuân thủ nghiêm `.agents/rules/design-skills.md` (giữ nguyên toàn bộ bảng màu `tokens.css`, không đổi hợp đồng/nghiệp vụ).
- **Bước 0–2 (Baseline & Audit/Critique độc lập):** Audit ban đầu `13/20`, Critique `28/40` (0 P0 · 7 P1 · 8 P2 · 2 P3); tạo ngữ cảnh `PRODUCT.md`, `DESIGN.md`.
- **Bước 3 (`1fc5dbd` — UI Kit & 4 Layout):** thay quy tắc `0.01ms` `prefers-reduced-motion` bằng reduced-motion có chủ đích + `::selection`/`caret-color` trong `src/styles/tokens.css`; chuẩn hóa focus ring `outline-2 outline-focus outline-offset-2`; bổ sung `useDialogFocusTrap` cho drawer `AccountLayout`/`AdminLayout`; sửa `:not([disabled])` ở `Modal`; hoàn thiện WAI-ARIA `Tabs`/`SegmentedControl`/`DateTimeInput`/`ImageUploader`; nâng input mobile `>= 16px` và vùng bấm mobile `>= 44×44px`; sửa tràn mép phải `Toast`; thêm `/me/products` và `/me/auctions` vào menu mobile `PublicLayout`; bỏ 19 class arbitrary `[...]` và `text-white`; thống nhất `"—"` ở `DataTable`/`StatusBadge`; sửa bọc dòng `StatCard`; giải phóng `URL.createObjectURL`; memoize `ToastContext`; thêm `.agents/**` vào `eslint.config.mjs`.
- **Bước 4 (`6dd704b` — Public & Auth):** ẩn ô tìm kiếm trùng trên header ở `/`; tách `useSharedNowMs()` sang `ActiveAuctionMeta` chỉ chạy khi phiên `ACTIVE`; bỏ Tab stop trùng trên ảnh `AuctionCard`; nâng chip đặt giá nhanh & nút lọc mobile `>= 44px`; thêm kiểm tra `minPrice > maxPrice` ở `FilterPanel`; thêm `scope="col"` ở `BidHistoryTable`; thêm `fetchPriority="high"` ảnh chính + `loading="lazy" decoding="async"` cho ảnh thẻ/thumbnail; thêm tooltip giải thích `ReserveBadge`.
- **Bước 5 (`2625b63` — Bán hàng):** nâng vùng bấm mobile `>= 44px` + focus ring ở `MyProductsClient`, `MyAuctionsClient`, `ProductFormClient`; `loading="lazy" decoding="async"` cho toàn bộ thumbnail bán hàng.
- **Bước 6 (`ae6a199` — Mua hàng, Đơn hàng & Thông báo):** nâng `NotificationBell` lên `44×44px` + gắn `useDialogFocusTrap`; ánh xạ `failureReason` thanh toán sang tiếng Việt (không lộ `MOCK_DECLINED`) và cảnh báo/chặn bấm nhầm `Thanh toán` khi form nhận hàng `isDirty` ở `OrderBuyerPendingCard`; lược bỏ dòng đối tác lặp lại trong thẻ tóm tắt `OrderDetailClient`; `loading="lazy" decoding="async"` cho thumbnail đơn hàng/lượt đặt giá.
- **Bước 7 (`95b07a4` — Quản trị):** sửa 2 class sai token ở `AdminDashboardClient` (`bg-neutral-400` → `bg-neutral`, `bg-tertiary-500` → `bg-tertiary-600`), gỡ `focus:outline-none` và gắn `focus-visible` ring cho 4 KPI `<Link>`; thêm `aria-current="true"` ở `AdminReportsClient`; thay `aspect-[4/3]` → `aspect-4/3` và thêm `aria-label`/`aria-current` thumbnail ở `AdminProductDetailClient`.
- **Bước 8 (Kiểm tra tổng thể):**
  - `npm run lint`: PASS (0 lỗi, 4 cảnh báo `window.location.href` cũ).
  - `npm run typecheck`: PASS (0 lỗi).
  - `npm run build`: PASS (34/34 routes, Next.js 16.4.5 Turbopack).
  - `verify-fe-v4.ps1`: 8/9 PASS (chỉ cảnh báo `OrderDetail.viewerRole` đã ghi nhận từ Phase 1).
  - Quét hồi quy tĩnh `src/`: 0 `focus:outline-none`, 0 `bg-neutral-400`/`bg-tertiary-500`, 0 `0.01ms`, 0 `text-white`, 0 `MOCK_DECLINED`.

## Cần backend (khối bị ẩn vì thiếu API)

## Việc tồn
- Chạy lại kịch bản E2E ở chế độ `NEXT_PUBLIC_API_MODE=live` khi có backend v4 để đối chiếu cảnh báo zod.
- (Tùy chọn) Cập nhật ngoại lệ `OrderDetail.viewerRole` trong `.agents/skills/omnibid-fe-v4/scripts/verify-fe-v4.ps1` nếu người dùng đồng ý cho phép sửa kit `.agents/`.
