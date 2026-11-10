---
name: swap-mocks
description: Gỡ dữ liệu mock của một màn hình, nối API backend thật theo design/backend-contract.md. Cách gọi: /swap-mocks S00
---

# /swap-mocks <ID màn hình>

Mục tiêu: màn hình chỉ dùng API thật; không còn file mock, adapter tạm hay cờ tắt tính năng nào cho màn hình này.

0. **Nhánh**: theo `AGENTS.md` mục 7, tạo `feature/<ID>-swap-mocks` từ `develop`.
1. **Đọc**: `design/backend-contract.md` – mục 2 (endpoint), 2.6 (DTO mới), 4 (lưu ý khi nối). Đọc spec `design/specs/<ID>-*.md`.
2. **Tìm mock đang dùng**: `grep -rn "src/mocks\|@/mocks\|TODO(backend\|adapters\|features\." src/` rồi lọc các file thuộc màn hình. Liệt kê thành bảng: file · mock/adapter/cờ nào · dữ liệu gì · endpoint thay thế trong `backend-contract.md`.
3. **Báo kế hoạch và dừng chờ đồng ý**: phần nào chuyển sang API thật, file sẽ sửa/xoá.
4. **Thực hiện**:
   - Hàm trong `src/features/<feature>/api.ts` gọi `src/lib/api` thay cho mock. Type trong `types.ts` khớp đúng DTO trong `backend-contract.md`; bỏ dấu `?` ở các trường giờ đã chắc chắn có.
   - Xoá adapter tạm (`withPending…`), cờ trong `src/lib/features.ts` và placeholder dành cho dữ liệu thiếu; bật lại tính năng đã ẩn (nút Theo dõi, bộ lọc danh mục/giá, ô tìm kiếm…).
   - Bỏ mọi chỗ frontend tự tính `minNextBid`; lấy từ dữ liệu phiên, tin `BID_PLACED`, lỗi `BID_TOO_LOW`. Badge giá sàn dùng `reserveStatus`.
   - Thêm mã lỗi mới vào `src/lib/errors.ts` (danh sách ở `backend-contract.md` mục 1).
   - Xoá file mock không còn ai import.
   - Query key, `staleTime`, loading/empty/error theo `.agents/rules/api-data.md` và `ux-states.md`. Thời gian parse giờ VN bằng `dayjs.tz`.
5. **Kiểm tra**: `npm run lint`, `npm run typecheck`, `npm run build`; mở trang với backend thật: có dữ liệu, trạng thái rỗng, lỗi (tắt backend → thông báo + "Thử lại"). Commit theo từng bước, không push.
6. **Báo lại**: bảng trước/sau (dữ liệu · trước · sau), file mock đã xoá, `git log --oneline develop..HEAD`, đề xuất PR.
