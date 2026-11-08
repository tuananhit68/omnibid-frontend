---
name: build-screen
description: Dựng một màn hình theo spec Figma. Cách gọi: /build-screen S05
---

# /build-screen <ID màn hình>

0. **Nhánh**: chạy `git status`. Có thay đổi chưa commit → dừng, báo người dùng. Sạch → `git switch develop && git pull --ff-only && git switch -c feature/<ID>-<slug>` (slug = tên file spec, vd `feature/S05-auction-detail-bid`). Nhánh đã tồn tại → `git switch` sang, không tạo lại.
1. Đọc theo thứ tự: `design/backend-contract.md` (API thật, bảng B các endpoint chưa có), `design/README.md`, `design/style-overrides.md`, `design/gaps.md`, `design/layouts.md`, `design/components.md`, rồi `design/specs/<ID>-*.md`. Mở ảnh `design/screens/<ID>-*.png`.
2. Tóm tắt lại cho người dùng trong 5–10 dòng:
   - route, layout, vai trò được vào;
   - các khối chính từ trên xuống;
   - API sẽ gọi và mã lỗi cần xử lý;
   - các mục trong `gaps.md` và bảng B của `backend-contract.md` áp dụng cho màn hình này, và cách xử lý (mock hay ẩn).
3. Liệt kê kế hoạch:
   - component **tái dùng** (đường dẫn thật trong `src/`);
   - component **cần tạo mới** (và vì sao không tái dùng được);
   - file sẽ tạo/sửa;
   - câu hỏi còn mở (nếu có).
4. **Dừng, chờ người dùng đồng ý.**
5. Code theo thứ tự: `types.ts` → `api.ts` → `hooks.ts` → component của feature → `page.tsx` + `loading.tsx` + `error.tsx`.
   - Màu: đúng token theo bảng "Màu và chữ" của spec. Kích thước, gap, padding: lấy bảng "Số đo từ Figma" làm điểm xuất phát, làm tròn về thang 4px, được chỉnh cho gọn và đều.
   - Bỏ font Inter, nhãn chữ hoa nhỏ, viền màu một bên có trong ảnh (theo `style-overrides.md`).
   - Làm đủ trạng thái loading/empty/error, mã lỗi, ẩn/hiện theo vai trò.
   - Responsive theo `design/layouts.md` mục 5.
6. Chạy `npm run lint` và `npm run typecheck`, sửa hết lỗi. Commit từng phần đã pass (vd `feat(<feature>): add types and api for <ID>`, rồi `feat(<feature>): build <ID> page`).
7. Nếu có công cụ trình duyệt: mở trang ở 1280px, 768px, 375px, chụp màn hình và so với ảnh Figma.
8. Tự chạy `/review-screen <ID>` và sửa các mục chưa đạt. Có thể chạy thêm `impeccable audit`/`polish` theo `.agents/rules/design-skills.md`.
9. Commit phần sửa sau review. Báo lại: `git log --oneline develop..HEAD`, `git diff --stat develop...HEAD`, giả định đã dùng, phần dùng mock/ẩn, đề xuất tiêu đề + mô tả PR. **Không push** – người dùng tự push và mở PR.

