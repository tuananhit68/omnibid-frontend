# GAP_ANALYSIS_FE — Mã frontend hiện tại vs tài liệu v4 + backend v4

Khảo sát 21/11/2026, nhánh hiện tại (commit `5ad890e`, đã merge S07 watchlist). Đã làm (theo Figma cũ): nền móng (UI kit, 4 layout, tokens, font), trang chủ, danh sách phiên, chi tiết phiên, đăng ký, đăng nhập, lượt đặt giá, watchlist. Các màn này được **thiết kế lại** theo API v4, chỉ giữ màu.
Đường dẫn tương đối từ `src/`. 🔴 vỡ khi chạy với backend v4 · 🟠 lệch tài liệu v4 · 🟡 dọn dẹp.

## A. Hạ tầng
| # | Mức | Hiện trạng | Yêu cầu v4 | Tệp |
|---|---|---|---|---|
| A1 | 🔴 | Envelope `{success, errorCode, message, data, timestamp}`; `ApiError.errorCode`; `VALIDATION_ERROR` đọc `data` | `{success, data}` / `{success:false, error:{code,message,details}}`; `details.fields` | `lib/api/client.ts`, `lib/api/types.ts` |
| A2 | 🔴 | 401 luôn redirect (kể cả đăng nhập sai) | 401 ở `/auth/login` = sai thông tin; 403 ACCOUNT_BANNED → đăng xuất | `lib/api/client.ts` |
| A3 | 🔴 | `lib/errors.ts` chứa mã cũ (INVALID_CREDENTIALS, PAYMENT_IN_PROGRESS, SELF_WATCH…) | đúng 24 mã v4 + NETWORK_ERROR | `lib/errors.ts` |
| A4 | 🔴 | Thời gian parse như giờ VN không múi giờ (`dayjs.tz(v, VN)`), gửi lên không offset | Chuỗi có offset +07:00; gửi kèm offset | `lib/format.ts` (`parseBackendDateTime`, `toBackendDateTimeString`, `calculateCountdown`) |
| A5 | 🔴 | STOMP qua SockJS `/ws-auction`, topic `/topic/auction/{id}`, `/user/queue/notifications`, payload `{type, auctionId, data}` | WebSocket thuần `/ws`, `/topic/auctions/{id}`, `AuctionEvent` phẳng, 5 type; không có kênh thông báo | `lib/ws/*`, `.env.example` |
| A6 | 🔴 | `AuthResponse {accessToken, tokenType, userId, email, fullName, role}`; cookie chứa token | `LoginResponse {…, expiresAt, user{…}}`; cookie chỉ cờ `omnibid_auth`, `omnibid_role` | `lib/api/auth-storage.ts`, `features/auth/*` |
| A7 | 🔴 | `types/enums.ts`: BidStatus, ShipmentStatus, ReportType, ReportAction, PaymentStatus PENDING, PaymentMethod 3 giá trị, ProductStatus REMOVED, NotificationType cũ, OrderAction | Enum v4 (DESIGN_SYSTEM.md §8, RESPONSE_DTO_v4.md) | `types/enums.ts` |
| A8 | 🟠 | `middleware.ts` bảo vệ `/watchlist`, `/seller`, `/notifications`; admin trang chủ `/admin/dashboard` | Bảo vệ `/me/**`, `/orders/**`, `/admin/**`; admin home `/admin`; Next 16: cân nhắc đổi sang `proxy.ts` | `middleware.ts` |
| A9 | 🟠 | `next.config.ts` cho phép ảnh `localhost:8080/uploads` | Chỉ Cloudinary `res.cloudinary.com`; `unoptimized` khi mock | `../next.config.ts` |
| A12 | 🔴 | Không chạy được khi thiếu backend | Chế độ mock theo `MOCK_MODE.md`; `contract.ts` theo `RESPONSE_DTO_v4.md` | `lib/api`, `mocks/` (mới) |
| A13 | 🟠 | Thang chữ/bề mặt theo hướng "Rõ ràng, đáng tin" cũ | Theo `design/DESIGN_SYSTEM.md` (giữ nguyên biến màu) | `styles/tokens.css` |
| A10 | 🟠 | Chưa có `lucide-react`; icon danh mục từ `iconUrl` | `category.icon` = tên icon lucide-react (Thiết kế 3.2) | `package.json`, `components/icons`, `features/auction/components/CategoryCard.tsx` |
| A11 | 🟡 | `sockjs-client`, `@types/sockjs-client` | gỡ | `package.json` |

## B. Layout
| # | Mức | Hiện trạng | Yêu cầu v4 | Tệp |
|---|---|---|---|---|
| B1 | 🟠 | PublicLayout nav có "Theo dõi", link "Kênh người bán" `/seller`, chuông → `/notifications` | Bỏ Theo dõi; menu tài khoản theo DESIGN_SYSTEM §5; chuông → `notification-bell` | `components/layout/PublicLayout.tsx` |
| B2 | 🟠 | SellerLayout (`/seller/*`) | Thay bằng `AccountLayout` (`/me/**`, sidebar 6 mục) | `components/layout/SellerLayout.tsx` → `AccountLayout.tsx` |
| B3 | 🟠 | AdminLayout 8 mục gồm "Nhật ký hệ thống", có chuông | 7 mục, không chuông, menu Hồ sơ/Đăng xuất | `components/layout/AdminLayout.tsx` |
| B4 | 🟡 | AuthLayout | logo + "Về trang chủ" theo DESIGN_SYSTEM §5 | `components/layout/AuthLayout.tsx` |

## C. Màn hình đã có
| # | Mức | Màn hình | Việc phải sửa |
|---|---|---|---|
| C1 | 🔴 | `register` | mật khẩu ≥ 8 + hoa/thường/số; SĐT bắt buộc; không địa chỉ; không nhận token → về `/login?registered=1` |
| C2 | 🔴 | `login` | response mới; 401/403/429; điều hướng theo vai trò |
| C3 | 🔴 | `auction-detail` | `POST /auctions/{id}/bids {amount}`; lịch sử `Page<BidHistoryItem>`; `viewerIsSeller`/`viewerIsLeading`/`orderId`; WS mới; `SELF_BID_NOT_ALLOWED` 409; bỏ Theo dõi; `report-modal` mới; "Đang chốt phiên"; Admin/chủ phiên không có form |
| C4 | 🔴 | `auction-list` | `categoryId` (một), `keyword` thay `q`, sort chỉ 4 giá trị, `endBefore`, bỏ `isWatched` |
| C5 | 🟠 | `home` | bỏ Theo dõi, `auctionCount`; Server Component cho dữ liệu đầu (live); icon lucide |
| C6 | 🔴 | `my-bids` | bỏ `/bids/mine/summary` và BidStatus; vị thế dẫn xuất từ `leading`, `orderId`, trạng thái phiên; AccountLayout |
| C7 | 🔴 | watchlist | xóa toàn bộ (DELETE_LIST_FE) |

## D. Thành phần UI
| # | Mức | Thành phần | Việc |
|---|---|---|---|
| D1 | 🟠 | `components/ui/ShipmentStepper.tsx` | thay bằng `OrderProgress` |
| D2 | 🟠 | `features/auction/components/ReportViolationModal.tsx` | chuyển sang `features/report/components/ReportModal.tsx` (`report-modal`) |
| D3 | 🟠 | `features/auction/components/SellerSummaryCard.tsx` | rút gọn thành dòng "Người bán: …" (không uy tín, không gian hàng) |
| D4 | 🟠 | `StatusBadge` | nhận enum v4 + nhãn vị thế dẫn xuất |
| D5 | 🟡 | `app/dev/ui/page.tsx` | cập nhật mẫu theo component mới/bỏ |

## E. Màn hình chưa có (MỚI)
`profile`, `admin-profile`, `my-products`, `product-form`, `auction-create`, `my-auctions`, `my-auction`, `my-orders`, `order-detail`, `notifications`, `notification-bell`, 7 màn `admin-*` — xem `SCREENS_v4.md`.
