---
trigger: model_decision
description: "Áp dụng khi gọi API backend v4, viết api.ts/hooks.ts/types.ts trong src/features, sửa src/lib/api, xử lý JWT, lỗi, phân trang, lọc, upload ảnh, thời gian, tiền."
---
# API và dữ liệu (v4)
Chi tiết: `.agents/skills/omnibid-fe-v4/references/API_CLIENT_FE.md` và `backend/API_SPEC_v4.md`.
- Mọi lời gọi qua `src/lib/api` (axios, `baseURL = NEXT_PUBLIC_API_URL`). Không gọi `fetch`/`axios` trong component.
- Envelope `{success, data}` / `{success:false, error:{code,message,details}}`. `ApiError { status, code, message, details, fieldErrors }`.
- Câu lỗi tiếng Việt từ `lib/errors.ts` theo `code` (24 mã v4). `VALIDATION_ERROR` → `details.fields` gắn vào ô form.
- 401 → xóa phiên, `/login?redirect=` (trừ chính request đăng nhập). 403 `ACCOUNT_BANNED` → xóa phiên, `/login?reason=banned`.
- Type và zod schema ở `src/lib/api/contract.ts`, sao đúng `backend/RESPONSE_DTO_v4.md`. Không đoán, không định nghĩa DTO trùng trong feature.
- Enum v4 trong `src/types/enums.ts` kèm `label` + `tone`; không có BidStatus, ShipmentStatus, ReportType, ReportAction, PaymentStatus.PENDING.
- Thời gian: chuỗi ISO **có offset**; `dayjs(v).tz('Asia/Ho_Chi_Minh')` để hiển thị; gửi lên kèm `+07:00`. Tiền: `number` nguyên VND.
- Feature: `types.ts`, `schemas.ts` (zod), `api.ts` (hàm thuần), `hooks.ts` (TanStack Query), `components/`. Query key tập trung; mutation invalidate đúng key; `staleTime` 30s; `placeholderData: keepPreviousData` cho phân trang.
- Lọc/trang/sắp xếp đồng bộ URL (`useSearchParams`); tìm kiếm debounce 300ms; đổi lọc về trang 0 (backend đếm trang từ 0, UI hiển thị từ 1). `sort` chỉ giá trị trong whitelist của endpoint.
- Upload: multipart qua `FormData`, không tự đặt `Content-Type`; `POST /products` gồm phần `product` (Blob JSON) + `files`; kiểm tra sớm JPG/PNG/WEBP ≤ 5 MB, 1–5 ảnh (backend vẫn kiểm tra magic bytes).
- Thanh toán: `Idempotency-Key = crypto.randomUUID()` mỗi lần bấm; retry do lỗi mạng dùng lại key.
- Dữ liệu giả chỉ nằm trong `src/mocks/` qua chế độ `NEXT_PUBLIC_API_MODE=mock` (`MOCK_MODE.md`); không dữ liệu cứng trong component. Không đặt secret trong `NEXT_PUBLIC_*`. Không log token hay dữ liệu cá nhân.
