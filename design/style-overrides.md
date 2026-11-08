# Hướng giao diện "Rõ ràng, đáng tin" (chốt 07/11/2026)

File này **thắng ảnh Figma** về mọi thứ trừ màu. Bản vẽ minh hoạ: canvas "OmniBid – Đề xuất giao diện" (bảng hướng dẫn + S05 desktop + S05 mobile).

## 1. Cái gì giữ, cái gì đổi

| Phần | Quy định |
| --- | --- |
| **Màu và vai trò màu** | **Giữ nguyên Figma.** Chỉ dùng token trong `tokens/tokens.css`. `primary-600` cho hành động thường, `primary-700` cho tiền và hành động tiền bạc, màu trạng thái chỉ cho trạng thái. Không thêm màu, gradient, bóng màu. |
| **Chức năng và thứ tự thông tin** | **Giữ nguyên Figma.** Màn hình có đủ khối, trường, nút, cột như spec, theo đúng thứ tự (trừ chỗ `gaps.md` bảo ẩn). Trên mobile được xếp lại theo `layouts.md` mục 5. |
| Font, thang chữ | Đổi – mục 3 |
| Bề mặt, bo góc, bóng | Đổi – mục 4 |
| Nhãn, trang trí | Đổi – mục 5 |
| Kích thước, khoảng cách | Số đo Figma là điểm xuất phát, làm tròn theo nhịp 4px và các cỡ ở mục 6 |

## 2. Ba nguyên tắc

1. **Màu là của Figma.** Không có màu nào ngoài bảng màu.
2. **Con số là nhân vật chính.** Giá, bước giá, đồng hồ: cỡ lớn, đậm, chữ số đều (`tabular`). Nhãn đi kèm nhỏ, viết thường, màu dịu.
3. **Phẳng, viền mảnh, ít lớp.** Card trắng viền 1px, không đổ bóng; không card lồng card; không viền màu một bên; không nhãn chữ hoa.

## 3. Chữ

Font **Be Vietnam Pro** (400, 500, 600, 700), nạp bằng `next/font/google` subset `latin` + `vietnamese`. Không dùng Inter.

| Bậc | Cỡ / dòng / đậm | Dùng cho |
| --- | --- | --- |
| `text-display` | 40/48 · 700 | Tiêu đề hero trang chủ (chỉ ở đây) |
| `text-h1` | 28/36 · 600 | Tiêu đề trang (mobile 22/30) |
| `text-h2` | 22/30 · 600 | Tiêu đề section |
| `text-h3` | 18/26 · 600 | Tiêu đề card, modal |
| `text-h4` | 16/24 · 600 | Tên sản phẩm trong thẻ |
| `text-body-lg` | 16/26 · 400 | Đoạn mô tả dài |
| `text-body` | **15/24 · 400** | Chữ mặc định |
| `text-small` | 14/22 · 400 | Bảng admin, dòng phụ |
| `text-label` / `.label` | 13/20 · 500 · `text-tertiary` | Nhãn, tiêu đề cột, badge |
| `text-caption` | 12/18 · 400 | Meta, giờ kết thúc – cỡ nhỏ nhất |
| `text-price-xl` | 40/48 · 700 · `primary-700` | Giá hiện tại ở trang chi tiết (mobile 34/42) |
| `text-price-lg` | 22/30 · 700 · `primary-700` | Giá trên thẻ phiên, tổng tiền đơn |
| `text-timer` | 28/36 · 700 | Đồng hồ đếm ngược |

- Chỉ 2 độ đậm cho chữ thường (400 và 600); 500 cho nhãn; 700 chỉ cho con số và hero.
- Tiền viết `21.500.000 ₫` (dấu chấm hàng nghìn, `₫` sau số, cách một khoảng).

## 4. Bề mặt

| Thành phần | Quy định |
| --- | --- |
| Nền trang | `bg` #FAF8FF |
| Card, section | nền trắng, viền 1px `border-brand` #E2E7FF, bo 12px, **không bóng**, padding 24px (mobile 16px) |
| Khối phụ trong card | nền `surface-subtle` #F2F3FF, bo 10px – không phải card thứ hai có viền + bóng |
| Lưới số liệu (giá khởi điểm, bước giá…) | ô nền `surface-subtle` cách nhau 1px trên nền `border-brand`, bo 10px; ô quan trọng nhất nền `primary-50` chữ `primary-700` |
| Hai phần trong một card | ngăn bằng đường kẻ 1px `border-brand` (vd phần giá và form đặt giá) |
| Lớp nổi | dropdown `shadow-md`, modal và drawer `shadow-lg`, bo 16px |
| Bo góc | 6 chip nhỏ · 8 nút/ô nhập/mục menu · 10 nút-ô nhập cỡ xl, thumbnail · 12 card · 16 modal · full badge/avatar |

## 5. Nhãn và trang trí

### Không có nhãn chữ hoa

- Nhãn nhỏ **phía trên tiêu đề** (eyebrow): bỏ hẳn. Thông tin cần giữ (mã phiên, danh mục) đưa xuống dòng meta dưới tiêu đề hoặc thành chip.
- Mọi chữ hoa nhỏ khác → viết thường kiểu câu, `.label`. Không dùng `uppercase`, `tracking-wide*`. Ngoại lệ: mã vốn viết hoa (`AUC-9821`, `VND`).

| Figma | Đề xuất |
| --- | --- |
| `PHÂN LOẠI CHUYÊN SÂU`, `LỊCH TRÌNH ĐẤU GIÁ`, `MINH BẠCH & CHUẨN XÁC`, `DÀNH CHO NGƯỜI BÁN` (S00) | bỏ |
| `MÃ PHIÊN: #AUC-9821` trên tên sản phẩm | dòng meta "Điện thoại · AUC-9821" dưới tên |
| `THỜI GIAN CÒN LẠI`, `GIÁ HIỆN TẠI`, `TRẠNG THÁI ĐƠN HÀNG` | "Thời gian còn lại", "Giá hiện tại", "Trạng thái đơn hàng" |
| Nhãn thẻ KPI, tiêu đề cột bảng (mọi trang) | viết thường: "Tổng đơn", "Người đặt", "Mức giá" |
| `QUẢN LÝ CỬA HÀNG`, `QUẢN TRỊ HỆ THỐNG` (sidebar) | bỏ nếu chỉ có một nhóm; nếu nhiều nhóm thì `.label` viết thường |
| `1. CÁC BÊN LIÊN QUAN…` (S25) | `text-h3` "Các bên liên quan" |
| `● ĐANG DIỄN RA`, `LIVE`, `ĐÃ CHỌN`, `SKU: PRD-7721` | `StatusBadge` "Đang diễn ra", badge "Đang đấu giá", badge "Đã chọn", meta "PRD-7721" |

### Không có viền màu một bên

- Hàng/mục đang chọn (S25, sidebar, danh sách): nền `primary-50`, chữ 600 màu `primary-700`, `aria-selected`/`aria-current`.
- Card đăng nhập (S04): bỏ viền trên 4px.
- Hộp thông báo: nền nhạt theo tông + viền 1px đủ bốn cạnh cùng tông + icon 20px ở đầu.
- **Giữ** gạch chân 2px `primary-600` cho tab đổi nội dung và mục menu ngang đang chọn – đây là chỉ báo vị trí.

## 6. Thành phần chính

| Thành phần | Quy định |
| --- | --- |
| Nút | sm 32 · md 40 · lg 44 (mặc định form) · xl 52 (Đặt giá, Thanh toán – nền `primary-700`, bo 10). Chữ 600, viết thường kiểu câu. Mỗi màn hình tối đa **một** nút `primary-700`. |
| Ô nhập | cao 44, nền `surface-subtle`, viền 1px `border-brand`, focus viền `primary-600` + ring. Ô tiền cao 52, nền trắng, căn phải, chữ 20/700 `tabular`, hậu tố `₫`. |
| Badge trạng thái | pill cao 26 (mobile 22–24), chữ 13/500, chấm tròn 6px cho trạng thái phiên; luôn có chữ. "Bị vượt" dùng `tertiary-100` + `tertiary-800`. |
| Tabs | gạch chân 2px, cao 56 (mobile 52), số đếm trong chip nhỏ. |
| Bộ lọc nhanh | segmented control: nền `surface-subtle` padding 4, mục chọn nền trắng + `shadow-xs`. |
| Đồng hồ | khối `warning-bg` viền `warning-border` bo 12; trái là nhãn + giờ kết thúc, phải là 3 nhóm số `text-timer` màu `warning-strong` #92400E với chữ "giờ / phút / giây" 12px bên dưới; mobile gộp `01:12:40`. Còn dưới 5 phút: chuyển bộ màu `danger`. |
| Khối giá (S02, S05) | một card: nhãn "Giá hiện tại" + badge giá sàn → giá `text-price-xl` → lưới 2×2 số liệu → đường kẻ → form đặt giá. |
| Thẻ phiên | ảnh 4:3 nền `surface-subtle`, badge trạng thái góc trên trái, badge thời gian góc dưới trái; tên `text-h4` 2 dòng; meta "Danh mục · AUC-…"; giá `text-price-lg` + số lượt; hàng nút: nút icon Theo dõi 44×44 + nút "Xem chi tiết". |
| Bảng | tiêu đề cột `.label` trên nền `surface-subtle`; hàng 52 (admin 48, chữ 14); cột tiền căn phải đậm; hàng nổi bật tô nền `surface-info`; kẻ ngang 1px `border-subtle`. |
| Mobile chi tiết phiên | thanh đáy cố định: "Giá của bạn" + nút "Đặt giá" xl. |
| Avatar chữ | tròn, nền `primary-50` chữ `primary-700` (người dùng hiện tại/người dẫn đầu) hoặc `neutral-bg` chữ `neutral`. |
| Icon | nét 1.8px, cỡ 16/18/20, màu theo chữ (`currentColor`). |

## 7. Chuyển động

- Thời lượng 150–200ms, chỉ `opacity`/`transform`/`background-color`.
- Giá vừa cập nhật realtime: class `.price-flash` (nháy nền `primary-50` 600ms).
- Tắt hết khi `prefers-reduced-motion`.

## 8. Khi đọc spec

Bảng "Số đo từ Figma" và `outline/` là dữ liệu gốc (font Inter, chữ hoa, viền một bên) – dùng để lấy màu, cấu trúc và kích thước khởi điểm, không lấy kiểu chữ hay trang trí. Bậc chữ gợi ý trong mỗi spec đã được quy đổi sang thang ở mục 3.
