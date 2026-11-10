# Chỗ lệch giữa Figma và backend – cần nhóm quyết trước khi code

Figma được vẽ đẹp hơn và "rộng" hơn backend hiện có. Nếu để agent code y nguyên ảnh, nó sẽ tự bịa API hoặc dữ liệu giả. Bảng dưới liệt kê từng chỗ lệch kèm **cách xử lý mặc định** đã được ghi vào spec. Nhóm chỉ cần sửa cột "Quyết định" nếu muốn khác.

Đã đối chiếu với code backend ngày 08/11/2026 – xem thêm `backend-contract.md` mục 4 (bảng B: endpoint backend chưa có, như API sản phẩm, theo dõi, hồ sơ). Bảng G dưới đây là chỗ Figma vẽ dư so với dữ liệu; bảng B là chỗ backend còn thiếu.

Quy tắc chung: **backend là chuẩn nghiệp vụ, Figma là chuẩn giao diện.** Thứ gì Figma có mà backend không có thì ẩn đi hoặc thay bằng dữ liệu thật gần nhất; không tạo endpoint mới trong phạm vi frontend.

## 1. Dữ liệu Figma có nhưng backend không có

| # | Màn hình | Trong Figma | Backend hiện có | Xử lý mặc định trong spec |
| --- | --- | --- | --- | --- |
| G1 | S00 | "Chọn vai trò người mua hoặc người bán khi tạo tài khoản", nút "Đăng ký làm người bán" | Chỉ có vai trò USER (vừa mua vừa bán) và ADMIN | Sửa chữ bước 01 thành "Đăng ký một tài khoản để vừa mua vừa bán"; nút CTA dẫn tới `/register` (khách) hoặc `/seller/products/new` (đã đăng nhập) |
| G2 | S02, S05, S11 | Thẻ người bán: tên shop, "Đối tác Uy tín", "3 năm hoạt động", "★5.0", nút "Xem gian hàng" | Chỉ có `seller` (full_name) | Hiện tên + avatar chữ cái đầu; ẩn chip uy tín, số năm, sao; ẩn "Xem gian hàng" |
| G3 | S02, S05 | "Kiểm duyệt: Hợp lệ 100%", chip "Đầy đủ phụ kiện & hộp", "Giao hàng toàn quốc" | Không có trường kiểm duyệt/phụ kiện | Ẩn các chip này; giữ chip danh mục và tình trạng (map từ `condition`) |
| G4 | S02 | Bảng "Thông số kỹ thuật chi tiết" có cấu trúc | `products.description` là TEXT | Hiển thị `description` dạng văn bản giữ xuống dòng (`whitespace-pre-line`); nếu mô tả dạng `Nhãn: giá trị` mỗi dòng thì có thể tách thành bảng |
| G5 | S14, S15, S16, S22, S23 | SKU `PRD-7721`, mã kiểu `#IP15-256` | Không có SKU | Hiển thị `PRD-{id}` (product) và `AUC-{id}` (auction), `ORD-{id}`, `REP-{id}`, `USR-{id}` – viết 1 hàm `formatCode()` |
| G6 | S15 | "Tình trạng hiện tại" dạng chữ tự do ("Như mới (Like New 99%…)") | ENUM `NEW, LIKE_NEW, GOOD, FAIR, POOR` | Select 5 lựa chọn: Mới, Như mới, Tốt, Khá, Cũ |
| G7 | S16 | "Mã dự kiến: #AUC-2055" trước khi tạo | ID chỉ có sau khi tạo | Ẩn chip mã dự kiến |
| G8 | S07 | "142 người đăng ký nhận tin", nút "Đặt nhắc nhở", badge "Tạm ngưng" | Không có nhắc nhở cho phiên; không có trạng thái tạm ngưng | Nút đổi thành "Xem chi tiết"; ẩn số người đăng ký; phiên CANCELLED chỉ hiện badge "Đã huỷ" + `cancelReason` |
| G9 | S08 | Ảnh đại diện, tải/gỡ ảnh, chip "Người mua" | Không có API hồ sơ nào (B5) | Hiện avatar chữ cái đầu + thông tin từ `AuthResponse`; ẩn tải/gỡ ảnh, bỏ chip vai trò; form khoá cho tới khi có B5 |
| G10 | S11 | "Họ và tên người nhận", "Ghi chú giao hàng" | `orders` chỉ có `shipping_address`, `phone_number` | Bỏ 2 ô này; tên người nhận lấy từ hồ sơ, chỉ hiển thị |
| G11 | S11 | Không có khu vực lịch sử thanh toán và kết quả lần thanh toán gần nhất | Use Case yêu cầu hiển thị; có `GET /orders/{id}/payments` | **Bổ sung** khối "Lịch sử thanh toán" dưới khối thanh toán, cùng style card bên phải |
| G12 | S11 | Một phương thức "Cổng thanh toán mô phỏng" | `method`: MOCK_CARD, MOCK_BANK, MOCK_WALLET; `simulateResult`: SUCCESS, FAILED, PROCESSING | Radio 3 phương thức; select "Kết quả mô phỏng" (Thành công / Thất bại / Đang xử lý) chỉ khi `NEXT_PUBLIC_DEMO_MODE=true` |
| G13 | S13 | Ô "Lý do khiếu nại" + "Mô tả chi tiết" + tải lên bằng chứng ảnh/video | `reports.reason` là 1 trường TEXT, không có tệp đính kèm | Gộp: `reason = "<Lý do>: <Mô tả>"`; ẩn vùng tải bằng chứng |
| G14 | S25 | "Bằng chứng đính kèm (2 ảnh)" | Không có | Ẩn khối bằng chứng |
| G15 | S09, S09a | "Đánh dấu đã đọc tất cả", lọc theo loại, "Xem biên lai" | Có `PATCH /notifications/read-all`, `GET /notifications/unread-count`; **không** lọc theo loại | Dùng read-all và unread-count; chip lọc loại lọc phía client trên trang đang xem (hoặc bỏ); bỏ "Xem biên lai"; nội dung lấy từ `title`/`content` |
| G16 | S20 | Cột "Vai trò: Người bán / Người mua", KPI "Người bán (Sellers)" | Vai trò chỉ USER/ADMIN | Cột vai trò hiện "Người dùng"/"Quản trị viên"; bỏ KPI người bán hoặc thay bằng "Quản trị viên" |
| G17 | S21 | Mô tả danh mục, trạng thái Hiển thị/Ẩn, số sản phẩm | `categories`: name, slug, icon_url | Bỏ cột mô tả và trạng thái; số sản phẩm chỉ hiện nếu API trả `productCount` |
| G18 | S06, S07, S10, S14, S19–S26 | Các thẻ KPI | Chỉ admin có `/admin/statistics` (đủ số cho S19–S26); trang người dùng không có số tổng | KPI admin lấy từ `/admin/statistics`; KPI trang người dùng: S10 tính được từ `totalElements` của từng `status` (gọi `size=1`), S06/S07/S14 ẩn hàng KPI |
| G19 | S19 | Bộ chọn "Hôm nay / 7 ngày / 30 ngày / Tuỳ chọn", biểu đồ lượt đặt giá 7 ngày | Phụ thuộc `/admin/statistics` | Truyền `range` nếu API hỗ trợ; nếu không thì hiện 1 khoảng cố định và ẩn bộ chọn |
| G20 | S12 | "Đơn vị: Vận chuyển mô phỏng", SĐT che `0908 ••• 419` | Có `carrier_name`, `phone_number` | Giữ nguyên, che 3 số giữa ở frontend |
| G21 | S18 | Dropdown "Chuyển trạng thái tiếp theo" | Chỉ có đúng 1 trạng thái kế tiếp hợp lệ | Thay dropdown bằng nhãn cố định "Trạng thái tiếp theo: Đã lấy hàng" + nút xác nhận (tránh chọn sai thứ tự) |

## 2. Màn hình còn thiếu trong Figma

| Thiếu | Lý do cần | Cách làm khi chưa có Figma |
| --- | --- | --- |
| Danh sách phiên của người bán (`/seller/auctions`) | Sidebar "Phiên đấu giá" trỏ tới đây; S17 chỉ là chi tiết 1 phiên | Dùng layout S14 (bảng) với cột: Mã phiên, Sản phẩm, Giá hiện tại, Lượt đặt, Thời gian, Trạng thái, Thao tác |
| Danh sách đơn của người bán (`/seller/orders`) | Sidebar "Đơn hàng"; S18 chỉ là chi tiết | Dùng layout bảng của S24 bỏ cột người bán |
| S17 khi phiên ACTIVE/ENDED/CANCELLED | Figma chỉ vẽ SCHEDULED (form sửa được) | Form chuyển sang chế độ chỉ đọc + khối lịch sử đặt giá (tái dùng `BidHistoryTable`); nút Huỷ chỉ khi ACTIVE và `bidCount = 0` |
| S11 sau khi thanh toán (PAID, SHIPPING, COMPLETED, EXPIRED, CANCELLED) | Figma chỉ vẽ PENDING_PAYMENT | Thay khối thanh toán bằng khối trạng thái tương ứng + link sang S12 |
| Trang lỗi 403/404, trang "Không có quyền" | Route bảo vệ | Card giữa trang theo style S04 |
| Bản mobile của mọi màn hình | Tất cả frame rộng 1280px | Áp dụng quy tắc responsive trong `layouts.md` |
| Tạo/sửa danh mục (modal admin) | S21 có nút "Thêm danh mục", "Sửa" | Modal theo style S13 với 3 trường name, slug, icon |
| Modal xác nhận khoá tài khoản / ẩn sản phẩm / huỷ phiên (admin) | Thao tác không đảo ngược | `ConfirmDialog` style S13, bắt buộc nhập lý do |

## 3. Lỗi giao diện trong Figma cần sửa khi code

- Bảng tràn khung, cột cuối bị cắt: S10, S14, S19, S22, S23, S24, S26 (S26 còn bị cắt cột đầu "Thời gian").
- Badge xuống 2 dòng: S20 ("Người bán", "Hoạt động"), S21 ("Hiển thị", "4.120 sản phẩm").
- Cột ghi chú quá hẹp làm chữ bị bẻ từng từ: S18 bảng lịch sử vận chuyển.
- S01: chữ "Xóa bộ lọc" và tiêu đề "Bộ lọc tìm kiếm" xuống dòng do khung 280px chật – giảm cỡ tiêu đề xuống 18px.
- S02/S05: breadcrumb tên sản phẩm dài bị cắt cứng – dùng `truncate` + `title`.
- Tiêu đề trang không thống nhất (30px ở đa số trang, 24px ở S09, S12, S15, S16, S21–S26) – dùng `text-h1` 30px cho mọi trang.
- Sidebar rộng 256px (người bán) và 288px (admin) – thống nhất 256px.
- Màu chữ `#747686` và `#94A3B8` không đạt tương phản – đã thay trong `tokens.css`.
