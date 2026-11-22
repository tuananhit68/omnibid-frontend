---
trigger: glob
globs: "src/app/**, src/middleware.ts, src/proxy.ts"
description: "Route, layout, bảo vệ route, Server/Client Component theo cấu trúc v4."
---
# Next.js App Router (Next 16)
## Route group
| Group | Layout | Route | Bảo vệ |
|---|---|---|---|
| `(public)` | PublicLayout | `/`, `/auctions`, `/auctions/[id]` | không |
| `(auth)` | AuthLayout | `/login`, `/register` | đã đăng nhập → `/` (Admin → `/admin`) |
| `(account)` | AccountLayout | `/me/profile`, `/me/products(/new, /[id]/edit)`, `/me/auctions(/new, /[id])`, `/me/bids`, `/me/orders`, `/me/notifications`, `/orders/[id]` | cần USER (Admin → `/admin`) |
| `admin` | AdminLayout | `/admin`, `/admin/users`, `/admin/products(/[id])`, `/admin/auctions(/[id])`, `/admin/orders(/[id])`, `/admin/categories`, `/admin/reports(/[id])`, `/admin/profile` | cần ADMIN |
- Bảo vệ sớm ở `src/middleware.ts` (Next 16 đã đổi tên thành `proxy.ts` — nếu build cảnh báo deprecated thì đổi tên tệp + hàm `proxy`, giữ logic) đọc cookie cờ `omnibid_auth`, `omnibid_role`; kiểm tra lại trong layout client bằng `useSession`. Backend vẫn trả 401/403 — luôn xử lý.
- Không còn: `/watchlist`, `/seller/**`, `/notifications`, `/me/settings`, `/admin/dashboard`, `/admin/audit-logs`. Thêm redirect vĩnh viễn trong `next.config.ts` cho route cũ đã từng dùng: `/me/settings`→`/me/profile`, `/notifications`→`/me/notifications`, `/admin/dashboard`→`/admin`, `/seller/products`→`/me/products`.
- `/dev/ui` (bảng component) và `/dev/mock` (công cụ mock) chỉ bật khi không phải production; `/dev/mock` chỉ khi `NEXT_PUBLIC_API_MODE=mock`. Ở chế độ mock, trang không tải dữ liệu phía server.
- Mỗi route có `loading.tsx` (skeleton theo bố cục) và `error.tsx` (câu + "Thử lại"); `not-found.tsx` chung; `/403`.
- `page.tsx` mỏng: lấy params, tải dữ liệu đầu (trang công khai), render component từ `src/features`.
## Server/Client
- Mặc định Server Component; `'use client'` ở component lá cần state/effect/sự kiện/WebSocket/localStorage. Không import code client-only vào Server Component.
- Trang công khai có `generateMetadata`. Dữ liệu cá nhân (cần JWT trong localStorage) chỉ tải phía client.
- Dự án bật `cacheComponents` (Next 16): dữ liệu phiên/giá luôn động — đánh dấu không cache (`connection()`/`noStore` tương đương) cho fetch chi tiết phiên phía server.
## Ảnh, font, hiệu năng
- `next/image` với khung tỉ lệ cố định; chỉ remotePattern `res.cloudinary.com`. Ảnh đầu màn hình `priority`.
- Font Be Vietnam Pro qua `next/font/google` (`latin`, `vietnamese`, weight 400–700).
- Danh sách dài phân trang; không fetch trong `useEffect` khi đã có TanStack Query.
