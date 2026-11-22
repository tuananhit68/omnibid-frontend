---
name: fe-phase-8-final-review
description: Phase 8 frontend Omnibid v4 — rà soát cuối, verify-fe-v4.ps1, demo đầu-cuối bằng mock (và live nếu có backend), a11y, responsive, README, PROGRESS.
---
# Phase 8 — Rà soát cuối

> Tài liệu ở `.agents/skills/omnibid-fe-v4/references/`; tiến độ ở `docs/v4/PROGRESS.md`. Mỗi màn làm bằng `/build-screen <id>`; mỗi màn bổ sung handler + seed mock cho endpoint của nó (`MOCK_MODE.md`).
1. `verify-fe-v4.ps1` → `ALL FE v4 CHECKS PASSED`; `lint`, `typecheck`, `build` sạch.
2. Kịch bản đầu-cuối ở **mock**: đăng ký → đăng nhập → tạo sản phẩm 3 ảnh → tạo phiên → người khác đặt giá (`/dev/mock`) → tua giờ chốt phiên → đơn → thanh toán FAILED rồi SUCCESS → gửi hàng → xác nhận → thông báo hai bên → báo cáo → Admin xử lý, ẩn sản phẩm, khóa người dùng. Ghi kết quả vào PROGRESS.md.
3. Nếu có backend v4: lặp kịch bản ở **live**; ghi mọi cảnh báo "lệch hợp đồng" của lớp kiểm tra zod.
4. Mọi màn: 375/768/1280, bàn phím, focus, `aria-live` giá, tương phản; không còn thuật ngữ cũ trong `src/`.
5. `README.md`: công nghệ, biến môi trường (`API_MODE`), chạy mock/live, danh sách route theo SCREENS_v4, tài khoản mẫu mock.
6. PROGRESS.md hoàn chỉnh. Commit `docs: finalize frontend v4`. Không push.
