# OmniBid – Frontend (v4)

Giao diện web cho **OmniBid – sàn đấu giá trực tuyến** (Next.js App Router), thiết kế lại theo hợp đồng API backend v4 (54 endpoint REST + STOMP WebSocket thuần `/ws`). Hỗ trợ phát triển và demo hoàn chỉnh **không cần backend** nhờ chế độ giả lập (`NEXT_PUBLIC_API_MODE=mock`).

## Công nghệ

| Phần | Lựa chọn |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| Giao diện | Tailwind CSS v4 (`@theme`), bảng màu khóa từ Figma (`src/styles/tokens.css`), font Be Vietnam Pro |
| Dữ liệu | TanStack Query v5, axios (`src/lib/api`) |
| Biểu mẫu & kiểm tra | react-hook-form, zod (`src/lib/api/contract.ts`) |
| Realtime | `@stomp/stompjs` trên WebSocket thuần `/ws` (không dùng SockJS) |
| Thời gian | `dayjs` (`utc`, `timezone` – múi giờ Việt Nam `Asia/Ho_Chi_Minh`) |
| Biểu tượng | `src/components/icons` + `lucide-react` (dành riêng cho icon danh mục) |

## Chạy dự án

Yêu cầu: Node.js 20 LTS trở lên.

```bash
npm install
cp .env.example .env.local
npm run dev   # http://localhost:3000
```

### Biến môi trường

File `.env.example` mặc định cấu hình chế độ `live`. Tạo `.env.local` để chọn chế độ chạy trên máy (không commit `.env*`):

| Biến | Giá trị mẫu | Ý nghĩa |
| --- | --- | --- |
| `NEXT_PUBLIC_API_MODE` | `mock` hoặc `live` | `mock`: chạy bằng kho giả lập trong trình duyệt (`src/mocks/`); `live`: gọi backend thật |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | URL gốc REST API backend v4 (dùng khi `API_MODE=live`) |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:8080/ws` | Endpoint STOMP WebSocket thuần (dùng khi `API_MODE=live`) |
| `NEXT_PUBLIC_DEMO_MODE` | `true` | Hiện lựa chọn kết quả thanh toán mô phỏng (`SUCCESS` / `FAILED`) trên trang chi tiết đơn |

### Chạy chế độ Mock (không cần backend)

1. Đặt `NEXT_PUBLIC_API_MODE=mock` trong `.env.local`.
2. Chạy `npm run dev` và truy cập `http://localhost:3000`.
3. Mở `/dev/mock` để đăng nhập nhanh theo vai trò, giả lập người khác đặt giá (phát sự kiện WS `BID_PLACED`), tua thời gian để kích hoạt chốt phiên / hết hạn đơn, đổi kết quả thanh toán mặc định hoặc đặt lại toàn bộ dữ liệu giả lập.

### Chạy chế độ Live (có backend v4)

1. Khởi chạy backend OmniBid v4 (mặc định tại `http://localhost:8080`).
2. Đặt `NEXT_PUBLIC_API_MODE=live`, `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_WS_URL` trong `.env.local`.
3. Chạy `npm run dev` (hoặc `npm run build` rồi `npm run start`).

### Lệnh kiểm tra

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Chạy môi trường phát triển (`http://localhost:3000`) |
| `npm run lint` | Kiểm tra ESLint |
| `npm run typecheck` | Kiểm tra kiểu TypeScript (`tsc --noEmit`) |
| `npm run build` | Build production (Next.js Turbopack) |
| `npm run start` | Chạy bản build production |
| `powershell -ExecutionPolicy Bypass -File .agents\skills\omnibid-fe-v4\scripts\verify-fe-v4.ps1` | Rà soát tuân thủ quy chuẩn frontend v4 |

## Tài khoản mẫu (chế độ Mock)

| Email | Mật khẩu | Vai trò | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- |
| `admin@omnibid.local` | `Admin@123456` | `ADMIN` | `ACTIVE` | Quản trị viên |
| `seller@omnibid.local` | `Demo@1234` | `USER` | `ACTIVE` | Trần Minh Quân (có sản phẩm, phiên, đơn bán) |
| `buyer1@omnibid.local` | `Demo@1234` | `USER` | `ACTIVE` | Nguyễn Thị Lan Anh (có lượt đặt giá, đơn mua) |
| `buyer2@omnibid.local` | `Demo@1234` | `USER` | `ACTIVE` | Lê Hoàng Nam (người mua tham gia đấu giá) |
| `banned@omnibid.local` | `Demo@1234` | `USER` | `BANNED` | Phạm Văn Khóa (kiểm thử tài khoản bị khóa) |

## Danh sách route (theo `SCREENS_v4.md`)

### Công khai (`PublicLayout`)
- `/` — Trang chủ (`home`)
- `/auctions` — Danh sách, tìm kiếm và lọc phiên đấu giá (`auction-list`)
- `/auctions/[id]` — Chi tiết phiên và đặt giá realtime (`auction-detail`)

### Xác thực (`AuthLayout`, khách chưa đăng nhập)
- `/login` — Đăng nhập (`login`)
- `/register` — Đăng ký (`register`)

### Tài khoản cá nhân (`AccountLayout`, vai trò `USER`)
- `/me/profile` — Hồ sơ cá nhân, ảnh đại diện, đổi mật khẩu (`profile`)
- `/me/products` — Sản phẩm của tôi (`my-products`)
- `/me/products/new` — Thêm sản phẩm mới (`product-form`)
- `/me/products/[id]/edit` — Sửa sản phẩm (`product-form`)
- `/me/auctions` — Phiên đấu giá của tôi (`my-auctions`)
- `/me/auctions/new` — Tạo phiên đấu giá (`auction-create`)
- `/me/auctions/[id]` — Quản lý một phiên: sửa khi `SCHEDULED`, hủy có lý do (`my-auction`)
- `/me/bids` — Lượt đặt giá của tôi (`my-bids`)
- `/me/orders` — Đơn hàng mua / bán (`my-orders`)
- `/orders/[id]` — Chi tiết đơn chung cho hai bên: thanh toán, gửi hàng, xác nhận nhận hàng (`order-detail`)
- `/me/notifications` — Danh sách thông báo (`notifications`)

### Quản trị (`AdminLayout`, vai trò `ADMIN`)
- `/admin` — Tổng quan thống kê (`admin-dashboard`)
- `/admin/users` — Quản lý người dùng: khóa / mở khóa (`admin-users`)
- `/admin/categories` — Quản lý danh mục + icon `lucide-react` (`admin-categories`)
- `/admin/products` — Danh sách sản phẩm (`admin-products`)
- `/admin/products/[id]` — Chi tiết sản phẩm & ẩn vĩnh viễn (`admin-products`)
- `/admin/auctions` — Danh sách phiên đấu giá (`admin-auctions`)
- `/admin/auctions/[id]` — Chi tiết phiên & hủy phiên có lý do (`admin-auctions`)
- `/admin/orders` — Danh sách đơn hàng (`admin-orders`)
- `/admin/orders/[id]` — Chi tiết đơn hàng & hủy đơn khi chờ thanh toán (`admin-orders`)
- `/admin/reports` — Danh sách báo cáo vi phạm (`admin-reports`)
- `/admin/reports/[id]` — Chi tiết và xử lý báo cáo vi phạm (`admin-reports`)
- `/admin/profile` — Hồ sơ quản trị viên (`admin-profile`)

### Hệ thống & phát triển
- `/403` — Không có quyền truy cập
- `/dev/ui` — Thư viện component giao diện dùng chung
- `/dev/mock` — Bảng điều khiển giả lập (chỉ hoạt động khi `NEXT_PUBLIC_API_MODE=mock`)

## Cấu trúc thư mục

```text
design/tokens/            # Bảng màu khóa từ Figma (chỉ đọc)
docs/v4/PROGRESS.md       # Nhật ký tiến độ, quyết định và lệch hợp đồng
src/
  app/
    (public)/             # /, /auctions, /auctions/[id]
    (auth)/               # /login, /register
    (account)/            # /me/**, /orders/[id]
    admin/                # /admin/**
    dev/                  # /dev/ui, /dev/mock
  components/
    ui/                   # Component thuần giao diện (không gọi API)
    layout/               # PublicLayout, AccountLayout, AdminLayout, AuthLayout
    icons/                # Icon SVG dùng chung + CategoryIcon (lucide-react)
  features/               # auth, account, auction, bid, product, order, notification, report, admin/*
  lib/
    api/                  # Axios client, envelope v4, contract.ts (zod)
    auth/                 # Phiên đăng nhập, bảo vệ route
    ws/                   # STOMP /ws client + cầu nối mock
    errors.ts             # Bảng thông báo lỗi tiếng Việt theo ErrorCode
    format.ts             # Định dạng tiền, thời gian GMT+7
  mocks/                  # Adapter, kho dữ liệu, seed, handlers, scheduler, ws-bus
  styles/tokens.css       # Token màu, chữ, bề mặt, khoảng cách
  types/enums.ts          # Enum v4 + nhãn tiếng Việt + tông badge
  proxy.ts                # Điều hướng và bảo vệ route theo vai trò (Next.js 16)
```

## Quy ước phát triển

- **Nguồn sự thật**: `.agents/skills/omnibid-fe-v4/references/` (`API_SPEC_v4.md`, `RESPONSE_DTO_v4.md`, `BUSINESS_RULES_v4.md`, `SCREENS_v4.md`, `DESIGN_SYSTEM.md`).
- **Màu & giao diện**: chỉ dùng class sinh từ token trong `src/styles/tokens.css`, font Be Vietnam Pro, không dùng chữ hoa nhỏ (`uppercase`/`tracking-wide*`) hay viền màu một bên.
- **Ngôn ngữ**: giao diện và thông báo tiếng Việt có dấu; mã nguồn, tên file và commit message tiếng Anh theo Conventional Commits.
- **Git**: nhánh gốc `develop`, nhánh phát triển `feature/fe-v4`.
