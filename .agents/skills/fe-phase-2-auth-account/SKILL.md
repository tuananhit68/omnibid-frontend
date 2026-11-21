---
name: fe-phase-2-auth-account
description: Phase 2 frontend Omnibid v4 — làm lại đăng nhập, đăng ký; làm hồ sơ/ảnh đại diện/đổi mật khẩu cho User và Admin; đăng xuất vô hiệu mọi token.
---
# Phase 2 — Tài khoản

> Tài liệu ở `.agents/skills/omnibid-fe-v4/references/`; tiến độ ở `docs/v4/PROGRESS.md`. Mỗi màn làm bằng `/build-screen <id>`; mỗi màn bổ sung handler + seed mock cho endpoint của nó (`MOCK_MODE.md`).
Spec: `screens/auth-account.md`. Màn: `login`, `register`, `profile`, `admin-profile`.
- `features/auth`, `features/account` (api, hooks, form). Mock: register, login (đếm sai → 429), logout và đổi mật khẩu tăng tokenVersion (token cũ → 401), avatar (data URL, `INVALID_IMAGE`).
- `useLogout()` cho menu tài khoản ở ba layout.
- Thử: đăng nhập sai 6 lần → 429; đổi mật khẩu → về đăng nhập; tài khoản `banned@` → thông báo khóa; ADMIN đăng nhập → `/admin`.
Cổng: lint/typecheck/build; `/review-screen` từng màn; commit theo màn.
