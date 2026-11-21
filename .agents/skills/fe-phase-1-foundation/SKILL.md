---
name: fe-phase-1-foundation
description: Phase 1 frontend Omnibid v4 — contract.ts từ RESPONSE_DTO_v4, API client envelope v4, ErrorCode, thời gian có offset, enums, phiên đăng nhập, proxy, STOMP /ws, khung chế độ mock, token chữ/bề mặt theo DESIGN_SYSTEM, UI kit, 4 layout, gỡ watchlist và code cũ.
---
# Phase 1 — Nền tảng

> Tài liệu ở `.agents/skills/omnibid-fe-v4/references/`; tiến độ ở `docs/v4/PROGRESS.md`. Mỗi màn làm bằng `/build-screen <id>`; mỗi màn bổ sung handler + seed mock cho endpoint của nó (`MOCK_MODE.md`).
Đọc: `API_CLIENT_FE.md`, `MOCK_MODE.md`, `design/DESIGN_SYSTEM.md`, `GAP_ANALYSIS_FE.md`, `DELETE_LIST_FE.md`, rule `nextjs-app`.

1. **Phụ thuộc, cấu hình:** gỡ `sockjs-client`, `@types/sockjs-client`; cài `lucide-react`. `.env.example`: `NEXT_PUBLIC_API_MODE=live`, `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`, `NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws`, `NEXT_PUBLIC_DEMO_MODE=true`; nhắc người dùng đặt `NEXT_PUBLIC_API_MODE=mock` trong `.env.local` nếu chưa có backend. `next.config.ts`: chỉ remotePattern Cloudinary; `images.unoptimized` khi mock.
2. **Hợp đồng:** `src/lib/api/contract.ts` — type + zod schema cho mọi DTO trong `backend/RESPONSE_DTO_v4.md` và `AuctionEvent`; map endpoint → schema để kiểm tra response ở dev (live).
3. **Client:** `src/lib/api/client.ts` envelope v4, `ApiError`, 401/403 toàn cục, `NETWORK_ERROR`, adapter mock khi `API_MODE=mock`. `src/lib/errors.ts` 24 mã. `src/types/enums.ts` nhãn + tông theo DESIGN_SYSTEM §8. `src/lib/format.ts` thời gian có offset.
4. **Phiên + bảo vệ route:** `src/lib/auth/session.ts`, `useSession`, middleware/proxy (screens/auth-account.md).
5. **WebSocket:** `src/lib/ws` interface `AuctionChannel`; bản STOMP thuần `/ws` và bản mock; `useAuctionChannel`, `resetWsClient`.
6. **Khung mock:** `src/mocks/{adapter,db,seed,errors,auth,scheduler,ws-bus}.ts`, handler auth + users/me + categories; trang `/dev/mock` (đăng nhập nhanh, tua giờ, reset). Seed đủ dữ liệu cho mọi phase theo MOCK_MODE §4 (handler các domain khác thêm ở phase sau).
7. **Hệ thiết kế:** cập nhật `src/styles/tokens.css` theo DESIGN_SYSTEM §3–§4 (giữ nguyên mọi biến màu). UI kit theo §6 (thêm `OrderProgress`, `CategoryIcon`, `ImageUploader`, `DateTimeInput`, `SegmentedControl`, `ConfirmDialog` có lý do, `ErrorState`; xóa `ShipmentStepper`). Cập nhật `/dev/ui`.
8. **Layout:** `PublicLayout`, `AccountLayout` (mới, route group `src/app/(account)`), `AdminLayout` (7 mục, không chuông), `AuthLayout` theo DESIGN_SYSTEM §5. Xóa `SellerLayout`.
9. **Gỡ code cũ** theo DELETE_LIST_FE (watchlist, enum cũ, SockJS…). Các màn đã có tạm sửa cho biên dịch được (đánh dấu `// TODO fe-v4 <id>`). Chuyển `/me/bids` vào `(account)`, xóa `src/app/(user)`.

Cổng: lint/typecheck/build sạch ở cả hai chế độ; `/dev/ui` và `/dev/mock` chạy; commit nhỏ theo bước.
