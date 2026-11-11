# AGENTS.md – OmniBid Frontend

Bạn là agent viết frontend cho **OmniBid – sàn đấu giá trực tuyến**. Backend đã có sẵn và là chuẩn nghiệp vụ. Figma đã được xuất thành thư mục `design/`. **Giữ như Figma: màu, chức năng, thứ tự thông tin.** Kiểu dáng theo hướng "Rõ ràng, đáng tin" trong `design/style-overrides.md`: font Be Vietnam Pro, chữ mặc định 15/24, card phẳng viền mảnh, con số lớn và đều, không nhãn chữ hoa, không viền màu một bên. Việc của bạn là dựng giao diện theo hướng đó và nối đúng API.

## 1. Nguồn sự thật (thứ tự ưu tiên khi mâu thuẫn)

| Câu hỏi                                            | Nguồn quyết định                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Nghiệp vụ, quyền, trạng thái, số tiền hợp lệ       | Response của backend (`/api/v1`) → `design/backend-contract.md` → `design/gaps.md` |
| Endpoint, tên trường, mã lỗi                       | `design/backend-contract.md` (đối chiếu từ code backend)                           |
| **Màu** (bắt buộc giữ như Figma)                   | `design/tokens/tokens.css`                                                         |
| Font, kiểu chữ, trang trí – thắng ảnh Figma        | `design/style-overrides.md`                                                        |
| Khối, trường, nút, cột của từng màn hình           | `design/specs/Sxx-*.md`                                                            |
| Bố cục, kích thước (tham khảo, được chỉnh cho gọn) | bảng số đo trong spec → `design/outline/Sxx.txt` → ảnh `design/screens/`           |
| Component, variant, nhãn và màu của trạng thái     | `design/components.md`                                                             |
| Khung trang, responsive                            | `design/layouts.md`                                                                |
| Accessibility, UX khi Figma không vẽ               | `.agents/rules/accessibility.md`, `.agents/rules/ux-states.md`                     |

Khi Figma vẽ dữ liệu mà backend không có: làm theo cách xử lý trong `design/gaps.md` (thường là ẩn). **Không bịa dữ liệu, không bịa endpoint, không tự thêm trường vào request.**

Skill thiết kế (Impeccable, UI UX Pro Max…) được dùng cho kiểu chữ, khoảng cách, bố cục, trạng thái và accessibility, **nhưng không được đổi bảng màu**: không thêm màu, gradient, bóng màu. Xem `.agents/rules/design-skills.md`.

## 2. Stack

- Next.js (App Router) + TypeScript strict + Tailwind CSS v4 (token khai báo bằng `@theme`)
- TanStack Query (dữ liệu server) · axios (`src/lib/api`) · react-hook-form + zod (form)
- @stomp/stompjs + sockjs-client (WebSocket `/ws-auction`) · dayjs + plugin `utc`/`timezone` (giờ Việt Nam)
- Không thêm thư viện UI (MUI, Ant, Chakra, shadcn…) hay thư viện state toàn cục khi chưa được đồng ý.

## 3. Lệnh

```bash
npm run dev         # http://localhost:3000, backend ở NEXT_PUBLIC_API_URL
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # phải pass trước khi báo xong
```

Chạy `lint` + `typecheck` sau mỗi thay đổi. Không báo "xong" khi còn lỗi.

## 4. Cấu trúc thư mục

```text
design/                 # bàn giao Figma – CHỈ ĐỌC, không sửa
src/app/
  (public)/             # Guest xem được: /, /auctions, /auctions/[id]
  (auth)/               # /login, /register
  (user)/               # cần đăng nhập: /me/*, /watchlist, /notifications, /orders/*, /seller/*
  admin/                # chỉ ADMIN
src/components/ui/      # component thuần giao diện, không gọi API
src/components/layout/  # PublicLayout, SellerLayout, AdminLayout, AuthLayout
src/components/icons/   # SVG export từ Figma, dùng currentColor
src/features/<domain>/  # auth, auction, bid, product, order, payment, shipment, notification, report, admin
  api.ts  hooks.ts  types.ts  schemas.ts  components/
src/lib/api/            # axios client, interceptor JWT, chuẩn hoá lỗi
src/lib/ws/             # kết nối STOMP, hook useAuctionChannel, useUserNotifications
src/lib/errors.ts       # mã lỗi backend → câu tiếng Việt
src/lib/format.ts       # tiền VND, ngày giờ, đếm ngược, che tên/SĐT
src/types/enums.ts      # enum giống hệt backend + label + tone
```

## 5. Quy tắc cứng (vi phạm là phải sửa)

1. Không mã màu hex/rgb, không giá trị arbitrary kiểu `text-[13px]`, `p-[18px]`, `bg-[#...]` trong component. Chỉ dùng class sinh từ token.
2. Không dùng emoji làm icon. Icon lấy từ `src/components/icons` (SVG Figma).
   2a. Font Be Vietnam Pro, không dùng Inter. Không dùng `uppercase`, `tracking-wide/wider/widest`, không đặt nhãn chữ nhỏ phía trên tiêu đề. Không dùng viền màu một bên (`border-l-4`, `border-t-4`… có màu) để nhấn card, hàng, hộp thông báo.
3. Component trong `src/components/ui` không gọi API, không import từ `src/features`.
4. Mọi lời gọi API đi qua `src/lib/api`. Envelope `{ success, errorCode, message, data, timestamp }`. Endpoint, DTO, mã lỗi theo `design/backend-contract.md` – file này thắng mục API trong spec. Không bịa endpoint hay tên trường ngoài file đó.
5. Mọi enum, nhãn trạng thái và màu badge lấy từ `src/types/enums.ts`. Không viết lại nhãn trong trang.
6. Không hiển thị con số **giá sàn** (`reservePrice`) ở bất kỳ trang nào của người mua, kể cả trong DOM ẩn. Chỉ chủ phiên (S17) và admin được thấy.
7. Không tự tính kết quả nghiệp vụ để chặn người dùng (giá tối thiểu, quyền, hạn thanh toán, trạng thái). Frontend chỉ gợi ý, khoá nút để dẫn hướng; backend quyết định và frontend xử lý mã lỗi trả về.
8. Không tự đổi trạng thái khi đồng hồ về 0. Chờ WebSocket hoặc refetch.
9. Mỗi thao tác thanh toán sinh `Idempotency-Key` mới; chỉ dùng lại key khi retry cùng một lần bấm.
10. Không lưu mật khẩu, không log token, không commit `.env*`. Không push – xem mục 7.
11. Không sửa file trong `design/` và `.agents/` trừ khi được yêu cầu rõ ràng.

## 6. Cách làm việc

- **Một lần một việc**: 1 màn hình hoặc 1 nhóm component. Xong thì dừng để review.
- **Lên kế hoạch trước khi code**: liệt kê file sẽ tạo/sửa, component tái dùng, API gọi, mã lỗi cần xử lý. Chờ đồng ý.
- **Trước khi làm màn hình Sxx**: đọc `design/README.md`, `design/style-overrides.md`, `design/gaps.md`, `design/layouts.md`, `design/components.md`, rồi `design/specs/Sxx-*.md`. Màu lấy đúng token; số đo trong spec là điểm xuất phát, được chỉnh cho gọn và đều.
- **Thiếu thông tin** (API chưa rõ, Figma không vẽ trạng thái): hỏi lại, hoặc làm theo mặc định trong `design/gaps.md` và ghi rõ đã giả định gì.
- **Tái dùng trước khi tạo mới**: tìm trong `src/components/ui` và `src/features/*/components` trước. Không tạo bản sao gần giống.
- Dùng workflow `/build-screen`, `/review-screen`, `/new-component`, `/swap-mocks` trong `.agents/workflows/`.

## 7. Git

Agent **tự tạo nhánh và commit trên máy**; người dùng review, push, mở PR và merge. Agent không bao giờ đẩy code lên remote.

- Nhánh gốc: `develop`. Mỗi màn hình một nhánh: `feature/S05-auction-detail`; nền móng: `feature/phase-0-foundation`; sửa lỗi: `fix/<mô-tả-ngắn>`.
- Bắt đầu việc: `git status` phải sạch – nếu có thay đổi chưa commit thì **dừng và hỏi**, không stash/xoá. Rồi `git switch develop && git pull --ff-only && git switch -c <nhánh>`. Nhánh đã có thì `git switch <nhánh>`, không tạo lại.
- Commit sau mỗi bước code xong **và** đã pass `lint` + `typecheck` (vd: types+api+hooks · component · trang). Conventional Commits tiếng Anh: `feat(bid): add bid panel for S05`, `fix(order): handle PAYMENT_RATE_LIMITED`. Commit nhỏ, đúng phạm vi màn hình.
- `git add` từng file/thư mục đã sửa, không `git add -A` mù. Không commit `.env*`, file build, file trong `design/` và `.agents/` (trừ khi được yêu cầu).
- Sandbox chặn ghi `.git/`: xin phép chạy **ngoài sandbox** cho lệnh git cục bộ (`switch`, `pull --ff-only`, `add`, `commit`, `status`, `log`, `diff`); người dùng đã đồng ý trước cho các lệnh này. Không bao giờ xin chạy `push` hay lệnh trong danh sách cấm dưới đây.
- **Cấm**: `git push` (mọi dạng), `--force`, `merge`, `rebase`, `reset --hard`, `clean -fd`, xoá nhánh, sửa commit đã có (`--amend` trên commit cũ), đổi `git config`, đụng repo backend.
- Kết thúc: in `git log --oneline develop..HEAD` và `git diff --stat develop...HEAD`, đề xuất tiêu đề + mô tả PR (màn hình, ảnh chụp cần đính kèm, checklist `/review-screen`, giả định đã dùng).

## 8. Định nghĩa "xong" cho một màn hình

- [ ] Màu khớp Figma (chỉ token); có đủ khối, trường, nút theo spec, đúng thứ tự và nhóm thông tin.
- [ ] Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên.
- [ ] Ở 375px và 768px không cuộn ngang, theo `design/layouts.md` mục 5.
- [ ] Có đủ trạng thái loading (skeleton đúng kích thước), empty, error (có "Thử lại"), success.
- [ ] Xử lý mọi mã lỗi liệt kê trong spec bằng câu tiếng Việt từ `lib/errors.ts`.
- [ ] Đi hết trang bằng bàn phím, focus ring nhìn thấy, nút icon có `aria-label`, form có label và lỗi dưới ô.
- [ ] Nút ẩn/hiện đúng vai trò (Guest, User, chủ phiên, người mua, Admin) và trạng thái.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` đều pass.
- [ ] Báo lại: file đã đổi, giả định đã dùng, phần còn thiếu.

## 9. Ngôn ngữ

Giao diện, thông báo lỗi, nội dung hiển thị: tiếng Việt có dấu. Tên biến, hàm, file, commit message: tiếng Anh. Comment code: tiếng Việt hoặc tiếng Anh đều được, ngắn gọn.
