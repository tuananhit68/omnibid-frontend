# Bán hàng trong khu tài khoản — `my-products`, `product-form`, `auction-create`, `my-auctions`, `my-auction`

Dữ liệu: `backend/RESPONSE_DTO_v4.md` §3 (`ProductListItem`, `Product`), §4 (`AuctionDetail`, `MyAuctionItem`); BR-05…BR-08, BR-15, BR-16, BR-20, BR-23; ảnh: `backend/BUSINESS_RULES_v4.md` §8.

## `my-products` — `/me/products` (MỚI)
Thanh công cụ: `SegmentedControl` trạng thái (Tất cả · Sẵn sàng · Đang đấu giá · Đang giao dịch · Đã bán · Bị ẩn) · ô tìm `keyword` · nút "Thêm sản phẩm".
`DataTable` (`GET /products/mine?keyword&status&page&size=10&sort=createdAt,desc`): Ảnh `primaryImageUrl` · Tiêu đề · Danh mục · Tình trạng · Số ảnh `imageCount` · Trạng thái · Ngày tạo · Thao tác.
| Điều kiện | Thao tác |
|---|---|
| `status = AVAILABLE` | Sửa · Tạo phiên (`/me/auctions/new?productId=`) · Xóa (chỉ khi `everAuctioned = false`; ConfirmDialog → `DELETE /products/{id}`) |
| `activeAuctionId != null` | Xem phiên → `/me/auctions/{activeAuctionId}` |
| RESERVED, SOLD | Xem đơn → `/me/orders?role=SELLER` |
| HIDDEN | chữ "Bị ẩn bởi quản trị viên — không bỏ ẩn được" |
Lỗi xóa `INVALID_STATUS_TRANSITION` → "Sản phẩm đã từng lên phiên nên không thể xóa". Mobile: danh sách thẻ.

## `product-form` — `/me/products/new`, `/me/products/[id]/edit` (MỚI)
Form 2 cột: Tiêu đề* · Danh mục* (`GET /categories?size=100`, hiện icon) · Tình trạng* (5 giá trị, nhãn tiếng Việt) · Mô tả* · `ImageUploader` (1–5 ảnh, JPG/JPEG/PNG/WEBP ≤ 5 MB; kiểm tra sớm phía client) · ghi chú "Ảnh được kiểm tra theo nội dung thật; nếu tải ảnh thất bại thì sản phẩm không được lưu."
- **Tạo:** một request `POST /products` multipart (`product` = Blob JSON, `files` theo thứ tự, ảnh chính đầu tiên — người dùng chọn bằng "Đặt làm ảnh chính"). Thanh tiến trình upload. 201 `Product` → `/me/products` + toast.
- **Sửa** (`GET /products/{id}`): chỉ khi `status = AVAILABLE`, ngược lại hiện thông báo khóa + nút quay lại. Thông tin → `PATCH /products/{id}`; thêm ảnh → `POST /products/{id}/images` (`files`, tổng ≤ 5); xóa ảnh → `DELETE /products/{id}/images/{imageId}` (không cho xóa ảnh cuối). Không đổi ảnh chính khi sửa (không có API).
- Lỗi: `INVALID_IMAGE`, `IMAGE_UPLOAD_FAILED`, `PAYLOAD_TOO_LARGE`, `PRODUCT_NOT_EDITABLE` (refetch), `VALIDATION_ERROR`.

## `auction-create` — `/me/auctions/new?productId=` (MỚI)
Tóm tắt sản phẩm (`GET /products/{productId}`: ảnh chính, tiêu đề, trạng thái, số ảnh; không AVAILABLE hoặc có `activeAuctionId` → hiện lý do, khóa form).
Form: Giá khởi điểm* · Bước giá* · Giá sàn (tùy chọn, không công khai, ≥ giá khởi điểm) · Bắt đầu* (tương lai) · Kết thúc* (sau bắt đầu) · "Tạo phiên". Ô xem trước: "Mức tối thiểu đầu tiên = giá khởi điểm", "Thời lượng: x ngày y giờ". Ghi chú "Sau khi phiên bắt đầu, không sửa được giá và thời gian."
zod: tiền nguyên > 0; reserve ≥ start; start > now; end > start. Không cứng hóa 1 giờ/30 ngày (backend cấu hình; lỗi về qua `VALIDATION_ERROR`). Gửi thời gian kèm `+07:00`.
`POST /auctions` → 201 `AuctionDetail` → `/me/auctions/{id}`. Lỗi `PRODUCT_NOT_AVAILABLE`, `CONFLICT`, `VALIDATION_ERROR`. Thiếu `productId` → về `/me/products`.

## `my-auctions` — `/me/auctions` (MỚI)
`SegmentedControl` trạng thái (Tất cả · Sắp diễn ra · Đang diễn ra · Đã kết thúc · Không bán được · Đã hủy) · `keyword`.
`DataTable` (`GET /auctions/mine`, `MyAuctionItem`): Ảnh · Sản phẩm · Giá hiện tại · Giá sàn `reservePrice` · Lượt · Bắt đầu · Kết thúc · Trạng thái · Thao tác ("Quản lý" → `/me/auctions/{id}`; `orderId` → "Xem đơn" `/orders/{orderId}`).

## `my-auction` — Quản lý phiên `/me/auctions/[id]` (MỚI)
`GET /auctions/{id}` (`viewerIsSeller` phải true, ngược lại hiện 403) + lịch sử + realtime như `auction-detail`.
Khối: tiêu đề + trạng thái · lưới số liệu (giá hiện tại, giá khởi điểm, bước giá, **giá sàn** + `ReserveBadge`, số lượt, người dẫn đầu ẩn danh, bắt đầu/kết thúc + đồng hồ) · lịch sử đặt giá · khối thao tác:
- SCHEDULED: "Sửa" (form như `auction-create`, điền sẵn → `PATCH /auctions/{id}`; `AUCTION_NOT_EDITABLE` → refetch) · "Hủy phiên".
- ACTIVE & `bidCount = 0`: "Hủy phiên"; ACTIVE & `bidCount > 0`: dòng "Phiên đã có lượt đặt giá nên không thể hủy".
- "Hủy phiên": ConfirmDialog, lý do bắt buộc → `POST /auctions/{id}/cancel {reason}`; lỗi `CANNOT_CANCEL`, `INVALID_STATUS_TRANSITION`.
- ENDED: kết quả + "Xem đơn hàng" `/orders/{orderId}`. UNSOLD/CANCELLED: "Tạo phiên mới cho sản phẩm" (nếu sản phẩm AVAILABLE).
