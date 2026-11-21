---
trigger: always_on
description: "Frontend Omnibid được thiết kế lại theo API backend v4; chỉ giữ màu Figma; làm được không cần backend nhờ hợp đồng chốt sẵn và chế độ mock."
---
# Frontend v4 — luật nền
- Chuẩn: `.agents/skills/omnibid-fe-v4/references/` — `SCREENS_v4.md` + `screens/*.md` (màn), `backend/API_SPEC_v4.md` (endpoint, mã lỗi), `backend/RESPONSE_DTO_v4.md` (dữ liệu trả về — chốt, dùng chung với backend), `API_CLIENT_FE.md`, `MOCK_MODE.md`, `design/DESIGN_SYSTEM.md`.
- **Chỉ màu** lấy từ Figma (`design/tokens/tokens.css`). Bố cục, component, luồng được thiết kế lại theo dữ liệu API. Không dựa vào ảnh Figma cũ hay wireframe tạm của tài liệu.
- Thứ tự khi mâu thuẫn: `RESPONSE_DTO_v4.md`/`API_SPEC_v4.md` → `screens/*.md` → `DESIGN_SYSTEM.md`. Khi chạy live mà backend trả khác hợp đồng: ghi "Lệch hợp đồng" vào PROGRESS.md, không tự đổi hợp đồng.
- Không cần backend đang chạy: phát triển bằng `NEXT_PUBLIC_API_MODE=mock`. Mock phải theo đúng hợp đồng; không viết dữ liệu cứng trong component.
- Không bịa endpoint, trường, mã lỗi. Không có watchlist, vận chuyển nhiều bước, nhật ký hệ thống, khiếu nại riêng, BidStatus.
- Tiến độ: `docs/v4/PROGRESS.md` — đọc đầu phiên, cập nhật cuối phase. Làm theo `/omnibid-fe-v4` hoặc `/build-screen <id>`; xong thì dừng để review.
- Trước khi báo xong: `npm run lint`, `npm run typecheck`; cuối phase thêm `npm run build`.
