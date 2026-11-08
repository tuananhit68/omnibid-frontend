# Thư viện component – OmniBid

File Figma không khai báo Component/Variant (components = 0), nên danh sách dưới đây được **gom từ các khối lặp lại** trong 28 frame S00–S26. Số đo lấy từ JSON. Mỗi mục tương ứng một file trong `src/components/ui/` (không gọi API) hoặc `src/features/*/components/` (có dữ liệu).

Quy ước: chỉ dùng token trong `design/tokens/tokens.css`. Kiểu chữ và trang trí theo `design/style-overrides.md`: không nhãn chữ hoa, không viền màu một bên; mọi "nhãn" dưới đây là class `.label` (13px, 500, viết thường kiểu câu). Mọi component tương tác phải có state `hover`, `focus-visible` (ring 2px `--color-focus`, offset 2px), `disabled`, và `loading` nếu là nút gửi dữ liệu.

## 1. Nút – `Button`

| Variant | Nền | Chữ | Viền | Dùng ở |
| --- | --- | --- | --- | --- |
| `primary` | `primary-600` #1D4ED8 | trắng | – | Hành động chính: Đăng nhập, Lưu, Tạo phiên, Xem chi tiết |
| `primary-strong` | `primary-700` #0037B0 | trắng | – | Hành động tiền bạc/quan trọng nhất trang: **Đặt giá** (S05), **Thanh toán** (S11), Gửi khiếu nại (S13), Vào đặt giá ngay (S07) |
| `secondary` | `surface-muted` #EAEDFF | `text` #131B2E | – | Huỷ bỏ, Áp dụng giá, Xem kết quả |
| `tertiary` | `surface-subtle` #F2F3FF | `text-secondary` #434655 | – | Nút phụ trên header/thanh công cụ: Báo cáo phiên này, Xem sàn đấu giá, Khôi phục |
| `outline` | trắng | `text` | `border-strong` #CBD5E1 | Theo dõi, Đăng ký (header), Hủy (S16) |
| `danger-soft` | `danger-bg` #FEF2F2 (S17 dùng #FFDAD6) | `danger` #BA1A1A | – | Huỷ phiên, Khoá tài khoản, Xoá |
| `ghost` | trong suốt | `text-link` | – | Link dạng nút: Xem toàn bộ, Quay lại |
| `icon` | trong suốt / `surface-subtle` | `text-tertiary` | – | Chuông thông báo, đóng modal, zoom ảnh – **bắt buộc `aria-label`** |

| Size | Chiều cao | Padding ngang | Chữ | Bo góc |
| --- | --- | --- | --- | --- |
| `sm` | 32px | 12px | 13/20, 600 | 8px |
| `md` | 40px | 16px | 14/20, 600 | 8px |
| `lg` (mặc định cho form, CTA) | 44px | 20px | 15/24, 600 | 8px |
| `xl` (Đặt giá, Thanh toán) | 52px | 28px | 16/24, 600 | 10px |

Icon trong nút: 16px, cách chữ 8px. Nút `loading`: giữ nguyên độ rộng, thay icon bằng spinner, `aria-busy="true"`, chặn bấm lặp.

## 2. Ô nhập – `Input`, `Textarea`, `Select`, `MoneyInput`, `DateTimeInput`, `PasswordInput`

- Kiểu chính: cao **44px**, nền `surface-subtle` #F2F3FF, viền 1px `border-brand`, bo 8px, padding ngang 14px, chữ 15/24 `text`; focus viền `primary-600` + ring. Icon trái 16px cách chữ 8px.
- Kiểu thanh lọc/tìm kiếm (S06, S07, S10, S14, admin): cao 40px, nền `bg` #FAF8FF, viền `#C4C5D7` 60% (dùng `border-strong`), bo 8px.
- Label: 14/20, 600, `text`, cách ô 8px; dấu `*` màu `danger`. Helper/lỗi: 12/16 ngay dưới ô, cách 4–6px; lỗi màu `danger` + icon.
- Placeholder dùng `text-placeholder` (đã sửa tương phản), **không thay label bằng placeholder**.
- `MoneyInput`: căn phải, hậu tố `₫`/`VND` màu `text-subtle`, định dạng nghìn bằng dấu chấm khi gõ (`22.000.000`), gửi API dạng số.
- `PasswordInput`: nút hiện/ẩn mật khẩu là `button` có `aria-label="Hiện mật khẩu"`.
- `DateTimeInput`: hiển thị `dd/MM/yyyy HH:mm` giờ VN (GMT+7), gửi ISO 8601.
- Checkbox/Radio: ô 16px (Figma), vùng bấm cả dòng label để đạt 44px.

## 3. Badge trạng thái – `StatusBadge`

Pill bo `full`, cao 26px (mobile 22–24px), padding 0 10px, chữ 13/500 viết thường, chấm tròn 6px phía trước cho trạng thái phiên. **Màu không phải là kênh duy nhất**: luôn có chữ. "Bị vượt" dùng nền `tertiary-100` #FFDBCF chữ `tertiary-800` #7F2500.

| Enum | Giá trị | Nhãn | Tông |
| --- | --- | --- | --- |
| AuctionStatus | SCHEDULED | Sắp diễn ra | warning (S01) / neutral |
| | ACTIVE | Đang diễn ra | info (#DBEAFE / #1D4ED8), chấm xanh |
| | ENDED | Đã kết thúc – Có người thắng | success |
| | UNSOLD | Không đạt giá sàn / Không có người thắng | warning |
| | CANCELLED | Đã huỷ | danger |
| BidStatus | LEADING | Dẫn đầu | success |
| | OUTBID | Bị vượt | warning |
| | WON | Đã thắng | info đậm |
| | NOT_WON | Không thắng | neutral |
| | INVALIDATED | Bị vô hiệu | danger |
| OrderStatus | PENDING_PAYMENT | Chờ thanh toán | warning |
| | PAID | Đã thanh toán | info |
| | SHIPPING | Đang giao | tím nhạt theo Figma S10 → dùng info nếu không muốn thêm màu |
| | COMPLETED | Hoàn tất | success |
| | CANCELLED | Đã huỷ | danger |
| | EXPIRED | Hết hạn | neutral |
| PaymentStatus | PENDING / SUCCESS / FAILED | Đang xử lý / Thành công / Thất bại | info / success / danger |
| ShipmentStatus | CREATED / PICKED_UP / IN_TRANSIT / DELIVERED | Đã tạo / Đã lấy hàng / Đang vận chuyển / Đã giao | neutral / info / info / success |
| ProductStatus | AVAILABLE / IN_AUCTION / RESERVED / SOLD / HIDDEN / REMOVED | Có thể đấu giá / Đang đấu giá / Đang giữ chỗ / Đã bán / Đã ẩn / Đã gỡ | success / info / warning / neutral / danger / neutral |
| ReportStatus | PENDING / RESOLVED / REJECTED | Chờ xử lý / Đã giải quyết / Đã bác bỏ | warning / success / neutral |
| UserStatus | ACTIVE / BANNED | Hoạt động / Bị khoá | success / danger |
| Giá sàn (dẫn xuất) | – | Đã đạt giá sàn / Chưa đạt giá sàn / Không có giá sàn | success / warning / neutral |

Đặt toàn bộ bảng này trong `src/types/enums.ts` (map `label` + `tone`), không viết lại nhãn trong từng trang. Badge dùng `whitespace-nowrap` (S20, S21 trong Figma bị xuống dòng – lỗi cần tránh).

## 4. Thẻ – `Card` và các thẻ nghiệp vụ

- `Card`: nền trắng, viền 1px `border-brand` #E2E7FF, bo 12px, **không đổ bóng**, padding 24px (mobile 16px). Khối phụ bên trong dùng nền `surface-subtle` bo 10px, không lồng card có viền thứ hai.
- `AuctionCard` (S00, S01, S07): ảnh 4:3 nền `surface-subtle`; badge trạng thái (nền trắng) góc trên trái, badge thời gian (nền `warning-bg`, chữ `warning-strong`, icon đồng hồ, `tabular`) góc dưới trái; padding 16px; tên `text-h4` 2 dòng (`line-clamp-2`); meta `.label` "Danh mục · AUC-9821"; hàng giá: nhãn "Giá hiện tại" + giá `text-price-lg` `primary-700`, số lượt đặt bên phải; hàng nút: nút icon Theo dõi 44×44 viền `border-strong` + nút `primary` lg "Xem chi tiết". Phiên SCHEDULED: nhãn "Giá khởi điểm", badge thời gian "Bắt đầu dd/MM HH:mm".
- `StatCard` / KPI (S06, S07, S10, S14, S19–S26): card trắng viền `border-brand`, bo 12px, padding 20px; nhãn `.label` viết thường; số 28/36 700 `tabular`; ô icon 40×40 bo 10px nền nhạt theo tông. Card "cần chú ý" đổi nền theo tông (vd "Chờ thanh toán" nền `warning-subtle-bg`).
- `CategoryCard` (S00): 224×160, icon tròn 48px nền `primary-50`, tên 14/700, số phiên 12.
- `NotificationItem` (S09, S09a): icon 40×40 bo 8px theo loại, tiêu đề 14–16/600 + chấm chưa đọc 8px `primary-700`, nội dung 14, meta 12 `text-subtle`, nút hành động bên phải (`primary`/`secondary` sm), nút "đánh dấu đã đọc" dạng `icon`.

## 5. Bảng – `DataTable`

- Header: nền `surface-subtle` #F2F3FF, chữ `.label` viết thường (vd "Người đặt"), cao 44px.
- Hàng: cao 52px (admin 48px, chữ 14px), kẻ ngang 1px `border-subtle`, hover nền `surface-subtle`. Hàng nổi bật (bid dẫn đầu) nền `surface-info`. Hàng cần chú ý (đơn chờ thanh toán, tài khoản bị khoá) nền `danger-bg` / `warning-subtle-bg` rất nhạt. Hàng đang chọn: nền `primary-50`, không dùng viền màu một bên.
- Cột số tiền căn phải, `.tabular`. Cột hành động căn phải, cố định ở mép phải (`sticky right-0`).
- **Bắt buộc bọc bảng trong vùng `overflow-x-auto`**: trong Figma, bảng ở S10, S14, S19, S22–S26 rộng hơn khung chứa nên cột cuối (Trạng thái/Thao tác) bị cắt. Ưu tiên giảm cột hoặc gộp cột trước khi cho cuộn ngang.
- Cột ghi chú dài (S18 "Lịch sử cập nhật") đặt `min-width: 240px`, không để chữ bị bẻ từng từ.
- Trạng thái bảng: skeleton 5 hàng khi tải, empty state có minh hoạ + câu hướng dẫn + nút hành động, error state có nút "Thử lại".
- `Pagination` (S01, S06, S10…): nút 32–36px vuông, bo 8px; trang hiện tại nền `primary-600` chữ trắng; "Trước/Sau" có chữ; `aria-current="page"`; dòng "Hiển thị 1 - 9 trong tổng số 128" bên trái.

## 6. Điều hướng

- `TopNav` (khách/người mua, S00–S13): cao 64px, nền trắng 95% + blur 8px, sticky; logo 122×32; menu chữ 14/500, mục active chữ `primary-600` + gạch chân 2px; ô tìm kiếm 310–448×38–44 nền `surface-subtle`; bên phải: khách = `outline` "Đăng ký" + `primary` "Đăng nhập"; đã đăng nhập = chuông (badge số đỏ) + avatar 32px + tên + mũi tên mở menu.
- `SideNav` (người bán S14–S18, admin S19–S26): rộng 256px, nền trắng; nhóm tiêu đề `.label` viết thường ("Quản lý cửa hàng"; bỏ nếu chỉ có một nhóm); mục cao 40px bo 8px, icon 20px, mục active nền `primary-600` chữ trắng.
- `Breadcrumb`: chữ 14 `text-tertiary`, ngăn cách `›`, mục cuối `primary-600`; dùng `nav aria-label="Breadcrumb"`.
- `Tabs` (đổi nội dung: S05 mô tả/lịch sử, S09): gạch chân 2px `primary-600` dưới tab đang chọn, cao 56px (mobile 52px), số đếm trong chip nhỏ nền `surface-muted`; `role="tablist"`. `SegmentedControl` (lọc nhanh theo trạng thái: S06, S07, S10…): nền `surface-subtle` padding 4px, mục chọn nền trắng + `shadow-xs`.
- `FilterChips` (S01, S23, S24): chip đã áp dụng nền `info-bg`, chữ `primary-600`, nút `×` có `aria-label="Bỏ lọc …"`.

## 7. Hộp thoại & lớp nổi

- `Modal` (S13): rộng 448px, bo 16px, shadow `lg`; header icon 40px + tiêu đề `text-h3` + phụ đề; footer nút phải; nền mờ `--color-overlay`. Bẫy focus, `Esc` để đóng, trả focus về nút đã mở.
- `Dropdown` thông báo (S09a): rộng 389px, bo 12px, shadow `lg`; header + tabs + danh sách + link "Xem toàn bộ".
- `ConfirmDialog`: dùng cho mọi hành động không đảo ngược (huỷ phiên, khoá tài khoản, xử lý báo cáo, xác nhận nhận hàng).
- `Toast`: góc dưới phải (desktop) / trên (mobile), `role="status"`, tự ẩn 5 giây, lỗi thì không tự ẩn.

## 8. Thành phần đặc thù đấu giá

- `CountdownTimer` (S02, S05): khối nền `warning-bg` #FEF3C7 viền `warning-border`, bo 12px, padding 16px 20px; trái: `.label` "Thời gian còn lại" + caption "Kết thúc 28/10/2026 21:30 (GMT+7)"; phải: 3 nhóm số `text-timer` màu `warning-strong` #92400E, `tabular`, chữ "giờ / phút / giây" 12px dưới mỗi nhóm; mobile gộp `01:12:40`. Còn dưới 5 phút: đổi sang bộ màu `danger`. Tính từ `endTime` và độ lệch giờ máy chủ; khi về 0 hiển thị "Đang chốt phiên…" và chờ WebSocket, **không tự đổi trạng thái**. `aria-live="off"` cho số giây, chỉ thông báo khi còn 5 phút / 1 phút.
- `PricePanel` (một card cùng `BidForm`): `.label` "Giá hiện tại" + badge giá sàn cùng hàng; giá `text-price-xl` `primary-700` `tabular`, `aria-live="polite"`, `.price-flash` khi đổi; lưới 2×2 số liệu (Giá khởi điểm · Bước giá · Lượt đặt giá · Giá tối thiểu tiếp theo – ô cuối nền `primary-50`).
- `BidForm` (S05): ngăn với `PricePanel` bằng đường kẻ 1px; nhãn "Mức giá của bạn" + "Đang dẫn đầu: Tr***g" bên phải; `MoneyInput` cao 52px; gợi ý có icon (i) "Tối thiểu X (giá hiện tại + bước giá)"; nút xl `primary-700` full-width "Đặt giá". Mobile: thanh đáy cố định "Giá của bạn" + nút "Đặt giá".
- `BidHistoryTable`: 4 cột Người đặt (avatar chữ viết tắt + tên che `Tr***g`, chip "Bạn") | Mức giá | Thời gian | Trạng thái; hàng LEADING nền `surface-subtle`, giá `primary-700`.
- `ImageGallery` (S02, S05): ảnh chính tỉ lệ ~3:2 nền `surface-subtle` viền `border-brand` bo 12px, badge trạng thái góc trên trái, nút phóng to (icon, 44×44) góc dưới phải; hàng thumbnail 96px bo 10px, ảnh đang xem viền 2px `primary-600` + `aria-pressed`. Mobile: ảnh 300px cao, vuốt ngang, chỉ số "1 / 5".
- `ShipmentStepper` (S12, S18): 4 bước tròn 32px nối bằng vạch 2px; bước đã qua nền `primary-700` chữ trắng; dưới mỗi bước nhãn + thời điểm.
- `ImageUploader` (S15): vùng kéo-thả nền `surface-subtle` viền nét đứt; lưới 5 ô 100×104; ô đầu gắn nhãn "Ảnh chính"; nút xoá trên ảnh có `aria-label`; đếm "3 / 5 ảnh".
- `SellerCard`: tên shop + chip uy tín + nút "Xem gian hàng" – xem `gaps.md` vì backend chưa có dữ liệu này.
