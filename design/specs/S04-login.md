# S04 – Đăng nhập (Khách)

| | |
|---|---|
| Route | `/login` |
| Vai trò | Guest |
| Layout | AuthLayout (card giữa trang, không header/footer) (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S04-login.png` (PNG @2x, frame 1280×678px) |
| Outline đầy đủ | `design/outline/S04.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Đăng nhập lấy JWT, quay về trang trước.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Card 520px giữa trang (padding 40px), viền 1px `border` (bỏ viền trên màu xanh của Figma), bo 12px; tiêu đề h1 căn giữa + mô tả.
2. Email* (icon), Mật khẩu* (nhãn phụ "Tối thiểu 8 ký tự" bên phải, nút hiện/ẩn), checkbox "Ghi nhớ đăng nhập trên thiết bị này", nút `primary` xl "Đăng nhập →", dòng "Chưa có tài khoản? Đăng ký ngay".

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S04.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Main → Section - SECTION 1: PRIMARY INTERACTIV | 380, 32 | 520 × 506 | col gap 0, pad 40, bg #FFFFFF, r 12, shadow | Đăng nhập / Chào mừng bạn quay lại với sàn đấu giá trực tuyế |
| 2 | · Card Header:margin | 420, 72 | 440 × 106 | col gap 0, pad 0 0 24 0 | Đăng nhập / Chào mừng bạn quay lại với sàn đấu giá trực tuyế |
| 3 | · · Card Header | 420, 72 | 440 × 82 | col gap 4 | Đăng nhập / Chào mừng bạn quay lại với sàn đấu giá trực tuyế |
| 4 | · · · Heading 1 | 420, 72 | 440 × 38 | col gap 0 | Đăng nhập |
| 4 | · · · Container | 448, 114 | 384 × 40 | col gap 0 | Chào mừng bạn quay lại với sàn đấu giá trực tuyế |
| 2 | · Standard Form | 420, 178 | 440 × 320 | col gap 16 | Địa chỉ Email * / nguyenvana@gmail.com |
| 3 | · · Field 1: Email | 420, 178 | 440 × 70 | col gap 6 | Địa chỉ Email * / nguyenvana@gmail.com |
| 4 | · · · Container | 420, 204 | 440 × 44 | row gap 0 | nguyenvana@gmail.com |
| 5 | · · · · Input | 420, 204 | 440 × 44 | col gap 0, pad 14 16 14 44, bg #FFFFFF, r 8 | nguyenvana@gmail.com |
| 3 | · · Field 2: Password | 420, 264 | 440 × 70 | col gap 6 | Mật khẩu * / Tối thiểu 8 ký tự |
| 4 | · · · Container | 420, 290 | 440 × 44 | row gap 0 | Nhập mật khẩu tài khoản của bạn |
| 5 | · · · · Input | 420, 290 | 440 × 44 | col gap 0, pad 14 44 14 44, bg #FFFFFF, r 8 | Nhập mật khẩu tài khoản của bạn |
| 3 | · · Remember Me Checkbox (Clean, strictly no socia | 420, 350 | 440 × 28 | row gap 0, pad 4 0 4 0 | Ghi nhớ đăng nhập trên thiết bị này |
| 3 | · · Primary Submit Button:margin | 420, 394 | 440 × 56 | col gap 0, pad 8 0 0 0 | Đăng nhập |
| 4 | · · · Button – Đăng nhập | 420, 402 | 440 × 48 | row gap 8, bg #1D4ED8, r 8, shadow | Đăng nhập |
| 3 | · · Redirect Link | 420, 466 | 440 × 32 | row gap 8, pad 10 106 2 106 | Chưa có tài khoản? / Đăng ký ngay |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#FFFFFF` | `surface / text-inverse` | 7 |
| `#131B2E` | `text` | 3 |
| `#434655` | `text-secondary` | 3 |
| `#1D4ED8` | `primary-600` | 3 |
| `#747686` | `text-subtle (sửa #696B7B)` | 3 |
| `#515F74` | `text-tertiary` | 3 |
| `#FAF8FF` | `bg` | 1 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 14px / 400 | `text-body` | 5 |
| 14px / 600 | `text-body (600)` | 3 |
| 30px / 700 | `text-h1` | 1 |
| 12px / 400 | `text-caption` | 1 |
| 16px / 600 | `text-h4` | 1 |

## API

- `POST /auth/login { email, password } → { accessToken, tokenType, userId, email, fullName, role }`

Body, DTO, mã lỗi chi tiết ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Sai thông tin: 1 thông báo chung phía trên form ("Email hoặc mật khẩu không đúng"), không chỉ ra trường nào sai.
- ACCOUNT_BANNED (403): thông báo "Tài khoản đã bị khoá" kèm hướng dẫn liên hệ.
- Thành công: chuyển `redirect` trong query, mặc định `/` (USER) hoặc `/admin` (ADMIN).
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- "Ghi nhớ" quyết định lưu token bền (cookie dài hạn) hay chỉ trong phiên.
- Không lưu mật khẩu ở bất cứ đâu phía client.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S04-login.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S04 – Đăng nhập (Khách).
Đọc: design/specs/S04-login.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S04-login.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
