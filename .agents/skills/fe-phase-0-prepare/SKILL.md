---
name: fe-phase-0-prepare
description: Phase 0 frontend Omnibid v4 — tạo nhánh feature/fe-v4, ghi baseline lint/typecheck/build. Không cần backend.
---
# Phase 0 — Chuẩn bị
1. `git status`. Có thay đổi chưa commit (kể cả việc thay kit) → **hỏi người dùng** commit trước (gợi ý `chore: replace agent kit with v4 kit`). Không stash/xóa.
2. `git switch develop && git pull --ff-only && git switch -c feature/fe-v4` (đã có thì `git switch feature/fe-v4`).
3. `npm install`, `npm run lint`, `npm run typecheck`, `npm run build`; ghi kết quả vào `docs/v4/PROGRESS.md` mục Baseline.
4. Hỏi người dùng có backend v4 chạy được không; ghi vào PROGRESS.md. Không có cũng tiếp tục (chế độ mock).
5. Không sửa mã. Commit `docs(v4): frontend phase 0 baseline`.
