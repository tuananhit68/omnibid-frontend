# S15 – Tạo & Sửa sản phẩm (Người bán)

| | |
|---|---|
| Route | `/seller/products/new · /seller/products/[id]/edit` |
| Vai trò | User (chủ sản phẩm) |
| Layout | SellerLayout (xem `design/layouts.md`) |
| Ảnh Figma | `design/screens/S15-seller-product-form.png` (PNG @2x, frame 1280×1504px) |
| Outline đầy đủ | `design/outline/S15.txt` (mọi layer, toạ độ, màu, chữ) |

## Mục tiêu

Tạo/sửa sản phẩm với 1–5 ảnh.

> Chỉ **màu** bắt buộc giống Figma. Ảnh còn dùng font Inter, nhãn chữ hoa nhỏ và viền màu một bên – khi code làm theo `design/style-overrides.md`.

## Bố cục (từ trên xuống)

1. Breadcrumb + h1 "Thêm sản phẩm mới"/"Sửa sản phẩm" + mô tả.
2. Lưới 2 cột: form ~ 437px+ (trái, ~ 2/3) và cột phụ "Tiêu chuẩn kiểm định sàn" (phải, card checklist 3 mục).
3. Card "Thông tin cơ bản": Tên sản phẩm* (đếm 0/120), Danh mục* (select), Tình trạng hiện tại* (select 5 giá trị – G6), Mô tả sản phẩm* (textarea có thanh công cụ định dạng đơn giản, đếm 0/2000).
4. Card "Hình ảnh sản phẩm": chip "3 / 5 ảnh đã tải lên"; vùng kéo-thả (PNG/JPG/WEBP, ≤ 10MB/ảnh); lưới 5 ô (ảnh đã tải có nút xoá, nút "Đặt ảnh chính"; ô trống "+ Thêm ảnh"); 2 hộp cảnh báo (tối thiểu 1 ảnh – `danger-bg`; tối đa 5 ảnh – `info-bg`).
5. Footer căn giữa: `outline` "Huỷ thay đổi" + `primary` "Lưu sản phẩm".

## Số đo từ Figma (tự trích)

Toạ độ tính từ góc trên trái của frame, đơn vị px. Header, footer, sidebar đã bỏ (xem `layouts.md`). Thụt lề = cấp lồng nhau. Dùng bảng này làm điểm xuất phát cho kích thước, gap, padding và để tra **màu** (bắt buộc giữ); bố cục được chỉnh cho gọn hơn, chữ hoa và viền một bên trong Figma thì bỏ theo `design/style-overrides.md`. Chi tiết hơn: `design/outline/S15.txt`.

| Cấp | Layer | x, y | Rộng × Cao | Auto layout / style | Nội dung đầu |
|---|---|---|---|---|---|
| 1 | Container | 0, 0 | 1280 × 1504 | col gap 0, pad 0 0 0 256 | Kênh Người Bán / Quản lý kho hàng |
| 2 | · Main | 256, 0 | 1024 × 1456 | col gap 0, pad 64 32 24 32, bg #FAF8FF | Kênh Người Bán / Quản lý kho hàng |
| 4 | · · · Top Navigation & Breadcrumb Header:margin | 288, 64 | 960 × 102 | col gap 0, pad 0 0 24 0 | Kênh Người Bán / Quản lý kho hàng |
| 5 | · · · · Top Navigation & Breadcrumb Header | 288, 64 | 960 × 78 | col gap 4 | Kênh Người Bán / Quản lý kho hàng |
| 6 | · · · · · Margin | 288, 84 | 960 × 58 | col gap 0, pad 4 0 0 0 | Thêm sản phẩm mới / Khai báo thông tin chi tiết tài sản và h |
| 7 | · · · · · · Container | 288, 88 | 960 × 54 | row gap 0 | Thêm sản phẩm mới / Khai báo thông tin chi tiết tài sản và h |
| 8 | · · · · · · · Container | 288, 88 | 669 × 54 | col gap 2 | Thêm sản phẩm mới / Khai báo thông tin chi tiết tài sản và h |
| 4 | · · · Main Asymmetric Workspace Layout | 288, 166 | 960 × 1158 |  | Thông tin cơ bản / Chi tiết nhận diện, phân loại tài sản và  |
| 5 | · · · · Left Column: Form Details (8 Columns) | 288, 166 | 632 × 1158 | col gap 24 | Thông tin cơ bản / Chi tiết nhận diện, phân loại tài sản và  |
| 6 | · · · · · Section - Card 1: Thông tin cơ bản | 288, 166 | 632 × 560 | col gap 24, pad 32, bg #FFFFFF, r 12, shadow | Thông tin cơ bản / Chi tiết nhận diện, phân loại tài sản và  |
| 7 | · · · · · · Container | 320, 198 | 568 × 42 | row gap 55 | Thông tin cơ bản / Chi tiết nhận diện, phân loại tài sản và  |
| 8 | · · · · · · · Container | 320, 198 | 378 × 42 | row gap 8 | Thông tin cơ bản / Chi tiết nhận diện, phân loại tài sản và  |
| 7 | · · · · · · Form | 320, 264 | 568 × 430 |  | Tên sản phẩm * / 58 / 120 ký tự |
| 8 | · · · · · · · Tên sản phẩm | 320, 264 | 568 × 70 | col gap 6 | Tên sản phẩm * / 58 / 120 ký tự |
| 8 | · · · · · · · 2-Column Grid: Danh mục & Tình trạng | 320, 350 | 568 × 70 | row gap 16 | Danh mục * / Đồng hồ cao cấp |
| 8 | · · · · · · · Mô tả chi tiết:margin | 320, 452 | 568 × 236 | col gap 0, pad 4 0 0 0 | Mô tả sản phẩm * / Khuyên dùng đầy đủ |
| 6 | · · · · · Section - Card 2: Hình ảnh sản phẩm (1 đến 5 ả | 288, 750 | 632 × 574 | col gap 24, pad 32, bg #FFFFFF, r 12, shadow | Hình ảnh sản phẩm / 3 / 5 ảnh đã tải lên |
| 7 | · · · · · · Container | 320, 782 | 568 × 58 | row gap 8 | Hình ảnh sản phẩm / 3 / 5 ảnh đã tải lên |
| 8 | · · · · · · · Container | 320, 782 | 356 × 58 | row gap 8 | Hình ảnh sản phẩm / 3 / 5 ảnh đã tải lên |
| 8 | · · · · · · · Container | 690, 793 | 197 × 36 | row gap 8 | Định dạng hỗ trợ: / PNG, JPG, WEBP |
| 7 | · · · · · · Drag & Drop Upload Dropzone | 320, 864 | 568 × 168 | col gap 0, pad 32, bg #F2F3FF, r 12 | Kéo & thả ảnh vào đây hoặc Duyệt từ máy tính / Dung lượng tố |
| 7 | · · · · · · Uploaded Images Gallery Grid (5 slots max) | 320, 1056 | 568 × 128 | col gap 8 | DANH SÁCH HÌNH ẢNH HIỆN CÓ / Kéo thả để sắp xếp lại thứ tự |
| 8 | · · · · · · · Container | 320, 1080 | 568 × 104 | row gap 16 | Ảnh chính / Góc chính diện |
| 7 | · · · · · · Inline Validation State Guidance Alerts | 320, 1208 | 568 × 84 | col gap 0, pad 4 0 0 0 | Quy tắc bắt buộc: Tối thiểu 1 ảnh Nếu xóa hết ản / Giới hạn  |
| 8 | · · · · · · · Simulation Warning & Capacity Notice Callouts | 320, 1212 | 568 × 80 | row gap 8 | Quy tắc bắt buộc: Tối thiểu 1 ảnh Nếu xóa hết ản / Giới hạn  |
| 5 | · · · · Right Column: Policies, Inspection Rules & Val | 944, 166 | 304 × 352 | col gap 16, pad 24, bg #FFFFFF, r 12, shadow | Tiêu chuẩn kiểm định sàn / Hình ảnh đủ ánh sáng: Không dùng  |
| 6 | · · · · · Container | 968, 190 | 256 × 52 | row gap 8 | Tiêu chuẩn kiểm định sàn |
| 7 | · · · · · · Heading 3 | 1008, 190 | 216 × 52 | col gap 0, pad 0 30 0 0 | Tiêu chuẩn kiểm định sàn |
| 6 | · · · · · List | 968, 258 | 256 × 236 | col gap 8 | Hình ảnh đủ ánh sáng: Không dùng hiệu ứng filter / Rõ nét số |
| 7 | · · · · · · Item (×2 lặp lại) | 968, 258 | 256 × 80 | row gap 8 | Hình ảnh đủ ánh sáng: Không dùng hiệu ứng filter |
| 8 | · · · · · · · Container | 991, 258 | 230 × 80 | col gap 0, pad 0 18 0 0 | Hình ảnh đủ ánh sáng: Không dùng hiệu ứng filter |
| 7 | · · · · · · Item | 968, 434 | 256 × 60 | row gap 8 | Tính trung thực tình trạng: Khai báo trung thực  |
| 8 | · · · · · · · Container | 991, 434 | 230 × 60 | col gap 0, pad 0 17 0 0 | Tính trung thực tình trạng: Khai báo trung thực  |
| 4 | · · · Bottom Sticky Standard Form Action Bar:margin | 288, 1324 | 960 × 108 |  | Hủy thay đổi / Lưu sản phẩm |
| 5 | · · · · Container | 589, 1356 | 330 × 44 | row gap 16 | Hủy thay đổi / Lưu sản phẩm |
| 6 | · · · · · Button – Hủy thay đổi | 589, 1356 | 132 × 44 | col gap 0, pad 12 24 12 24, bg #FFFFFF, r 8 | Hủy thay đổi |
| 6 | · · · · · Button – Lưu sản phẩm | 737, 1356 | 181 × 44 | row gap 8, pad 0 32 0 32, bg #1D4ED8, r 8 | Lưu sản phẩm |
| 7 | · · · · · · Button:shadow | 737, 1356 | 181 × 44 | bg #FFFFFF@0.00, r 8, shadow |  |

## Màu và chữ dùng trong màn hình

| Màu Figma | Token | Số lần |
|---|---|---|
| `#FFFFFF` | `surface / text-inverse` | 26 |
| `#434655` | `text-secondary` | 26 |
| `#131B2E` | `text` | 26 |
| `#747686` | `text-subtle (sửa #696B7B)` | 17 |
| `#0037B0` | `primary-700` | 11 |
| `#F2F3FF` | `surface-subtle` | 8 |
| `#1D4ED8` | `primary-600` | 6 |
| `#BA1A1A` | `danger` | 6 |
| `#EAEDFF` | `surface-muted` | 5 |
| `#DCE1FF` | `primary-100` | 3 |
| `#0D1C2E` | `text` | 3 |
| `#FAF8FF` | `bg` | 2 |

Màu: bắt buộc dùng đúng token ở cột giữa.

| Cỡ/độ đậm trong Figma (font Inter) | Bậc chữ gần nhất – chỉ tham khảo | Số lần |
|---|---|---|
| 12px / 400 | `text-caption` | 21 |
| 14px / 600 | `text-body (600)` | 12 |
| 12px / 600 | `text-label / .label` | 11 |
| 14px / 400 | `text-body` | 6 |
| 18px / 600 | `text-h3` | 3 |
| 12px / 500 | `text-label / .label` | 3 |
| 14px / 700 | `text-body (600)` | 3 |
| 24px / 600 | `text-h2 / text-timer` | 2 |

## API

- `POST /products { title, categoryId, condition, description }`
- `GET/PATCH /products/{id}`
- `POST /products/{id}/images (multipart file, một ảnh mỗi request)`
- `DELETE /products/{id}/images/{imageId}`
- `PATCH /products/{id}/images/{imageId}/primary`
- `GET /categories`

Body, DTO, mã lỗi chi tiết ở `design/backend-contract.md` – **file đó thắng mục này**.

## Trạng thái và tương tác

- Tạo mới: lưu thông tin trước để có id, sau đó tải ảnh tuần tự, mỗi ảnh có thanh tiến trình và nút thử lại.
- Ảnh > 10MB hoặc sai định dạng: lỗi ngay trên ô ảnh.
- Rời trang khi chưa lưu: hỏi xác nhận.
- Sửa sản phẩm đang IN_AUCTION/RESERVED/SOLD: chuyển sang chỉ đọc.
- Mọi khối dữ liệu có loading (skeleton giữ đúng kích thước), empty và error (thông báo từ `lib/errors.ts` + nút "Thử lại").

## Quy tắc nghiệp vụ

- 1–5 ảnh; không cho lưu nếu 0 ảnh khi định tạo phiên.
- Bỏ nút "Chèn mẫu mô tả đấu giá" nếu không có mẫu thật.
- Backend là chốt chặn cuối cùng; frontend chỉ ẩn/khoá nút để dẫn hướng, luôn xử lý mã lỗi trả về.

## Chỗ lệch Figma ↔ backend

Áp dụng cách xử lý mặc định trong `design/gaps.md` cho: **G6**. Không vẽ dữ liệu giả cho các phần đã ẩn.

## Accessibility

- Tương phản ≥ 4.5:1 (dùng token đã sửa, không dùng `#747686`/`#94A3B8` cho chữ thường).
- Đi hết trang bằng Tab theo thứ tự đọc; focus ring 2px rõ ràng.
- Nút chỉ có icon có `aria-label`; ảnh sản phẩm có `alt` = tên sản phẩm.
- Form: label hiển thị, lỗi ngay dưới ô và nối bằng `aria-describedby`.
- Badge trạng thái luôn có chữ, không chỉ dựa vào màu.
- Vùng bấm ≥ 44×44px.

## Tiêu chí hoàn thành

- Màu khớp Figma (chỉ dùng token); bố cục giữ đúng các khối, thứ tự và cách nhóm thông tin như `design/screens/S15-seller-product-form.png`.
- Font Be Vietnam Pro; không có chữ hoa nhỏ, không có viền màu một bên (`design/style-overrides.md`).
- Ở 375px không cuộn ngang, theo quy tắc `layouts.md` mục 5.
- Đã xử lý mọi mã lỗi của các API ở trên.
- Không có mã màu hex hay px cứng ngoài token.

## Prompt cho Antigravity

```text
Làm màn hình S15 – Tạo & Sửa sản phẩm (Người bán).
Đọc: design/specs/S15-seller-product-form.md (spec này), design/style-overrides.md, design/layouts.md, design/components.md, design/gaps.md, design/tokens/tokens.css.
Nhìn ảnh design/screens/S15-seller-product-form.png để biết các khối và thứ tự; màu lấy đúng token, số đo trong spec là điểm xuất phát. Không làm theo font, chữ hoa nhỏ, viền màu một bên trong ảnh.
Dùng lại component trong src/components/ui; chỉ dùng token; không thêm màu, font hay API ngoài spec.
Trước khi code: liệt kê file sẽ tạo/sửa, component tái dùng và API sẽ gọi. Đợi mình đồng ý rồi mới viết.
```
