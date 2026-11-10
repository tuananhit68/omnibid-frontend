# OmniBid – Frontend

Giao diện web cho **OmniBid – sàn đấu giá trực tuyến**: khách xem phiên, người dùng đặt giá realtime, thanh toán mô phỏng, theo dõi vận chuyển, đăng bán sản phẩm; quản trị viên kiểm duyệt và xử lý báo cáo.

Frontend này được viết theo cách vibecoding với agent Antigravity, dựa trên bộ bàn giao thiết kế từ Figma trong thư mục `design/` và backend REST + WebSocket có sẵn.

## Công nghệ

| Phần      | Lựa chọn                                                                          |
| --------- | --------------------------------------------------------------------------------- |
| Framework | Next.js (App Router), React, TypeScript strict                                    |
| Giao diện | Tailwind CSS v4, bảng màu từ Figma (`src/styles/tokens.css`), font Be Vietnam Pro |
| Dữ liệu   | TanStack Query, axios                                                             |
| Form      | react-hook-form, zod                                                              |
| Realtime  | @stomp/stompjs, sockjs-client                                                     |
| Thời gian | dayjs (giờ Việt Nam GMT+7)                                                        |

## Chạy dự án

Yêu cầu: Node.js 20 LTS trở lên, backend OmniBid đang chạy (mặc định `http://localhost:8080`).

```bash
git clone <repo-url> omnibid-web
cd omnibid-web
npm install
cp .env.example .env.local   # sửa giá trị nếu backend chạy chỗ khác
npm run dev                  # http://localhost:3000
```

### Biến môi trường (`.env.local`)

| Biến                    | Ví dụ                              | Ý nghĩa                                 |
| ----------------------- | ---------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_API_URL`   | `http://localhost:8080/api/v1`     | Gốc REST API                            |
| `NEXT_PUBLIC_WS_URL`    | `http://localhost:8080/ws-auction` | Endpoint STOMP/SockJS                   |
| `NEXT_PUBLIC_DEMO_MODE` | `true`                             | Hiện ô chọn kết quả thanh toán mô phỏng |

Không đặt secret vào biến `NEXT_PUBLIC_*` – chúng lộ ra trình duyệt.

### Lệnh

| Lệnh                | Việc làm                                     |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Chạy môi trường phát triển                   |
| `npm run lint`      | Kiểm tra ESLint                              |
| `npm run typecheck` | Kiểm tra kiểu (`tsc --noEmit`)               |
| `npm run build`     | Build production – phải pass trước khi merge |
| `npm run start`     | Chạy bản build                               |

Thêm `"typecheck": "tsc --noEmit"` vào `scripts` của `package.json` nếu chưa có.

Tài khoản demo: lấy từ dữ liệu seed của backend (USER và ADMIN).

## Cấu trúc thư mục

```text
.agents/
  rules/            # quy tắc cho agent Antigravity (tự nạp theo ngữ cảnh)
  workflows/        # lệnh /phase-0-foundation, /build-screen, /review-screen, /new-component
AGENTS.md           # hướng dẫn tổng cho agent (luôn được nạp)
design/             # bàn giao từ Figma – chỉ đọc
  README.md         # mục lục 28 màn hình
  gaps.md           # chỗ Figma lệch backend – đọc trước khi code
  layouts.md        # khung trang + responsive
  components.md     # thư viện component
  tokens/tokens.css # màu, chữ, bo góc, bóng
  specs/            # spec từng màn hình S00–S26
  outline/          # cây layer đầy đủ từng frame
  screens/          # ảnh PNG @2x
src/
  app/              # route: (public) (auth) (user) admin, dev/ui
  components/       # ui, layout, icons – dùng chung, không gọi API
  features/         # auth, auction, bid, product, order, payment, shipment, notification, report, admin
  lib/              # api, ws, errors, format, cn
  styles/tokens.css
  types/enums.ts
```

## Thiết kế

- **Chỉ màu là bắt buộc giống Figma.** Font dùng Be Vietnam Pro thay Inter; bỏ nhãn chữ hoa nhỏ phía trên tiêu đề và viền màu một bên. Các điều chỉnh này nằm trong `design/style-overrides.md` và thắng ảnh Figma.
- Nội dung, chức năng mỗi màn hình theo `design/specs`; bố cục và số đo trong đó là điểm xuất phát, được chỉnh cho gọn.
- `design/` được trích từ Figma (gói Starter, không dùng MCP), không cần mở Figma khi code.
- **Nguồn sự thật cho nghiệp vụ** là backend. Chỗ nào Figma vẽ dữ liệu backend không có, làm theo `design/gaps.md`.
- Khi nhóm design sửa Figma: tải lại JSON file Figma (1 lần gọi REST API), xuất lại ảnh frame bị đổi, sinh lại `design/specs` + `design/outline`, commit với message `design: cập nhật Sxx`.

## Làm việc với agent (Antigravity)

Antigravity tự đọc `AGENTS.md` ở gốc repo và các rule trong `.agents/rules/`:

| Rule                                                                                            | Khi nào nạp                               |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `styling-tokens.md`, `accessibility.md`                                                         | khi sửa file `src/**/*.tsx`               |
| `components-ui.md`                                                                              | khi sửa `src/components/**`               |
| `nextjs-app.md`                                                                                 | khi sửa `src/app/**`                      |
| `ux-states.md`, `api-data.md`, `realtime-websocket.md`, `business-rules.md`, `design-skills.md` | agent tự nạp khi việc đang làm khớp mô tả |

### Skill thiết kế

Có thể cài [Impeccable](https://github.com/pbakaus/impeccable) vào `.agents/skills/` để tinh chỉnh kiểu chữ, khoảng cách, bố cục. Chạy `teach` và `document` một lần, sau đó dùng `audit`, `polish`, `typeset`, `layout`, `harden` trên từng màn hình đã xong. Không dùng các lệnh đổi màu (`colorize`, `bolder`). Chi tiết trong `.agents/rules/design-skills.md`.

Mở bảng Customizations của Antigravity để kiểm tra các rule đều hiện ra; rule thiếu frontmatter hợp lệ sẽ bị bỏ qua mà không báo.

### Quy trình

1. Lần đầu: `/phase-0-foundation` – token, component, layout, API client, WebSocket, trang `/dev/ui`.
2. Mỗi màn hình: `/build-screen S05` → đọc kế hoạch agent đưa ra → đồng ý → agent code → `/review-screen S05`.
3. Thứ tự màn hình theo phase trong `design/README.md`: tài khoản → sản phẩm → phiên → đặt giá → sau đấu giá → thông báo → admin.
4. Mỗi màn hình một nhánh (agent tạo) và một PR (bạn mở sau khi push).

### Mẹo để agent làm đúng

- Mỗi lần chỉ giao 1 màn hình hoặc 1 nhóm component. Mở cuộc chat mới khi chuyển màn hình.
- Luôn bắt agent đưa kế hoạch trước khi code (workflow đã có sẵn bước này).
- Khi sửa, dán đúng mục bị trượt trong checklist `/review-screen`, không yêu cầu chung chung kiểu "làm lại cho đẹp".
- Dán JSON response thật từ Postman khi agent viết type cho API mới.

## Quy ước

- **Ai làm gì với Git**: agent tự tạo nhánh từ `develop` và commit trên máy sau mỗi bước pass lint/typecheck; **bạn** xem diff, push, mở PR, merge. Agent không push, không merge, không rebase (`AGENTS.md` mục 7).
- **Branch**: `feature/S05-auction-detail-bid`, `feature/phase-0-foundation`, `fix/bid-panel-error`. Nhánh gốc `develop` – Mọi nhánh `feature/fix` đều được tạo từ `develop`.
- **Commit** (Conventional Commits, tiếng Anh): `feat(bid): S05 realtime bid panel`, `fix(order): handle PAYMENT_RATE_LIMITED`, `design: update S11 specs`.
- **PR**: ghi màn hình, ảnh chụp 1280/375px, checklist `/review-screen` đã tick, giả định đã dùng.
- **Đặt tên**: component `PascalCase.tsx`, hook `useXxx`, file tiện ích `camelCase.ts`, route theo kebab-case.
- **Ngôn ngữ**: giao diện tiếng Việt có dấu; code và commit tiếng Anh.

## Định nghĩa "xong"

Một màn hình được merge khi: màu đúng bảng màu Figma, đủ nội dung theo spec, không chữ hoa nhỏ và không viền màu một bên; không cuộn ngang ở 375px; có đủ loading/empty/error; xử lý mọi mã lỗi trong spec; dùng được bằng bàn phím; ẩn/hiện đúng vai trò; `lint`, `typecheck`, `build` đều pass. Chi tiết trong `AGENTS.md` mục 7.

## Kiểm thử trước demo

Chạy 6 kịch bản trên giao diện:

1. Đặt giá hợp lệ và không hợp lệ (thấp hơn giá tối thiểu, tự đặt giá phiên của mình, đang dẫn đầu).
2. Hai trình duyệt đặt giá cùng lúc – giá cập nhật ở cả hai, chỉ một lượt thắng.
3. Phiên kết thúc: có người thắng (tạo đơn) và không đạt giá sàn (UNSOLD).
4. Thanh toán thất bại → thử lại → thành công → giao hàng → xác nhận → hoàn tất.
5. Đơn quá hạn thanh toán chuyển EXPIRED.
6. Admin khoá tài khoản đang dẫn đầu một phiên.
