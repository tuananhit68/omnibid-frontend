# Tài khoản — `login`, `register`, `profile`, `admin-profile`, đăng xuất

Dữ liệu: `backend/RESPONSE_DTO_v4.md` §2 (`LoginResponse`, `UserProfile`); UC01, UC02, NFR-05.

## `login` — `/login` (SỬA)
Card: Email* (`autocomplete="email"`) · Mật khẩu* (`PasswordInput`) · "Đăng nhập" · link "Tạo tài khoản".
`POST /auth/login` → lưu `LoginResponse` → `redirect` nội bộ hợp lệ, nếu không: ADMIN `/admin`, USER `/`.
Hộp thông báo theo query: `registered=1` (điền email), `reason=banned|expired|password-changed`.
Lỗi: 401 → "Email hoặc mật khẩu không đúng" · 403 `ACCOUNT_BANNED` · 429 `TOO_MANY_REQUESTS` → "Bạn đã đăng nhập sai quá nhiều lần, vui lòng thử lại sau 15 phút" · `VALIDATION_ERROR`.

## `register` — `/register` (SỬA)
Họ tên* · Email* (gợi ý "dùng để đăng nhập, không đổi được") · Mật khẩu* (gợi ý "Tối thiểu 8 ký tự, có chữ hoa, chữ thường và chữ số", thanh độ mạnh) · Nhập lại mật khẩu* (chỉ client) · Số điện thoại*.
zod: password `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$`. `POST /auth/register` → 201 `UserProfile`, **không token** → `/login?registered=1&email=`. Lỗi `VALIDATION_ERROR` (email đã tồn tại trong `details.fields.email`).

## `profile` — `/me/profile` (USER) · `admin-profile` — `/admin/profile` (ADMIN) (MỚI)
Một feature `src/features/account` dùng cho hai route.
- Card "Thông tin cá nhân": `Avatar` + "Đổi ảnh" (JPG/PNG/WEBP ≤ 5 MB) · Họ tên* · Email (chỉ đọc) · Số điện thoại · Địa chỉ · Vai trò, ngày tạo (chỉ đọc) · "Lưu thay đổi". API: `GET /users/me`, `PATCH /users/me {fullName, phoneNumber, address}`, `POST /users/me/avatar` (FormData `file`) → `{avatarUrl}`; cập nhật tên/ảnh trong phiên (header). Lỗi ảnh: `INVALID_IMAGE`, `IMAGE_UPLOAD_FAILED`, `PAYLOAD_TOO_LARGE`.
- Card "Đổi mật khẩu": Mật khẩu hiện tại* · Mật khẩu mới* · Nhập lại* · ghi chú "Sau khi đổi, mọi phiên đăng nhập trên các thiết bị đều kết thúc." → `PATCH /users/me/password` → xóa phiên → `/login?reason=password-changed`.

## Đăng xuất (menu tài khoản ở mọi layout)
`POST /auth/logout` → luôn xóa phiên (kể cả lỗi mạng), `queryClient.clear()`, `resetWsClient()`, về `/login`. Dòng nhỏ trong menu: "Đăng xuất khỏi mọi thiết bị".

## Phiên phía client (`src/lib/auth/session.ts`, `useSession`)
Đọc localStorage sau mount; `{ user, isAuthenticated, isAdmin, ready }`; hết `expiresAt` → `/login?reason=expired`; đồng bộ tab qua sự kiện `storage`; cookie cờ `omnibid_auth`, `omnibid_role` (không token) cho middleware/proxy.
