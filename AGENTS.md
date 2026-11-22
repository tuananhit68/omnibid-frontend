# AGENTS.md — Omnibid Frontend (v4)

Bạn là agent viết frontend cho **Omnibid – sàn đấu giá trực tuyến** (Next.js). Frontend được **thiết kế lại theo API của backend v4** (coi như đã hoàn thành). **Chỉ giữ màu của Figma**; ảnh Figma cũ và wireframe trong tài liệu Thiết kế là tạm, không dùng làm căn cứ. Làm được **không cần backend đang chạy** nhờ hợp đồng dữ liệu chốt sẵn và chế độ mock.

## 1. Nguồn sự thật (ưu tiên từ trên xuống)
| Câu hỏi | Nguồn (`references/` = `.agents/skills/omnibid-fe-v4/references/`) |
|---|---|
| Endpoint, tham số, mã lỗi, envelope | `references/backend/API_SPEC_v4.md` |
| Dữ liệu trả về của từng endpoint (tên trường, kiểu) | `references/backend/RESPONSE_DTO_v4.md` — chốt chung với backend |
| Nghiệp vụ, quyền, trạng thái | `references/backend/BUSINESS_RULES_v4.md` |
| Danh sách màn, route, khối, hành vi theo vai trò | `references/SCREENS_v4.md` → `references/screens/*.md` |
| Cách gọi API, thời gian, xác thực, WebSocket | `references/API_CLIENT_FE.md` |
| Chạy không cần backend | `references/MOCK_MODE.md` |
| **Màu** (khóa) | `design/tokens/tokens.css` (bản dùng: `src/styles/tokens.css`) |
| Chữ, bề mặt, khung trang, component, nhãn trạng thái | `references/design/DESIGN_SYSTEM.md` |

Không bịa endpoint, trường, dữ liệu. Dữ liệu giả chỉ trong `src/mocks/` theo hợp đồng. Lệch giữa backend thật và hợp đồng → ghi "Lệch hợp đồng" vào `docs/v4/PROGRESS.md`.

## 2. Stack
Next.js 16 (App Router) + TypeScript strict + Tailwind CSS v4 (`@theme`) · TanStack Query · axios (`src/lib/api`) · react-hook-form + zod · `@stomp/stompjs` với WebSocket thuần `/ws` (không SockJS) · dayjs `utc`/`timezone` · `lucide-react` (chỉ icon danh mục, theo tài liệu v4). Không thêm thư viện khác khi chưa được đồng ý.

## 3. Lệnh
```bash
npm run dev        # http://localhost:3000; NEXT_PUBLIC_API_MODE=mock (không cần backend) hoặc live (backend ở NEXT_PUBLIC_API_URL)
npm run lint
npm run typecheck
npm run build      # phải pass trước khi báo xong một phase
powershell -ExecutionPolicy Bypass -File .agents\skills\omnibid-fe-v4\scripts\verify-fe-v4.ps1
```

## 4. Cấu trúc
```text
design/tokens/           # màu Figma — CHỈ ĐỌC
src/app/(public)/        # /, /auctions, /auctions/[id]
src/app/(auth)/          # /login, /register
src/app/(account)/       # /me/** và /orders/[id] — AccountLayout, chỉ USER
src/app/admin/           # /admin/** — AdminLayout, chỉ ADMIN
src/components/ui/       # component thuần giao diện
src/components/layout/   # PublicLayout, AccountLayout, AdminLayout, AuthLayout
src/features/<domain>/   # auth, account, auction, bid, product, order, notification, report, admin/*
src/lib/api/ (client, contract.ts)  src/lib/auth/  src/lib/ws/  src/lib/errors.ts  src/lib/format.ts
src/mocks/               # chế độ mock: adapter, db, seed, handlers, scheduler, ws-bus
src/types/enums.ts       # enum v4 + nhãn + tông
```

## 5. Quy tắc cứng
1. Chỉ class sinh từ token; không hex/rgb, không giá trị arbitrary; không `uppercase`/`tracking-wide*`/eyebrow; không viền màu một bên; font Be Vietnam Pro.
2. Icon từ `src/components/icons` (và `lucide-react` cho danh mục); không emoji.
3. `src/components/ui` không gọi API, không import `src/features`.
4. Mọi lời gọi API qua `src/lib/api`; envelope v4 `{success,data}` / `{success:false,error:{code,message,details}}`.
5. Enum, nhãn, màu badge chỉ lấy từ `src/types/enums.ts`; không hiển thị giá trị enum thô.
6. Không render số giá sàn trừ khi API trả cho chủ phiên/Admin.
7. Không tự tính kết quả nghiệp vụ để chặn; backend quyết định, frontend xử lý mã lỗi.
8. Không tự đổi trạng thái khi đồng hồ/hạn về 0; chờ WebSocket hoặc refetch.
9. Mỗi lần bấm Thanh toán một `Idempotency-Key` mới.
10. Không lưu mật khẩu, không log token, không commit `.env*`.
11. Không sửa `design/`, `.agents/` (trừ cập nhật kit khi được yêu cầu) và **không sửa repo backend**. `RESPONSE_DTO_v4.md` chỉ đổi khi người dùng đồng ý (sửa cả bản ở backend).
12. Mã mock chỉ được import từ `src/lib/api`, `src/lib/ws`, `src/app/dev`.

## 6. Cách làm việc
- Bắt đầu: `/omnibid-fe-v4` (điều phối phase 0–8). Từng màn: `/build-screen <id>`, rà: `/review-screen <id>`, component: `/new-component <Tên>`.
- Thiết kế mỗi màn từ dữ liệu DTO; màn đã có được làm lại, không cần giữ bố cục cũ.
- Một lần một phase/màn; lập kế hoạch trước khi code; xong thì dừng để review.
- Ghi tiến độ, giả định, "Cần backend" vào `docs/v4/PROGRESS.md`.

## 7. Git
Agent tạo nhánh và commit trên máy; người dùng review, push, mở PR, merge.
- Nhánh gốc `develop`; nhánh làm việc `feature/fe-v4` (một nhánh cho toàn bộ đợt đồng bộ, commit nhỏ theo màn).
- Bắt đầu: `git status` sạch; có thay đổi lạ → dừng, hỏi (không stash/xóa).
- Commit sau mỗi bước đã pass `lint` + `typecheck`; Conventional Commits tiếng Anh; `git add` từng tệp/thư mục.
- **Cấm:** `git push`, `--force`, `merge`, `rebase`, `reset --hard`, `clean -fd`, xóa nhánh, `--amend` commit cũ, đổi `git config`.

## 8. Định nghĩa "xong" một màn
- [ ] Đủ khối/trường/nút theo `screens/*.md`; chỉ màu token; theo DESIGN_SYSTEM.
- [ ] Chỉ endpoint v4, đúng tham số; mọi mã lỗi có câu tiếng Việt.
- [ ] Loading (skeleton), empty, error ("Thử lại"), success.
- [ ] Ẩn/hiện đúng vai trò và trạng thái.
- [ ] 375/768/1280 không cuộn ngang; bàn phím, focus, label, `aria-*`.
- [ ] Chạy đúng ở chế độ mock (và live khi có backend).
- [ ] `lint`, `typecheck`, `build` pass; `/review-screen` đạt.

## 9. Ngôn ngữ
Giao diện, thông báo: tiếng Việt có dấu. Biến, hàm, tệp, commit: tiếng Anh.
