---
name: omnibid-fe-v4
description: Điều phối việc thiết kế lại và làm frontend Omnibid (Next.js) theo API backend v4 — sửa màn đã có, làm màn mới, chỉ giữ màu Figma, chạy được không cần backend nhờ hợp đồng RESPONSE_DTO_v4 và chế độ mock. Dùng khi người dùng yêu cầu làm/sửa frontend theo v4, hỏi phase tiếp theo, hoặc làm một màn bất kỳ.
---
# Omnibid frontend — thiết kế lại theo API v4

## Khi được gọi
1. Đọc `docs/v4/PROGRESS.md`. Chưa có dấu [x] → phase 0.
2. Đọc `references/SCREENS_v4.md`, `references/GAP_ANALYSIS_FE.md`.
3. Làm **một phase mỗi lần**; trong phase làm từng màn bằng `/build-screen <id>`. Hết phase: `lint` + `typecheck` + `build`, cập nhật PROGRESS.md, commit, **dừng báo cáo**. Chỉ chuyển phase khi người dùng đồng ý, trừ khi họ bảo chạy liên tục.
4. Mặc định làm ở chế độ mock (`NEXT_PUBLIC_API_MODE=mock`). Nếu người dùng nói backend đang chạy, kiểm thêm ở chế độ live.

## Phase
| Phase | Skill | Nội dung | Màn (id) |
|---|---|---|---|
| 0 | `fe-phase-0-prepare` | nhánh, baseline | – |
| 1 | `fe-phase-1-foundation` | hợp đồng `contract.ts`, client v4, lỗi, thời gian, phiên, proxy, WS, **khung mock**, hệ thiết kế (token chữ/bề mặt), UI kit, 4 layout, gỡ code cũ | – |
| 2 | `fe-phase-2-auth-account` | tài khoản | `login`, `register`, `profile`, `admin-profile` |
| 3 | `fe-phase-3-public-auctions` | phiên công khai + realtime | `home`, `auction-list`, `auction-detail`, `report-modal` |
| 4 | `fe-phase-4-selling` | bán hàng | `my-products`, `product-form`, `auction-create`, `my-auctions`, `my-auction` |
| 5 | `fe-phase-5-buying-orders` | mua hàng, đơn | `my-bids`, `my-orders`, `order-detail` |
| 6 | `fe-phase-6-notifications` | thông báo | `notifications`, `notification-bell` |
| 7 | `fe-phase-7-admin` | quản trị | `admin-dashboard`, `admin-users`, `admin-categories`, `admin-products`, `admin-auctions`, `admin-orders`, `admin-reports` |
| 8 | `fe-phase-8-final-review` | rà soát, demo đầu-cuối bằng mock (và live nếu có backend) | – |

## Tài liệu (`references/`)
- `SCREENS_v4.md`, `screens/*.md` — danh mục và spec màn (khối, trường, API, hành vi theo vai trò, mã lỗi).
- `backend/API_SPEC_v4.md` (endpoint, tham số, mã lỗi), `backend/RESPONSE_DTO_v4.md` (dữ liệu trả về — chốt chung với backend), `backend/BUSINESS_RULES_v4.md`, `backend/API_CHANGES_FOR_FRONTEND.md`.
- `API_CLIENT_FE.md` — envelope, lỗi, thời gian, xác thực, cách gọi, WebSocket.
- `MOCK_MODE.md` — chạy không cần backend.
- `design/DESIGN_SYSTEM.md` — màu (khóa), chữ, bề mặt, khung trang, component, nhãn trạng thái.
- `GAP_ANALYSIS_FE.md`, `DELETE_LIST_FE.md`; `scripts/verify-fe-v4.ps1`.

## Nguyên tắc
- Thiết kế mỗi màn từ dữ liệu: liệt kê trường của DTO → nhóm theo việc người dùng cần làm → chọn component trong DESIGN_SYSTEM. Màn SỬA được làm lại, không cần giữ bố cục cũ, nhưng tái dùng component tốt đã có.
- Mỗi màn: loading/empty/error, mã lỗi, vai trò, responsive 375/768/1280, a11y.
- Không sửa repo backend. Hợp đồng chỉ đổi khi người dùng đồng ý và sửa cả hai bản `RESPONSE_DTO_v4.md`.
- Thư viện mới: chỉ `lucide-react` (icon danh mục theo tài liệu v4); thư viện khác phải hỏi.
