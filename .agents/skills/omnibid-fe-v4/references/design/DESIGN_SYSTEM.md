# DESIGN_SYSTEM — Hệ thiết kế frontend Omnibid (v4)

**Chỉ màu là kế thừa Figma** (`design/tokens/tokens.css` → `src/styles/tokens.css`): không thêm màu, không đổi vai trò màu. Mọi thứ khác (bố cục, thang chữ, khoảng cách, component) được **thiết kế lại theo dữ liệu API v4** (`backend/RESPONSE_DTO_v4.md`) và quy định trong tệp này. Ảnh Figma cũ và wireframe tạm trong tài liệu Thiết kế **không** dùng làm căn cứ.
Agent được phép tinh chỉnh thang chữ, bo góc, khoảng cách trong `tokens.css` (một chỗ duy nhất) nếu thấy cần, và ghi lại trong `docs/v4/PROGRESS.md`.

## 1. Nguyên tắc
1. **Dữ liệu dẫn thiết kế.** Mỗi màn hiển thị đúng các trường API trả về, xếp theo mức quan trọng với người dùng; không vẽ khối cho dữ liệu không tồn tại.
2. **Con số là nhân vật chính.** Giá, mức tối thiểu, đồng hồ, hạn thanh toán: cỡ lớn, đậm, `tabular`. Nhãn nhỏ, viết thường kiểu câu, màu dịu.
3. **Phẳng, viền mảnh, ít lớp.** Card trắng viền 1px, không bóng; không card lồng card; không viền màu một bên; không nhãn chữ hoa.
4. **Trạng thái luôn rõ.** Mọi đối tượng có trạng thái (phiên, sản phẩm, đơn, báo cáo, người dùng) hiển thị `StatusBadge` có chữ; hành động khả dụng nằm cạnh trạng thái và giải thích khi bị khóa.

## 2. Màu (khóa)
| Vai trò | Token |
|---|---|
| Hành động thường, link, mục đang chọn | `primary-600`; nền chọn `primary-50` |
| Tiền và hành động tiền bạc (Đặt giá, Thanh toán) | `primary-700` — tối đa **một** nút `primary-700` mỗi màn |
| Nền trang / card / khối phụ / chip | `bg` / `surface` / `surface-subtle` / `surface-muted` |
| Chữ | `text`, `text-secondary`, `text-tertiary`, `text-subtle`, `text-placeholder`; `text-disabled` chỉ cho disabled |
| Viền | `border-brand` (card), `border-subtle` (kẻ bảng), `border-strong` (ô nhập outline) |
| Trạng thái | `success`, `warning`, `danger`, `info`, `neutral` (+ `-bg`, `-border`, `-strong`); nhấn cam `tertiary-*` cho "Bị vượt giá" |
Không gradient, không bóng màu, không màu ngoài token.

## 3. Chữ
Font **Be Vietnam Pro** (400/500/600/700) qua `next/font/google`, subset `latin` + `vietnamese`.
| Bậc | Cỡ/dòng/đậm | Dùng cho |
|---|---|---|
| `text-display` | 40/48·700 | hero trang chủ |
| `text-h1` | 28/36·600 (mobile 22/30) | tiêu đề trang |
| `text-h2` | 22/30·600 | tiêu đề section |
| `text-h3` | 18/26·600 | tiêu đề card, modal |
| `text-h4` | 16/24·600 | tên sản phẩm trong thẻ |
| `text-body` | 15/24·400 | mặc định |
| `text-small` | 14/22·400 | bảng, dòng phụ |
| `.label` | 13/20·500 `text-tertiary` | nhãn, tiêu đề cột |
| `text-caption` | 12/18·400 | meta |
| `text-price-xl` | 40/48·700 `primary-700` (mobile 34/42) | giá ở chi tiết phiên |
| `text-price-lg` | 22/30·700 `primary-700` | giá trên thẻ, tổng tiền đơn |
| `text-timer` | 28/36·700 | đồng hồ |
Tiền `21.500.000 ₫`. Không `uppercase`, `tracking-wide*`, eyebrow (trừ mã như `AUC-12`).

## 4. Bề mặt và khoảng cách
Card: `bg-surface border border-border-brand rounded-xl p-6` (mobile `p-4`), không bóng. Khối phụ: `bg-surface-subtle rounded-lg`. Lưới số liệu: ô `surface-subtle` cách 1px, ô quan trọng nhất nền `primary-50`. Lớp nổi: dropdown `shadow-md`, modal/drawer `shadow-lg`, bo 16. Bo góc: 6 chip · 8 nút/ô nhập · 10 cỡ xl/thumbnail · 12 card · 16 modal · full badge/avatar. Khoảng cách theo thang 4px; khối trong trang cách 24px. Chuyển động 150–200ms, `.price-flash` khi giá đổi, tắt khi `prefers-reduced-motion`.

## 5. Khung trang
| Layout | Route | Cấu trúc |
|---|---|---|
| `PublicLayout` | `/`, `/auctions`, `/auctions/[id]` | Header sticky 64px: logo · ô tìm kiếm (→ `/auctions?keyword=`) · Guest: "Đăng ký" + "Đăng nhập"; USER: chuông thông báo + menu tài khoản; ADMIN: "Trang quản trị" + menu. Nav: Trang chủ · Phiên đấu giá. Nội dung tối đa 1216px. Footer gọn |
| `AccountLayout` | `/me/**`, `/orders/[id]` (chỉ USER) | Header như Public + breadcrumb "Tài khoản › …". Sidebar 256px "Tài khoản": Hồ sơ · Sản phẩm của tôi · Phiên của tôi · Lượt đặt giá · Đơn hàng · Thông báo (số chưa đọc). Nội dung tối đa 960px |
| `AdminLayout` | `/admin/**` (chỉ ADMIN) | Header: logo + chip "Quản trị viên" · "Xem sàn đấu giá" · menu Hồ sơ/Đăng xuất (không chuông). Sidebar 256px: Tổng quan · Người dùng · Sản phẩm · Phiên đấu giá · Đơn hàng · Danh mục · Báo cáo vi phạm (số chờ xử lý) |
| `AuthLayout` | `/login`, `/register` | Logo + "Về trang chủ"; card trắng giữa trang 480–560px |
Lý do không có "kênh người bán" riêng: v4 chỉ có vai trò USER (vừa mua vừa bán) và ADMIN.

**Responsive (mobile-first, `md` 768, `lg` 1024):** padding trang 16/24/32; sidebar thành drawer dưới `lg` (bẫy focus); lưới thẻ phiên 1/2/3 cột (trang chủ 4 ở ≥1280); trang 2 cột xếp dọc dưới `lg`; chi tiết phiên mobile: khối giá + đặt giá ngay dưới ảnh, thanh đáy cố định "Đặt giá"; bảng: dưới `md` thành danh sách thẻ; modal toàn màn hình dưới `md`. Kiểm tra 375/768/1280: không cuộn ngang, vùng bấm ≥ 44px, input mobile 16px.

## 6. Component (`src/components/ui`, thuần giao diện)
| Component | Quy định |
|---|---|
| `Button` | variant `primary` (`primary-600`), `money` (`primary-700`, chỉ Đặt giá/Thanh toán), `secondary` (`surface-muted`), `outline`, `danger-soft` (`danger-bg` + `danger`), `ghost`; size sm 32 · md 40 · lg 44 · xl 52; `loading` giữ độ rộng |
| `IconButton` | `label` bắt buộc, vùng bấm 44 |
| `Input`, `Textarea`, `Select`, `PasswordInput` | cao 44, nền `surface-subtle`, viền `border-brand`, focus `primary-600`; label trên, lỗi dưới |
| `MoneyInput` | cao 52, căn phải, `20/700 tabular`, hậu tố `₫`, giá trị số nguyên |
| `DateTimeInput` | hiển thị `dd/MM/yyyy HH:mm` giờ VN, trả ISO `+07:00` |
| `StatusBadge` | pill 26px chữ 13/500, chấm 6px cho trạng thái phiên; label + tone từ `types/enums.ts` |
| `Card`, `StatCard` | card chuẩn; StatCard: nhãn + số 28/36·700 + dòng phụ |
| `DataTable` | header `.label` nền `surface-subtle`; hàng 52 (admin 48); cột tiền phải `tabular`; `overflow-x-auto`; chế độ thẻ trên mobile; skeleton/empty/error |
| `Pagination` | trang hiện tại `primary-600`; "Hiển thị a–b trong tổng n" |
| `Tabs`, `SegmentedControl` | tab gạch chân 2px `primary-600`; segmented nền `surface-subtle`, mục chọn trắng `shadow-xs` |
| `Modal`, `ConfirmDialog` | 448px, bo 16; ConfirmDialog nêu hệ quả + ô lý do (bắt buộc/tùy chọn) |
| `Toast` | thành công tự ẩn 5s; lỗi không tự ẩn |
| `EmptyState`, `Skeleton`, `ErrorState` | icon + một câu + một nút |
| `CountdownTimer` | khối `warning-bg`/`warning-border`; < 5 phút đổi bộ màu `danger`; về 0 hiện "Đang chốt phiên…" |
| `OrderProgress` | 4 bước Chờ thanh toán → Đã thanh toán → Đang giao → Hoàn tất, kèm mốc thời gian; EXPIRED/CANCELLED thay bằng hộp thông báo |
| `ImageUploader` | 1–5 ô, đếm "n / 5", nhãn "Ảnh chính" ở ô đầu, nút "Đặt làm ảnh chính" (chỉ khi tạo), xóa có `aria-label` |
| `ImageGallery` | ảnh chính 4:3 + hàng thumbnail; mobile vuốt, chỉ số "1 / 5" |
| `CategoryIcon` | tên icon `lucide-react` → map tĩnh các icon cho phép, fallback `tag` |
| `Avatar` | ảnh hoặc chữ viết tắt nền `primary-50` |

## 7. Component nghiệp vụ (trong `src/features/*/components`)
`AuctionCard` (ảnh, badge trạng thái, tên 2 dòng, "Danh mục", giá hiện tại/giá khởi điểm, số lượt, thời gian còn lại/bắt đầu, nút "Xem chi tiết") · `PricePanel` + `BidForm` (một card, ngăn bằng đường kẻ) · `BidHistoryTable` (Thời điểm `HH:mm:ss.SSS` · Người đặt ẩn danh · Mức giá) · `ReserveBadge` · `OrderSummaryCard` · `PaymentForm` · `PaymentHistoryTable` · `ShipForm` · `NotificationItem` · `NotificationBell` · `ReportModal` · `AdminActionDialogs` (ban/unban/hide/cancel auction/cancel order) · `ReportResolvePanel`.

## 8. Nhãn trạng thái (đặt trong `src/types/enums.ts`)
| Enum | Giá trị → nhãn · tông |
|---|---|
| AuctionStatus | SCHEDULED Sắp diễn ra · warning; ACTIVE Đang diễn ra · info; ENDED Đã kết thúc · success; UNSOLD Không bán được · neutral; CANCELLED Đã hủy · danger |
| ReserveStatus | MET Đã đạt giá sàn · success; NOT_MET Chưa đạt giá sàn · warning; NO_RESERVE Không có giá sàn · neutral |
| ProductStatus | AVAILABLE Sẵn sàng · success; IN_AUCTION Đang đấu giá · info; RESERVED Đang giao dịch · warning; SOLD Đã bán · neutral; HIDDEN Bị ẩn · danger |
| ProductCondition | NEW Mới · LIKE_NEW Như mới · GOOD Tốt · FAIR Khá · POOR Kém |
| OrderStatus | PENDING_PAYMENT Chờ thanh toán · warning; PAID Đã thanh toán · info; SHIPPING Đang giao · info; COMPLETED Hoàn tất · success; CANCELLED Đã hủy · danger; EXPIRED Hết hạn · neutral |
| PaymentStatus | SUCCESS Thành công · success; FAILED Thất bại · danger |
| NotificationType | OUTBID Bị vượt giá · tertiary; AUCTION_RESULT Kết quả phiên · info; AUCTION_CANCELLED Phiên bị hủy · danger; ORDER_UPDATE Cập nhật đơn hàng · info; REPORT_RESOLVED Kết quả báo cáo · neutral |
| ReportStatus | PENDING Chờ xử lý · warning; RESOLVED Đã xử lý · success; REJECTED Bác bỏ · neutral |
| UserStatus / UserRole | ACTIVE Hoạt động · success; BANNED Bị khóa · danger / USER Người dùng; ADMIN Quản trị viên |
| BidPosition (dẫn xuất từ `MyBidItem`) | leading Đang dẫn đầu · success; outbid Bị vượt · tertiary; won Đã thắng · info; lost Không thắng · neutral |
Không hiển thị giá trị enum thô cho người dùng.
