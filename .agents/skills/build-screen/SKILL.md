---
name: build-screen
description: Thiết kế lại hoặc dựng mới một màn hình Omnibid theo API backend v4. Cách gọi /build-screen auction-detail (id trong SCREENS_v4.md). Không cần backend đang chạy.
---
# /build-screen <id>

1. **Nhánh:** `feature/fe-v4`; `git status` có thay đổi lạ → dừng, hỏi.
2. **Đọc:** dòng `<id>` trong `.agents/skills/omnibid-fe-v4/references/SCREENS_v4.md` → mục `<id>` trong `references/screens/<nhóm>.md` → các endpoint `#n` trong `backend/API_SPEC_v4.md` và DTO trong `backend/RESPONSE_DTO_v4.md` → `API_CLIENT_FE.md` (phần liên quan) → `design/DESIGN_SYSTEM.md`.
3. **Thiết kế từ dữ liệu** (trình bày ngắn cho người dùng): danh sách trường DTO sẽ hiển thị và trường bỏ qua · nhóm khối theo việc người dùng cần làm (thứ tự ưu tiên) · bố cục desktop/mobile bằng component của DESIGN_SYSTEM · hành động theo vai trò/trạng thái · mã lỗi và câu hiển thị · trạng thái loading/empty/error. Màn SỬA: nêu phần code cũ bỏ/giữ.
4. **Kế hoạch tệp:** sửa/tạo/xóa; component tái dùng (đường dẫn thật); handler + seed mock cần thêm.
5. **Dừng, chờ đồng ý** (trừ khi người dùng bảo chạy liên tục — ghi thiết kế vào PROGRESS.md rồi làm tiếp).
6. **Code:** type từ `contract.ts` → `api.ts` → `hooks.ts` → handler mock (`src/mocks/handlers/*`) + seed → component → `page.tsx` + `loading.tsx` + `error.tsx`. Chỉ token màu; đủ trạng thái, mã lỗi, vai trò, responsive, a11y.
7. `npm run lint`, `npm run typecheck`; commit từng phần (`feat(order): add order api, hooks and mock handlers`, `feat(order): build order-detail page`).
8. Chạy thử ở mock (và live nếu có backend) tại 1280/768/375; dùng `/dev/mock` để tạo tình huống (người khác đặt giá, tua giờ, đổi tài khoản).
9. `/review-screen <id>`, sửa mục chưa đạt, commit.
10. Cập nhật PROGRESS.md; báo `git log --oneline develop..HEAD`, giả định. **Không push.**
