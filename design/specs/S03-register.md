# S03 – Đăng ký tài khoản (Khách)

| | |
|---|---|
| Route | `/register` |
| Vai trò | Guest |
| Layout | AuthLayout (card giữa trang, không header/footer) (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S03-register.png` (PNG @2x, frame 1280×935px) |
| Outline đầy đủ | `design/outline/S03.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Tạo tài khoản USER.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Card trắng rộng 620px căn giữa (x=330), bo 12px, shadow `sm`, padding 32px, các phần cách nhau 24px; tiêu đề h1 30px + mô tả 16/24.
2. 5 trường cao 44px nền `surface-subtle` có icon trái: Họ và tên* (helper), Email*, Số điện thoại (không bắt buộc), Mật khẩu* (nút hiện/ẩn, helper quy tắc), Nhập lại mật khẩu*.
3. Checkbox đồng ý Điều khoản/Chính sách (link `primary-600` 600). Nút `primary` xl full-width "Đăng ký tài khoản →". Dòng "Đã có tài khoản? Đăng nhập ngay".

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S03.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main | 32, 32 | 1216 × 871 | col gap 0, pad 32 0 32 0 | Đăng ký tài khoản / Tham gia sàn đấu giá trực tuyến OmniBid  |
| 2 | · Center Auth Card Container (Max ~600px) | 330, 64 | 620 × 807 | col gap 24, pad 32, bg #FFFFFF, r 12 | Đăng ký tài khoản / Tham gia sàn đấu giá trực tuyến OmniBid  |
| 3 | · · Center Auth Card Container (Max ~600px):shadow | 330, 64 | 620 × 806 | bg #FFFFFF@0.00, r 12, shadow |  |
| 3 | · · Header Section | 362, 96 | 556 × 90 | col gap 4 | Đăng ký tài khoản / Tham gia sàn đấu giá trực tuyến OmniBid  |
| 4 | · · · Heading 1 | 362, 96 | 556 × 38 | col gap 0 | Đăng ký tài khoản |
| 4 | · · · Container | 362, 138 | 556 × 48 | col gap 0 | Tham gia sàn đấu giá trực tuyến OmniBid để khám  |
| 3 | · · Registration Fields Form | 362, 210 | 556 × 629 | col gap 16 | Họ và tên / * |
| 4 | · · · Field A: Full Name | 362, 210 | 556 × 92 | col gap 6 | Họ và tên / * |
| 5 | · · · · Container | 362, 236 | 556 × 44 | row gap 0 | Nguyễn Văn An |
| 6 | · · · · · Input | 362, 236 | 556 × 44 | col gap 0, pad 14 14 14 44, bg #F2F3FF, r 8 | Nguyễn Văn An |
| 4 | · · · Field B: Email (Showing Error State) | 362, 318 | 556 × 70 | col gap 6 | Địa chỉ Email / * |
| 5 | · · · · Container | 362, 344 | 556 × 44 | row gap 0 | example@gmail.com |
| 6 | · · · · · Input | 362, 344 | 556 × 44 | col gap 0, pad 14 14 14 44, bg #F2F3FF, r 8 | example@gmail.com |
| 4 | · · · Field C: Phone Number (Optional) | 362, 404 | 556 × 70 | col gap 6 | Số điện thoại (Không bắt buộc) / Ví dụ: 0912 345 678 |
| 5 | · · · · Container | 362, 430 | 556 × 44 | row gap 0 | Ví dụ: 0912 345 678 |
| 6 | · · · · · Input | 362, 430 | 556 × 44 | col gap 0, pad 14 14 14 44, bg #F2F3FF, r 8 | Ví dụ: 0912 345 678 |
| 4 | · · · Field D: Password | 362, 490 | 556 × 92 | col gap 6 | Mật khẩu / * |
| 5 | · · · · Container | 362, 516 | 556 × 44 | row gap 0 | SecurePass@2024 |
| 6 | · · · · · Input | 362, 516 | 556 × 44 | col gap 0, pad 14 44 14 44, bg #F2F3FF, r 8 | SecurePass@2024 |
| 4 | · · · Field E: Confirm Password (Showing Error State | 362, 598 | 556 × 70 | col gap 6 | Nhập lại mật khẩu / * |
| 5 | · · · · Container | 362, 624 | 556 × 44 | row gap 0 | Nhập lại mật khẩu |
| 6 | · · · · · Input | 362, 624 | 556 × 44 | col gap 0, pad 14 14 14 44, bg #F2F3FF, r 8 | Nhập lại mật khẩu |
| 4 | · · · Agreement Checkbox | 362, 684 | 556 × 43 | col gap 0, pad 4 0 0 0 | Tôi đồng ý với Điều khoản sử dụng và Chính sách  |
| 5 | · · · · Label | 362, 688 | 556 × 39 | row gap 8 | Tôi đồng ý với Điều khoản sử dụng và Chính sách  |
| 6 | · · · · · Container | 390, 688 | 526 × 39 | col gap 0, pad 0 18 0 0 | Tôi đồng ý với Điều khoản sử dụng và Chính sách  |
| 4 | · · · Submit Action Button:margin | 362, 743 | 556 × 52 | col gap 0, pad 4 0 0 0 | Đăng ký tài khoản |
| 5 | · · · · Button – Đăng ký tài khoản | 362, 747 | 556 × 48 | row gap 4, bg #1D4ED8, r 8, shadow | Đăng ký tài khoản |
| 6 | · · · · · Container | 544, 757 | 173 × 28 | col gap 0 | Đăng ký tài khoản |
| 4 | · · · Bottom Nav to Login | 362, 811 | 556 × 28 | row gap 0, pad 4 0 4 0 | Đã có tài khoản? / Đăng nhập ngay |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#434655` | `text-secondary` | 10 |
| `#131B2E` | `text` | 9 |
| `#F2F3FF` | `surface-subtle` | 5 |
| `#FFFFFF` | `surface / text-inverse` | 4 |
| `#BA1A1A` | `danger` | 4 |
| `#9CA3AF` | `text-disabled` | 3 |
| `#1D4ED8` | `primary-600` | 3 |
| `#FAF8FF` | `bg` | 1 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 600 | `text-body (600)` | 10 |
| 14px / 400 | `text-body` | 7 |
| 12px / 400 | `text-caption` | 2 |
| 30px / 700 | `text-h1` | 1 |
| 16px / 400 | `text-body-lg` | 1 |
| 20px / 600 | `text-h2 / text-price-lg` | 1 |

## API

- `POST /auth/register { fullName, email, password (≥6), phoneNumber?, address? } → AuthResponse (đăng nhập luôn)`

Body, DTO, mã lỗi chi tiết ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Lỗi email trùng (409/VALIDATION_ERROR) hiện dưới ô Email.
- Thành công: toast "Đăng ký thành công" và chuyển `/login?email=...` (hoặc đăng nhập luôn nếu API trả token).
- Nút loading khi gửi; giữ dữ liệu khi lỗi.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- Mật khẩu ≥ 8 ký tự, có chữ hoa, chữ thường, chữ số (zod, trùng helper text).
- Nhập lại phải khớp.
- Phải tick đồng ý mới bật nút.
- Chữ trong ảnh Figma (Nguyễn Văn An, SecurePass@2024) là ví dụ – không đặt sẵn giá trị.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S03-register.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S03 – Đăng ký tài khoản (Khách).
Đọc: design/specs/S03-register.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S03-register.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
