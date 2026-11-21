# Hướng dẫn dùng kit Antigravity 2.0 — frontend Omnibid v4

**Hướng đi:** thiết kế lại frontend theo API backend v4; chỉ giữ màu Figma; không cần backend đang chạy.

## Kit gồm
```
AGENTS.md                                   luật dự án
.agents/rules/        10 rule (1 luôn bật, 4 theo glob, 5 theo ngữ cảnh)
.agents/skills/omnibid-fe-v4/               skill điều phối
  references/SCREENS_v4.md, screens/*.md    25 màn (id dùng với /build-screen), spec theo dữ liệu API
  references/backend/API_SPEC_v4.md         54 endpoint, tham số, mã lỗi
  references/backend/RESPONSE_DTO_v4.md     dữ liệu trả về của 54 endpoint — CHỐT, bản giống hệt ở repo backend
  references/backend/BUSINESS_RULES_v4.md   quy tắc nghiệp vụ
  references/API_CLIENT_FE.md               cách gọi API, thời gian, xác thực, WebSocket
  references/MOCK_MODE.md                   chạy không cần backend
  references/design/DESIGN_SYSTEM.md        màu (khóa) + hệ thiết kế mới
  references/GAP_ANALYSIS_FE.md, DELETE_LIST_FE.md
  scripts/verify-fe-v4.ps1
.agents/skills/fe-phase-0 … fe-phase-8, build-screen, review-screen, new-component
design/tokens/tokens.css                    bảng màu Figma (thứ duy nhất giữ lại)
docs/v4/PROGRESS.md                         tiến độ do agent ghi
```

## Không cần backend
1. Tên trường của mọi response đã chốt trong `RESPONSE_DTO_v4.md` → agent viết type mà không phải gọi backend.
2. `.env.local`: `NEXT_PUBLIC_API_MODE=mock` → mọi request đi vào `src/mocks` (kho dữ liệu trong trình duyệt, đúng envelope, mã lỗi, quy tắc nghiệp vụ chính, sự kiện realtime giả lập).
3. Trang `/dev/mock`: đăng nhập nhanh tài khoản mẫu, cho "người khác" đặt giá, tua đồng hồ (chốt phiên, hết hạn thanh toán), reset dữ liệu.
4. Khi có backend: đổi `NEXT_PUBLIC_API_MODE=live`. Ở dev, lớp API kiểm tra response bằng zod theo cùng hợp đồng và cảnh báo nếu backend trả khác.
Tài khoản mẫu (mock): `admin@omnibid.local` / `Admin@123456`; `seller@`, `buyer1@`, `buyer2@`, `banned@omnibid.local` / `Demo@1234`.

## Chạy
1. Mở `C:\Project\omnibid-frontend` trong Antigravity 2.0; Customizations phải thấy 10 rule, 13 skill.
2. Gõ `/omnibid-fe-v4` → phase 0, rồi "tiếp phase 1"… Làm lẻ một màn: `/build-screen order-detail`.
3. Cuối mỗi phase: `npm run build` + `verify-fe-v4.ps1` (còn báo thiếu route tới phase 7 là bình thường).

## Quyết định kit tự chốt
| Vấn đề | Kit chọn |
|---|---|
| Bố cục | Thiết kế lại từ dữ liệu API; 4 layout: Public, Account (`/me/**`), Admin, Auth |
| Kênh người bán riêng | Không có; gộp vào "Tài khoản của tôi" (v4 chỉ có USER vừa mua vừa bán) |
| Đơn hàng | Một trang `/orders/[id]` cho hai bên theo `viewerRole` |
| Thông báo | Không kênh realtime; chuông tải lại khi focus/điều hướng/60 giây |
| Icon danh mục | `lucide-react` (tài liệu v4 lưu tên icon lucide) |
| Hợp đồng response | Bổ sung một số trường dẫn xuất để UI không phải đoán: `viewerIsSeller`, `viewerIsLeading`, `orderId`, `viewerRole`, `activeAuctionId`, `everAuctioned`, `productCount`, `bannedUsers`, `targets` — đã thêm cùng tệp vào kit backend |

## Đã xóa
Bộ hướng dẫn cũ (`AGENTS.md`, `.agents/`, `design/*.md`, `design/specs/`), ảnh và cây layer Figma (`design/screens/`, `design/outline/`), wireframe tạm. Còn trong lịch sử Git.
