# S08 – Cài đặt tài khoản (Người mua)

| | |
|---|---|
| Route | `/me/settings` |
| Vai trò | User |
| Layout | PublicLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S08-account-settings.png` (PNG @2x, frame 1280×1061px) |
| Outline đầy đủ | `design/outline/S08.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Cập nhật hồ sơ và đổi mật khẩu.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 + mô tả.
2. Lưới 2 cột (trái ~ 7/12, phải ~ 5/12, gap 24px).
3. Card "Thông tin cá nhân": header nền `surface-subtle` có ô icon; khối avatar 72px + tên 20px; các trường Họ và tên*, Email (chỉ đọc, nền `surface-subtle`, icon đã xác minh), Số điện thoại*, Địa chỉ nhận hàng mặc định* (textarea); footer nút `secondary` "Huỷ bỏ" + `primary` "Lưu thay đổi".
4. Card "Đổi mật khẩu": Mật khẩu hiện tại*, Mật khẩu mới* (helper quy tắc), Nhập lại mật khẩu mới*, nút `primary` lg full-width "Cập nhật mật khẩu".

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S08.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 0, 0 | 1280 × 976 | col gap 0, pad 64 0 0 0, bg #FAF8FF | Trang chủ / Tài khoản của tôi |
| 2 | · Toast Notification Bar (Sticky / Prominent Top | 0, 64 | 1280 × 912 | col gap 24, pad 24 32 24 32 | Trang chủ / Tài khoản của tôi |
| 3 | · · Nav - Breadcrumb:margin | 32, 88 | 1216 × 36 | col gap 0, pad 0 0 16 0 | Trang chủ / Tài khoản của tôi |
| 3 | · · Page Header | 32, 148 | 1216 × 70 | row gap 0, pad 0 0 4 0 | Cài đặt tài khoản / Quản lý thông tin định danh cá nhân và t |
| 4 | · · · Container | 32, 148 | 701 × 66 | col gap 4 | Cài đặt tài khoản / Quản lý thông tin định danh cá nhân và t |
| 5 | · · · · Container | 32, 148 | 701 × 38 | row gap 0 | Cài đặt tài khoản |
| 6 | · · · · · Heading 1 | 32, 148 | 230 × 38 | col gap 0 | Cài đặt tài khoản |
| 3 | · · Main 2-Column Responsive Layout (Asymmetrical  | 32, 242 | 1216 × 710 |  | Thông tin cá nhân / Nguyễn Văn An |
| 4 | · · · Section - CARD 1: Thông tin cá nhân (Col 7) | 32, 242 | 699 × 710 | col gap 24, pad 24, bg #FFFFFF, r 12, shadow | Thông tin cá nhân / Nguyễn Văn An |
| 5 | · · · · Card 1 Header:margin | 56, 266 | 651 × 40 |  | Thông tin cá nhân |
| 6 | · · · · · Card 1 Header | 32, 242 | 699 × 64 | row gap 427, pad 16 24 8 24, bg #F2F3FF | Thông tin cá nhân |
| 7 | · · · · · · Container | 56, 258 | 204 × 40 | row gap 8 | Thông tin cá nhân |
| 5 | · · · · Avatar & Role Section | 56, 330 | 651 × 128 | row gap 16, pad 16, bg #F2F3FF, r 8 | Nguyễn Văn An / Người mua |
| 6 | · · · · · Container | 168, 346 | 523 × 96 | col gap 6 | Nguyễn Văn An / Người mua |
| 7 | · · · · · · Container | 168, 346 | 523 × 28 | row gap 4 | Nguyễn Văn An / Người mua |
| 8 | · · · · · · · Container | 168, 346 | 150 × 28 | col gap 0 | Nguyễn Văn An |
| 7 | · · · · · · Container | 168, 402 | 523 × 40 | row gap 8, pad 4 0 0 0 | Tải ảnh mới / Gỡ ảnh |
| 5 | · · · · Personal Info Form | 56, 482 | 651 × 446 | col gap 16 | Họ và tên * / Nguyễn Văn An |
| 6 | · · · · · Họ và tên | 56, 482 | 651 × 70 | col gap 6 | Họ và tên * / Nguyễn Văn An |
| 7 | · · · · · · Background+Shadow | 56, 508 | 651 × 44 | row gap 0, pad 0 16 0 16, bg #FFFFFF, r 8, shadow | Nguyễn Văn An |
| 6 | · · · · · Email (Read-only) | 56, 568 | 651 × 70 | col gap 6 | Email đăng nhập / nguyenvanan.tech@gmail.com |
| 7 | · · · · · · Background | 56, 594 | 651 × 44 | row gap 0, pad 0 16 0 16, bg #F2F3FF, r 8 | nguyenvanan.tech@gmail.com |
| 6 | · · · · · Số điện thoại | 56, 654 | 651 × 70 | col gap 6 | Số điện thoại liên hệ * / 0912 345 678 |
| 7 | · · · · · · Background+Shadow | 56, 680 | 651 × 44 | row gap 0, pad 0 16 0 16, bg #FFFFFF, r 8, shadow | 0912 345 678 |
| 6 | · · · · · a chỉ nhận hàng & liên h | 56, 740 | 651 × 120 | col gap 6 | Địa chỉ nhận hàng mặc định * / Số 12, Ngõ 45, Đường Lê Duẩn, |
| 7 | · · · · · · Background+Shadow | 56, 766 | 651 × 94 | row gap 4, pad 8, bg #FFFFFF, r 8, shadow | Số 12, Ngõ 45, Đường Lê Duẩn, Phường Bến Nghé, Q |
| 8 | · · · · · · · Textarea | 81, 774 | 618 × 78 | col gap 0, pad 0 0 52 0 | Số 12, Ngõ 45, Đường Lê Duẩn, Phường Bến Nghé, Q |
| 6 | · · · · · Card 1 Buttons | 56, 876 | 651 × 52 | row gap 16, pad 8 0 0 0 | Hủy bỏ / Lưu thay đổi |
| 7 | · · · · · · Button – Lưu thay đổi | 542, 884 | 164 × 44 | row gap 4, pad 12 32 12 32, bg #1D4ED8, r 8, shadow | Lưu thay đổi |
| 4 | · · · Section - CARD 2: Đổi mật khẩu (Col 5) | 755, 242 | 492 × 464 | col gap 24, pad 24, bg #FFFFFF, r 12, shadow | Đổi mật khẩu / Mật khẩu hiện tại * |
| 5 | · · · · Card 2 Header:margin | 779, 266 | 444 × 40 |  | Đổi mật khẩu |
| 6 | · · · · · Card 2 Header | 755, 242 | 492 × 64 | row gap 263, pad 16 24 8 24, bg #F2F3FF | Đổi mật khẩu |
| 7 | · · · · · · Container | 779, 258 | 161 × 40 | row gap 8 | Đổi mật khẩu |
| 5 | · · · · Password Change Form | 779, 330 | 444 × 352 | col gap 16 | Mật khẩu hiện tại * / matkhaucu123 |
| 6 | · · · · · Mật khẩu hiện tại | 779, 330 | 444 × 70 | col gap 6 | Mật khẩu hiện tại * / matkhaucu123 |
| 7 | · · · · · · Background+Shadow | 779, 356 | 444 × 44 | row gap 0, pad 0 16 0 16, bg #FFFFFF, r 8, shadow | matkhaucu123 |
| 6 | · · · · · Mật khẩu mới | 779, 416 | 444 × 112 | col gap 6 | Mật khẩu mới * / OmniBid@Secure2025 |
| 7 | · · · · · · Background+Shadow | 779, 442 | 444 × 44 | row gap 0, pad 0 16 0 16, bg #FFFFFF, r 8, shadow | OmniBid@Secure2025 |
| 7 | · · · · · · List - Password Strength Bar | 779, 492 | 444 × 36 | col gap 0, pad 4 0 0 0 | Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ  / số |
| 8 | · · · · · · · Item | 779, 496 | 444 × 32 |  | Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ  / số |
| 6 | · · · · · Nhập lại mật khẩu mới (With explicit inline er | 779, 544 | 444 × 70 | col gap 6 | Nhập lại mật khẩu mới * / Nhập lại mật khẩu mới |
| 7 | · · · · · · Background+Shadow | 779, 570 | 444 × 44 | row gap 0, pad 0 16 0 16, bg #FFFFFF, r 8, shadow | Nhập lại mật khẩu mới |
| 6 | · · · · · Card 2 Action Button | 779, 630 | 444 × 52 | col gap 0, pad 8 0 0 0 | Cập nhật mật khẩu |
| 7 | · · · · · · Button – Cập nhật mật khẩu | 779, 638 | 444 × 44 | row gap 4, pad 12 0 12 0, bg #1D4ED8, r 8, shadow | Cập nhật mật khẩu |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#131B2E` | `text` | 20 |
| `#FFFFFF` | `surface / text-inverse` | 19 |
| `#747686` | `text-subtle (sửa #696B7B)` | 17 |
| `#434655` | `text-secondary` | 11 |
| `#F2F3FF` | `surface-subtle` | 5 |
| `#0037B0` | `primary-700` | 5 |
| `#475569` | `neutral` | 5 |
| `#64748B` | `text-placeholder` | 3 |
| `#1D4ED8` | `primary-600` | 3 |
| `#BA1A1A` | `danger` | 3 |
| `#FAF8FF` | `bg` | 2 |
| `#94A3B8` | `text-placeholder (sửa #5F6B7F)` | 2 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 600 | `text-body (600)` | 15 |
| 16px / 400 | `text-body-lg` | 8 |
| 14px / 500 | `text-body` | 6 |
| 14px / 400 | `text-body` | 3 |
| 12px / 600 | `text-label / .label` | 3 |
| 12px / 500 | `text-label / .label` | 3 |
| 18px / 600 | `text-h3` | 2 |
| 12px / 400 | `text-caption` | 2 |
| 30px / 700 | `text-h1` | 1 |
| 20px / 600 | `text-h2 / text-price-lg` | 1 |

## API

- `⛔ B5 hồ sơ và đổi mật khẩu – backend chưa có; hiển thị từ AuthResponse, khoá form`

Đối chiếu từ code backend ngày 08/11/2026. Body, DTO, mã lỗi chi tiết và bảng endpoint chưa có (⛔ B…) ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Hai form độc lập, mỗi form có loading và toast riêng.
- "Huỷ bỏ" khôi phục giá trị ban đầu; nút Lưu chỉ bật khi form đã thay đổi.
- Sai mật khẩu hiện tại: lỗi dưới ô đó.
- Đổi mật khẩu thành công: xoá 3 ô.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Email không sửa được.
- Các ô mật khẩu dùng `autocomplete="current-password"` / `"new-password"`.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G9**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S08-account-settings.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S08 – Cài đặt tài khoản (Người mua).
Đọc: design/specs/S08-account-settings.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S08-account-settings.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
