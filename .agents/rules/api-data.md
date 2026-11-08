---
trigger: model_decision
description: Áp dụng khi gọi API backend, viết api.ts/hooks.ts/types.ts trong src/features, sửa src/lib/api, xử lý JWT, phân trang, lọc, upload ảnh.
---

# Gọi API và quản lý dữ liệu

## Client (`src/lib/api/client.ts`)

Hợp đồng API thật nằm ở `design/backend-contract.md` (đối chiếu từ code backend). **File đó thắng mục API trong spec.**

- axios instance với `baseURL = process.env.NEXT_PUBLIC_API_URL` (vd `http://localhost:8080/api/v1`).
- Interceptor request gắn `Authorization: Bearer <token>`.
- Envelope backend: `{ success, errorCode?, message?, data?, timestamp }` – lỗi nằm ở cấp trên cùng, **không có object `error`**.
- Interceptor response: trả `body.data` khi `success: true`; khi lỗi ném `ApiError { status, code: body.errorCode, message: body.message, data: body.data }`. 401 → `onUnauthorized()` (xoá token, chuyển `/login?redirect=`).
- Không hiển thị `message` của backend trực tiếp (lẫn Anh/Việt): map `code` qua `lib/errors.ts`. `VALIDATION_ERROR` → `data` là map `{ field: message }`, gắn vào ô form.
- `PageResponse` = `{ content, page (từ 0), size, totalElements, totalPages }`; viết type chung `Page<T>`.
- Không gọi `fetch`/`axios` trực tiếp trong component.

## Tổ chức theo feature

```text
src/features/auction/
  types.ts     # type khớp JSON backend (camelCase)
  schemas.ts   # zod cho form (createAuctionSchema…)
  api.ts       # hàm thuần: getAuctions(params), getAuction(id), createAuction(body)…
  hooks.ts     # useAuctions, useAuction, useCreateAuction (TanStack Query)
  components/  # AuctionCard, BidPanel… (được dùng hooks)
```

- Query key dạng mảng có cấu trúc, khai báo tập trung: `auctionKeys.list(params)`, `auctionKeys.detail(id)`, `auctionKeys.bids(id)`.
- Mutation xong thì `invalidateQueries` đúng key liên quan (đặt giá → `detail`, `bids`).
- `staleTime` mặc định 30 giây; dữ liệu realtime (chi tiết phiên đang ACTIVE) cập nhật qua WebSocket bằng `setQueryData`.

## Type và enum

- Viết type theo DTO trong `backend-contract.md` (hoặc đọc thẳng `src/main/java/com/omnibid/dto` của repo backend). Không đoán tên trường.
- Enum trong `src/types/enums.ts` giống hệt backend: `AuctionStatus`, `BidStatus`, `ProductStatus`, `ProductCondition`, `OrderStatus`, `PaymentStatus`, `PaymentMethod`, `ShipmentStatus`, `ReportType`, `ReportStatus`, `ReportAction`, `UserStatus`, `UserRole`, `NotificationType`, `SimulatedOutcome`. Kèm map `label` + `tone` theo `design/components.md` mục 3.
- Tiền: backend trả `BigDecimal` → đọc bằng `Number()`, hiển thị không thập phân.
- **Thời gian không có múi giờ** (`"2026-10-28T21:30:00"`, giờ Việt Nam). Parse bằng `dayjs.tz(v, 'Asia/Ho_Chi_Minh')` (plugin `utc` + `timezone`), không dùng `new Date(v)`. Gửi lên dạng `YYYY-MM-DDTHH:mm:ss` giờ VN, không có `Z`.

## Danh sách, lọc, phân trang

- Bộ lọc, trang, sắp xếp đồng bộ lên URL (`useSearchParams`) để chia sẻ link và nút Back hoạt động.
- Ô tìm kiếm debounce 300ms. Đổi bộ lọc thì về trang 1.
- Dùng `placeholderData: keepPreviousData` để chuyển trang không chớp.

## Server vs Client Component

- Trang công khai (`/`, `/auctions`, `/auctions/[id]`): Server Component tải dữ liệu lần đầu (SEO, `generateMetadata`), truyền xuống Client Component làm `initialData`.
- Phần cần đăng nhập, form, realtime, đồng hồ: Client Component (`'use client'` ở file thấp nhất có thể).

## Upload ảnh

- **Backend chưa có endpoint ảnh (B1).** Khi có: gửi `multipart/form-data` lên backend (backend đẩy lên Cloudinary), không gọi Cloudinary trực tiếp từ trình duyệt.
- Kiểm tra trước khi gửi: PNG/JPG/WEBP, ≤ 10MB, tối đa 5 ảnh/sản phẩm. Tải tuần tự, có tiến trình và nút thử lại từng ảnh.

## Endpoint chưa có

Backend chưa có một số API (sản phẩm, danh mục công khai, hồ sơ, theo dõi, lượt đặt của tôi, lọc phiên – `backend-contract.md` mục 4). Với màn hình phụ thuộc:
- Không tự bịa endpoint. Viết hàm trong `api.ts` gọi tới `src/mocks/<feature>.ts` (dữ liệu mẫu đúng type dự kiến) và đánh dấu `// TODO(backend B1): thay bằng API thật`.
- Hoặc ẩn tính năng theo cột "Frontend làm gì" trong bảng B.

## Bảo mật

- Token: ưu tiên cookie httpOnly qua route handler của Next.js; nếu nhóm chọn lưu ở client thì chỉ trong memory + `localStorage`, và ghi rõ hạn chế này trong báo cáo.
- Không đặt secret trong biến `NEXT_PUBLIC_*`. Không log token hay dữ liệu cá nhân ra console.
