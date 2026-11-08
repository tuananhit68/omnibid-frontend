---
trigger: glob
globs: src/app/**
---

# Next.js App Router

## Route và layout

| Route group | Layout | Bảo vệ |
| --- | --- | --- |
| `(public)` | `PublicLayout` | không |
| `(auth)` | `AuthLayout` | đã đăng nhập thì chuyển về `/` |
| `(user)` | `PublicLayout` (`/me`, `/orders`, `/watchlist`, `/notifications`) hoặc `SellerLayout` (`/seller/*`) | cần đăng nhập |
| `admin` | `AdminLayout` | cần role ADMIN |

- Bảo vệ ở `src/middleware.ts` (đọc cookie/phiên) + kiểm tra lại trong layout. Backend vẫn trả 401/403 – luôn xử lý.
- Mỗi route có `loading.tsx` (skeleton theo bố cục trang) và `error.tsx` (thông báo + nút "Thử lại"). Có `not-found.tsx` chung.
- `page.tsx` mỏng: lấy params, tải dữ liệu đầu (nếu là trang công khai), render component từ `src/features`.

## Server/Client

- Mặc định Server Component. Chỉ thêm `'use client'` ở component lá cần state, effect, sự kiện, WebSocket.
- Không import code client-only (window, localStorage, STOMP) vào Server Component.
- Trang công khai có `generateMetadata` (tiêu đề, mô tả, ảnh chính cho chi tiết phiên).

## Ảnh và font

- Ảnh dùng `next/image` với `width/height` hoặc `fill` + khung có tỉ lệ cố định (tránh CLS). Khai báo domain Cloudinary trong `next.config` (`images.remotePatterns`).
- Ảnh trên màn hình đầu (hero, ảnh chính chi tiết phiên) đặt `priority`; còn lại lazy.
- Font Be Vietnam Pro qua `next/font/google`: `Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], weight: ['400','500','600','700'], variable: '--font-be-vietnam-pro', display: 'swap' })`, gắn class `variable` lên `<html>`. Không phải variable font nên phải khai báo `weight`.

## Hiệu năng

- Không tải thư viện biểu đồ ở trang không cần: `dynamic(() => import(...), { ssr: false })` cho biểu đồ admin.
- Danh sách dài (lịch sử bid đầy đủ, nhật ký) phân trang hoặc tải thêm, không render hàng nghìn dòng.
- Không fetch trong `useEffect` khi đã có TanStack Query.
